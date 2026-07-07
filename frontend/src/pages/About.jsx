import React from "react";
import { FaBoxes, FaCheckCircle, FaGlobeAmericas, FaLayerGroup } from "react-icons/fa";

function About() {
  const pageContainerStyle = {
    padding: "40px",
    marginLeft: "260px",
    width: "calc(100% - 260px)",
    boxSizing: "border-box",
    background: "#f4f7f5",
    minHeight: "100vh"
  };

  const cardStyle = {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    lineHeight: "1.8",
    color: "#374151"
  };

  const sectionHeaderStyle = {
    color: "#064e3b",
    fontSize: "20px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "35px",
    marginBottom: "20px"
  };

  const featureItemStyle = {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "14.5px",
    fontWeight: "500",
    color: "#4b5563"
  };

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px"
  };

  const moduleTitleStyle = {
    fontSize: "13px",
    fontWeight: "800",
    color: "#065f46",
    letterSpacing: "1px",
    marginBottom: "12px",
    display: "block"
  };

  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        
        {/* Project Overview */}
        <h3 style={{ ...sectionHeaderStyle, marginTop: 0 }}>
          <FaBoxes color="#16a34a" size={20} /> System Overview
        </h3>
        <p style={{ fontSize: "16px", margin: 0 }}>
          Verdant AI is an automated diagnostic platform designed to provide clarity on consumer product safety. 
          The system leverages advanced computational vision and analytical engines to evaluate product 
          formulations, identify environmental risks, and verify marketing claims, ensuring users receive 
          unbiased, data-driven health insights.
        </p>

        {/* Capabilities */}
        <h3 style={sectionHeaderStyle}>
          <FaCheckCircle color="#16a34a" size={20} /> System Capabilities
        </h3>
        <div style={gridContainerStyle}>
          <div style={featureItemStyle}>📷 Automated Optical Data Extraction</div>
          <div style={featureItemStyle}>🤖 Deep Chemical Composition Analysis</div>
          <div style={featureItemStyle}>🌱 Environmental Impact Scoring</div>
          <div style={featureItemStyle}>⚠️ Health Hazard Identification</div>
          <div style={featureItemStyle}>🔍 Marketing Authenticity Verification</div>
          <div style={featureItemStyle}>♻️ Sustainable Alternative Recommendation</div>
        </div>

        {/* System Architecture */}
        <h3 style={sectionHeaderStyle}>
          <FaLayerGroup color="#16a34a" size={20} /> System Architecture
        </h3>
        <div style={{ background: "#fcfcfc", padding: "25px", borderRadius: "16px", border: "1px dashed #d1d5db" }}>
          
          <div style={{ marginBottom: "20px" }}>
            <span style={moduleTitleStyle}>INTERFACE LAYER</span>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "5px 0" }}>
              Responsive, cross-platform web interface built for high-performance data visualization and user interaction.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <span style={moduleTitleStyle}>PROCESSING LAYER</span>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "5px 0" }}>
              Robust server-side infrastructure managing asynchronous data pipelines, secure API communication, and scalable storage protocols.
            </p>
          </div>

          <div>
            <span style={moduleTitleStyle}>INTELLIGENCE LAYER</span>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "5px 0" }}>
              Heuristic-based AI engines and machine-learning models dedicated to pattern recognition and intelligent document processing.
            </p>
          </div>
        </div>

        {/* Mission */}
        <h3 style={sectionHeaderStyle}>
          <FaGlobeAmericas color="#16a34a" size={20} /> Institutional Mission
        </h3>
        <p style={{ fontSize: "16px", margin: 0, color: "#4b5563" }}>
          Our mission is to democratize product transparency. We enable consumers to make informed, 
          science-backed decisions by providing a clear analytical window into the ingredients that 
          define our daily products and environmental impact.
        </p>

      </div>
    </div>
  );
}

export default About;