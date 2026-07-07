import React from "react";

/**
 * Enhanced Loader Component
 * @param {string} currentStep - Optional prop to highlight the active backend pipeline stage:
 *                               "upload", "ocr", "ai", "report"
 */
function Loader({ currentStep = "upload" }) {
  const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  };

  const box = {
    width: "420px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb"
  };

  const spinner = {
    width: "60px",
    height: "60px",
    border: "6px solid #d1fae5",
    borderTop: "6px solid #16a34a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 25px auto"
  };

  const progressContainer = {
    width: "100%",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "25px"
  };

  const progressBar = {
    width: "100%",
    height: "100%",
    background: "#16a34a",
    animation: "loading 1.8s ease-in-out infinite"
  };

  // Helper styling function to dim inactive pipeline steps
  const getStepStyle = (stepName) => ({
    fontSize: "14px",
    margin: "8px 0",
    fontWeight: currentStep === stepName ? "600" : "400",
    color: currentStep === stepName ? "#111827" : "#9ca3af",
    transition: "color 0.3s ease, font-weight 0.3s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px"
  });

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>

      <div style={overlay}>
        <div style={box}>
          <div style={spinner}></div>

          <h2 style={{ color: "#166534", margin: "0 0 5px 0", fontSize: "22px" }}>
            🌿 Verdant AI
          </h2>

          <h4 style={{ margin: "0 0 20px 0", color: "#4b5563", fontWeight: "500" }}>
            Processing Pipeline Active
          </h4>

          {/* Dynamic Pipeline Steps Checkpoints */}
          <div style={{ textAlign: "left", maxWidth: "260px", margin: "0 auto" }}>
            <div style={getStepStyle("upload")}>
              <span>{currentStep === "upload" ? "⏳" : "✅"}</span>
              <span>Uploading Product Image...</span>
            </div>
            <div style={getStepStyle("ocr")}>
              <span>{currentStep === "ocr" ? "⏳" : currentStep === "upload" ? "⚪" : "✅"}</span>
              <span>Extracting Ingredients (EasyOCR)...</span>
            </div>
            <div style={getStepStyle("ai")}>
              <span>{currentStep === "ai" ? "⏳" : (currentStep === "upload" || currentStep === "ocr") ? "⚪" : "✅"}</span>
              <span>Analyzing Eco-Impact (Groq AI)...</span>
            </div>
            <div style={getStepStyle("report")}>
              <span>{currentStep === "report" ? "⏳" : "⚪"}</span>
              <span>Compiling Analysis Record...</span>
            </div>
          </div>

          <div style={progressContainer}>
            <div style={progressBar}></div>
          </div>

          <p style={{ marginTop: "20px", color: "#16a34a", fontSize: "14px", fontWeight: "600", margin: "20px 0 0 0" }}>
            Please don't close this window...
          </p>
        </div>
      </div>
    </>
  );
}

export default Loader;