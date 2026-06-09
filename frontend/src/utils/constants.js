export const ROLES = { ADMIN: "admin", USER: "usuario" };

export const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-yellow-100", text: "text-yellow-700" },
  { bg: "bg-red-100", text: "text-red-700" },
];

export const PRECIO_ENVIO_GRATIS = 100_000;
export const IVA = 0.19;
export const STOCK_BAJO_UMBRAL = 5;

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ESTADOS_PEDIDO = [
  { valor: "procesando", label: "Procesando" },
  { valor: "confirmado", label: "Confirmado" },
  { valor: "enviado", label: "Enviado" },
  { valor: "entregado", label: "Completado" },
  { valor: "cancelado", label: "Cancelado" },
];

export const ESTADO_PEDIDO = Object.fromEntries(
  ESTADOS_PEDIDO.map((e) => [e.valor.toUpperCase(), e.valor]),
);

export const ESTADOS_PAGO = [
  { valor: "pagado", label: "Contado" },
  { valor: "pendiente", label: "Anticipo" },
  { valor: "fallido", label: "Fallido" },
  { valor: "reembolsado", label: "Reembolsado" },
];

export const METODOS_PAGO = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta de crédito",
  transferencia: "Transferencia bancaria",
  pse: "PSE",
};

export const METODOS_PAGO_KEYS = Object.keys(METODOS_PAGO);

export const CONDICIONES_OFERTA = [
  "Todos los productos",
  "Solo Manga",
  "Solo Cómic",
  "Solo Arte",
  "Compras superiores a $100.000",
  "Compras superiores a $200.000",
  "Clientes VIP",
  "Temporada especial",
];

export const ESTADOS_CLIENTE = ["VIP", "Activo", "Nuevo"];

export const labelEstado = (v) =>
  ESTADOS_PEDIDO.find((e) => e.valor === v || e.label === v)?.label ?? v ?? "—";

export const labelTipo = (v) =>
  ESTADOS_PAGO.find((e) => e.valor === v || e.label === v)?.label ?? v ?? "—";

export const valorEstado = (v) =>
  ESTADOS_PEDIDO.find((e) => e.valor === v || e.label === v)?.valor ?? v ?? "";

export const valorTipo = (v) =>
  ESTADOS_PAGO.find((e) => e.valor === v || e.label === v)?.valor ?? v ?? "";

export const claseEstado = (v) => {
  const l = labelEstado(v).toLowerCase();
  if (["completado", "entregado"].includes(l))
    return "bg-accent-green/10 text-accent-green border-accent-green/20";
  if (["enviado", "confirmado"].includes(l))
    return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
  if (l === "procesando")
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  if (l === "cancelado") return "bg-red-500/10 text-red-400 border-red-500/20";
  return "bg-white/5 text-gray-300 border-white/5";
};

export const claseTipo = (v) => {
  const l = labelTipo(v).toLowerCase();
  if (["contado", "pagado"].includes(l))
    return "bg-accent-blue/10 text-accent-blue border-accent-blue/20";
  if (["anticipo", "pendiente"].includes(l))
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  if (l === "fallido") return "bg-red-500/10 text-red-400 border-red-500/20";
  if (l === "reembolsado")
    return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  return "bg-white/5 text-gray-300 border-white/5";
};

export const dotEstado = (v) => {
  const l = labelEstado(v).toLowerCase();
  if (["completado", "entregado"].includes(l)) return "bg-accent-green";
  if (["enviado", "confirmado"].includes(l)) return "bg-accent-blue";
  if (l === "procesando") return "bg-yellow-500";
  if (l === "cancelado") return "bg-red-400";
  return "bg-gray-500";
};
