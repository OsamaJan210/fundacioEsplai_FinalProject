import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaCog,
  FaCube,
  FaList,
  FaChevronDown,
  FaChevronRight,
  FaTachometerAlt // Nuevo icono para Dashboard
} from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [screenData, setScreenData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("screen");
    if (!stored) return;

    let screens = [];
    try {
      screens = JSON.parse(stored);
    } catch {
      const cleaned = stored
        .replace(/[\[\]]/g, "")
        .split(",")
        .map(s => s.trim().replace(/^"?(.*?)"?$/, "$1"));
      screens = cleaned;
    }
    setScreenData(screens.map(s => s.toLowerCase()));
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/product") || location.pathname.startsWith("/category")) {
      setIsProductsOpen(true);
    }
  }, [location.pathname]);

  const toggleProductsMenu = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/landing" className="logo-link">
          <img src="/logo-nombre.png" alt="Logo" className="logo-image" />
        </Link>
      </div>

      <nav className="sidebar-menu">
        {/* Home */}
        <Link to="/landing" className={location.pathname === "/landing" ? "active" : ""}>
            <FaHome /> Home
        </Link>

        {/* Dashboard */}
        {screenData.includes("dashboard") && (
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            <FaTachometerAlt /> Dashboard
          </Link>
        )}

        {/* Products */}
        {screenData.includes("product") && (
          <div className={`menu-item ${isProductsOpen ? "open" : ""}`}>
            <div className="menu-button-product" onClick={toggleProductsMenu}>
              <FaBox /> Products
              <span className="chevron-icon">
                {isProductsOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </div>
            {isProductsOpen && (
              <div className="submenu">
                <Link to="/product" className={location.pathname === "/product" ? "active" : ""}>
                  <FaCube /> Product
                </Link>
                <Link to="/category" className={location.pathname === "/category" ? "active" : ""}>
                  <FaList /> Category
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {screenData.includes("settings") && (
          <Link to="/settings-busines" className={location.pathname === "/settings-busines" ? "active" : ""}>
            <FaCog /> Settings
          </Link>
        )}
      </nav>
    </aside>
  );
}
