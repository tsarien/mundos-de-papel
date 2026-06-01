import api from "./api";

export const obtenerProductos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.categoria) params.append("categoria", filtros.categoria);
    if (filtros.busqueda) params.append("busqueda", filtros.busqueda);
    if (filtros.precioMin) params.append("precioMin", filtros.precioMin);
    if (filtros.precioMax) params.append("precioMax", filtros.precioMax);
    if (filtros.autor) params.append("autor", filtros.autor);
    if (filtros.editorial) params.append("editorial", filtros.editorial);
    if (filtros.enOferta) params.append("enOferta", "true");
    if (filtros.pagina) params.append("pagina", filtros.pagina);
    if (filtros.limite) params.append("limite", filtros.limite);

    const response = await api.get(`/productos?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obtenerProductoPorId = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const agregarValoracion = async (productoId, datos) => {
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
