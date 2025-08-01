import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/UserRegister.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // error general
  const [emailError, setEmailError] = useState(""); // error específico de email
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Limpiar errores cuando cambie cualquier campo
    setError("");
    if (name === "email") {
      setEmailError("");
    }
  };

  const checkEmailExists = async (email) => {
    try {
      setIsCheckingEmail(true);
      const url = `${API_URL}/smartflow-api/V1/User/isEmailExsist?email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      const data = await response.json();


      setIsCheckingEmail(false);
      if (data.msg === "email not exsist" && data.erc === "1") {
        return false; // No existe email, no hay error
      } else {
        return true; // Email existe
      }
    } catch (error) {
      setIsCheckingEmail(false);
      console.error("Error checking email:", error);
      setError("Error checking email. Please try again later.");
      return true; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.username || !form.email || !form.password || !form.fullName) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    // Verificar email en la API
    const emailExists = await checkEmailExists(form.email);

    if (emailExists) {
      setEmailError("This email is already registered.");
      return;
    }

    // Si todo está bien, redirige al dashboard o siguiente página
    navigate("/dashboard");
  };

  return (
    <div className="user-register-page">
      <h1>Business Essential</h1>
      <div className="user-register-card">
        <form onSubmit={handleSubmit} className="user-register-form">
          <div className="input-group-register">
            <FaUser className="icon" />
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group-register">
            <FaUserCircle className="icon" />
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group-register">
            <FaEnvelope className="icon" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isCheckingEmail}
            />
          </div>
          {emailError && (
            <span className="error-message-register">{emailError}</span>
          )}

          <div className="input-group-register password-group">
            <FaLock className="icon" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error-message-register">{error}</p>}

          <button
            type="submit"
            className="btn-submit-register"
            disabled={isCheckingEmail}
          >
            {isCheckingEmail ? "Checking..." : "Register"}
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/")}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
