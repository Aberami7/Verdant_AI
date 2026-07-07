import React, { useState } from "react";
import { FaLeaf, FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [hasNotifications, setHasNotifications] = useState(true);

  const navbarStyle = {
    height: "70px",
    background: "var(--card-bg)",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 25px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.02)",
    marginBottom: "25px",
    border: "1px solid var(--border)",
    transition: "all 0.3s ease"
  };

  const iconContainerStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "50%",
    transition: "background 0.2s ease",
  };

  const badgeStyle = {
    position: "absolute",
    top: "5px",
    right: "5px",
    width: "8px",
    height: "8px",
    background: "#ef4444",
    borderRadius: "50%",
    border: "1px solid var(--card-bg)"
  };

  return (
    <div style={navbarStyle}>
      {/* Left side: Branding and Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <h2
          style={{
            margin: 0,
            color: "#16a34a",
            fontSize: "20px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FaLeaf size={18} color="#16a34a" /> Verdant AI Dashboard
        </h2>
        <p
          style={{
            margin: 0,
            color: "var(--text-muted)",
            fontSize: "13px",
            fontWeight: "500",
            transition: "color 0.3s ease"
          }}
        >
          AI-Powered Eco Product Analyzer
        </p>
      </div>

      {/* Right side: Action Items & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* Notification Bell with Badge */}
        <div 
          style={iconContainerStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--hover-bg)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          onClick={() => setHasNotifications(false)}
          title="Notifications"
        >
          <FaBell color="var(--text-muted)" size={20} style={{ transition: "color 0.3s ease" }} />
          {hasNotifications && <div style={badgeStyle} />}
        </div>

        {/* Vertical Divider */}
        <div style={{ width: "1px", height: "24px", background: "var(--border)", transition: "background 0.3s ease" }} />

        {/* User Profile Action */}
        <div 
          style={{ ...iconContainerStyle, padding: "2px" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          title="User Account"
        >
          <FaUserCircle color="#166534" size={36} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;