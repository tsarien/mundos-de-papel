// Formateadores de datos para respuestas consistentes

export const formatearEstadoCliente = (pedidos, fechaRegistro) => {
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);

  if (pedidos >= 10) return "VIP";
  if (fechaRegistro >= hace30Dias && pedidos <= 1) return "Nuevo";
  return "Activo";
};

export const mapearEstadoPedido = (estado) => {
  const estados = {
    entregado: "Completado",
    enviado: "Enviado",
    procesando: "Procesando",
    confirmado: "Pendiente",
    cancelado: "Cancelado",
  };
  return estados[estado] || estado;
};

export const mapearEstadoPago = (estadoPago) => {
  const estados = {
    pendiente: "Pendiente",
    pagado: "Pagado",
    fallido: "Fallido",
    reembolsado: "Reembolsado",
  };
  return estados[estadoPago] || estadoPago;
};

export const formatearNumeroPedido = (id) => {
  return `#${id.toString().slice(-4).toUpperCase()}`;
};

export const calcularDescuento = (precio, descuentoPorcentaje) => {
  if (!descuentoPorcentaje || descuentoPorcentaje <= 0) return 0;
  return (precio * descuentoPorcentaje) / 100;
};

export const calcularPrecioFinal = (precio, descuentoPorcentaje) => {
  const descuento = calcularDescuento(precio, descuentoPorcentaje);
  return precio - descuento;
};
