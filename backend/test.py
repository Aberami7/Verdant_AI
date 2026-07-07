from app.ocr import extract_text
from app.agent import analyze_ingredients

# 1. IMAGE PATH (change if needed)
image_path = "uploads/test.png"

print("\n📸 Step 1: OCR running...\n")

# 2. OCR TEXT EXTRACTION
text = extract_text(image_path)

print("🔍 OCR OUTPUT:\n")
print(text)

if not text.strip():
    print("\n❌ No text detected!")
    exit()

print("\n🤖 Step 2: AI Analysis running...\n")

# 3. AI ANALYSIS (LangGraph + Groq)
result = analyze_ingredients(
    product_name="Test Product",
    company_name="Unknown",
    ingredients=text
)

print("📊 FINAL AI RESULT:\n")
print(result)