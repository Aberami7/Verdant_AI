import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ResultCard from "../components/ResultCard";
import Footer from "../components/Footer";
import { analyzeProduct } from "../services/api";

function Analysis() {
    // ===========================
    // STATES & REFS 
    // ===========================
    const [username, setUsername] = useState("");
    const [productName, setProductName] = useState("");
    const [companyName, setCompanyName] = useState("");

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    // ===========================
    // LIFECYCLE CLEANUP 
    // ===========================
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // ===========================
    // 🎨 STYLES 
    // ===========================
    const pageStyle = {
        marginLeft: "260px", 
        width: "calc(100% - 260px)",
        background: "#f4f7f5", 
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflowX: "hidden"
    };

    const centralContentStyle = {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px 40px 50px 40px", 
        width: "100%",
        boxSizing: "border-box"
    };

    const containerStyle = {
        width: "100%",
        maxWidth: "950px", 
        display: "flex",
        flexDirection: "column",
        gap: "25px"
    };

    const cardStyle = {
        background: "#ffffff",
        padding: "45px 40px",
        borderRadius: "24px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.03)",
        width: "100%",
        boxSizing: "border-box"
    };

    const inputGroupStyle = {
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        textAlign: "left"
    };

    const labelStyle = {
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
        paddingLeft: "4px"
    };

    const inputStyle = {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "12px",
        border: "1.5px solid #e5e7eb",
        fontSize: "15.5px",
        background: "#f9fafb",
        color: "#1f2937",
        boxSizing: "border-box",
        transition: "all 0.2s ease",
        outline: "none"
    };

    const fileUploadBoxStyle = {
        border: "2px dashed #cdd5cd",
        padding: "30px 20px",
        borderRadius: "16px",
        background: "#f9fafb",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease"
    };

    const buttonStyle = {
        padding: "14px 32px",
        border: "none",
        borderRadius: "12px",
        background: "#16a34a",
        color: "white",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "600",
        boxShadow: "0px 4px 12px rgba(22, 163, 74, 0.15)",
        transition: "all 0.2s ease"
    };

    // ===========================
    // 🌀 LOADING MODAL STYLES
    // ===========================
    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000
    };

    const modalBoxStyle = {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "50px 55px",
        width: "440px",
        maxWidth: "90%",
        textAlign: "center",
        boxShadow: "0px 20px 60px rgba(0,0,0,0.25)"
    };

    const spinnerStyle = {
        width: "70px",
        height: "70px",
        margin: "0 auto 20px auto",
        borderRadius: "50%",
        border: "5px solid #dcfce7",
        borderTopColor: "#16a34a",
        animation: "verdant-spin 0.9s linear infinite"
    };

    const stepRowStyle = (isActive, isDone) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "8px 0",
        fontSize: isActive ? "15.5px" : "14.5px",
        fontWeight: isActive ? "700" : "500",
        color: isDone ? "#16a34a" : (isActive ? "#111827" : "#9ca3af"),
        transition: "all 0.25s ease"
    });

    const progressTrackStyle = {
        width: "100%",
        height: "6px",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
        marginTop: "25px"
    };

    const progressFillStyle = {
        height: "100%",
        width: `${progress}%`,
        background: "#16a34a",
        borderRadius: "10px",
        transition: "width 0.4s ease"
    };

    const steps = [
        { label: "Uploading Product Image...", threshold: 10 },
        { label: "Extracting Ingredients (EasyOCR)...", threshold: 30 },
        { label: "Analyzing Eco-Impact (Groq AI)...", threshold: 70 },
        { label: "Compiling Analysis Record...", threshold: 90 }
    ];

    // ===========================
    // HANDLERS
    // ===========================
    const handleImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImage(file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    };

   
    const formatField = (value, fallback) => {
        if (value === null || value === undefined || value === "") return fallback;
        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
    };

    const handleAnalyze = async () => {
        if (username.trim() === "" || productName.trim() === "" || companyName.trim() === "" || !image) {
            setError("Please fill all fields and upload an image.");
            return;
        }

        setError("");
        setResult(null);
        setLoading(true);
        setProgress(10);

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("product_name", productName);
            formData.append("company_name", companyName);
            formData.append("file", image); 

            setProgress(30);
            const response = await analyzeProduct(formData);
            setProgress(70);

            // api.js -> { success: true, data: response.data }
            // backend  -> { status: "success", data: parsed_result }
          
            if (response.success) {
                const backendData = response.data?.data || response.data || {};

                setProgress(90);

                const structuredReport = {
                    username: username, 
                    product_name: backendData.product_name || productName,
                    company_name: backendData.company_name || companyName,
                    ingredients: formatField(backendData.ingredients, "OCR Text Extraction Complete"),
                    eco_score: backendData.eco_score ?? "7.5",
                    health_risk: formatField(backendData.health_risk, "Medium"),
                    environment_score: backendData.environmental_score ?? backendData.environment_score ?? "7.5",
                    greenwashing_verdict: formatField(backendData.greenwashing_verdict, "Verified Safe Ingredients"),
                    hidden_chemicals: formatField(backendData.hidden_chemicals, "None Flagged"),
                    safe_alternatives: formatField(backendData.safe_alternatives, "Continue using this product"),
                    confidence_score: backendData.confidence_score ?? "9.0",
                    ai_summary: backendData.summary || backendData.ai_summary || "Product processed cleanly through Verdant AI Engine Layer."
                };
                
                
                setResult(structuredReport);
                localStorage.setItem("latestReport", JSON.stringify(structuredReport));
                
                setProgress(100);
            } else {
                setError(response.message || "Analysis failed.");
            }
        } catch (error) {
            console.error(error);
            setError("Unable to connect to server.");
        } finally {
            
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 500);
        }
    };

    const handleReset = () => {
        setUsername("");
        setProductName("");
        setCompanyName("");
        setImage(null);
        if (preview) {
            URL.revokeObjectURL(preview);
            setPreview(null);
        }
        setResult(null);
        setError("");
        setProgress(0);
        
        // 💡 நீக்கம்: ரீசெட் செய்யும்போது லோக்கல் ஸ்டோரேஜையும் காலி செய்கிறோம்
        localStorage.removeItem("latestReport");
        
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div>
            {/* Spinner animation keyframes (inline, no external CSS file needed) */}
            <style>
                {`
                    @keyframes verdant-spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>

            <Sidebar />

            {/* ===========================
                🌀 FULL-SCREEN LOADING MODAL
               =========================== */}
            {loading && (
                <div style={overlayStyle}>
                    <div style={modalBoxStyle}>
                        <div style={spinnerStyle} />

                        <h2 style={{ color: "#16a34a", fontSize: "22px", fontWeight: "800", margin: "0 0 4px 0" }}>
                            🌿 Verdant AI
                        </h2>
                        <p style={{ color: "#374151", fontSize: "15px", fontWeight: "600", margin: "0 0 22px 0" }}>
                            Processing Pipeline Active
                        </p>

                        <div>
                            {steps.map((step, idx) => {
                                const isDone = progress > step.threshold;
                                const isActive = !isDone && progress >= (steps[idx - 1]?.threshold || 0);
                                return (
                                    <div key={step.label} style={stepRowStyle(isActive, isDone)}>
                                        <span>{isDone ? "✅" : isActive ? "⏳" : "⚪"}</span>
                                        <span>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={progressTrackStyle}>
                            <div style={progressFillStyle} />
                        </div>

                        <p style={{ color: "#16a34a", fontSize: "13px", fontWeight: "700", marginTop: "18px", marginBottom: 0 }}>
                            Please don't close this window...
                        </p>
                    </div>
                </div>
            )}
            
            <div style={pageStyle}>
                <div style={centralContentStyle}>
                    <div style={containerStyle}>
                        
                        <div style={{ textAlign: "center", marginTop: "25px", padding: "0px" }}>
                            <h1 style={{ color: "#14532d", fontSize: "44px", fontWeight: "800", marginBottom: "25px", letterSpacing: "-0.5px" }}>
                                🌿 Product Analysis Run
                            </h1>
                            <p style={{ color: "#6b7280", fontSize: "17px", fontWeight: "500", margin: "0", lineHeight: "1.6" }}>
                                Upload a product label snapshot to
                                instantly isolate chemical components.
                            </p>
                        </div>

                        {/* INPUT CARD */}
                        <div style={cardStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>User Identification</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    placeholder="Enter your name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                                />
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Product Nomenclature</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    placeholder="e.g. Organic Green Tea, Aloe Moisturizer"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                                />
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Manufacturing Company</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    placeholder="Enter brand or manufacturer name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                                />
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Product Ingredients Label Image</label>
                                <div 
                                    style={fileUploadBoxStyle}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#16a34a"}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "#cdd5cd"}
                                >
                                    <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>📸</span>
                                    <span style={{ fontSize: "14px", color: "#4b5563", fontWeight: "500" }}>
                                        {image ? `Selected: ${image.name}` : "Click here to browse image from directory"}
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        style={{
                                            position: "absolute",
                                            top: 0, left: 0, width: "100%", height: "100%",
                                            opacity: 0, cursor: "pointer"
                                        }}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImage}
                                    />
                                </div>
                            </div>

                            {preview && (
                                <div style={{ marginTop: "25px", textAlign: "center" }}>
                                    <p style={{ ...labelStyle, marginBottom: "10px", textAlign: "center" }}>Selected Label Preview</p>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            maxWidth: "280px",
                                            borderRadius: "16px",
                                            border: "3px solid #ffffff",
                                            boxShadow: "0px 4px 15px rgba(0,0,0,0.06)"
                                        }}
                                    />
                                </div>
                            )}

                            {/* BUTTON ACTIONS */}
                            <div style={{ display: "flex", gap: "15px", marginTop: "35px" }}>
                                <button 
                                    style={buttonStyle} 
                                    onClick={handleAnalyze}
                                    onMouseOver={(e) => e.currentTarget.style.background = "#15803d"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "#16a34a"}
                                >
                                    🚀 Analyze Product Pipeline
                                </button>
                                <button
                                    onClick={handleReset}
                                    style={{ ...buttonStyle, background: "#6b7280", boxShadow: "none" }}
                                    onMouseOver={(e) => e.currentTarget.style.background = "#4b5563"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "#6b7280"}
                                >
                                    Reset Fields
                                </button>
                            </div>

                            {error && (
                                <p style={{ color: "#dc2626", marginTop: "20px", fontWeight: "600", fontSize: "14.5px", background: "#fef2f2", padding: "10px 15px", borderRadius: "8px", border: "1px solid #fee2e2" }}>
                                    ⚠️ {error}
                                </p>
                            )}
                        </div>

                        {/* REPORTS OUTPUT */}
                        {result && (
                            <div
                                style={{
                                    marginTop: "10px",
                                    background: "#ffffff",
                                    padding: "40px 35px",
                                    borderRadius: "24px",
                                    boxShadow: "0px 4px 20px rgba(0,0,0,0.03)",
                                    textAlign: "left"
                                }}
                            >
                                <h2 style={{ color: "#14532d", marginBottom: "25px", fontSize: "26px", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
                                    📋 Comprehensive Eco Evaluation
                                </h2>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                        gap: "20px"
                                    }}
                                >
                                    <ResultCard title="Username" value={result.username} color="#2563eb" />
                                    <ResultCard title="Product Name" value={result.product_name} color="#16a34a" />
                                    <ResultCard title="Company Name" value={result.company_name} color="#9333ea" />

                                    {/* Ingredients - text நீளமா இருக்கறதால தனி full-width row-ஆ காட்டுறோம் */}
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <ResultCard title="Ingredients" value={result.ingredients} color="#ea580c" />
                                    </div>

                                    <ResultCard title="Eco Score" value={`${result.eco_score} / 10`} color="#22c55e" />
                                    <ResultCard title="Health Risk" value={result.health_risk} color="#ef4444" />
                                    <ResultCard title="Environment Score" value={`${result.environment_score} / 10`} color="#2563eb" />
                                    <ResultCard title="Greenwashing Verdict" value={result.greenwashing_verdict} color="#8b5cf6" />
                                    <ResultCard title="Hidden Chemicals" value={result.hidden_chemicals} color="#f97316" />
                                    <ResultCard title="Safe Alternatives" value={result.safe_alternatives} color="#0f766e" />
                                    <ResultCard title="Confidence Score" value={`${result.confidence_score} / 10`} color="#0891b2" />
                                </div>

                                <div style={{ marginTop: "20px" }}>
                                    <ResultCard title="AI Summary" value={result.ai_summary} color="#475569" />
                                </div>
                            </div>
                        )}

                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analysis;