import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaCog,
  FaCube,       // para Product
  FaList,       // para Category
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

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
        <Link to="/dashboard">
          <img src="/logo-nombre.png" alt="Logo" className="logo-image" />
        </Link>
      </div>

      <nav className="sidebar-menu">
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
          <FaHome /> Dashboard
        </Link>

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

        <Link to="/settings-busines" className={location.pathname === "/settings-busines" ? "active" : ""}>
          <FaCog /> Settings
        </Link>
      </nav>
    </aside>
  );
}
