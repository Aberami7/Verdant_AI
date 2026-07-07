import axios from "axios";

// Target port for FastAPI local instance
const API_BASE_URL = "http://localhost:8000";

// ==========================================
// 🔬 AI ANALYSIS ENGINE ENDPOINTS
// ==========================================

/**
 * Sends a product payload (image file or raw text ingredients) to the backend 
 * to parse via EasyOCR and evaluate with the Groq/LangGraph AI chain.
 * @param {FormData} formData - Multi-part form container holding file data/metadata.
 */
export const analyzeProduct = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Analysis Pipeline Exception Trace:", error);
        return {
            success: false,
            message: error.response?.data?.detail || error.message || "AI engine encountered analytical sequence failure routing parameters."
        };
    }
};

// ==========================================
// 📊 DASHBOARD ENDPOINTS
// ==========================================

/**
 * Fetches core summary statistics and analytical metrics for the main dashboard views.
 */
export const fetchDashboardData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Dashboard overview query error execution context:", error);
        return {
            success: false,
            message: error.response?.data?.detail || error.message || "Failed grid telemetry dashboard payload metrics lookup extraction."
        };
    }
};

// ==========================================
// 📜 HISTORY & REPORTS ENDPOINTS (Live Now! 🚀)
// ==========================================

/**
 * Fetches the entire evaluation log history directly from the MySQL database via FastAPI.
 */
export const fetchHistory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history`);
        // FastAPI returns raw list, we wrap it in success:true for your History.jsx structure
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching evaluation log history:", error);
        return { 
            success: false, 
            data: [], 
            message: error.response?.data?.detail || "Failed to retrieve database history records." 
        };
    }
};

/**
 * Sends a DELETE request to clear a specific record from MySQL by its ID.
 * @param {string|number} id - Unique identifier key of the history item to remove.
 */
export const deleteHistoryItem = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/history/${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error deleting log item with identifier ${id}:`, error);
        return { 
            success: false, 
            message: error.response?.data?.detail || "Failed to clear selected item track." 
        };
    }
};