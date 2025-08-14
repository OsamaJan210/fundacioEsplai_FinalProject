import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/BusinesRegister";
import RegisterUser from "./pages/RegisterUser";
import Dashboard from "./pages/Dashboard";
import Pos from "./pages/Pos";
import Product from "./pages/Product";
import SettingsBussines from "./pages/Settings-busines";
import Settings from "./pages/Settings";
import Category from "./pages/Category";
import Landing from "./pages/Landing";

import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/Navbar";

function AppWrapper() {
  const location = useLocation();
  const [lang, setLang] = useState("en"); // Estado global de idioma

  const hideNavbarRoutes = ["/", "/register", "/registerUser", "/pos"];

  return (
    <div className="app-container">
      {!hideNavbarRoutes.includes(location.pathname) && <Sidebar lang={lang} />}

      {/* Main content area */}

      <div className="main-content">
        {!hideNavbarRoutes.includes(location.pathname) && (
          <TopNavbar lang={lang} setLang={setLang} />
        )}
        <Routes>
          <Route path="/settings" element={<Settings lang={lang} />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/product" element={<Product />} />
          <Route path="/category" element={<Category />} />
          <Route path="/settings-busines" element={<SettingsBussines lang={lang} />} />
          <Route path="/landing" element={<Landing lang={lang}/>} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
