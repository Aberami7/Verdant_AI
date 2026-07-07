import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaLeaf,
  FaChartPie,
  FaSearch,
  FaHistory,
  FaInfoCircle 
} from "react-icons/fa";

function Sidebar({ latestReport }) {
  const sidebarStyle = {
    width: "260px",
    background: "#14532d",
    color: "white",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    boxSizing: "border-box",
    position: "fixed",
    top: 0,
    left: 0,
    boxShadow: "4px 0 15px rgba(20, 83, 45, 0.15)",
    zIndex: 1000
  };

  const getNavigationLinkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 16px",
    marginBottom: "6px",
    borderRadius: "8px",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "#d1fae5",
    background: isActive ? "#16a34a" : "transparent",
    fontWeight: isActive ? "600" : "500",
    fontSize: "15px",
    transition: "all 0.2s ease-in-out"
  });

  return (
    <div style={sidebarStyle}>
      <style>{`
        .sidebar-nav-link:hover { background-color: rgba(255, 255, 255, 0.08) !important; color: #ffffff !important; transform: translateX(3px); }
        .sidebar-nav-link.active:hover { background-color: #16a34a !important; transform: none; }
      `}</style>

      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "35px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "20px" }}>
        <div style={{ display: "inline-flex", padding: "12px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.1)" }}>
          <FaLeaf size={32} color="#4ade80" />
        </div>
        <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "12px" }}>Verdant AI</div>
      </div>

      {/* Navigation Main Links */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <NavLink to="/dashboard" style={getNavigationLinkStyle} className="sidebar-nav-link">
          <FaChartPie size={18} /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/analysis" style={getNavigationLinkStyle} className="sidebar-nav-link">
          <FaSearch size={18} /> <span>Analysis Run</span>
        </NavLink>
        <NavLink to="/history" style={getNavigationLinkStyle} className="sidebar-nav-link">
          <FaHistory size={18} /> <span>Audit History</span>
        </NavLink>

        {/* Dynamic DB Data Display Section */}
        {latestReport && (
          <div style={{ marginTop: "20px", padding: "15px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div style={{ fontSize: "11px", color: "#a7f3d0", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Latest Analysis
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{latestReport.product_name}</div>
            <div style={{ fontSize: "12px", color: "#d1fae5" }}>Eco Score: {latestReport.eco_score}</div>
          </div>
        )}
      </div>

      {/* About Foot */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "15px" }}>
        <NavLink to="/about" style={getNavigationLinkStyle} className="sidebar-nav-link">
          <FaInfoCircle size={18} /> <span>About</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;