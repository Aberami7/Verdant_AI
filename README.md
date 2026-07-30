![header](https://capsule-render.vercel.app/api?type=waving&color=0:00C853,100:2E7D32&height=220&section=header&text=Verdant%20AI&fontSize=45&fontColor=ffffff)
                                                 🌿 Verdant AI – AI-Powered Sustainable Product Analyzer
Verdant AI is an AI-powered web application that helps users evaluate the safety and sustainability of consumer products. It extracts ingredients directly from product packaging images using OCR, analyzes ingredient safety with AI, detects potential greenwashing, and provides personalized sustainability recommendations.

-- Features
Extracts ingredients directly from product packaging images using EasyOCR, eliminating manual ingredient entry.
Performs AI-powered ingredient safety analysis using Groq LLM and LangGraph.
Detects potential greenwashing by evaluating both ingredient safety and environmental impact.
Generates ingredient explanations, safety scores, allergen information, and personalized sustainability recommendations.
Stores user analysis history securely in Aiven Cloud DB.
⚙️ Working
The user uploads a product packaging image.
EasyOCR extracts the ingredient list from the uploaded image.
The extracted ingredients are processed using Groq LLM and LangGraph.
The AI evaluates ingredient safety, identifies potential allergens, and assesses environmental impact.
The system detects potential greenwashing and calculates an overall safety score.
Finally, AI-generated ingredient insights and sustainability recommendations are displayed, and the analysis is stored in Aiven Cloud DB.
🛠️ Tech Stack
Category	Technologies
Frontend	React, TypeScript
Backend	FastAPI, Python
AI	Groq LLM, LangGraph
OCR	EasyOCR
Database	Aiven Cloud DB (MySQL)
Deployment	Docker
⭐ Key Highlights
AI-powered ingredient analysis from product packaging images.
Automated ingredient extraction using EasyOCR.
Greenwashing detection through safety and environmental impact analysis.
AI-generated ingredient insights and sustainability recommendations.
Secure cloud-based storage using Aiven Cloud DB.
🔮 Future Enhancements
Barcode-based product identification
Product comparison dashboard
Carbon footprint estimation
Multi-language OCR support
Mobile application
