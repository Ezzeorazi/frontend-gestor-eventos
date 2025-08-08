import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Registro from "../pages/registro/Registro";
import Dashboard from "../pages/dashboard/Dashboard";

export function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
