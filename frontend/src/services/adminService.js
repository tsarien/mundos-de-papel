import api from "./api";

export const obtenerResumen = async () => {
  const response = await api.get("/admin/resumen");
  return response.data;
};

export const obtenerVentas = async () => {
  const response = await api.get("/admin/ventas");
  return response.data;
};

export const obtenerInventario = async () => {
  const response = await api.get("/admin/inventario");
  return response.data;
};

export const obtenerClientes = async () => {
  const response = await api.get("/admin/clientes");
  return response.data;
};

export const obtenerPrecios = async () => {
  const response = await api.get("/admin/precios");
  return response.data;
};

export const obtenerProveedores = async () => {
  const response = await api.get("/admin/proveedores");
  return response.data;
};

export const obtenerAlertas = async () => {
  const response = await api.get("/admin/alertas");
  return response.data;
};

export const obtenerConfiguracion = async () => {
  const response = await api.get("/admin/configuracion");
  return response.data;
};
