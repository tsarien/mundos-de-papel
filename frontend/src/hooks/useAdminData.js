import { useState, useEffect, useCallback } from "react";
import {
  obtenerResumen,
  obtenerVentas,
  obtenerInventario,
  obtenerClientes,
  obtenerPrecios,
  obtenerProveedores,
  obtenerAlertas,
  obtenerConfiguracion,
} from "../services/adminService";

const fetchMap = {
  resumen: () => obtenerResumen().then((d) => d.resumen),
  ventas: () => obtenerVentas().then((d) => d.ventas),
  inventario: () => obtenerInventario().then((d) => d.inventario),
  clientes: () => obtenerClientes().then((d) => d.clientes),
  precios: () => obtenerPrecios().then((d) => d.precios),
  proveedores: () => obtenerProveedores().then((d) => d.proveedores),
  alertas: () => obtenerAlertas(),
  configuracion: () => obtenerConfiguracion().then((d) => d.configuracion),
};

export const useAdminData = (tipo) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetcher = fetchMap[tipo];
      if (!fetcher) throw new Error("Tipo inválido");
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err) {
      console.error(`Error en ${tipo}:`, err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
