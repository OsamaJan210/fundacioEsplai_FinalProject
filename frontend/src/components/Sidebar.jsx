import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome, FaBox, FaCog, FaCube, FaList,
  FaChevronDown, FaChevronRight, FaTachometerAlt
} from "react-icons/fa";
import "../styles/Sidebar.css";
import { translations } from "../translations"; 

export default function Sidebar({ lang }) {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [screenData, setScreenData] = useState([]);
  const t = translations[lang] || translations["en"];

  useEffect(() => {
    const stored = localStorage.getItem("screen");
    if (!stored) return;

    let screens = [];
    try {
      screens = JSON.parse(stored);
    } catch {
      screens = stored
        .replace(/[\[\]]/g, "")
        .split(",")
        .map(s => s.trim().replace(/^"?(.*?)"?$/, "$1"));
    }
    setScreenData(screens.map(s => s.toLowerCase()));
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/product") || location.pathname.startsWith("/category")) {
      setIsProductsOpen(true);
    }
  }, [location.pathname]);

  const toggleProductsMenu = () => setIsProductsOpen(!isProductsOpen);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/landing" className="logo-link">
          <img src="/logo-nombre.png" alt="Logo" className="logo-image" />
        </Link>
      </div>

      <nav className="sidebar-menu">
        <Link to="/landing" className={location.pathname === "/landing" ? "active" : ""}>
          <FaHome /> {t.home}
        </Link>

        {screenData.includes("dashboard") && (
          <Link to="/dashboard" className={location.pathname.startsWith("/dashboard") ? "active" : ""}>
            <FaTachometerAlt /> {t.dashboard}
          </Link>
        )}

        {screenData.includes("product") && (
          <div className={`menu-item ${isProductsOpen ? "open" : ""}`}>
            <div className="menu-button-product" onClick={toggleProductsMenu}>
              <FaBox /> {t.products}
              <span className="chevron-icon">
                {isProductsOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </div>
            {isProductsOpen && (
              <div className="submenu">
                <Link to="/product" className={location.pathname.startsWith("/product") ? "active" : ""}>
                  <FaCube /> {t.product}
                </Link>
                <Link to="/category" className={location.pathname.startsWith("/category") ? "active" : ""}>
                  <FaList /> {t.category}
                </Link>
              </div>
            )}
          </div>
        )}

        {screenData.includes("settings") && (
          <Link to="/settings-busines" className={location.pathname.startsWith("/settings-busines") ? "active" : ""}>
            <FaCog /> {t.settings}
          </Link>
        )}
      </nav>
    </aside>
  );
}
