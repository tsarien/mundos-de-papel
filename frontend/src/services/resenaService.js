import api from "./api";

export const obtenerResenas = async (productoId, filtro = 0) => {
  try {
    const params = filtro !== 0 ? `?filtro=${filtro}` : "";
    const response = await api.get(
      `/productos/${productoId}/valoraciones${params}`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const agregarResena = async (productoId, datos) => {
  try {
    const response = await api.post(
      `/productos/${productoId}/valoraciones`,
      datos,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const marcarResenaUtil = async (productoId, valoracionId) => {
  try {
    const response = await api.put(
      `/productos/${productoId}/valoraciones/${valoracionId}/util`,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
