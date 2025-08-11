import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Registro from "../pages/registro/Registro";
import Dashboard from "../pages/dashboard/Dashboard";
import CrearEvento from "../pages/eventos/CrearEvento";
import Invitar from "../pages/invitaciones/Invitar";
import ResponderInvitacion from "../pages/invitaciones/ResponderInvitacion";
import ProtectedRoute from "./ProtectedRoute";

export function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/crear-evento"
          element={
            <ProtectedRoute>
              <CrearEvento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/evento/:id/invitar"
          element={
            <ProtectedRoute>
              <Invitar />
            </ProtectedRoute>
          }
        />

        {/* pública */}
        <Route path="/invitaciones/responder/:token" element={<ResponderInvitacion />} />
      </Routes>
    </BrowserRouter>
  );
}
