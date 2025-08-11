import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import FloatInput from "../../components/FloatInput";


export default function CrearEvento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [fechaHora, setFechaHora] = useState(""); // datetime-local
  const [lugar, setLugar] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [privado, setPrivado] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canNext = useMemo(() => {
    if (step === 0) return !!(titulo && fechaHora && lugar);
    if (step === 1) return true;
    return true;
  }, [step, titulo, fechaHora, lugar]);

  const steps = [
    { key: "basicos", label: "Datos básicos" },
    { key: "detalles", label: "Detalles & diseño" },
    { key: "confirmar", label: "Confirmar" },
  ];

  const submit = async () => {
    setError("");
    setSaving(true);
    try {
      // Normalizamos fechaHora del <input type="datetime-local">
      const fechaISO = fechaHora ? new Date(fechaHora).toISOString() : null;

      const body = {
        titulo,
        descripcion,
        fechaHora: fechaISO,
        lugar,
        imagenUrl,
        privado,
      };

      const { data } = await api.post("/eventos", body); // ⬅️ espera tu endpoint
      // si tu backend devuelve el evento recién creado:
      const id = data?._id || data?.id;
      if (id) {
        // podés llevarlo directo a invitar
        navigate(`/dashboard/evento/${id}/invitar`);
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      setError(e?.response?.data?.mensaje || "No se pudo crear el evento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar minimal */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">Crear evento</div>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Progreso de pasos */}
        <ol className="mb-6 flex items-center gap-2 text-sm">
          {steps.map((s, i) => (
            <li key={s.key} className="flex items-center gap-2">
              <div className={`h-7 w-7 grid place-items-center rounded-full border text-xs
                ${i <= step ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-400"}`}>
                {i + 1}
              </div>
              <span className={`${i <= step ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-gray-200" />}
            </li>
          ))}
        </ol>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-rose-700">
            {error}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {step === 0 && (
            <div className="space-y-5">
              <FloatInput id="titulo" label="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} required />
              <FloatInput id="lugar" label="Lugar" value={lugar} onChange={e=>setLugar(e.target.value)} required />
              <label htmlFor="fecha" className="relative block">
                <input
                  id="fecha"
                  type="datetime-local"
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                  required
                  className="peer w-full rounded border border-gray-300 px-3 pt-5 pb-2 shadow-sm focus:border-blue-600 focus:outline-none sm:text-sm"
                  placeholder=" "
                />
                <span className="pointer-events-none absolute left-3 top-1 text-sm text-gray-700 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm px-1">
                  Fecha y hora
                </span>
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="descripcion"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none sm:text-sm"
                placeholder="Detalles del evento, agenda, dress code…"
              />
              <FloatInput id="imagen" label="Imagen (URL opcional)" value={imagenUrl} onChange={e=>setImagenUrl(e.target.value)} />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={privado}
                  onChange={(e) => setPrivado(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                Evento privado (solo con enlace)
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">Revisar y crear</h3>
              <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-700">
                <p><span className="font-medium">Título:</span> {titulo || "-"}</p>
                <p><span className="font-medium">Lugar:</span> {lugar || "-"}</p>
                <p><span className="font-medium">Fecha y hora:</span> {fechaHora ? new Date(fechaHora).toLocaleString() : "-"}</p>
                <p><span className="font-medium">Privado:</span> {privado ? "Sí" : "No"}</p>
                {descripcion && <p className="mt-2 text-gray-600">{descripcion}</p>}
                {imagenUrl && (
                  <div className="mt-3">
                    <img src={imagenUrl} alt="preview" className="h-28 w-full rounded object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer de acciones */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => (step > 0 ? setStep(step - 1) : navigate("/dashboard"))}
              className="rounded-lg border px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              type="button"
            >
              {step === 0 ? "Volver al dashboard" : "Atrás"}
            </button>

            {step < steps.length - 1 ? (
              <button
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className={`rounded-lg px-4 py-2 text-sm text-white ${canNext ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"}`}
                type="button"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                type="button"
              >
                {saving ? "Creando..." : "Crear evento"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
