import { useEffect, useState } from "react";
import "../styles/Settings.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/smartflow-api/v1/user/get`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const text = await res.text();
        const fullName = text.match(/fullName=([^,]+)/)?.[1] || "";
        const username = text.match(/username=([^,]+)/)?.[1] || "";
        const email = text.match(/email=([^,]+)/)?.[1] || "";
        const password = text.match(/password=([^,]+)/)?.[1] || "";

        setProfile({ fullName, username, email, password });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/smartflow-api/v1/user/changePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: newPassword, oldPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || "Error changing password");
        return;
      }

      setMessage("Password changed successfully!");
      setShowModal(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      setMessage("Server error. Please try again later.");
    }
  };

  if (!profile) return <p>Loading...</p>;

return (
  <div className="profile-container">
    {/* Título separado arriba */}
    <h2 className="profile-title">My Profile</h2>

    {/* Columnas con información */}
    <div className="profile-columns">
      {/* Columna izquierda */}
      <div className="profile-column">
        <div className="profile-field">
          <FaUser />
          <label>Full Name:</label>
          <span>{profile.fullName}</span>
        </div>

        <div className="profile-field">
          <FaUser />
          <label>Username:</label>
          <span>{profile.username}</span>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="profile-column">
        <div className="profile-field">
          <FaEnvelope />
          <label>Email:</label>
          <span>{profile.email}</span>
        </div>

        <div className="profile-field">
          <FaLock />
          <label>Password:</label>
          <span>••••••••</span>
        </div>

        <p className="forgot-password" onClick={() => setShowModal(true)}>
          Change password?
        </p>
      </div>
    </div>

    {message && <p className="message">{message}</p>}

    {showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

}
