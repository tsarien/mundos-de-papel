import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useProductFilters = () => {
  const [searchParams] = useSearchParams();
  const [filtros, setFiltros] = useState(() => ({
    categorias: searchParams.get("categoria")
      ? [searchParams.get("categoria")]
      : [],
    autor: "",
    editorial: "",
    precioMin: "",
    precioMax: "",
  }));

  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    setFiltros((prev) => ({
      ...prev,
      categorias: categoriaParam ? [categoriaParam] : [],
    }));
  }, [searchParams]);

  const handleCategoriaChange = (categoriaId) => {
    setFiltros((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoriaId)
        ? prev.categorias.filter((c) => c !== categoriaId)
        : [...prev.categorias, categoriaId],
    }));
  };

  const handleCambioFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const resetFiltros = () => {
    setFiltros({
      categorias: [],
      autor: "",
      editorial: "",
      precioMin: "",
      precioMax: "",
    });
  };

  return {
    filtros,
    handleCategoriaChange,
    handleCambioFiltro,
    resetFiltros,
    setFiltros,
  };
};
