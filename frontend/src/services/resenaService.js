import api from './api';

// Obtener reseñas de un producto
export const obtenerResenas = async (productoId, filtro = 0) => {
  try {
    const params = filtro !== 0 ? `?filtro=${filtro}` : '';
    const response = await api.get(`/productos/${productoId}/valoraciones${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Agregar reseña a un producto
export const agregarResena = async (productoId, datos) => {
  try {
    const response = await api.post(`/productos/${productoId}/valoraciones`, datos);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Marcar reseña como útil
export const marcarResenaUtil = async (productoId, valoracionId) => {
  try {
    const response = await api.put(`/productos/${productoId}/valoraciones/${valoracionId}/util`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
