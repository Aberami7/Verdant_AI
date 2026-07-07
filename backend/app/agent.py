import os
from typing import TypedDict, List
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()  # Ensure environment variables are loaded first

from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from app.prompts import SYSTEM_PROMPT, USER_PROMPT

# ---------------- PYDANTIC RESPONSE SCHEMA ----------------
# This guarantees that the LLM returns structured data exactly in this layout
class ProductAnalysis(BaseModel):
    eco_score: int = Field(description="Eco Score from 1 to 10 based on environmental impact")
    health_risk: str = Field(description="Health risk assessment level or description")
    environment_score: int = Field(description="Specific environment breakdown score")
    greenwashing_verdict: str = Field(description="Analysis on whether the product uses fake eco claims")
    hidden_chemicals: str = Field(description="Any identified hidden harmful chemicals or additives")
    safe_alternatives: str = Field(description="Suggestions for safer product alternatives")
    confidence_score: float = Field(description="The AI's confidence score in this evaluation")
    ai_summary: str = Field(description="A concise narrative summarizing the overall findings")

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
llm = raw_llm.with_structured_output(ProductAnalysis)


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
        # Thanks to .with_structured_output, response is already an instantiated ProductAnalysis Pydantic object
        response = llm.invoke(messages)
        result = response.model_dump() # Convert safely to a standard Python dictionary

    except Exception as e:
        # Fallback gracefully if API fails or cannot format
        result = {
            "eco_score": 0,
            "health_risk": "Unknown",
            "environment_score": 0,
            "greenwashing_verdict": "Unable to Analyze",
            "hidden_chemicals": "",
            "safe_alternatives": "",
            "confidence_score": 0.0,
            "ai_summary": f"Structured parsing failed or model dropped connection: {str(e)}"
        }

    # Return ONLY the state keys that are being updated (LangGraph merges this automatically)
    return {"result": result}


# ---------------- GRAPH ----------------
def build_graph():
    # Note: StateGraph handles state transitions smoothly using update dictionaries
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
        return {
            "eco_score": 0,
            "health_risk": "Unknown",
            "environment_score": 0,
            "greenwashing_verdict": "Analysis Failed",
            "hidden_chemicals": "",
            "safe_alternatives": "",
            "confidence_score": 0.0,
            "ai_summary": f"Critical execution error: {str(e)}"
        }