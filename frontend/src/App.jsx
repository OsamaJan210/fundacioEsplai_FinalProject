import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/BusinesRegister";
import RegisterUser from "./pages/RegisterUser";
import Dashboard from "./pages/Dashboard";
import Pos from "./pages/Pos";
import Product from "./pages/Product";
import SettingsBussines from "./pages/Settings-busines";
import Settings from "./pages/Settings";

import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/Navbar";

import "./i18n";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/register", "/registerUser"];

  return (
    <div className="app-container">
      {!hideNavbarRoutes.includes(location.pathname) && <Sidebar />}

      <div className="content-wrapper">
        {!hideNavbarRoutes.includes(location.pathname) && <TopNavbar />}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registerUser" element={<RegisterUser />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<Pos />} />
            <Route path="/product" element={<Product />} />
            <Route path="/settings-busines" element={<SettingsBussines />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
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
