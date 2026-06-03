export const formatearMoneda = (valor) => {
  if (valor === undefined || valor === null) return "$0";
  if (valor >= 1_000_000) return `$${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `$${Math.round(valor / 1000)}K`;
  return `$${valor.toLocaleString()}`;
};

export const formatearFecha = (fecha, formato = "es-CO") => {
  if (!fecha) return "—";
  try {
    return new Date(fecha).toLocaleDateString(formato, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export const formatearFechaCorta = (fecha) => {
  if (!fecha) return "";
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const tiempoRelativo = (fecha) => {
  if (!fecha) return "";
  const diff = Date.now() - new Date(fecha).getTime();
  const horas = Math.floor(diff / (1000 * 60 * 60));
  if (horas < 1) return "Hace un momento";
  if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? "s" : ""}`;
  const dias = Math.floor(horas / 24);
  return `Hace ${dias} día${dias !== 1 ? "s" : ""}`;
};

export const formatearEstadoPedido = (estado) => {
  const map = {
    entregado: "Entregado",
    procesando: "En proceso",
    confirmado: "En proceso",
    enviado: "Enviado",
    cancelado: "Cancelado",
  };
  return map[estado] || estado;
};

export const formatearEstadoPago = (estadoPago) => {
  const map = {
    pendiente: "Pendiente",
    pagado: "Pagado",
    fallido: "Fallido",
    reembolsado: "Reembolsado",
  };
  return map[estadoPago] || estadoPago;
};

export const formatearNumeroPedido = (id) =>
  id?.toString().slice(-6).toUpperCase() || "";

export const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <span
      key={i}
      className={`text-base ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
    >
      {i < rating ? "★" : "☆"}
    </span>
  ));
};
