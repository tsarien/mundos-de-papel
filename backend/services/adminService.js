import Pedido from "../models/Pedido.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Alert from "../models/Alert.js";
import Category from "../models/Category.js";
import ReglaPrecio from "../models/ReglaPrecio.js";
import { inicioMes, inicioDia } from "../utils/fechaUtils.js";
import {
  formatearEstadoCliente,
  formatearNumeroPedido,
} from "../utils/formatters.js";

/**
 * Obtiene métricas para el dashboard
 * @param {number} umbralStockBajo
 * @returns {Promise<object>}
 */
export const obtenerMetricasDashboard = async (umbralStockBajo) => {
  const mesInicio = inicioMes();

  const productosVendidosRaw = await Pedido.aggregate([
    { $match: { estado: { $ne: "cancelado" } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.producto", ventas: { $sum: "$items.cantidad" } } },
    { $sort: { ventas: -1 } },
    { $limit: 5 },
  ]);

  const productosIds = productosVendidosRaw.map((p) => p._id);
  const productosInfo = await Product.find({
    _id: { $in: productosIds },
  }).select("nombre");
  const nombreMap = new Map(
    productosInfo.map((p) => [p._id.toString(), p.nombre]),
  );

  const productosVendidos = productosVendidosRaw.map((p) => ({
    nombre: nombreMap.get(p._id.toString()) || "Producto eliminado",
    ventas: p.ventas,
    max: Math.max(p.ventas, 10),
  }));

  const [
    ventasMes,
    pedidosActivos,
    stockBajo,
    clientesNuevos,
    pedidosRecientes,
    productosStockBajo,
    alertasPendientes,
  ] = await Promise.all([
    Pedido.aggregate([
      {
        $match: {
          createdAt: { $gte: mesInicio },
          estado: { $ne: "cancelado" },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Pedido.countDocuments({
      estado: { $in: ["procesando", "confirmado", "enviado"] },
    }),
    Product.countDocuments({ activo: true, stock: { $lte: umbralStockBajo } }),
    User.countDocuments({ rol: "usuario", createdAt: { $gte: mesInicio } }),
    Pedido.find()
      .populate("usuario", "nombre apellido")
      .populate("items.producto", "nombre")
      .sort("-createdAt")
      .limit(4),
    Product.find({ activo: true, stock: { $lte: umbralStockBajo } })
      .populate("categoria", "nombre")
      .sort("stock")
      .limit(5)
      .select("nombre stock categoria"),
    Alert.countDocuments({ leida: false }),
  ]);

  const pedidosListosEnviar = await Pedido.countDocuments({
    estado: "confirmado",
  });

  return {
    ventasMes: ventasMes[0]?.total || 0,
    pedidosActivos,
    pedidosListosEnviar,
    stockBajo,
    clientesNuevos,
    alertasPendientes,
    pedidosRecientes: pedidosRecientes.map((p) => ({
      id: p._id,
      numero: formatearNumeroPedido(p._id),
      cliente: `${p.usuario?.nombre || ""} ${p.usuario?.apellido || ""}`.trim(),
      libro: p.items[0]?.producto?.nombre || "",
      total: p.total,
      estado: p.estadoPago === "pagado" ? "ok" : "low",
      estadoPedido: p.estado,
    })),
    productosVendidos,
    productosStockBajo: productosStockBajo.map((p) => ({
      nombre: p.nombre,
      stock: p.stock,
      umbral: umbralStockBajo,
      critico: p.stock <= umbralStockBajo / 2,
    })),
  };
};

/**
 * Obtiene métricas de ventas
 * @returns {Promise<object>}
 */
export const obtenerMetricasVentas = async () => {
  const hoy = inicioDia();
  const mesInicio = inicioMes();

  const [ventasHoy, completadosMes, pedidos] = await Promise.all([
    Pedido.aggregate([
      { $match: { createdAt: { $gte: hoy }, estado: { $ne: "cancelado" } } },
      { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
    ]),
    Pedido.countDocuments({
      createdAt: { $gte: mesInicio },
      estado: "entregado",
    }),
    Pedido.find()
      .populate("usuario", "nombre apellido")
      .populate("items.producto", "nombre")
      .sort("-createdAt")
      .limit(50),
  ]);

  const ventasHoyData = ventasHoy[0] || { total: 0, count: 0 };
  const promedioPedido =
    ventasHoyData.count > 0
      ? Math.round(ventasHoyData.total / ventasHoyData.count)
      : 0;

  return {
    ventasHoy: ventasHoyData.total,
    pedidosHoy: ventasHoyData.count,
    promedioPedido,
    completadosMes,
    pedidos: pedidos.map((p) => ({
      id: p._id,
      numero: `#${p._id.toString().slice(-4).toUpperCase()}`,
      cliente: `${p.usuario?.nombre || ""} ${p.usuario?.apellido || ""}`.trim(),
      producto: p.items[0]?.producto?.nombre || "",
      fecha: p.createdAt,
      tipo: p.estadoPago === "pagado" ? "Contado" : "Anticipo",
      total: p.total,
      estado: p.estado,
    })),
  };
};

/**
 * Obtiene datos de inventario
 * @param {number} umbralBajo
 * @returns {Promise<object>}
 */
export const obtenerDatosInventario = async (umbralBajo) => {
  const productos = await Product.find({ activo: true })
    .populate("categoria", "nombre")
    .sort("nombre");

  const productosConEstado = productos.map((p) => ({
    id: p._id,
    nombre: p.nombre,
    categoria: p.categoria || { nombre: "Categoría desconocida" },
    precio: p.precio,
    stock: p.stock,
    estado: p.stock <= umbralBajo ? "low" : "ok",
  }));

  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0);
  const valorInventario = productos.reduce(
    (acc, p) => acc + p.precio * p.stock,
    0,
  );

  const categorias = ["Manga", "Cómic", "Arte"].map((cat) => {
    const count = productos.filter((p) => p.categoria?.nombre === cat).length;
    return {
      categoria: cat,
      count,
      pct: productos.length ? (count / productos.length) * 100 : 0,
    };
  });

  return {
    totalProductos: productos.length,
    stockTotal,
    stockBajo: productosConEstado.filter((p) => p.estado === "low").length,
    valorInventario,
    productos: productosConEstado,
    categorias,
    umbralBajo,
  };
};

/**
 * Obtiene datos de clientes con estadísticas
 * @returns {Promise<object>}
 */
export const obtenerDatosClientes = async () => {
  const usuarios = await User.find({ rol: "usuario" }).select("-password");

  const stats = await Pedido.aggregate([
    {
      $group: {
        _id: "$usuario",
        pedidos: { $sum: 1 },
        total: { $sum: "$total" },
        ultima: { $max: "$createdAt" },
      },
    },
  ]);

  const statsMap = Object.fromEntries(stats.map((s) => [s._id?.toString(), s]));

  const clientes = usuarios.map((u) => {
    const stat = statsMap[u._id.toString()] || {
      pedidos: 0,
      total: 0,
      ultima: null,
    };
    return {
      id: u._id,
      nombre: `${u.nombre} ${u.apellido}`,
      email: u.email,
      pedidos: stat.pedidos,
      total: stat.total,
      ultima: stat.ultima,
      estado: formatearEstadoCliente(stat.pedidos, u.createdAt),
    };
  });

  clientes.sort((a, b) => b.total - a.total);

  const valorPromedio = clientes.length
    ? Math.round(
        clientes.reduce((acc, c) => acc + c.total, 0) / clientes.length,
      )
    : 0;

  return {
    lista: clientes,
    total: clientes.length,
    vip: clientes.filter((c) => c.estado === "VIP").length,
    nuevos: clientes.filter((c) => c.estado === "Nuevo").length,
    valorPromedio,
  };
};

/**
 * Obtiene datos de precios y reglas
 * @returns {Promise<object>}
 */
export const obtenerDatosPrecios = async () => {
  const [productos, reglas, categoriasDB] = await Promise.all([
    Product.find({ activo: true }).populate("categoria", "nombre"),
    ReglaPrecio.find().sort("nombre"),
    Category.find({ activo: true }).sort("nombre"),
  ]);

  const precioPromedio = productos.length
    ? Math.round(
        productos.reduce((acc, p) => acc + p.precio, 0) / productos.length,
      )
    : 0;

  const enOferta = productos.filter((p) => p.enOferta);
  const descuentoPromedio = enOferta.length
    ? Math.round(
        enOferta.reduce((acc, p) => acc + (p.descuento || 0), 0) /
          enOferta.length,
      )
    : 0;

  const categorias = categoriasDB.map((cat) => {
    const prods = productos.filter(
      (p) => p.categoria?._id.toString() === cat._id.toString(),
    );
    const precios = prods.map((p) => p.precio);
    return {
      categoria: cat.nombre,
      min: precios.length ? Math.min(...precios) : 0,
      max: precios.length ? Math.max(...precios) : 0,
      promedio: precios.length
        ? Math.round(precios.reduce((a, b) => a + b, 0) / precios.length)
        : 0,
    };
  });

  return {
    precioPromedio,
    productosEnOferta: enOferta.length,
    totalProductos: productos.length,
    descuentoPromedio,
    reglas,
    categorias,
  };
};

/**
 * Obtiene todas las alertas con resumen
 * @returns {Promise<object>}
 */
export const obtenerAlertasConResumen = async () => {
  const alertas = await Alert.find().sort("-createdAt");
  return {
    alertas,
    resumen: {
      total: alertas.length,
      criticas: alertas.filter((a) => a.tipo === "critico").length,
      advertencias: alertas.filter((a) => a.tipo === "advertencia").length,
      info: alertas.filter((a) => a.tipo === "info").length,
      pendientes: alertas.filter((a) => !a.leida).length,
    },
  };
};
