import Pedido from "../models/Pedido.js";
import {
  crearNuevoPedido,
  cancelarPedidoConStock,
} from "../services/pedidoService.js";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../utils/errors.js";

// @desc    Crear nuevo pedido
// @route   POST /api/pedidos
export const crearPedido = async (req, res, next) => {
  try {
    const pedido = await crearNuevoPedido(req.usuario.id, req.body);
    res.status(201).json({ success: true, pedido });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener pedidos del usuario
// @route   GET /api/pedidos/mis-pedidos
export const obtenerMisPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario.id })
      .populate("items.producto", "nombre imagen")
      .sort("-createdAt");

    res.json({ success: true, count: pedidos.length, pedidos });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener pedido por ID
// @route   GET /api/pedidos/:id
export const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("usuario", "nombre apellido email")
      .populate("items.producto", "nombre imagen autor editorial");

    if (!pedido) {
      throw new NotFoundError("Pedido");
    }

    if (
      pedido.usuario._id.toString() !== req.usuario.id &&
      req.usuario.rol !== "admin"
    ) {
      throw new ForbiddenError("No tienes permiso para ver este pedido");
    }

    res.json({ success: true, pedido });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los pedidos (Admin)
// @route   GET /api/pedidos
export const obtenerTodosPedidos = async (req, res, next) => {
  try {
    const { estado, pagina = 1, limite = 20 } = req.query;
    const filtros = {};
    if (estado) filtros.estado = estado;

    const skip = (Number(pagina) - 1) * Number(limite);

    const [pedidos, total] = await Promise.all([
      Pedido.find(filtros)
        .populate("usuario", "nombre apellido email")
        .populate("items.producto", "nombre")
        .sort("-createdAt")
        .limit(Number(limite))
        .skip(skip),
      Pedido.countDocuments(filtros),
    ]);

    res.json({
      success: true,
      count: pedidos.length,
      total,
      paginas: Math.ceil(total / Number(limite)),
      pedidos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar estado del pedido
// @route   PUT /api/pedidos/:id/estado
export const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const { estado, comentario, tracking } = req.body;
    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      throw new NotFoundError("Pedido");
    }

    pedido.estado = estado;
    if (tracking) pedido.tracking = tracking;
    if (estado === "entregado") pedido.fechaEntrega = new Date();

    pedido.agregarHistorial(estado, comentario);
    await pedido.save();

    res.json({ success: true, pedido });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar pedido
// @route   PUT /api/pedidos/:id/cancelar
export const cancelarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate(
      "items.producto",
    );

    if (!pedido) {
      throw new NotFoundError("Pedido");
    }

    if (
      pedido.usuario.toString() !== req.usuario.id &&
      req.usuario.rol !== "admin"
    ) {
      throw new ForbiddenError("No tienes permiso para cancelar este pedido");
    }

    if (!["procesando", "confirmado"].includes(pedido.estado)) {
      throw new BadRequestError(
        "No se puede cancelar este pedido en su estado actual",
      );
    }

    const pedidoCancelado = await cancelarPedidoConStock(
      pedido,
      req.body.motivo,
    );

    res.json({
      success: true,
      mensaje: "Pedido cancelado exitosamente",
      pedido: pedidoCancelado,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de pedidos (Admin)
// @route   GET /api/pedidos/estadisticas
export const obtenerEstadisticas = async (req, res, next) => {
  try {
    const [totalPedidos, pedidosPorEstado, ventasTotales] = await Promise.all([
      Pedido.countDocuments(),
      Pedido.aggregate([{ $group: { _id: "$estado", count: { $sum: 1 } } }]),
      Pedido.aggregate([
        { $match: { estado: { $ne: "cancelado" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    res.json({
      success: true,
      estadisticas: {
        totalPedidos,
        pedidosPorEstado,
        ventasTotales: ventasTotales[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
