import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import postalCodesData from "../data/postalCodes.js";

import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaFlag,
  FaMapPin,
  FaGlobe,
  FaIdCard,
} from "react-icons/fa";

import "../styles/BusinesRegister.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: "",
    businessEmail: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    taxId: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [error, setError] = useState("");

  // Simulación de correos registrados
  const registeredEmails = ["test@example.com", "admin@business.com"];

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
      name: s.name,
    }))
    : [];

  const cityOptions = selectedState
    ? City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
      (c) => ({
        value: c.name,
        label: c.name,
      })
    )
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "postalCode") {
      if (/^\d*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      const countryCode = selectedCountry.value;
      const stateName = selectedState.name;
      const cityName = selectedCity.value;

      const postalCode =
        postalCodesData?.[countryCode]?.[stateName]?.[cityName] || "";

      setForm((form) => ({ ...form, postalCode }));
    } else {
      setForm((form) => ({ ...form, postalCode: "" }));
    }
  }, [selectedCountry, selectedState, selectedCity]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailExists = registeredEmails.includes(
      form.businessEmail.toLowerCase()
    );

    if (emailExists) {
      setError("This email is already registered.");
    } else {
      navigate("/registerUser");
    }
  };

  return (
    <div className="register-page">
      <h1>Business Essential</h1>
      <div className="register-card">
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaBuilding className="icon" />
            <input
              name="businessName"
              type="text"
              placeholder="Business Name"
              value={form.businessName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              name="businessEmail"
              type="email"
              placeholder="Business Email"
              value={form.businessEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaPhone className="icon" />
            <input
              name="phone"
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setForm({ ...form, phone: value });
                }
              }}
              required
            />

          </div>

          <div className="input-group">
            <FaMapMarkerAlt className="icon" />
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaGlobe className="icon" />
            <Select
              options={countryOptions}
              placeholder="Select Country"
              value={selectedCountry}
              onChange={(value) => {
                setSelectedCountry(value);
                setSelectedState(null);
                setSelectedCity(null);
              }}
              className="select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          <div className="input-group">
            <FaFlag className="icon" />
            <Select
              options={stateOptions}
              placeholder="Select State"
              value={selectedState}
              onChange={(selected) => {
                setSelectedState(selected);
                setSelectedCity(null);
              }}
              isDisabled={!selectedCountry}
              className="select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          <div className="input-group">
            <FaCity className="icon" />
            <Select
              options={cityOptions}
              placeholder="Select City"
              value={selectedCity}
              onChange={setSelectedCity}
              isDisabled={!selectedState}
              className="select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          <div className="input-group">
            <FaMapPin className="icon" />
            <input
              name="postalCode"
              type="text"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              required
              maxLength={10}
            />
          </div>
          <div className="input-group">
            <FaIdCard className="icon" />
            <input
              name="taxId"
              type="text"
              placeholder="DNI / CIF / NIE"
              value={form.taxId}
              onChange={handleChange}
              maxLength={15}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-submit">
            Next
          </button>
          <p className="login-text">
            <span className="login-link" onClick={() => navigate("/")}>
              Already have an account?
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
