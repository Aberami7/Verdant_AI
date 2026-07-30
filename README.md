<div align="center">

![header](https://capsule-render.vercel.app/api?type=waving&color=0:00C853,100:2E7D32&height=220&section=header&text=Verdant%20AI&fontSize=45&fontColor=ffffff)

# 🌿 Verdant AI

### AI-Powered Sustainable Product Analyzer

An AI-powered web application that extracts ingredients from product packaging images, evaluates ingredient safety, detects potential greenwashing, and generates personalized sustainability recommendations.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![EasyOCR](https://img.shields.io/badge/OCR-EasyOCR-success?style=for-the-badge)
![Groq LLM](https://img.shields.io/badge/AI-Groq%20LLM-orange?style=for-the-badge)
![LangGraph](https://img.shields.io/badge/LangGraph-Agent-blueviolet?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

# 📖 Overview

Verdant AI is an AI-powered web application that helps users evaluate the safety and sustainability of consumer products. It extracts ingredients directly from product packaging images using OCR, analyzes ingredient safety with AI, detects potential greenwashing, and provides personalized sustainability recommendations.

---

# ✨ Features

- 📷 Extracts ingredients directly from product packaging images using **EasyOCR**, eliminating manual ingredient entry.
- 🤖 Performs AI-powered ingredient safety analysis using **Groq LLM** and **LangGraph**.
- 🌱 Detects potential greenwashing by evaluating both ingredient safety and environmental impact.
- 📊 Generates ingredient explanations, safety scores, allergen information, and personalized sustainability recommendations.
- ☁️ Stores user analysis history securely in **Aiven Cloud DB**.

---

# ⚙️ How It Works

1. 📤 The user uploads a product packaging image.
2. 🔍 EasyOCR extracts the ingredient list from the uploaded image.
3. 🧠 The extracted ingredients are processed using **Groq LLM** and **LangGraph**.
4. 🧪 The AI evaluates ingredient safety, identifies potential allergens, and assesses environmental impact.
5. 🌿 The system detects potential greenwashing and calculates an overall safety score.
6. 💡 AI-generated ingredient insights and sustainability recommendations are displayed.
7. ☁️ The complete analysis is securely stored in **Aiven Cloud DB**.

---

# 🔄 Workflow

```text
           Product Packaging Image
                     │
                     ▼
          EasyOCR Ingredient Extraction
                     │
                     ▼
       Groq LLM + LangGraph Analysis
                     │
                     ▼
   Safety • Allergens • Eco-Impact Analysis
                     │
                     ▼
        Greenwashing Detection & Score
                     │
                     ▼
 AI Insights & Sustainability Recommendations
                     │
                     ▼
          Aiven Cloud DB Storage
```

---

# 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React, TypeScript |
| **Backend** | FastAPI, Python |
| **AI** | Groq LLM, LangGraph |
| **OCR** | EasyOCR |
| **Database** | Aiven Cloud DB (MySQL) |
| **Deployment** | Docker |

---

# ⭐ Key Highlights

- 🚀 AI-powered ingredient analysis from product packaging images.
- 🔍 Automated ingredient extraction using EasyOCR.
- 🌱 Greenwashing detection through safety and environmental impact analysis.
- 💡 AI-generated ingredient insights and personalized sustainability recommendations.
- ☁️ Secure cloud-based storage using Aiven Cloud DB.

---

# 🔮 Future Enhancements

- 📦 Barcode-based product identification
- 📊 Product comparison dashboard
- 🌍 Carbon footprint estimation
- 🌐 Multi-language OCR support
- 📱 Mobile application

---

<div align="center">

### 🌿 Making Sustainable Product Choices Smarter with AI

**If you found this project useful, consider giving it a ⭐ on GitHub!**

</div>
