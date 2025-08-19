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
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    if (name === "email") setEmailError("");
  };

  // Verificar si el email existe
  const checkEmailExists = async (email) => {
    setIsCheckingEmail(true);
    try {
      const url = `${API_URL}/auth/isEmailExsistUser?email=${encodeURIComponent(email)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Email check response:", data);
      setIsCheckingEmail(false);

      if (data.msg?.trim().toLowerCase() === "email not exsist" && data.erc?.trim() === "1") {
        return false; // Email no existe → se puede crear
      } else {
        return true; // Email ya registrado → bloquea creación
      }
    } catch (err) {
      console.error("Error checking email:", err);
      setIsCheckingEmail(false);
      setError("Error checking email. Please try again later.");
      return true; // Bloquea por seguridad
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos de usuario
    if (!form.username || !form.email || !form.password || !form.fullName) {
      setError("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    // Comprobar si el email ya existe
    const emailExists = await checkEmailExists(form.email);
    if (emailExists) {
      setEmailError("This email is already registered.");
      return;
    }

    // Recuperar datos de la empresa desde localStorage
    const businessData = JSON.parse(localStorage.getItem("businessData"));
    if (!businessData) {
      setError("Business data is missing. Please complete business registration first.");
      return;
    }

    // Combinar datos de empresa + usuario
    const requestData = {
      ...businessData,
      username: form.username,
      email: form.email,
      password: form.password,
      fullName: form.fullName,
    };

    console.log("Request Data to API:", requestData);

    try {
      const response = await fetch(`${API_URL}/auth/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.removeItem("businessData"); // Limpiar datos de empresa
        navigate("/");
      } else {
        setError(result.message || "Error creating account.");
      }
    } catch (err) {
      setError("Unexpected error. Please try again.");
    }
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
          {emailError && <span className="error-message-register">{emailError}</span>}

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
