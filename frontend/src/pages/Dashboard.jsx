import React from "react";
import { useNavigate } from "react-router-dom"; // For page navigation
import Sidebar from "../components/Sidebar"; 

function Dashboard() {
    const navigate = useNavigate();

    // ===========================
    // 🎨 STYLES (Fixes image_1a1dbc.png Overlay & Overlap issue)
    // ===========================
    const pageStyle = {
        marginLeft: "260px", // 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflowX: "hidden"
    };

    const customNavbarStyle = {
        background: "#ffffff",
        padding: "20px 40px",
        borderRadius: "0px 0px 16px 16px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.02)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box"
    };

    const centralContentStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 40px", 
        width: "100%",
        boxSizing: "border-box"
    };

    const containerStyle = {
        width: "100%",
        maxWidth: "1150px", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "45px" 
    };

    const buttonStyle = {
        padding: "18px 48px",
        border: "none",
        borderRadius: "14px",
        background: "#16a34a",
        color: "white",
        cursor: "pointer",
        fontSize: "20px",
        fontWeight: "700",
        boxShadow: "0px 8px 20px rgba(22, 163, 74, 0.25)",
        transition: "all 0.2s ease-in-out"
    };

    return (
        // 🌟 
        <div>
            
            <Sidebar />

         
            <div style={pageStyle}>
                
              
                <div style={customNavbarStyle}>
                    <div>
                        <h3 style={{ color: "#16a34a", margin: 0, display: "flex", alignItems: "center", gap: "8px", fontSize: "22px", fontWeight: "700" }}>
                            🌱 Verdant AI Dashboard
                        </h3>
                        <p style={{ color: "#888888", margin: "4px 0 0 0", fontSize: "14px", fontWeight: "500" }}>
                            AI-Powered Eco Product Analyzer
                        </p>
                    </div>
                </div>
                
                {/* Main Viewport Section */}
                <div style={centralContentStyle}>
                    <div style={containerStyle}>
                        
                        {/* 1. PRIMARY WELCOME HEADINGS */}
                        <div style={{ textAlign: "center" }}>
                            <h1 style={{ color: "#14532d", fontSize: "54px", fontWeight: "900", marginBottom: "15px", letterSpacing: "-1px" }}>
                                   Welcome to Verdant AI 🌿
                            </h1>
                            <p style={{ textAlign: "center" ,color: "#6b7280", fontSize: "20px", fontWeight: "500", margin: "0" }}>
                                AI Powered Environmental Product Analysis Dashboard
                            </p>
                        </div>

                        {/* 2. CORE SLOGAN ACCENT CARD */}
                        <div style={{ 
                            background: "#ffffff", 
                            padding: "50px 40px", 
                            borderRadius: "24px", 
                            boxShadow: "0px 4px 20px rgba(0,0,0,0.03)", 
                            width: "100%",
                            boxSizing: "border-box",
                            textAlign: "center"
                        }}>
                            <h2 style={{ color: "#16a34a", fontSize: "32px", fontWeight: "700", marginBottom: "22px" }}>
                                Scan Smart. Choose Green. Live Clean.
                            </h2>
                            <p style={{ color: "#4b5563", fontSize: "17.5px", maxWidth: "900px", margin: "0 auto", lineHeight: "1.85" }}>
                                Take total control over your health and ecological footprint with machine-learning insights. Verdant AI simplifies consumer awareness by instantly translating complex, dense product label parameters from uploaded images. Our advanced optical pipeline extracts chemical listings, reviews environmental risk indicators, isolates harmful additives, and maps sustainability benchmarks to bring absolute transparent readability right to your screen layout.
                            </p>
                        </div>

                        {/* 3. INTERACTION ACTION RUN TRIGGER */}
                        <div>
                            <button 
                                style={buttonStyle} 
                                onClick={() => navigate("/analysis")}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = "#15803d";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = "#16a34a";
                                    e.currentTarget.style.transform = "translateY(0px)";
                                }}
                            >
                                🔍 Start Analysis Run
                            </button>
                        </div>

                        {/* 4. BASE COMPLIANCE FOOT DISCLAIMER */}
                        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "30px", width: "100%", marginTop: "10px", textAlign: "center" }}>
                            <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: "1.6", margin: "0" }}>
                                <strong style={{ color: "#6b7280", fontWeight: "600" }}>Disclaimer:</strong> Automated analytical pipeline evaluation reports are processed via intelligence frameworks. Always cross-verify consumer compliance standards against accredited physical verification systems.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;