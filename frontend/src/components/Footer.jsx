import React from "react";

function Footer() {
  const footerStyle = {
    marginTop: "35px", // Spacing added to separate from content above
    width: "100%",     // Ensures full alignment with the container
    boxSizing: "border-box",
    background: "#ffffff",
    padding: "25px 20px", 
    borderRadius: "24px",  
    boxShadow: "0px 4px 20px rgba(0,0,0,0.03)", 
    textAlign: "center",
    border: "1px solid #e5e7eb"
  };

  return (
    <footer style={footerStyle}>
      <h3 style={{ margin: "0", color: "#166534", fontSize: "18px", fontWeight: "700" }}>
        🌿 Verdant AI
      </h3>

      <p style={{ color: "#4b5563", marginTop: "8px", fontSize: "14px", fontWeight: "500" }}>
        AI Powered Environmental Product Analyzer
      </p>

      <hr style={{ margin: "15px 0", border: "none", borderTop: "1px solid #f3f4f6" }} />

      <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0" }}>
        © 2026 Verdant AI. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;