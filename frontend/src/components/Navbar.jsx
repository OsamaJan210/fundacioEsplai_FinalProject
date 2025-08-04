import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCog, FaGlobe } from "react-icons/fa";
import "../styles/Navbar.css";

export default function TopNavbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguages, setShowLanguages] = useState(false);

  const handleSignOut = () => navigate("/");

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
    <nav className="top-navbar">
      <div className="pos-button-container">    
        <Link to="/pos" className="pos-button">
          POS
        </Link>
      </div>

      <div className="welcome-text-container">
        <span>Welcome Aitor</span>
      </div>

      <div className="profile-container" onClick={() => setShowMenu(!showMenu)}>
        <FaUserCircle size={42} className="profile-icon" />
        {showMenu && (
          <div className="navbar-dropdown" onClick={stopPropagation}>
            <Link to="/settings" className="dropdown-link" onClick={stopPropagation}>
              <FaCog style={{ marginRight: 8 }} />
              Settings
            </Link>

            <div className="language-selector" onClick={stopPropagation}>
              <FaGlobe />
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
                  <div className="language-option" onClick={() => changeLanguage("en")}>
                    <img src="/en.png" alt="English" className="flag-icon" />
                    English
                  </div>
                  <div className="language-option" onClick={() => changeLanguage("es")}>
                    <img src="/es.png" alt="Español" className="flag-icon" />
                    Español
                  </div>
                </div>
              )}
            </div>

            <button className="logout-button" onClick={handleSignOut}>
              <FaSignOutAlt style={{ marginRight: 8 }} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
