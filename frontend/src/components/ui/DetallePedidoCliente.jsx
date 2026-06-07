import { useState, useEffect, useCallback } from "react";
import { obtenerPedidoPorId } from "../../services/pedidoService";
import { formatearFecha, formatearMoneda } from "../../utils/formatters";
import {
  labelEstado,
  labelTipo,
  claseEstado,
  claseTipo,
  dotEstado,
} from "../../utils/constants";
import { toast } from "sonner";
import {
  TbX,
  TbMapPin,
  TbCreditCard,
  TbCalendar,
  TbTruck,
  TbPackage,
  TbBook,
  TbReceipt,
  TbHeadset,
  TbCircleCheck,
  TbLoader2,
  TbAlertTriangle,
  TbHash,
  TbClock,
  TbShoppingBag,
  TbStar,
  TbChevronRight,
} from "react-icons/tb";

const PASOS = [
  { key: "pendiente", label: "Recibido", icon: TbShoppingBag },
  { key: "confirmado", label: "Confirmado", icon: TbCircleCheck },
  { key: "procesando", label: "Preparando", icon: TbPackage },
  { key: "enviado", label: "En camino", icon: TbTruck },
  { key: "entregado", label: "Entregado", icon: TbStar },
];

const ORDEN_ESTADOS = [
  "pendiente",
  "confirmado",
  "procesando",
  "enviado",
  "entregado",
];

const StepperPedido = ({ estado }) => {
  const cancelado = estado === "cancelado";
  const indiceActual = ORDEN_ESTADOS.indexOf(estado);

  return (
    <div className="px-6 pt-2 pb-6">
      {cancelado ? (
        <div className="flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl py-4 px-6">
          <TbAlertTriangle size={22} className="text-red-400 flex-shrink-0" />
          <span className="text-sm font-bold text-red-400">
            Este pedido fue cancelado
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between relative">
          {/* Línea de progreso de fondo */}
          <div className="absolute top-5 left-[calc(10%)] right-[calc(10%)] h-0.5 bg-white/5 z-0" />
          {/* Línea de progreso activa */}
          <div
            className="absolute top-5 left-[calc(10%)] h-0.5 bg-gradient-to-r from-accent-blue to-accent-purple z-0 transition-all duration-700"
            style={{
              width:
                indiceActual < 0
                  ? "0%"
                  : `${(indiceActual / (PASOS.length - 1)) * 80}%`,
            }}
          />

          {PASOS.map((paso, i) => {
            const completado = indiceActual >= i;
            const activo = indiceActual === i;
            const Icon = paso.icon;

            return (
              <div
                key={paso.key}
                className="flex flex-col items-center gap-2 z-10 flex-1"
              >
                {/* Círculo */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    completado
                      ? activo
                        ? "bg-gradient-to-br from-accent-blue to-accent-purple border-transparent shadow-[0_0_14px_rgba(139,92,246,0.5)]"
                        : "bg-accent-purple/30 border-accent-purple/50"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      completado
                        ? activo
                          ? "text-white"
                          : "text-accent-purple"
                        : "text-gray-600"
                    }
                  />
                </div>
                {/* Label */}
                <span
                  className={`text-[10px] font-bold text-center leading-tight transition-colors duration-300 ${
                    completado
                      ? activo
                        ? "text-accent-blue"
                        : "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {paso.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, accent = "blue" }) => {
  const accentMap = {
    blue: "text-accent-blue   bg-accent-blue/10   border-accent-blue/20",
    purple: "text-accent-purple bg-accent-purple/10 border-accent-purple/20",
    pink: "text-accent-pink   bg-accent-pink/10   border-accent-pink/20",
    green: "text-accent-green  bg-accent-green/10  border-accent-green/20",
  };
  return (
    <div className="flex items-start gap-3 bg-white/3 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${accentMap[accent]}`}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div className="text-sm font-semibold text-white truncate">
          {value || "—"}
        </div>
      </div>
    </div>
  );
};

const ModalDetallePedidoCliente = ({ pedidoId, onClose }) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await obtenerPedidoPorId(pedidoId);
      setPedido(data.pedido);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const numeroPedido = pedido
    ? `#${pedido._id.toString().slice(-6).toUpperCase()}`
    : "…";

  const handleContactarSoporte = () => {
    toast.info("Contactar con soporte", {
      description:
        "Próximamente disponible. Por ahora escríbenos a soporte@mundosdepapel.com",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl bg-[#13151b]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero Header ── */}
        <div className="relative overflow-hidden rounded-t-2xl">
          {/* Fondo degradado */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-blue/20 to-accent-pink/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />

          <div className="relative px-6 pt-6 pb-0">
            {/* Fila superior: número + cerrar */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-accent-purple/30 border border-accent-purple/40 flex items-center justify-center">
                    <TbReceipt size={16} className="text-accent-purple" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Detalle de compra
                  </span>
                </div>
                <h2 className="font-poppins text-3xl font-bold text-white">
                  Pedido{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">
                    {numeroPedido}
                  </span>
                </h2>
                {pedido && (
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${claseEstado(pedido.estado)}`}
                    >
                      {labelEstado(pedido.estado)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${claseTipo(pedido.estadoPago)}`}
                    >
                      {labelTipo(pedido.estadoPago)}
                    </span>
                  </div>
                )}
              </div>

              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all flex-shrink-0 mt-1"
                aria-label="Cerrar"
              >
                <TbX size={18} />
              </button>
            </div>
          </div>

          {/* Stepper */}
          {pedido && !loading && <StepperPedido estado={pedido.estado} />}
        </div>

        {/* ── Cuerpo ── */}
        <div className="px-6 pb-8 pt-2">
          {/* Estado: Cargando */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-accent-purple/30 border-t-accent-purple animate-spin" />
              <span className="text-sm text-gray-500 font-medium">
                Cargando tu pedido…
              </span>
            </div>
          )}

          {/* Estado: Error */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <TbAlertTriangle size={32} className="text-red-400" />
              </div>
              <div>
                <p className="text-base font-bold text-white mb-1">
                  No se pudo cargar el pedido
                </p>
                <p className="text-sm text-gray-500">
                  Verifica tu conexión e inténtalo de nuevo.
                </p>
              </div>
              <button
                onClick={cargar}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-all"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Contenido del pedido */}
          {pedido && !loading && (
            <div className="flex flex-col gap-5">
              {/* ── Datos rápidos ── */}
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={TbCalendar}
                  label="Fecha del pedido"
                  value={formatearFecha(pedido.createdAt)}
                  accent="purple"
                />
                <InfoCard
                  icon={TbCreditCard}
                  label="Método de pago"
                  value={pedido.metodoPago}
                  accent="blue"
                />
                <InfoCard
                  icon={TbTruck}
                  label="Entrega estimada"
                  value={
                    pedido.fechaEstimadaEntrega
                      ? formatearFecha(pedido.fechaEstimadaEntrega)
                      : "Por confirmar"
                  }
                  accent="green"
                />
                <InfoCard
                  icon={TbHash}
                  label="Tracking"
                  value={pedido.tracking || "No disponible aún"}
                  accent="pink"
                />
              </div>

              {/* ── Dirección de envío ── */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center">
                    <TbMapPin size={14} className="text-accent-pink" />
                  </div>
                  <span className="text-xs font-bold text-accent-pink uppercase tracking-wider">
                    Dirección de envío
                  </span>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed pl-9">
                  <p className="text-white font-semibold mb-0.5">
                    {pedido.direccionEnvio?.direccion}
                  </p>
                  {(pedido.direccionEnvio?.ciudad ||
                    pedido.direccionEnvio?.departamento) && (
                    <p className="text-gray-400">
                      {[
                        pedido.direccionEnvio.ciudad,
                        pedido.direccionEnvio.departamento,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {pedido.direccionEnvio?.codigoPostal && (
                    <p className="text-gray-400">
                      CP: {pedido.direccionEnvio.codigoPostal}
                    </p>
                  )}
                  {pedido.direccionEnvio?.telefono && (
                    <p className="text-gray-400 mt-0.5">
                      Tel: {pedido.direccionEnvio.telefono}
                    </p>
                  )}
                  {pedido.direccionEnvio?.notas && (
                    <p className="text-gray-500 text-xs mt-1 italic">
                      Nota: {pedido.direccionEnvio.notas}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Productos ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
                    <TbBook size={14} className="text-accent-blue" />
                  </div>
                  <span className="text-xs font-bold text-accent-blue uppercase tracking-wider">
                    Productos ({pedido.items?.length || 0})
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {pedido.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white/3 border border-white/5 rounded-xl p-4 hover:border-accent-blue/20 hover:bg-accent-blue/5 transition-all group"
                    >
                      {/* Imagen */}
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#0d0f14] border border-white/10 flex-shrink-0 flex items-center justify-center">
                        {item.producto?.imagen ? (
                          <img
                            src={item.producto.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <TbBook size={24} className="text-gray-600" />
                        )}
                      </div>

                      {/* Datos del libro */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate group-hover:text-accent-blue transition-colors">
                          {item.nombre}
                        </p>
                        {item.producto?.autor && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {item.producto.autor}
                          </p>
                        )}
                        {item.descuento > 0 && (
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                            -{item.descuento}% dto.
                          </span>
                        )}
                      </div>

                      {/* Precio */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-gray-500 mb-0.5">
                          {item.cantidad} × ${item.precio?.toLocaleString()}
                        </p>
                        <p className="text-base font-bold text-accent-blue">
                          ${item.subtotal?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Resumen de pago ── */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center">
                    <TbReceipt size={14} className="text-accent-green" />
                  </div>
                  <span className="text-xs font-bold text-accent-green uppercase tracking-wider">
                    Resumen de pago
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">
                      ${pedido.subtotal?.toLocaleString()}
                    </span>
                  </div>

                  {pedido.descuentoTotal > 0 && (
                    <div className="flex justify-between items-center text-accent-green">
                      <span className="font-semibold">Descuento aplicado</span>
                      <span className="font-bold">
                        −${pedido.descuentoTotal?.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-gray-400">
                    <span>IVA (19%)</span>
                    <span className="font-medium text-white">
                      ${pedido.iva?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-400">
                    <span>Envío</span>
                    <span
                      className={`font-semibold ${pedido.costoEnvio === 0 ? "text-accent-green" : "text-white"}`}
                    >
                      {pedido.costoEnvio === 0
                        ? "¡Gratis!"
                        : `$${pedido.costoEnvio?.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3 mt-1 flex justify-between items-center">
                    <span className="font-poppins font-bold text-base text-white">
                      Total pagado
                    </span>
                    <span className="font-poppins font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">
                      ${pedido.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Historial del pedido ── */}
              {pedido.historial?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                      <TbClock size={14} className="text-accent-purple" />
                    </div>
                    <span className="text-xs font-bold text-accent-purple uppercase tracking-wider">
                      Historial del pedido
                    </span>
                  </div>

                  <div className="relative pl-4 flex flex-col gap-0">
                    {/* Línea vertical */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-px bg-white/8" />

                    {[...pedido.historial].reverse().map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 py-3 relative"
                      >
                        {/* Dot */}
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 border-[#13151b] flex-shrink-0 z-10 mt-1 ${dotEstado(h.estado)}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">
                              {labelEstado(h.estado)}
                            </span>
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <TbCalendar size={10} />
                              {formatearFecha(h.fecha)}
                            </span>
                          </div>
                          {h.comentario && (
                            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                              {h.comentario}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Notas del pedido ── */}
              {pedido.notas && (
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                    Notas adicionales
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {pedido.notas}
                  </p>
                </div>
              )}

              {/* ── Botón soporte ── */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleContactarSoporte}
                  className="group flex items-center gap-2.5 text-sm font-semibold py-2.5 px-6 rounded-full bg-white/5 text-gray-300 border border-white/10 hover:bg-accent-purple/10 hover:text-accent-purple hover:border-accent-purple/30 transition-all"
                >
                  <TbHeadset
                    size={17}
                    className="group-hover:scale-110 transition-transform"
                  />
                  ¿Necesitas ayuda con este pedido?
                  <TbChevronRight
                    size={14}
                    className="text-gray-500 group-hover:text-accent-purple transition-colors"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetallePedidoCliente;
