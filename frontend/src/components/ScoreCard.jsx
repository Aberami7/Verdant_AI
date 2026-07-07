import React from "react";

function ScoreCard({ data }) {
  if (!data) {
    return (
      <div 
        style={{ 
          padding: "30px", 
          color: "#6b7280", 
          textAlign: "center",
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px dashed #d1d5db"
        }}
      >
        No analysis data available. Please upload a product image.
      </div>
    );
  }

  // Helper to color-code risk and greenwashing categories dynamically
  const getSeverityStyle = (text = "") => {
    const value = text.toLowerCase();
    if (value.includes("high") || value.includes("yes") || value.includes("severe")) {
      return { bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" };
    }
    if (value.includes("medium") || value.includes("caution") || value.includes("maybe")) {
      return { bg: "#fffbeb", text: "#d97706", border: "#fde68a" };
    }
    return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
  };

  const badge = getSeverityStyle(data.health_risk || data.greenwashing_verdict);

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        border: "1px solid #e5e7eb",
        marginTop: "20px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#111827", fontSize: "20px", fontWeight: "700" }}>
          AI Analysis Report
        </h2>
        {data.confidence_score && (
          <span style={{ fontSize: "12px", background: "#f3f4f6", color: "#4b5563", padding: "4px 10px", borderRadius: "20px", fontWeight: "500" }}>
            🎯 Match Confidence: {data.confidence_score}
          </span>
        )}
      </div>

      {/* Main Grid Metrics System */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
          gap: "15px",
          marginBottom: "25px"
        }}
      >
        {/* Eco Score Block */}
        <div style={{ background: "#f0fdf4", padding: "15px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
          <span style={{ fontSize: "13px", color: "#166534", fontWeight: "600", display: "block" }}>🌱 Eco Score</span>
          <span style={{ fontSize: "28px", fontWeight: "800", color: "#16a34a" }}>{data.eco_score}</span>
          <span style={{ fontSize: "14px", color: "#166534" }}> / 10</span>
        </div>

        {/* Environment Score Block */}
        <div style={{ background: "#f0fdfa", padding: "15px", borderRadius: "8px", border: "1px solid #99f6e4" }}>
          <span style={{ fontSize: "13px", color: "#115e59", fontWeight: "600", display: "block" }}>🌍 Environment Score</span>
          <span style={{ fontSize: "28px", fontWeight: "800", color: "#0d9488" }}>{data.environment_score}</span>
          <span style={{ fontSize: "14px", color: "#115e59" }}> / 10</span>
        </div>

        {/* Health Risk Flag */}
        <div style={{ background: badge.bg, padding: "15px", borderRadius: "8px", border: `1px solid ${badge.border}` }}>
          <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600", display: "block" }}>🏥 Health Risk</span>
          <span style={{ fontSize: "16px", fontWeight: "700", color: badge.text, display: "inline-block", marginTop: "8px" }}>
            {data.health_risk || "Low"}
          </span>
        </div>

        {/* Greenwashing Check */}
        <div style={{ background: getSeverityStyle(data.greenwashing_verdict).bg, padding: "15px", borderRadius: "8px", border: `1px solid ${getSeverityStyle(data.greenwashing_verdict).border}` }}>
          <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600", display: "block" }}>⚠️ Greenwashing Verdict</span>
          <span style={{ fontSize: "16px", fontWeight: "700", color: getSeverityStyle(data.greenwashing_verdict).text, display: "inline-block", marginTop: "8px" }}>
            {data.greenwashing_verdict || "Clear"}
          </span>
        </div>
      </div>

      {/* Detailed Technical Breakdowns */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
        
        {data.hidden_chemicals && (
          <div>
            <h4 style={{ margin: "0 0 4px 0", color: "#991b1b", fontSize: "14px", fontWeight: "600" }}>🧪 Hidden Chemicals / Additives Detected</h4>
            <p style={{ margin: 0, color: "#4b5563", fontSize: "14px", lineHeight: "1.5" }}>{data.hidden_chemicals}</p>
          </div>
        )}

        {data.safe_alternatives && (
          <div>
            <h4 style={{ margin: "0 0 4px 0", color: "#166534", fontSize: "14px", fontWeight: "600" }}>♻️ Eco-Friendly Alternatives</h4>
            <p style={{ margin: 0, color: "#4b5563", fontSize: "14px", lineHeight: "1.5" }}>{data.safe_alternatives}</p>
          </div>
        )}

        {data.ai_summary && (
          <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "5px" }}>
            <h4 style={{ margin: "0 0 6px 0", color: "#334155", fontSize: "14px", fontWeight: "600" }}>📝 Deep Summary Analysis</h4>
            <p style={{ margin: 0, color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>{data.ai_summary}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ScoreCard;