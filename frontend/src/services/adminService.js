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

export const obtenerCategorias = async () => {
  const response = await api.get("/categorias");
  return response.data;
};

export const crearProducto = async (datos) => {
  const response = await api.post("/productos", datos);
  return response.data;
};

export const subirImagenProducto = async (id, imagenFile) => {
  const formData = new FormData();
  formData.append("imagen", imagenFile);
  const response = await api.put(`/productos/${id}/imagen`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
