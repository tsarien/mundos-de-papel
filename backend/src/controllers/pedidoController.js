import Pedido from '../models/Pedido.js';
import Producto from '../models/Producto.js';

// @desc    Crear nuevo pedido
// @route   POST /api/pedidos
// @access  Private
export const crearPedido = async (req, res) => {
  try {
    const { items, direccionEnvio, metodoPago, notas } = req.body;

    // Validar que haya items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'El pedido debe tener al menos un producto'
      });
    }

    // Verificar stock y calcular totales
    const itemsProcesados = [];
    let descuentoTotal = 0;

    for (const item of items) {
      const producto = await Producto.findById(item.producto);

      if (!producto) {
        return res.status(404).json({
          success: false,
          mensaje: `Producto ${item.producto} no encontrado`
        });
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          mensaje: `Stock insuficiente para ${producto.nombre}`
        });
      }

      // Calcular precio con descuento si aplica
      let precioFinal = producto.precio;
      let descuentoProducto = 0;

      if (producto.enOferta && producto.descuento > 0) {
        descuentoProducto = (producto.precio * producto.descuento) / 100;
        precioFinal = producto.precio - descuentoProducto;
        descuentoTotal += descuentoProducto * item.cantidad;
      }

      const subtotal = precioFinal * item.cantidad;

      itemsProcesados.push({
        producto: producto._id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precio: producto.precio,
        descuento: producto.descuento || 0,
        subtotal
      });

      // Reducir stock
      producto.stock -= item.cantidad;
      await producto.save();
    }

    // Calcular costo de envío
    const subtotalPedido = itemsProcesados.reduce((acc, item) => acc + item.subtotal, 0);
    const costoEnvio = subtotalPedido >= 100000 ? 0 : 10000; // Gratis si es más de $100,000

    // Crear pedido
    const pedido = await Pedido.create({
      usuario: req.usuario.id,
      items: itemsProcesados,
      direccionEnvio,
      metodoPago,
      descuentoTotal,
      costoEnvio,
      notas,
      subtotal: subtotalPedido,
      iva: subtotalPedido * 0.19,
      total: subtotalPedido + (subtotalPedido * 0.19) + costoEnvio - descuentoTotal
    });

    // Agregar al historial
    pedido.agregarHistorial('procesando', 'Pedido creado');
    await pedido.save();

    // Poblar datos
    await pedido.populate('items.producto', 'nombre imagen');

    res.status(201).json({
      success: true,
      pedido
    });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear pedido',
      error: error.message
    });
  }
};

// @desc    Obtener pedidos del usuario
// @route   GET /api/pedidos/mis-pedidos
// @access  Private
export const obtenerMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario.id })
      .populate('items.producto', 'nombre imagen')
      .sort('-createdAt');

    res.json({
      success: true,
      count: pedidos.length,
      pedidos
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener pedidos',
      error: error.message
    });
  }
};

// @desc    Obtener pedido por ID
// @route   GET /api/pedidos/:id
// @access  Private
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('usuario', 'nombre apellido email')
      .populate('items.producto', 'nombre imagen autor editorial');

    if (!pedido) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pedido no encontrado'
      });
    }

    // Verificar que el pedido pertenece al usuario (excepto admin)
    if (pedido.usuario._id.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para ver este pedido'
      });
    }

    res.json({
      success: true,
      pedido
    });

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener pedido',
      error: error.message
    });
  }
};

// @desc    Obtener todos los pedidos (Admin)
// @route   GET /api/pedidos
// @access  Private/Admin
export const obtenerTodosPedidos = async (req, res) => {
  try {
    const { estado, pagina = 1, limite = 20 } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;

    const skip = (Number(pagina) - 1) * Number(limite);

    const pedidos = await Pedido.find(filtros)
      .populate('usuario', 'nombre apellido email')
      .populate('items.producto', 'nombre')
      .sort('-createdAt')
      .limit(Number(limite))
      .skip(skip);

    const total = await Pedido.countDocuments(filtros);

    res.json({
      success: true,
      count: pedidos.length,
      total,
      paginas: Math.ceil(total / Number(limite)),
      pedidos
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener pedidos',
      error: error.message
    });
  }
};

// @desc    Actualizar estado del pedido
// @route   PUT /api/pedidos/:id/estado
// @access  Private/Admin
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { estado, comentario, tracking } = req.body;

    const pedido = await Pedido.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pedido no encontrado'
      });
    }

    // Actualizar estado
    pedido.estado = estado;
    
    if (tracking) {
      pedido.tracking = tracking;
    }

    // Si está entregado, guardar fecha
    if (estado === 'entregado') {
      pedido.fechaEntrega = new Date();
    }

    // Agregar al historial
    pedido.agregarHistorial(estado, comentario);
    await pedido.save();

    res.json({
      success: true,
      pedido
    });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar estado del pedido',
      error: error.message
    });
  }
};

// @desc    Cancelar pedido
// @route   PUT /api/pedidos/:id/cancelar
// @access  Private
export const cancelarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('items.producto');

    if (!pedido) {
      return res.status(404).json({
        success: false,
        mensaje: 'Pedido no encontrado'
      });
    }

    // Verificar que el pedido pertenece al usuario
    if (pedido.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        mensaje: 'No tienes permiso para cancelar este pedido'
      });
    }

    // Solo se puede cancelar si está en procesando o confirmado
    if (!['procesando', 'confirmado'].includes(pedido.estado)) {
      return res.status(400).json({
        success: false,
        mensaje: 'No se puede cancelar este pedido en su estado actual'
      });
    }

    // Devolver stock
    for (const item of pedido.items) {
      const producto = await Producto.findById(item.producto);
      if (producto) {
        producto.stock += item.cantidad;
        await producto.save();
      }
    }

    // Actualizar pedido
    pedido.estado = 'cancelado';
    pedido.agregarHistorial('cancelado', req.body.motivo || 'Cancelado por el usuario');
    await pedido.save();

    res.json({
      success: true,
      mensaje: 'Pedido cancelado exitosamente',
      pedido
    });

  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al cancelar pedido',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas de pedidos (Admin)
// @route   GET /api/pedidos/estadisticas
// @access  Private/Admin
export const obtenerEstadisticas = async (req, res) => {
  try {
    const totalPedidos = await Pedido.countDocuments();
    const pedidosPorEstado = await Pedido.aggregate([
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 }
        }
      }
    ]);

    const ventasTotales = await Pedido.aggregate([
      {
        $match: { estado: { $ne: 'cancelado' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      estadisticas: {
        totalPedidos,
        pedidosPorEstado,
        ventasTotales: ventasTotales[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
