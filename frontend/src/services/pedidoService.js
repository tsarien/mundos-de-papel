import api from "./api";

export const crearPedido = async (datosPedido) => {
  try {
    const response = await api.post("/pedidos", datosPedido);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerMisPedidos = async () => {
  try {
    const response = await api.get("/pedidos/mis-pedidos");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerPedidoPorId = async (id) => {
  try {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelarPedido = async (id, motivo) => {
  try {
    const response = await api.put(`/pedidos/${id}/cancelar`, { motivo });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
