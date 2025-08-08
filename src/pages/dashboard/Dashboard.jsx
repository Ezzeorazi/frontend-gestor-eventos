import React from "react";

export default function Dashboard() {
  // Si quieres proteger la ruta, puedes verificar el token aquí

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido 👋</h1>
        <p className="text-gray-600 mb-6">
          Este es tu panel de control. Pronto podrás ver aquí tus eventos y estadísticas.
        </p>
        <button className="bg-blue-600 text-white py-2 px-8 rounded hover:bg-blue-700 transition font-semibold">
          Crear nuevo evento
        </button>
      </div>
    </div>
  );
}
