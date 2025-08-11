import React, { useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import FloatInput from "../../components/FloatInput";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    try {
      await api.post("/auth/registro", { nombre, email, password });
      setExito("Registro exitoso, ¡puedes iniciar sesión!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.msg ||
          "Error al registrar usuario. ¿Ya existe ese email?"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Registro
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center mb-2">
              {error}
            </div>
          )}
          {exito && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-center mb-2">
              {exito}
            </div>
          )}
          <FloatInput
            id="nombre"
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <FloatInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FloatInput
            id="password"
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold cursor-pointer"
          >
            Registrar
          </button>
          <div className="mt-2 text-sm text-center">
            ¿Ya tienes cuenta?{" "}
            <a className="text-blue-500 hover:underline" href="/login">
              Inicia sesión
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
