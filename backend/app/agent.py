import os
from typing import TypedDict, List, Literal
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()  # Ensure environment variables are loaded first

from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from app.prompts import SYSTEM_PROMPT, USER_PROMPT

SafetyLevel = Literal["Safe", "Moderate", "Hazardous"]


# ---------------- PYDANTIC RESPONSE SCHEMA ----------------
# This guarantees the LLM returns structured data exactly matching the frontend's
# AnalysisReport contract (src/types.ts).
class IngredientDetailSchema(BaseModel):
    name: str = Field(description="The ingredient or chemical compound name")
    safety: SafetyLevel = Field(description="Safe, Moderate, or Hazardous")
    description: str = Field(description="Short explanation of what it is and any safety notes")
    category: str = Field(description="Functional category, e.g. Preservative, Emulsifier, Colorant")


class ProductSafetyAnalysis(BaseModel):
    ingredients_list: List[str] = Field(description="Clean list of individual ingredient names parsed from the raw text")
    safety_score: float = Field(description="Overall safety score from 0 (most hazardous) to 100 (safest)")
    safety_level: SafetyLevel = Field(description="Overall safety level: Safe, Moderate, or Hazardous")
    allergens: List[str] = Field(description="Common allergens detected, empty list if none")
    ingredients_details: List[IngredientDetailSchema] = Field(description="Per-ingredient safety breakdown")
    summary: str = Field(description="2-3 sentence clinical summary of the overall findings")
    recommendations: List[str] = Field(description="Actionable safety recommendations for the consumer")


# ---------------- STATE ----------------
class AgentState(TypedDict):
    product_name: str
    company_name: str
    ingredients: str
    result: dict


# ---------------- LLM WITH STRUCTURED OUTPUT ----------------
raw_llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)

# Bind the Pydantic schema natively to force structured JSON responses
llm = raw_llm.with_structured_output(ProductSafetyAnalysis)


def _fallback_result(error_message: str) -> dict:
    return {
        "ingredients_list": [],
        "safety_score": 0.0,
        "safety_level": "Hazardous",
        "allergens": [],
        "ingredients_details": [],
        "summary": f"Unable to complete safety analysis: {error_message}",
        "recommendations": ["Re-scan the product with a clearer image and try again."],
    }


# ---------------- AGENT NODE ----------------
def analyze_product(state: AgentState):
    prompt = USER_PROMPT.format(
        product_name=state["product_name"],
        company_name=state["company_name"],
        ingredients=state["ingredients"]
    )

    messages = [
        ("system", SYSTEM_PROMPT),
        ("human", prompt)
    ]

    try:
        # Thanks to .with_structured_output, response is already an instantiated
        # ProductSafetyAnalysis Pydantic object.
        response = llm.invoke(messages)
        result = response.model_dump()
    except Exception as e:
        result = _fallback_result(str(e))

    return {"result": result}


# ---------------- GRAPH ----------------
def build_graph():
    workflow = StateGraph(AgentState)
    workflow.add_node("analyze_product", analyze_product)
    workflow.set_entry_point("analyze_product")
    workflow.add_edge("analyze_product", END)
    return workflow.compile()


graph = build_graph()


# ---------------- RUNNER ----------------
def run_agent(product_name: str, company_name: str, ingredients: str) -> dict:
    initial_state = {
        "product_name": product_name,
        "company_name": company_name,
        "ingredients": ingredients,
        "result": {}
    }
    final_state = graph.invoke(initial_state)
    return final_state["result"]


# ---------------- SERVICE WRAPPER ----------------
def analyze_ingredients(product_name: str, company_name: str, ingredients: str) -> dict:
    try:
        return run_agent(product_name, company_name, ingredients)
    except Exception as e:
        return _fallback_result(str(e))
