import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import {
  FaHome,
  FaBox,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaGlobe,
} from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguages, setShowLanguages] = useState(false);

  const handleSignOut = () => {
    navigate("/");
  };

  const changeLanguage = (lang) => {
    if (lang === selectedLanguage) {
      setShowLanguages(!showLanguages);
    } else {
      setSelectedLanguage(lang);
      setShowLanguages(false);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="navbar-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link to="/dashboard">
            <img src="/logo-nombre.png" alt="Logo" className="logo-image" />
          </Link>
        </div>

        <nav className="sidebar-menu">
          <Link
            to="/dashboard"
            className={location.pathname === "/dashboard" ? "active" : ""}
          >
            <FaHome /> Dashboard
          </Link>
          <Link
            to="/product"
            className={location.pathname === "/product" ? "active" : ""}
          >
            <FaBox /> Product
          </Link>
          <Link
            to="/settings-busines"
            className={location.pathname === "/settings-busines" ? "active" : ""}
          >
            <FaCog /> Settings
          </Link>
        </nav>
      </aside>

      <nav className="navbar">
        <div className="navbar-section left">
          <Link to="/pos" className="pos-button">POS</Link>
        </div>

        <div className="navbar-section center">
          <span className="welcome-text">Welcome Aitor</span>
        </div>

        <div
          className="navbar-section right"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaUserCircle size={42} className="profile-icon" />

          {showMenu && (
            <div className="navbar-dropdown" onClick={stopPropagation}>
              <Link
                to="/settings"
                className="dropdown-link"
                onClick={stopPropagation}
              >
                <FaCog className="sidebar-icon" style={{ marginRight: "8px" }} />
                Settings
              </Link>

              <div className="language-selector" onClick={stopPropagation}>
                <FaGlobe className="sidebar-icon" />
                <div
                  className="selector-display"
                  onClick={() => setShowLanguages(!showLanguages)}
                >
                  <img
                    src={`/${selectedLanguage}.png`}
                    alt={selectedLanguage}
                    className="flag-icon"
                  />
                  <span>{selectedLanguage === "en" ? "English" : "Español"}</span>
                </div>

                {showLanguages && (
                  <div className="language-dropdown">
                    <div
                      onClick={() => changeLanguage("en")}
                      className="language-option"
                    >
                      <img src="/en.png" alt="English" className="flag-icon" />
                      <span>English</span>
                    </div>
                    <div
                      onClick={() => changeLanguage("es")}
                      className="language-option"
                    >
                      <img src="/es.png" alt="Español" className="flag-icon" />
                      <span>Español</span>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleSignOut} className="logout-button">
                <FaSignOutAlt size={16} style={{ marginRight: "8px" }} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
