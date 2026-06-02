import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";
import Pedido from "../models/Pedido.js";
import Proveedor from "../models/Proveedor.js";
import Alerta from "../models/Alerta.js";
import ReglaPrecio from "../models/ReglaPrecio.js";
import Configuracion from "../models/Configuracion.js";
import Categoria from "../models/Categoria.js";

const inicioMes = () => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
};

const inicioDia = () => {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  return fecha;
};

const obtenerConfig = async () => {
  let config = await Configuracion.findOne({ clave: "general" });
  if (!config) {
    config = await Configuracion.create({});
  }
  return config;
};

const formatearEstadoCliente = (pedidos, fechaRegistro) => {
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);

  if (pedidos >= 10) return "VIP";
  if (fechaRegistro >= hace30Dias && pedidos <= 1) return "Nuevo";
  return "Activo";
};

const mapearEstadoPedido = (estado) => {
  const estados = {
    entregado: "Completado",
    enviado: "Enviado",
    procesando: "Procesando",
    confirmado: "Pendiente",
    cancelado: "Cancelado",
  };
  return estados[estado] || estado;
};

// @desc    Resumen del dashboard admin
// @route   GET /api/admin/resumen
export const obtenerResumen = async (req, res) => {
  try {
    const config = await obtenerConfig();
    const umbralBajo = config.inventario.umbralStockBajo;

    const mesInicio = inicioMes();

    const [
      ventasMes,
      pedidosActivos,
      stockBajo,
      clientesNuevos,
      pedidosRecientes,
      productosVendidos,
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
      Producto.countDocuments({ activo: true, stock: { $lte: umbralBajo } }),
      Usuario.countDocuments({
        rol: "usuario",
        createdAt: { $gte: mesInicio },
      }),
      Pedido.find()
        .populate("usuario", "nombre apellido")
        .populate("items.producto", "nombre")
        .sort("-createdAt")
        .limit(4),
      Pedido.aggregate([
        { $match: { estado: { $ne: "cancelado" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.nombre",
            ventas: { $sum: "$items.cantidad" },
          },
        },
        { $sort: { ventas: -1 } },
        { $limit: 5 },
      ]),
      Producto.find({ activo: true, stock: { $lte: umbralBajo } })
        .populate("categoria", "nombre")
        .sort("stock")
        .limit(5)
        .select("nombre stock categoria"),
      Alerta.countDocuments({ leida: false }),
    ]);

    const pedidosListosEnviar = await Pedido.countDocuments({
      estado: "confirmado",
    });

    res.json({
      success: true,
      resumen: {
        ventasMes: ventasMes[0]?.total || 0,
        pedidosActivos,
        pedidosListosEnviar,
        stockBajo,
        clientesNuevos,
        alertasPendientes,
        pedidosRecientes: pedidosRecientes.map((p) => ({
          id: p._id,
          numero: p._id.toString().slice(-4).toUpperCase(),
          cliente:
            `${p.usuario?.nombre || ""} ${p.usuario?.apellido || ""}`.trim(),
          libro: p.items[0]?.nombre || p.items[0]?.producto?.nombre || "",
          total: p.total,
          estado: p.estadoPago === "pagado" ? "ok" : "low",
          estadoPedido: p.estado,
        })),
        productosVendidos: productosVendidos.map((p) => ({
          nombre: p._id,
          ventas: p.ventas,
          max: Math.max(p.ventas, 10),
        })),
        productosStockBajo: productosStockBajo.map((p) => ({
          nombre: p.nombre,
          stock: p.stock,
          umbral: umbralBajo,
          critico: p.stock <= config.inventario.umbralStockCritico,
        })),
      },
    });
  } catch (error) {
    console.error("Error al obtener resumen:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener resumen",
      error: error.message,
    });
  }
};

// @desc    Métricas de ventas
// @route   GET /api/admin/ventas
export const obtenerMetricasVentas = async (req, res) => {
  try {
    const hoy = inicioDia();
    const mesInicio = inicioMes();

    const [ventasHoy, completadosMes, pedidos] = await Promise.all([
      Pedido.aggregate([
        {
          $match: {
            createdAt: { $gte: hoy },
            estado: { $ne: "cancelado" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
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

    res.json({
      success: true,
      ventas: {
        ventasHoy: ventasHoyData.total,
        pedidosHoy: ventasHoyData.count,
        promedioPedido,
        completadosMes,
        pedidos: pedidos.map((p) => ({
          id: p._id,
          numero: `#${p._id.toString().slice(-4).toUpperCase()}`,
          cliente:
            `${p.usuario?.nombre || ""} ${p.usuario?.apellido || ""}`.trim(),
          producto: p.items[0]?.nombre || p.items[0]?.producto?.nombre || "",
          fecha: p.createdAt,
          tipo: p.estadoPago === "pagado" ? "Contado" : "Anticipo",
          total: p.total,
          estado: mapearEstadoPedido(p.estado),
        })),
      },
    });
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener ventas",
      error: error.message,
    });
  }
};

// @desc    Inventario admin
// @route   GET /api/admin/inventario
export const obtenerInventario = async (req, res) => {
  try {
    const config = await obtenerConfig();
    const umbralBajo = config.inventario.umbralStockBajo;

    const productos = await Producto.find({ activo: true })
      .populate("categoria", "nombre")
      .sort("nombre");

    const productosConEstado = productos.map((p) => ({
      id: p._id,
      nombre: p.nombre,
      categoria: p.categoria?.nombre || "Categoría desconocida",
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
      const count = productos.filter((p) => p.categoria === cat).length;
      return {
        categoria: cat,
        count,
        pct: productos.length ? (count / productos.length) * 100 : 0,
      };
    });

    res.json({
      success: true,
      inventario: {
        totalProductos: productos.length,
        stockTotal,
        stockBajo: productosConEstado.filter((p) => p.estado === "low").length,
        valorInventario,
        productos: productosConEstado,
        categorias,
        umbralBajo,
      },
    });
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener inventario",
      error: error.message,
    });
  }
};

// @desc    Clientes con estadísticas
// @route   GET /api/admin/clientes
export const obtenerClientes = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ rol: "usuario" }).select("-password");

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

    const statsMap = Object.fromEntries(
      stats.map((s) => [s._id.toString(), s]),
    );

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

    res.json({
      success: true,
      clientes: {
        lista: clientes,
        total: clientes.length,
        vip: clientes.filter((c) => c.estado === "VIP").length,
        nuevos: clientes.filter((c) => c.estado === "Nuevo").length,
        valorPromedio,
      },
    });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener clientes",
      error: error.message,
    });
  }
};

// @desc    Métricas y reglas de precios
// @route   GET /api/admin/precios
export const obtenerPrecios = async (req, res) => {
  try {
    const [productos, reglas, categoriasDB] = await Promise.all([
      Producto.find({ activo: true }).populate("categoria", "nombre"),
      ReglaPrecio.find().sort("nombre"),
      Categoria.find({ activo: true }).sort("nombre"),
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

    res.json({
      success: true,
      precios: {
        precioPromedio,
        productosEnOferta: enOferta.length,
        totalProductos: productos.length,
        descuentoPromedio,
        reglas,
        categorias,
      },
    });
  } catch (error) {
    console.error("Error al obtener precios:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener precios",
      error: error.message,
    });
  }
};

// @desc    Listar proveedores
// @route   GET /api/admin/proveedores
export const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find().sort("nombre");

    res.json({
      success: true,
      proveedores,
    });
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener proveedores",
      error: error.message,
    });
  }
};

// @desc    Listar alertas
// @route   GET /api/admin/alertas
export const obtenerAlertas = async (req, res) => {
  try {
    const alertas = await Alerta.find().sort("-createdAt");

    res.json({
      success: true,
      alertas,
      resumen: {
        total: alertas.length,
        criticas: alertas.filter((a) => a.tipo === "critico").length,
        advertencias: alertas.filter((a) => a.tipo === "advertencia").length,
        info: alertas.filter((a) => a.tipo === "info").length,
        pendientes: alertas.filter((a) => !a.leida).length,
      },
    });
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener alertas",
      error: error.message,
    });
  }
};

// @desc    Obtener configuración
// @route   GET /api/admin/configuracion
export const obtenerConfiguracion = async (req, res) => {
  try {
    const configuracion = await obtenerConfig();

    res.json({
      success: true,
      configuracion,
    });
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener configuración",
      error: error.message,
    });
  }
};
