import React from "react";

function ProgressBar({ progress = 0 }) {
  // Ensure progress stays strictly within 0 to 100 boundaries
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const containerStyle = {
    width: "100%",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    height: "22px",
    marginTop: "10px",
    position: "relative",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)"
  };

  const barStyle = {
    width: `${safeProgress}%`,
    height: "100%",
    background: "#16a34a",
    color: "white",
    textAlign: "center",
    lineHeight: "22px",
    fontWeight: "bold",
    fontSize: "12px",
    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  // Label styling for when progress is too small to fit the text inside the green fill
  const outOfBarLabelStyle = {
    position: "absolute",
    left: "10px",
    top: 0,
    lineHeight: "22px",
    color: "#1f2937",
    fontWeight: "bold",
    fontSize: "12px"
  };

  return (
    <div style={{ width: "100%" }}>
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "6px"
        }}
      >
        <h4 style={{ margin: 0, color: "#166534", fontSize: "14px", fontWeight: "600" }}>
          Analysis Progress
        </h4>
        {safeProgress >= 100 && (
          <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: "bold" }}>
            ✅ Complete
          </span>
        )}
      </div>

      <div style={containerStyle}>
        <div style={barStyle}>
          {safeProgress > 15 && `${safeProgress}%`}
        </div>
        
        {/* Render text on top of gray track if bar width is too skinny to fit text safely */}
        {safeProgress <= 15 && (
          <div style={outOfBarLabelStyle}>
            {safeProgress}%
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressBar;