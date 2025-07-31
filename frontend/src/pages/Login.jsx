import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Simulación de base de datos de usuarios registrados
  const registeredUsers = ["admin@example.com", "user@test.com", "cliente@demo.com"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Limpiar error al escribir
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica si el email está registrado
    if (!registeredUsers.includes(form.email.toLowerCase())) {
      setError("User is not registered.");

      return;
    }

    // Continuar con el inicio de sesión
    alert(`Bienvenido ${form.email}`);
    // navigate('/dashboard'); // Redirigir si deseas
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Business Essential</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Mostrar error si el correo no está registrado */}
          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-btn-submit">
            <FaSignInAlt /> Login
          </button>

          <p className="login-text">
            <FaUserPlus />{' '}
            <span className="login-link" onClick={() => navigate('/register')}>
              Don’t have an account? Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
