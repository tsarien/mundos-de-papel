import Product from "../models/Product.js";

/**
 * Obtiene productos con filtros y paginación
 * @param {object} queryParams
 * @returns {Promise<object>}
 */
export const obtenerProductosConFiltros = async (queryParams) => {
  const {
    categoria,
    busqueda,
    precioMin,
    precioMax,
    autor,
    editorial,
    enOferta,
    destacado,
    pagina = 1,
    limite = 12,
    ordenar = "-createdAt",
  } = queryParams;

  const filtros = { activo: true };

  if (categoria) filtros.categoria = categoria;
  if (busqueda) filtros.$text = { $search: busqueda };
  if (autor) filtros.autor = { $regex: autor, $options: "i" };
  if (editorial) filtros.editorial = { $regex: editorial, $options: "i" };
  if (enOferta === "true") filtros.enOferta = true;
  if (destacado === "true") filtros.destacado = true;

  if (precioMin || precioMax) {
    filtros.precio = {};
    if (precioMin) filtros.precio.$gte = Number(precioMin);
    if (precioMax) filtros.precio.$lte = Number(precioMax);
  }

  const skip = (Number(pagina) - 1) * Number(limite);
  const total = await Product.countDocuments(filtros);

  const productos = await Product.find(filtros)
    .populate("categoria", "nombre slug icono")
    .sort(ordenar)
    .limit(Number(limite))
    .skip(skip);

  return {
    productos,
    total,
    paginas: Math.ceil(total / Number(limite)),
    paginaActual: Number(pagina),
    count: productos.length,
  };
};

/**
 * Actualiza stock de un producto
 * @param {object} producto
 * @param {number} nuevaCantidad
 * @returns {Promise<object>}
 */
export const actualizarStockProducto = async (producto, nuevaCantidad) => {
  producto.stock = nuevaCantidad;
  await producto.save();
  return producto;
};
