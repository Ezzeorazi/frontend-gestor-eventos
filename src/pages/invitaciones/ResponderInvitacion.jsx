import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";

const StatusPill = ({ value }) => {
  const map = {
    pendiente: "bg-gray-100 text-gray-700",
    confirmada: "bg-emerald-100 text-emerald-700",
    rechazada: "bg-rose-100 text-rose-700",
  };
  const label = { pendiente: "Pendiente", confirmada: "Confirmada", rechazada: "Rechazada" }[value] || value;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[value] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
};

export default function ResponderInvitacion() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invitacion, setInvitacion] = useState(null); // { _id, email, estado, token, evento: {...} }
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/invitaciones/responder/${token}`);
        setInvitacion(data);
      } catch (e) {
        setError(e?.response?.data?.mensaje || "Invitación no encontrada o expirada.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const updateEstado = async (estado) => {
    if (!invitacion?._id) return;
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put(`/invitaciones/${invitacion._id}`, { estado });
      setInvitacion((prev) => ({ ...prev, estado: data.estado }));
    } catch (e) {
      setError(e?.response?.data?.mensaje || "No se pudo actualizar la respuesta.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-gray-50">
        <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="h-4 w-56 rounded bg-gray-200" />
          <div className="mt-3 h-3 w-80 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-gray-50 px-4">
        <div className="max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Ups…</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  const ev = invitacion?.evento;
  const yaRespondida = invitacion?.estado !== "pendiente";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar muy simple */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">Invitación</div>
          <a
            href="/"
            className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Inicio
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Encabezado del evento */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{ev?.titulo || "Evento"}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {ev?.lugar ? ev.lugar + " · " : ""}
                {ev?.fechaHora ? new Date(ev.fechaHora).toLocaleString() : "Fecha a confirmar"}
              </p>
            </div>
            <StatusPill value={invitacion?.estado} />
          </div>

          {/* Imagen opcional */}
          {ev?.imagenUrl && (
            <div className="mt-5 overflow-hidden rounded-xl">
              <img
                src={ev.imagenUrl}
                alt="Imagen del evento"
                className="h-56 w-full object-cover"
              />
            </div>
          )}

          {/* Descripción */}
          {ev?.descripcion && (
            <p className="mt-5 text-gray-700">{ev.descripcion}</p>
          )}

          {/* Info del invitado */}
          <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
            Invitado: <span className="font-medium">{invitacion?.email}</span>
          </div>

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => updateEstado("confirmada")}
              disabled={saving || yaRespondida}
              className={`rounded-lg px-4 py-2 text-sm text-white ${
                yaRespondida
                  ? "bg-gray-300"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } disabled:opacity-60`}
            >
              {saving ? "Guardando…" : "Confirmar asistencia"}
            </button>
            <button
              onClick={() => updateEstado("rechazada")}
              disabled={saving || yaRespondida}
              className={`rounded-lg px-4 py-2 text-sm ${
                yaRespondida
                  ? "bg-gray-100 text-gray-400"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              } disabled:opacity-60`}
            >
              No podré ir
            </button>
            {yaRespondida && (
              <span className="text-sm text-gray-600">
                Respuesta registrada: <b>{invitacion?.estado}</b>
              </span>
            )}
          </div>

          {/* Link público (por si quiere copiarlo) */}
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="text-xs text-gray-500">
              Enlace de esta invitación:
            </div>
            <code className="mt-1 inline-block rounded bg-gray-50 px-2 py-1 text-xs text-gray-700">
              {window.location.href}
            </code>
          </div>
        </div>
      </main>
    </div>
  );
}
