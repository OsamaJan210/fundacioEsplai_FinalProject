import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCog, FaGlobe } from "react-icons/fa";
import "../styles/Navbar.css";
import { translations } from "../translations"; 

export default function TopNavbar({ lang, setLang }) { 
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const userName = localStorage.getItem("userName") || "User";
  const screenData = localStorage.getItem("screen") || "";
  const hasPOS = screenData.includes("POS");

  // Fallback si lang es inválido
  const t = translations[lang] || translations["en"];

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("businessId");
    localStorage.removeItem("token");
    navigate("/");
  };

  const changeLanguage = (selected) => {
    setLang(selected);
    setShowLanguages(false);
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <nav className="top-navbar">
      {hasPOS && (
        <div className="pos-button-container">
          <Link to="/pos" className="pos-button">
            {t.pos}
          </Link>
        </div>
      )}

      <div className="welcome-text-container">
        <span>{t.welcome}, {userName} 👋</span>
      </div>

      <div className="profile-container" onClick={() => setShowMenu(!showMenu)}>
        <FaUserCircle size={42} className="profile-icon" />
        {showMenu && (
          <div className="navbar-dropdown" onClick={stopPropagation}>
            <Link to="/settings" className="dropdown-link" onClick={stopPropagation}>
              <FaCog style={{ marginRight: 8 }} />
              {t.settings}
            </Link>

            <div className="language-selector" onClick={stopPropagation}>
              <FaGlobe />
              <div className="selector-display" onClick={() => setShowLanguages(!showLanguages)}>
                <img src={`/${lang}.png`} alt={lang} className="flag-icon" />
                <span>{lang === "en" ? t.english : t.spanish}</span>
              </div>

              {showLanguages && (
                <div className="language-dropdown">
                  <div className="language-option" onClick={() => changeLanguage("en")}>
                    <img src="/en.png" alt="English" className="flag-icon" />
                    {translations.en.english}
                  </div>
                  <div className="language-option" onClick={() => changeLanguage("es")}>
                    <img src="/es.png" alt="Español" className="flag-icon" />
                    {translations.es.spanish}
                  </div>
                </div>
              )}
            </div>

            <button className="logout-button" onClick={handleSignOut}>
              <FaSignOutAlt style={{ marginRight: 8 }} />
              {t.signOut}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
