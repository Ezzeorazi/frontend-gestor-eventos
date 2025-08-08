import React, { useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";

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
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar sesión
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Mostrar error */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center mb-2">
              {error}
            </div>
          )}
          {/* Email */}
          <label htmlFor="email" className="relative block">
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="peer w-full rounded border border-gray-300 px-3 pt-5 pb-2 shadow-sm focus:border-blue-600 focus:outline-none sm:text-sm"
              placeholder=" "
              autoComplete="off"
            />
            <span className="pointer-events-none absolute left-3 text-sm text-gray-700 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm px-1">
              Email
            </span>
          </label>
          {/* Password */}
          <label htmlFor="password" className="relative block">
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="peer w-full rounded border border-gray-300 px-3 pt-5 pb-2 shadow-sm focus:border-blue-600 focus:outline-none sm:text-sm "
              placeholder=" "
              autoComplete="off"
            />
            <span className="pointer-events-none absolute left-3 text-sm text-gray-700 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm  px-1 ">
              Contraseña
            </span>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold  cursor-pointer"
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
