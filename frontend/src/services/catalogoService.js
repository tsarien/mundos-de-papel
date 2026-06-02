import { obtenerProductos } from "./productoService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
      throw new Error("Error al obtener categorías");
    }
    const data = await response.json();
    return data.categorias || [];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const obtenerEditoriales = async () => {
  try {
    const response = await fetch(`${API_URL}/editoriales`);
    if (!response.ok) {
      throw new Error("Error al obtener editoriales");
    }
    const data = await response.json();
    return data.editoriales || [];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
