import React, { useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import FloatInput from "../../components/FloatInput";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar sesión
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center mb-2">
              {error}
            </div>
          )}
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
            Iniciar sesión
          </button>
          <div className="mt-2 text-sm text-center">
            ¿No tienes cuenta?{" "}
            <a className="text-blue-500 hover:underline" href="/registro">
              Registrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
