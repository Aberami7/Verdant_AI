import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ResultCard from "../components/ResultCard";
import { useParams } from "react-router-dom";
import axios from "axios";

function Report() {
    const { id } = useParams();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const pageStyle = {
        marginLeft: "250px",
        padding: "20px",
        background: "#f3f4f6",
        minHeight: "100vh"
    };

    useEffect(() => {
        fetchReport();
    }, [id]); // Included id in dependency array as a best practice

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(""); // Reset error state on a new fetch
            const response = await axios.get(
                `http://localhost:8000/api/history/${id}`
            );
            setReport(response.data);
        } catch (err) {
            setError("Failed to load report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Sidebar />

            <div style={pageStyle}>
                <Navbar />

                <h2 style={{ color: "#14532d" }}>
                    🌿 Product Analysis Report
                </h2>

                <p style={{ color: "gray" }}>
                    Detailed AI Eco Analysis Result
                </p>

                {/* --- Layout Sub-views --- */}
                
                {loading && (
                    <h2 style={{ marginTop: "30px", color: "#4b5563" }}>
                        Loading Report...
                    </h2>
                )}

                {error && (
                    <h2 style={{ marginTop: "30px", color: "#dc2626" }}>
                        {error}
                    </h2>
                )}

                {!loading && !error && report && (
                    <div style={{ marginTop: "20px" }}>
                        <ResultCard
                            title="Product Name"
                            value={report.product_name}
                            color="#16a34a"
                        />

                        <ResultCard
                            title="Company Name"
                            value={report.company_name || "N/A"}
                            color="#2563eb"
                        />

                        <ResultCard
                            title="Eco Score"
                            value={(report.eco_score ?? "N/A") + " / 10"}
                            color="#16a34a"
                        />

                        <ResultCard
                            title="Health Risk"
                            value={report.health_risk || "N/A"}
                            color="#dc2626"
                        />

                        <ResultCard
                            title="Environment Score"
                            value={(report.environment_score ?? "N/A") + " / 10"}
                            color="#2563eb"
                        />

                        <ResultCard
                            title="Greenwashing Verdict"
                            value={report.greenwashing_verdict || "N/A"}
                            color="#9333ea"
                        />

                        <ResultCard
                            title="Hidden Chemicals"
                            value={report.hidden_chemicals || "None detected"}
                            color="#f97316"
                        />

                        <ResultCard
                            title="Safe Alternatives"
                            value={report.safe_alternatives || "N/A"}
                            color="#0f766e"
                        />

                        <ResultCard
                            title="Confidence Score"
                            value={(report.confidence_score ?? "N/A") + " / 10"}
                            color="#14b8a6"
                        />

                        <ResultCard
                            title="AI Summary"
                            value={report.ai_summary || "No summary available."}
                            color="#475569"
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default Report;