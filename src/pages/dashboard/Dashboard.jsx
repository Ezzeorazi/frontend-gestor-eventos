import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";

/** Pills de estado RSVP */
const StatusPill = ({ value }) => {
  const map = {
    pendiente: "bg-gray-100 text-gray-700",
    confirmada: "bg-emerald-100 text-emerald-700",
    rechazada: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[value] || "bg-gray-100 text-gray-700"}`}>
      {value}
    </span>
  );
};

/** Tarjeta de métrica (estilo minimal) */
const StatCard = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
    {hint && <div className="mt-2 text-xs text-gray-500">{hint}</div>}
  </div>
);

/** Fila de invitación */
const InviteRow = ({ invite }) => (
  <tr className="border-b last:border-none">
    <td className="py-3">{invite.email}</td>
    <td className="py-3">
      <StatusPill value={invite.estado} />
    </td>
    <td className="py-3 text-right">
      {invite.token ? (
        <a
          href={`${window.location.origin}/invitaciones/responder/${invite.token}`}
          className="text-sm text-blue-600 hover:underline"
          target="_blank" rel="noreferrer"
        >
          Ver enlace
        </a>
      ) : (
        <span className="text-sm text-gray-400">Sin enlace</span>
      )}
    </td>
  </tr>
);

/** Estado vacío */
const Empty = ({ onCreate }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
    <h3 className="text-xl font-semibold text-gray-900">Aún no tienes eventos</h3>
    <p className="mt-2 text-gray-600">Crea tu primer evento e invita con un link único.</p>
    <button onClick={onCreate} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
      Crear nuevo evento
    </button>
  </div>
);

/** Cabecera minimal con CTA */
const Topbar = ({ onCreate }) => (
  <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-blue-600" />
        <span className="text-lg font-semibold text-gray-900">Invita</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onCreate} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Crear invitación
        </button>
        <button
          onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
          className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Salir
        </button>
      </div>
    </div>
  </header>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState([]);       // [{ _id, titulo, fechaHora, invitaciones: [...] }]
  const [seleccion, setSeleccion] = useState(null); // evento seleccionado
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/eventos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEventos(data || []);
        setSeleccion((data && data[0]) || null);
      } catch {
        setError("No se pudieron cargar los eventos.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, token]);

  useEffect(() => {
    if (!seleccion?._id) return;
    // si ya tiene invitaciones, no pedimos de nuevo
    if (Array.isArray(seleccion.invitaciones) && seleccion.invitaciones.length) return;

    (async () => {
      try {
        const { data } = await api.get(`/eventos/${seleccion._id}/invitaciones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // setear en 'seleccion'
        setSeleccion((prev) => ({ ...prev, invitaciones: data || [] }));
        // opcional: sincronizar también en 'eventos'
        setEventos((prev) =>
          prev.map((ev) => (ev._id === seleccion._id ? { ...ev, invitaciones: data || [] } : ev))
        );
      } catch (e) {
        console.error("No se pudieron cargar invitaciones del evento", e);
      }
    })();
  }, [seleccion?._id, seleccion?.invitaciones, token]);


  // métricas
  const metrics = useMemo(() => {
    const totalEventos = eventos.length;
    const todasInv = eventos.flatMap(e => e.invitaciones || []);
    const totalInvitados = todasInv.length;
    const confirmadas = todasInv.filter(i => i.estado === "confirmada").length;
    const tasa = totalInvitados > 0 ? Math.round((confirmadas / totalInvitados) * 100) : 0;
    return { totalEventos, totalInvitados, confirmadas, tasa };
  }, [eventos]);

  const onCreateEvent = () => navigate("/dashboard/crear-evento");

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar onCreate={onCreateEvent} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {error && <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-rose-700">{error}</div>}

        {/* Métricas */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Eventos" value={metrics.totalEventos} />
          <StatCard label="Invitaciones" value={metrics.totalInvitados} />
          <StatCard label="Confirmadas" value={metrics.confirmadas} />
          <StatCard label="Tasa de RSVP" value={`${metrics.tasa}%`} hint="Confirmadas / Invitaciones" />
        </section>

        {/* Acciones rápidas */}
        <section className="mt-6 flex flex-wrap gap-3">
          <button onClick={onCreateEvent} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50">
            Nuevo evento
          </button>
          {seleccion && (
            <button
              onClick={() => navigate(`/dashboard/evento/${seleccion._id}/invitar`)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
            >
              Agregar invitaciones
            </button>
          )}
        </section>

        {/* Listado de eventos + invitaciones del seleccionado */}
        {eventos.length === 0 ? (
          <section className="mt-8">
            <Empty onCreate={onCreateEvent} />
          </section>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Eventos */}
            <section className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Tus eventos</h3>
                <ul className="space-y-1">
                  {eventos.map((e) => {
                    const active = seleccion?._id === e._id;
                    return (
                      <li key={e._id}>
                        <button
                          onClick={() => setSeleccion(e)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm ${active ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-800"
                            }`}
                        >
                          <div className="font-medium">{e.titulo}</div>
                          <div className="text-xs text-gray-500">
                            {e.fechaHora ? new Date(e.fechaHora).toLocaleString() : "Sin fecha"}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>

            {/* Invitaciones del evento seleccionado */}
            <section className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Invitaciones {seleccion ? `· ${seleccion.titulo}` : ""}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {seleccion?.invitaciones?.length || 0} invitaciones
                    </p>
                  </div>
                  {seleccion && (
                    <button
                      onClick={() => navigate(`/dashboard/evento/${seleccion._id}/invitar`)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Nueva invitación
                    </button>
                  )}
                </div>

                {seleccion?.invitaciones?.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500">
                          <th className="pb-2">Email</th>
                          <th className="pb-2">Estado</th>
                          <th className="pb-2 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seleccion.invitaciones.map((inv) => (
                          <InviteRow key={inv._id || inv.email} invite={inv} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
                    Aún no hay invitaciones para este evento.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
