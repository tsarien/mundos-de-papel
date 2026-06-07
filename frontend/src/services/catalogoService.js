import api from "./api";

export const obtenerCategorias = async () => {
  const res = await api.get("/categorias");
  return res.data.categorias || [];
};
export const obtenerEditoriales = async () => {
  const res = await api.get("/editoriales");
  return res.data.editoriales || [];
};
