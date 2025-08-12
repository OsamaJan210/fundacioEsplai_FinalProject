import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "../styles/Settings-busines.css";

const API_URL = import.meta.env.VITE_API_URL;

function parseSfBusinessString(str) {
  const result = {};
  const start = str.indexOf("(");
  const end = str.lastIndexOf(")");
  if (start === -1 || end === -1) return result;

  const content = str.slice(start + 1, end);
  const parts = content.split(/,(?![^(]*\))/);

  parts.forEach((part) => {
    const [key, ...rest] = part.split("=");
    if (!key || rest.length === 0) return;
    const value = rest.join("=").trim();
    result[key.trim()] = value;
  });

  return result;
}

export default function CompanyPage() {
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [companyForm, setCompanyForm] = useState({ address: "", phone: "" });

  useEffect(() => {
    const businessId = localStorage.getItem("businessId");
    const token = localStorage.getItem("token");

    if (!businessId || !token) {
      console.error("Missing businessId or token.");
      return;
    }

    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API_URL}/smartflow-api/v1/business/get/${businessId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch company info");

        const json = await response.json();
        const rawData = json.data;
        const parsed = parseSfBusinessString(rawData);

        setCompany({
          name: parsed.businessName || "",
          NIE: parsed.taxId || "",
          email: parsed.email || "",
          address: parsed.address || "",
          phone: parsed.phone || "",
        });
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${API_URL}/smartflow-api/v1/user/getAllByBusinessId/${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCompany();
    fetchUsers();
  }, []);

  const openEditCompanyModal = () => {
    setCompanyForm({
      address: company?.address || "",
      phone: company?.phone || "",
    });
    setModalMode("editCompany");
  };

  const saveCompany = () => {
    setCompany((prev) => ({
      ...prev,
      address: companyForm.address,
      phone: companyForm.phone,
    }));
    setModalMode(null);
  };

  const closeModal = () => {
    setModalMode(null);
  };

  return (
    <div className="company-page-container">
      <div className="company-header">
        <h1 className="company-name">{company?.name || ""}</h1>
      </div>

      <section className="company-info-section">
        <div
          className="section-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <h2>Company Information</h2>
          <button onClick={openEditCompanyModal} className="btn edit-btn">
            <FaEdit style={{ marginRight: 6 }} /> Edit Company
          </button>
        </div>
        <div className="company-info-columns">
          <div className="left-column">
            <p>
              <strong>Name:</strong> {company?.name || ""}
            </p>
            <p>
              <strong>NIE:</strong> {company?.NIE || ""}
            </p>
          </div>
          <div className="right-column">
            <p>
              <strong>Address:</strong> {company?.address || ""}
            </p>
            <p>
              <strong>Phone:</strong> {company?.phone || ""}
            </p>
            <p>
              <strong>Email:</strong> {company?.email || ""}
            </p>
          </div>
        </div>
      </section>

      <section className="users-section">
        <div className="section-header">
          <h2>Users</h2>
          <button onClick={() => alert("Add user functionality not implemented yet")} className="btn add-btn">
            <FaEdit style={{ marginRight: 6 }} /> Add User
          </button>
        </div>

        <div className="grid-table-company">
          <div className="grid-header-company">Name</div>
          <div className="grid-header-company">Email</div>
          

          {users.length > 0 ? (
            users.map((user, index) => (
              <React.Fragment key={user.id || index}>
                <div className="grid-cell-company">{user.fullName}</div>
                <div className="grid-cell-company">{user.email}</div>
              </React.Fragment>
            ))
          ) : (
            <div className="grid-cell" style={{ gridColumn: "1 / -1" }}>
              No users found.
            </div>
          )}
        </div>
      </section>


      {modalMode === "editCompany" && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content-company" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaEdit style={{ marginRight: "6px" }} /> Edit Company
              </h2>
              <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                <FaTimes />
              </button>
            </div>

            <div className="modal-grid">
              <label>
                Name:
                <input type="text" value={company?.name || ""} disabled />
              </label>

              <label>
                NIE:
                <input type="text" value={company?.NIE || ""} disabled />
              </label>

              <label>
                Email:
                <input type="email" value={company?.email || ""} disabled />
              </label>

              <label>
                Address:
                <input
                  type="text"
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                />
              </label>

              <label>
                Phone:
                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                />
              </label>
            </div>

            <div className="form-buttons">
              <button onClick={saveCompany} className="btn save-btn">
                <FaSave style={{ marginRight: 6 }} /> Save
              </button>
              <button onClick={closeModal} className="btn cancel-btn">
                <FaTimes style={{ marginRight: 6 }} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
