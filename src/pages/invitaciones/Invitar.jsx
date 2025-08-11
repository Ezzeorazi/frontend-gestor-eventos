import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/axios";
import FloatInput from "../../components/FloatInput";

const Row = ({ i, value, onChange, onRemove }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
    <FloatInput
      id={`nombre-${i}`}
      value={value.nombre || ""}
      onChange={(e) => onChange(i, { ...value, nombre: e.target.value })}
      label="Nombre (opcional)"
      className="md:col-span-2"
    />
    <FloatInput
      id={`email-${i}`}
      type="email"
      value={value.email}
      onChange={(e) => onChange(i, { ...value, email: e.target.value })}
      label="Email"
      required
      className="md:col-span-3"
    />
    <button
      type="button"
      onClick={() => onRemove(i)}
      className="text-sm text-rose-600 hover:underline md:col-span-1 md:justify-self-end"
      title="Eliminar"
    >
      Eliminar
    </button>
  </div>
);

export default function Invitar() {
  const { id } = useParams(); // eventoId
  const navigate = useNavigate();

  const [rows, setRows] = useState([{ nombre: "", email: "" }]);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({ type: "", text: "" });

  const addRow = () => setRows((r) => [...r, { nombre: "", email: "" }]);
  const removeRow = (i) => setRows((r) => (r.length > 1 ? r.filter((_, idx) => idx !== i) : r));
  const changeRow = (i, v) => setRows((r) => r.map((row, idx) => (idx === i ? v : row)));

  const quickPaste = (text) => {
    // Permite pegar líneas "Nombre, email" o "email"
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [a, b] = l.split(",").map((x) => x?.trim());
        if (b) return { nombre: a, email: b };
        return { nombre: "", email: a };
      });
    if (lines.length) setRows(lines);
  };

  const submit = async (e) => {
    e.preventDefault();
    setAlerta({ type: "", text: "" });

    // validaciones mínimas
    const invalid = rows.some((r) => !r.email || !/\S+@\S+\.\S+/.test(r.email));
    if (invalid) {
      setAlerta({ type: "error", text: "Revisá los emails (formato incorrecto o vacío)." });
      return;
    }

    setLoading(true);
    try {
      // Backend actual: 1 invitación por request → mandamos N requests
      await Promise.all(
        rows.map((r) => api.post(`/eventos/${id}/invitaciones`, { email: r.email }))
      );

      setAlerta({ type: "ok", text: "Invitaciones agregadas correctamente." });
      setTimeout(() => navigate(`/dashboard`), 900);
    } catch (err) {
      setAlerta({
        type: "error",
        text: err?.response?.data?.mensaje || "No se pudieron agregar las invitaciones.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">Agregar invitaciones</div>
          <button
            onClick={() => navigate(`/dashboard`)}
            className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Volver
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Invitados</h2>
          <p className="mt-1 text-sm text-gray-600">
            Cargá nombre (opcional) y email. También podés pegar una lista (una persona por línea).
          </p>

          {alerta.text && (
            <div
              className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                alerta.type === "ok"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {alerta.text}
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-5">
            {/* pegado rápido */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pegar lista (opcional)
              </label>
              <textarea
                rows={3}
                onPaste={(e) => {
                  const t = e.clipboardData.getData("text");
                  if (t?.includes("\n") || t?.includes(",")) {
                    e.preventDefault();
                    quickPaste(t);
                  }
                }}
                placeholder={`Ejemplos:\nJuan Perez, juan@correo.com\nmaria@correo.com`}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none sm:text-sm"
              />
            </div>

            {/* filas */}
            <div className="space-y-3">
              {rows.map((row, i) => (
                <Row key={i} i={i} value={row} onChange={changeRow} onRemove={removeRow} />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addRow}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
              >
                + Agregar otro
              </button>
            </div>

            {/* acciones */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(`/dashboard`)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Enviando…" : "Guardar invitaciones"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
