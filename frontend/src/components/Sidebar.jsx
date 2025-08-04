import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaCog } from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/dashboard">
          <img src="/logo-nombre.png" alt="Logo" className="logo-image" />
        </Link>
      </div>

      <nav className="sidebar-menu">
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
          <FaHome /> Dashboard
        </Link>
        <Link to="/product" className={location.pathname === "/product" ? "active" : ""}>
          <FaBox /> Product
        </Link>
        <Link to="/settings-busines" className={location.pathname === "/settings-busines" ? "active" : ""}>
          <FaCog /> Settings
        </Link>
      </nav>
    </aside>
  );
}
