import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/BusinesRegister';
import RegisterUser from './pages/RegisterUser';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path ="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
