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

export const actualizarConfiguracion = async (datos) => {
  const response = await api.put("/admin/configuracion", datos);
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

export const actualizarStock = async (id, cantidad) => {
  const response = await api.put(`/productos/${id}/stock`, { cantidad });
  return response.data;
};

export const actualizarProducto = async (id, datos) => {
  try {
    const response = await api.put(`/productos/${id}`, datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const eliminarProducto = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};

export const crearReglaPrecio = async (datos) => {
  const response = await api.post("/admin/precios", datos);
  return response.data;
};

export const actualizarReglaPrecio = async (id, datos) => {
  const response = await api.put(`/admin/precios/${id}`, datos);
  return response.data;
};

export const actualizarEstadoRegla = async (id, activo) => {
  const response = await api.patch(`/admin/precios/${id}/estado`, { activo });
  return response.data;
};

export const eliminarReglaPrecio = async (id) => {
  const response = await api.delete(`/admin/precios/${id}`);
  return response.data;
};

export const obtenerDetalleCliente = async (id) => {
  const response = await api.get(`/admin/clientes/${id}`);
  return response.data;
};

export const actualizarCliente = async (id, datos) => {
  const response = await api.put(`/admin/clientes/${id}`, datos);
  return response.data;
};

export const actualizarEstadoCliente = async (id, estado) => {
  const response = await api.patch(`/admin/clientes/${id}/estado`, { estado });
  return response.data;
};

export const eliminarCliente = async (id) => {
  const response = await api.delete(`/admin/clientes/${id}`);
  return response.data;
};

export const obtenerDetalleProveedor = async (id) => {
  const response = await api.get(`/admin/proveedores/${id}`);
  return response.data;
};

export const crearProveedor = async (datos) => {
  const response = await api.post("/admin/proveedores", datos);
  return response.data;
};

export const actualizarProveedor = async (id, datos) => {
  const response = await api.put(`/admin/proveedores/${id}`, datos);
  return response.data;
};

export const actualizarEstadoProveedor = async (id, estado) => {
  const response = await api.patch(`/admin/proveedores/${id}/estado`, {
    estado,
  });
  return response.data;
};

export const eliminarProveedor = async (id) => {
  const response = await api.delete(`/admin/proveedores/${id}`);
  return response.data;
};

export const obtenerPedidosProveedor = async (proveedorId) => {
  const response = await api.get(`/admin/proveedores/${proveedorId}/pedidos`);
  return response.data;
};

export const crearPedidoProveedor = async (proveedorId, datos) => {
  const response = await api.post(
    `/admin/proveedores/${proveedorId}/pedidos`,
    datos,
  );
  return response.data;
};

export const actualizarPedidoProveedor = async (pedidoId, datos) => {
  const response = await api.put(`/admin/pedidos-proveedor/${pedidoId}`, datos);
  return response.data;
};

export const actualizarEstadoPedidoProveedor = async (pedidoId, estado) => {
  const response = await api.patch(
    `/admin/pedidos-proveedor/${pedidoId}/estado`,
    { estado },
  );
  return response.data;
};

export const eliminarPedidoProveedor = async (pedidoId) => {
  const response = await api.delete(`/admin/pedidos-proveedor/${pedidoId}`);
  return response.data;
};

export const marcarAlertaLeida = async (id) => {
  const response = await api.patch(`/admin/alertas/${id}/leer`);
  return response.data;
};

export const marcarTodasAlertasLeidas = async () => {
  const response = await api.patch("/admin/alertas/leer-todas");
  return response.data;
};

export const eliminarAlerta = async (id) => {
  const response = await api.delete(`/admin/alertas/${id}`);
  return response.data;
};
