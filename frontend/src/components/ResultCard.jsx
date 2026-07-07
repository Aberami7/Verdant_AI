import React from "react";

/**
 * ResultCard Component
 * @param {string} title - The section title header
 * @param {string|React.ReactNode} value - Content body text, metrics, or breakdown text
 * @param {string} color - Hex code or standard CSS color for the left emphasis accent border
 */
function ResultCard({ title, value, color = "#16a34a" }) {
  
  const cardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e5e7eb",
    borderLeft: `6px solid ${color}`,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  };

  const titleStyle = {
    fontSize: "14px",
    color: "#4b5563",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: 0
  };

  const valueStyle = {
    fontSize: "16px",
    color: "#1f2937",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: 0,
    fontWeight: "400"
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0px 6px 16px rgba(0, 0, 0, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.04)";
      }}
    >
      <h3 style={titleStyle}>
        {title}
      </h3>
      
      <div style={valueStyle}>
        {value}
      </div>
    </div>
  );
}

export default ResultCard;