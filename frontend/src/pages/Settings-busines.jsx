import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Settings-busines.css";
import { Country, State, City } from "country-state-city";
import postalCodesData from "../data/postalCodes.js";


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
  const [companyForm, setCompanyForm] = useState({
    address: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Form state for Add User modal
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    permissions: [],
  });
  const [editUserForm, setEditUserForm] = useState({
    id: "",
    username: "",
    email: "",
    fullName: "",
    permissions: [],
  });
  const getPostalCode = (countryName, stateName, cityName) => {
    if (!countryName || !stateName || !cityName) return "";
    const countryIso = Country.getAllCountries().find(c => c.name === countryName)?.isoCode;
    if (!countryIso) return "";
    const stateIso = State.getStatesOfCountry(countryIso).find(s => s.name === stateName)?.name;
    if (!stateIso) return "";
    return postalCodesData?.[countryIso]?.[stateIso]?.[cityName] || "";
  };



  const permissionsList = ["Product", "Settings", "POS", "Dashboard"];

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [modalError, setModalError] = useState("");
  // Obtener el isoCode del country según el valor que viene de la API
  const countryIso = Country.getAllCountries().find(
    (c) => c.name === companyForm.country
  )?.isoCode;

  // Obtener todos los estados del país
  const states = countryIso ? State.getStatesOfCountry(countryIso) : [];

  // Obtener el isoCode del state según el valor que viene de la API
  const stateIso = states.find((s) => s.name === companyForm.state)?.isoCode;

  // Obtener todas las ciudades del state
  const cities = countryIso && stateIso ? City.getCitiesOfState(countryIso, stateIso) : [];




  // 1) Fetch de la empresa SOLO al montar
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
        console.log("Company info response:", json);
        const rawData = json.data || {};
        const parsed = parseSfBusinessString(rawData) || {};

        setCompany({
          name: parsed.businessName || "",
          NIE: parsed.taxId || "",
          country: parsed.country || "",
          city: parsed.city || "",
          state: parsed.state || "",
          postalCode: parsed.postalCode || "",
          email: parsed.email || "",
          address: parsed.address || "",
          phone: parsed.phone || "",
        });
        console.log("Company data:", parsed);
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    fetchCompany();
    fetchUsers();
  }, []);


  useEffect(() => {
    if (modalMode === "editCompany" && company) {
      setCompanyForm({
        address: company.address || "",
        phone: company.phone || "",
        country: company.country || "",
        state: company.state || "",
        city: company.city || "",
        postalCode: company.postalCode || "", // 👈 ahora sí
      });
    }
  }, [modalMode, company]);
  ;



  const fetchUsers = async () => {
    try {
      const businessId = localStorage.getItem("businessId");
      const token = localStorage.getItem("token");
      if (!businessId || !token) return;

      const response = await fetch(
        `${API_URL}/smartflow-api/v1/user/getAllByBusinessId/${businessId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      // console.log("Fetched users:", data);
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



  const openEditCompanyModal = () => {
    setCompanyForm({
      address: company?.address || "",
      phone: company?.phone || "",
      country: company?.country || "",
      state: company?.state || "",
      city: company?.city || "",
    });
    setModalMode("editCompany");
  };

  const toggleEditPermission = (perm) => {
    setEditUserForm((prev) => {
      if (prev.permissions.includes(perm)) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== perm) };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
  };

  const saveEditedUser = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      userId: editUserForm.id,
      screenList: permissionsList.map((screenName) => ({
        screenName,
        allowed: editUserForm.permissions.includes(screenName),
      })),
    };

    try {
      const response = await fetch(`${API_URL}/smartflow-api/v1/user/editScreenAllowd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.erc === "0") {
        // Hubo un error, mostramos mensaje y NO cerramos modal
        setModalError(data.msg || "Error updating user");
        return;
      }

      // Si todo va bien, actualizamos usuario y cerramos modal
      setUsers((prev) =>
        prev.map((u) => (u.id === editUserForm.id ? { ...u, ...editUserForm } : u))
      );
      setModalMode(null);
      setModalError(""); // Limpiar error
    } catch (error) {
      console.error("Error updating user:", error);
      setModalError("Error updating user. Try again later.");
    }
  };


  const saveCompany = () => {
    const token = localStorage.getItem("token");
    const businessId = localStorage.getItem("businessId");

    if (!token || !businessId) {
      console.error("Missing token or businessId.");
      return;
    }

    const payload = {
      businessId: businessId,
      address: companyForm.address,
      phone: companyForm.phone,
      country: companyForm.country,
      state: companyForm.state,
      city: companyForm.city,
      postalCode: companyForm.postalCode,
    };
    console.log("Saving company with payload:", payload);
    fetch(`${API_URL}/smartflow-api/v1/business/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.erc === "0") {
          console.error("Error updating company:", data.msg);
          return;
        }
        setCompany({ ...company, ...companyForm });
        setModalMode(null);
      })
      .catch((error) => {
        console.error("Error saving company:", error);
      });

  };

  const openAddUserModal = () => {
    setNewUserForm({
      username: "",
      email: "",
      password: "",
      fullName: "",
      permissions: [],
    });
    setShowPassword(false);
    setEmailError("");
    setModalMode("addUser");
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailError("");
  };

  const togglePermission = (perm) => {
    setNewUserForm((prev) => {
      const hasPerm = prev.permissions.includes(perm);
      if (hasPerm) {
        return { ...prev, permissions: prev.permissions.filter((p) => p !== perm) };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
  };

  const checkEmailExists = async (email) => {
    try {
      setIsCheckingEmail(true);
      setEmailError("");
      const token = localStorage.getItem("token");

      const url = `${API_URL.replace(/\/$/, "")}/auth/isEmailExsistUser?email=${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`HTTP error! status: ${response.status}, body: ${text}`);
        setEmailError("Error al verificar el correo.");
        setIsCheckingEmail(false);
        return { exists: true, msg: null };
      }

      const data = await response.json();
      setIsCheckingEmail(false);

      return data;
    } catch (error) {
      setIsCheckingEmail(false);
      console.error("Error checking email:", error);
      setEmailError("Error al verificar el correo. Intenta más tarde.");
      return { exists: true, msg: null };
    }
  };

  const saveNewUser = async () => {
    setEmailError("");
    if (!newUserForm.email) {
      setEmailError("Email is required");
      return;
    }

    const data = await checkEmailExists(newUserForm.email);

    if (data.msg && data.msg.toLowerCase().includes("email not exsist")) {
      // Email no existe, creamos usuario
      const businessId = localStorage.getItem("businessId");
      const token = localStorage.getItem("token");

      if (!businessId || !token) {
        return;
      }

      const payload = {
        businessId: Number(businessId),
        name: newUserForm.fullName || newUserForm.username,
        username: newUserForm.username,
        email: newUserForm.email,
        password: newUserForm.password,
        permission: permissionsList.map((screenName) => ({
          screenName,
          allowed: newUserForm.permissions.includes(screenName),
        })),
      };

      try {
        const response = await fetch(`${API_URL}/smartflow-api/v1/user/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error creating user");
        }

        const result = await response.json();

        setUsers((prev) => [...prev, { ...newUserForm, id: result.data?.id || Date.now() }]);
        setModalMode(null);
        fetchUsers(); // Refresh user list

      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else {
      // Email existe, no crear
      setEmailError("This email is already registered.");
    }

  };

  const closeModal = () => {
    setModalMode(null);
  };
  const openEditUserModal = async (user) => {
    const token = localStorage.getItem("token");
    console.log(user.userId); // 
    try {
      const response = await fetch(
        `${API_URL}/smartflow-api/v1/user/getScreenAllowdById/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user permissions");

      const data = await response.json();
      // console.log("User permissions data:", data);
      const allowedPermissions = data.data
        .filter(([screenName, allowed]) => allowed)
        .map(([screenName]) => screenName);

      setEditUserForm({
        id: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName || "",
        permissions: allowedPermissions,
      });

      setModalMode("editUser");
    } catch (error) {
      console.error("Error fetching user permissions:", error);
    }
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
            <p>
              <strong>Country:</strong> {company?.country || ""}
            </p>
            <p>
              <strong>City:</strong> {company?.city || ""}
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
            <p>
              <strong>State:</strong> {company?.state || ""}
            </p>
            <p>
              <strong>Postal Code:</strong> {company?.postalCode || ""}
            </p>
          </div>
        </div>
      </section>

      <section className="users-section">
        <div className="section-header">
          <h2>Users</h2>
          <button onClick={openAddUserModal} className="btn add-btn">
            <FaEdit style={{ marginRight: 6 }} /> Add User
          </button>
        </div>

        <div className="grid-table-company">
          <div className="grid-header-company">Name</div>
          <div className="grid-header-company">Email</div>
          <div className="grid-header-company">Actions</div>

          {users.length > 0 ? (
            users.map((user, index) => (
              <React.Fragment key={user.id || index}>
                <div className="grid-cell-company">{user.fullName || user.username}</div>
                <div className="grid-cell-company">{user.email}</div>
                <div className="grid-cell-company">
                  <button
                    className="btn edit-btn"
                    onClick={() => openEditUserModal(user)}
                  >
                    <FaEdit style={{ marginRight: 6 }} /> Edit
                  </button>


                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="grid-cell" style={{ gridColumn: "1 / -1" }}>
              No users found.
            </div>
          )}
        </div>
      </section>

      {/* Modal Edit Company */}
      {modalMode === "editCompany" && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-content-company company-modal-edit"
            onClick={(e) => e.stopPropagation()}
          >
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
                Address:
                <input
                  type="text"
                  value={companyForm.address}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </label>

              <label>
                Phone:
                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </label>
              <label>
                Country:
                <select
                  value={companyForm.country}
                  onChange={(e) => {
                    const country = e.target.value;
                    setCompanyForm((prev) => ({
                      ...prev,
                      country,
                      state: "",
                      city: "",
                      postalCode: "",
                    }));
                  }}
                >
                  <option value="">Select country</option>
                  {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label>
                State:
                <select
                  value={companyForm.state}
                  onChange={(e) => {
                    const state = e.target.value;
                    setCompanyForm((prev) => ({
                      ...prev,
                      state,
                      city: "",
                      postalCode: "",
                    }));
                  }}
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </label>

              <label>
                City:
                <select
                  value={companyForm.city}
                  onChange={(e) => {
                    const city = e.target.value;
                    setCompanyForm((prev) => ({
                      ...prev,
                      city,
                      postalCode: getPostalCode(prev.country, prev.state, city),
                    }));
                  }}
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Postal Code:
                <input
                  type="text"
                  value={companyForm.postalCode}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, postalCode: e.target.value })
                  }
                  placeholder="Enter postal code"
                  disabled={!companyForm.city} // Solo deshabilitado si no hay ciudad
                  maxLength={5} // máximo de dígitos
                />
              </label>
              {!companyForm.city}
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

      {/* Modal Add User */}
      {modalMode === "addUser" && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="company-modal-add" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaEdit style={{ marginRight: "6px" }} /> Add User
              </h2>
              <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                <FaTimes />
              </button>
            </div>

            <div className="modal-grid">
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={newUserForm.username}
                  onChange={handleNewUserChange}
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={newUserForm.email}
                  onChange={handleNewUserChange}
                />
                {isCheckingEmail && <small style={{ color: "blue" }}>Verificando...</small>}
                {emailError && <small style={{ color: "red" }}>{emailError}</small>}
              </label>

              <label style={{ position: "relative" }}>
                Password:
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={newUserForm.password}
                  onChange={handleNewUserChange}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </label>

              <label>
                Full Name:
                <input
                  type="text"
                  name="fullName"
                  value={newUserForm.fullName}
                  onChange={handleNewUserChange}
                />
              </label>

              <div>
                <p>Permissions:</p>
                {permissionsList.map((perm) => (
                  <label key={perm} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={newUserForm.permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                    />{" "}
                    {perm}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-buttons">
              <button onClick={saveNewUser} className="btn save-btn">
                <FaSave style={{ marginRight: 6 }} /> Save
              </button>
              <button onClick={closeModal} className="btn cancel-btn">
                <FaTimes style={{ marginRight: 6 }} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {modalMode === "editUser" && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="company-modal-add"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                <FaEdit style={{ marginRight: "6px" }} /> Edit User Permissions
              </h2>
              <button
                className="modal-close-btn"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-grid">
              <label>
                Full Name:
                <input type="text" value={editUserForm.fullName} disabled />
              </label>

              <label>
                Username:
                <input type="text" value={editUserForm.username} disabled />
              </label>

              <label>
                Email:
                <input type="email" value={editUserForm.email} disabled />
              </label>

              <div className="permissions-section">
                <h3>Permissions</h3>
                {permissionsList.map((perm) => (
                  <label key={perm} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      checked={editUserForm.permissions.includes(perm)} // o newUserForm.permissions para Add User
                      onChange={() => toggleEditPermission(perm)} // función para actualizar el estado
                    />
                    {perm}
                  </label>
                ))}
                {modalError && (
                  <p style={{ color: "red", marginTop: "8px" }}>{modalError}</p>
                )}

              </div>
            </div>

            <div className="form-buttons">
              <button onClick={saveEditedUser} className="btn save-btn">
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
