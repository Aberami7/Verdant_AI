import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Loader from "../components/Loader"; 
import { fetchHistory, deleteHistoryItem } from "../services/api"; 

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHistoryData = async () => {
            try {
                setLoading(true);
                const response = await fetchHistory();
                // பேக்கெண்டிலிருந்து வரும் டேட்டா வடிவத்தைப் பொறுத்து செட் செய்யவும்
                if (Array.isArray(response)) {
                    setHistory(response);
                } else if (response && response.data) {
                    setHistory(response.data);
                } else {
                    setError("Failed to load history items.");
                }
            } catch (err) {
                setError("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        };
        loadHistoryData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this analysis record?")) return;
        try {
            // API-ல் குறிப்பிட்ட ரெக்கார்டை நீக்குகிறது
            await deleteHistoryItem(id);
            // UI-லிருந்து அந்த குறிப்பிட்ட ரெக்கார்டை மட்டும் நீக்குகிறது
            setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Delete Error:", err);
            alert("An error occurred while deleting the item.");
        }
    };

    const pageStyle = {
        marginLeft: "260px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f4f7f5",
        padding: "20px"
    };

    const contentStyle = {
        flex: "1"
    };

    return (
        <>
            <Sidebar />
            <div style={pageStyle}>
                <div style={contentStyle}>
                    <h2 style={{ color: "#166534", marginBottom: "5px" }}>📜 Analysis History</h2>
                    <p style={{ color: "gray", marginBottom: "20px" }}>View all previously analyzed products.</p>

                    {loading ? <Loader /> : error ? (
                        <div style={{ padding: "12px", background: "#fee2e2", color: "#dc2626", borderRadius: "8px" }}>{error}</div>
                    ) : (
                        <div style={{ background: "#ffffff", padding: "20px", borderRadius: "16px", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#16a34a", color: "white" }}>
                                        <th style={{ padding: "12px" }}>S.No</th>
                                        <th style={{ padding: "12px" }}>Product</th>
                                        <th style={{ padding: "12px" }}>Company</th>
                                        <th style={{ padding: "12px" }}>Eco Score</th>
                                        <th style={{ padding: "12px" }}>Health Risk</th>
                                        <th style={{ padding: "12px" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>No records found.</td></tr>
                                    ) : (
                                        history.map((item, index) => (
                                            <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                                <td style={{ padding: "12px", textAlign: "center" }}>{index + 1}</td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>{item.product_name}</td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>{item.company_name}</td>
                                                <td style={{ padding: "12px", textAlign: "center", fontWeight: "bold", color: "#16a34a" }}>{item.eco_score} / 100</td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>{item.health_risk}</td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)} 
                                                        style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
}

export default History;