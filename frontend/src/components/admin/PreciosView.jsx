import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  TbPlus,
  TbTag,
  TbTagOff,
  TbPercentage,
  TbCurrencyDollar,
  TbLoader2,
  TbInbox,
} from "react-icons/tb";
import {
  obtenerPrecios,
  actualizarEstadoRegla,
} from "../../services/adminService";
import StatCard from "./StatCard";
import ModalAgregarOferta from "./modal/ModalAgregarOferta";
import ModalEditarOferta from "./modal/ModalEditarOferta";

const claseActivo = (activo) =>
  activo
    ? "bg-accent-green/10 text-accent-green border-accent-green/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";

const CLS_INLINE_SELECT =
  "bg-[#0d0d1a] border border-accent-blue/50 rounded text-[9px] text-white px-2 py-0.5 focus:outline-none cursor-pointer";

const TipoBadge = ({ tipo }) =>
  tipo === "Porcentaje" ? (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border bg-accent-purple/10 text-accent-purple border-accent-purple/20 uppercase tracking-wider">
      <TbPercentage size={10} />%
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border bg-accent-blue/10 text-accent-blue border-accent-blue/20 uppercase tracking-wider">
      <TbCurrencyDollar size={10} />
      Fijo
    </span>
  );

const PreciosView = () => {
  const [reglas, setReglas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editandoEstado, setEditandoEstado] = useState(null); // regla _id
  const [actualizando, setActualizando] = useState(null); // regla _id

  const [modalAgregar, setModalAgregar] = useState(false);
  const [reglaEditar, setReglaEditar] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerPrecios();
      const lista = Array.isArray(data.precios)
        ? data.precios
        : Array.isArray(data.precios?.reglas)
          ? data.precios.reglas
          : [];
      setReglas(lista);
    } catch {
      toast.error("No se pudieron cargar las reglas de precio");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const totalReglas = reglas.length;
  const reglasActivas = reglas.filter((r) => r.activo).length;
  const reglasInactivas = totalReglas - reglasActivas;

  const cambiarEstado = async (reglaId, nuevoActivo) => {
    setEditandoEstado(null);
    setActualizando(reglaId);
    try {
      await actualizarEstadoRegla(reglaId, nuevoActivo);
      setReglas((prev) =>
        prev.map((r) =>
          r._id === reglaId ? { ...r, activo: nuevoActivo } : r,
        ),
      );
      toast.success(nuevoActivo ? "Oferta activada" : "Oferta desactivada");
    } catch {
      toast.error("No se pudo actualizar el estado");
    } finally {
      setActualizando(null);
    }
  };

  const cerrarModales = useCallback(() => {
    setModalAgregar(false);
    setReglaEditar(null);
  }, []);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <TbLoader2 size={16} className="animate-spin" />
        Cargando reglas de precio...
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-5 text-white">
        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Reglas activas"
            valor={reglasActivas}
            sub={`de ${totalReglas} regla${totalReglas !== 1 ? "s" : ""} en total`}
            subColor="text-accent-green"
            hoverColor="hover:border-accent-green/30"
          />
          <StatCard
            label="Reglas inactivas"
            valor={reglasInactivas}
            sub="sin aplicar en la tienda"
            subColor="text-red-400"
            hoverColor="hover:border-red-500/20"
          />
          <StatCard
            label="Total de reglas"
            valor={totalReglas}
            sub={`${reglas.filter((r) => r.tipo === "Porcentaje").length} por % · ${reglas.filter((r) => r.tipo === "Fijo").length} valor fijo`}
            subColor="text-accent-blue"
            hoverColor="hover:border-accent-blue/30"
          />
        </div>

        {/* ── Tabla de reglas ────────────────────────────────────────────────── */}
        <div className="glass-panel rounded-2xl border border-white/5 shadow-soft overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div>
              <h3 className="font-poppins text-sm font-bold text-white">
                Reglas de precio
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Las reglas activas se aplican automáticamente en la tienda
              </p>
            </div>
            <button
              onClick={() => setModalAgregar(true)}
              className="flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-lg bg-accent-green/15 text-accent-green border border-accent-green/25 hover:bg-accent-green hover:text-bg transition-all cursor-pointer"
            >
              <TbPlus size={14} />
              Agregar oferta
            </button>
          </div>

          {/* Table */}
          {reglas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <TbInbox size={32} className="text-gray-700" />
              <p className="text-gray-600 text-xs">
                No hay reglas de precio registradas
              </p>
              <button
                onClick={() => setModalAgregar(true)}
                className="text-[11px] font-bold text-accent-green hover:underline transition-all"
              >
                + Crear la primera oferta
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500">
                    <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider w-[30%]">
                      Regla
                    </th>
                    <th className="text-left px-3 py-3 text-[10px] font-bold uppercase tracking-wider w-[12%]">
                      Tipo
                    </th>
                    <th className="text-left px-3 py-3 text-[10px] font-bold uppercase tracking-wider w-[14%]">
                      Descuento
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-[28%]">
                      Condición
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-[16%]">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reglas.map((regla) => (
                    <tr
                      key={regla._id}
                      className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${
                        actualizando === regla._id
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }`}
                    >
                      {/* Regla (clickable name) */}
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setReglaEditar(regla)}
                          className="text-left group w-full"
                          title="Editar oferta"
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-white group-hover:text-accent-purple transition-colors">
                            <span className="truncate max-w-[180px]">
                              {regla.nombre}
                            </span>
                            <svg
                              className="w-3 h-3 text-gray-600 group-hover:text-accent-purple/70 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </div>
                        </button>
                      </td>

                      {/* Tipo */}
                      <td className="px-3 py-3">
                        <TipoBadge tipo={regla.tipo} />
                      </td>

                      {/* Descuento */}
                      <td className="px-3 py-3 text-gray-200 font-semibold">
                        {regla.tipo === "Porcentaje"
                          ? `${regla.valor}%`
                          : `$${Number(regla.valor).toLocaleString()}`}
                      </td>

                      {/* Condición */}
                      <td className="px-4 py-3 text-gray-400 max-w-[200px]">
                        <span
                          className="truncate block"
                          title={regla.condicion}
                        >
                          {regla.condicion}
                        </span>
                      </td>

                      {/* Estado — inline dropdown */}
                      <td className="px-4 py-3">
                        {editandoEstado === regla._id ? (
                          <select
                            autoFocus
                            defaultValue={regla.activo ? "activo" : "inactivo"}
                            onChange={(e) =>
                              cambiarEstado(
                                regla._id,
                                e.target.value === "activo",
                              )
                            }
                            onBlur={() => setEditandoEstado(null)}
                            className={CLS_INLINE_SELECT}
                          >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditandoEstado(regla._id)}
                            title="Clic para cambiar estado"
                            className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border transition-all hover:brightness-125 hover:ring-1 hover:ring-white/10 cursor-pointer ${claseActivo(regla.activo)}`}
                          >
                            {regla.activo ? (
                              <>
                                <TbTag size={10} />
                                Activo
                              </>
                            ) : (
                              <>
                                <TbTagOff size={10} />
                                Inactivo
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer note */}
          {reglas.length > 0 && (
            <div className="px-5 py-3 border-t border-white/5">
              <p className="text-[10px] text-gray-600">
                Haz clic en el nombre de una oferta para editarla · Haz clic en
                el estado para cambiarlo
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────────── */}
      {modalAgregar && (
        <ModalAgregarOferta onClose={cerrarModales} onSuccess={cargar} />
      )}
      {reglaEditar && (
        <ModalEditarOferta
          regla={reglaEditar}
          onClose={cerrarModales}
          onSuccess={cargar}
        />
      )}
    </>
  );
};

export default PreciosView;
