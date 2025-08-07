import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import "../styles/Login.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      // ❌ Invalid credentials
      if (data.msg === "Wrong login credentials" || data.erc === "0") {
        setError("Incorrect email or password. Please try again.");
        return;
      }

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Save user info
      if (data.name && data.businessId) {
        localStorage.setItem("userName", data.name);
        localStorage.setItem("businessId", data.businessId);
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Business Essential</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group password-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? < FaEye/> : <FaEyeSlash />}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn-submit">
            <FaSignInAlt /> Login
          </button>

          <p className="login-text">
            <FaUserPlus />{" "}
            <span
              className="login-link"
              onClick={() => navigate("/register")}
              style={{ cursor: "pointer" }}
            >
              Don’t have an account? Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
