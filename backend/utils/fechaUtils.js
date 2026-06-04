export const inicioMes = () => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
};

export const finMes = () => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59);
};

export const inicioDia = () => {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  return fecha;
};

export const finDia = () => {
  const fecha = new Date();
  fecha.setHours(23, 59, 59, 999);
  return fecha;
};

export const haceNDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
};

export const formatearFechaLocal = (fecha) => {
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
