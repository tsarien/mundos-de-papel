import { obtenerConfiguracion as obtenerConfiguracionService } from "../services/configService.js";
import {
  obtenerMetricasDashboard,
  obtenerMetricasVentas as obtenerMetricasVentasService,
  obtenerDatosInventario,
  obtenerDatosClientes,
  obtenerDatosPrecios,
  obtenerAlertasConResumen,
  generarDatosBackup,
  restaurarDatosBackup,
} from "../services/adminService.js";
import Proveedor from "../models/Proveedor.js";
import PedidoProveedor from "../models/PedidoProveedor.js";
import ReglaPrecio from "../models/ReglaPrecio.js";
import Usuario from "../models/User.js";
import Pedido from "../models/Pedido.js";
import Alerta from "../models/Alert.js";
import Configuracion from "../models/Configuration.js";

export const obtenerResumen = async (req, res, next) => {
  try {
    const config = await obtenerConfiguracionService();
    const umbralBajo = config.inventario.umbralStockBajo;
    const resumen = await obtenerMetricasDashboard(umbralBajo);
    res.json({ success: true, resumen });
  } catch (error) {
    next(error);
  }
};

export const obtenerMetricasVentas = async (req, res, next) => {
  try {
    const ventas = await obtenerMetricasVentasService();
    res.json({ success: true, ventas });
  } catch (error) {
    next(error);
  }
};

export const obtenerInventario = async (req, res, next) => {
  try {
    const config = await obtenerConfiguracionService();
    const umbralBajo = config.inventario.umbralStockBajo;
    const inventario = await obtenerDatosInventario(umbralBajo);
    res.json({ success: true, inventario });
  } catch (error) {
    next(error);
  }
};

export const obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await obtenerDatosClientes();
    res.json({ success: true, clientes });
  } catch (error) {
    next(error);
  }
};

export const obtenerPrecios = async (req, res, next) => {
  try {
    const reglas = await ReglaPrecio.find().sort({ createdAt: -1 });
    res.json({ success: true, precios: { reglas } });
  } catch (error) {
    next(error);
  }
};

export const obtenerConfiguracion = async (req, res, next) => {
  try {
    const configuracion = await obtenerConfiguracionService();
    res.json({ success: true, configuracion });
  } catch (error) {
    next(error);
  }
};

export const actualizarConfiguracion = async (req, res, next) => {
  try {
    const { tienda, pedidos, inventario, metodosPago, notificaciones } =
      req.body;

    const configuracion = await Configuracion.findOneAndUpdate(
      { clave: "general" },
      {
        $set: {
          ...(tienda && { tienda }),
          ...(pedidos && { pedidos }),
          ...(inventario && { inventario }),
          ...(metodosPago && { metodosPago }),
          ...(notificaciones && { notificaciones }),
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.json({
      success: true,
      mensaje: "Configuración guardada exitosamente",
      configuracion,
    });
  } catch (error) {
    next(error);
  }
};

export const descargarBackup = async (req, res, next) => {
  try {
    const backup = await generarDatosBackup();
    if (!backup.pedidosProveedor) {
      backup.pedidosProveedor = await PedidoProveedor.find().lean();
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const filename = `backup-mundos-de-papel-${timestamp}.json`;

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(JSON.stringify(backup, null, 2));
  } catch (error) {
    next(error);
  }
};

export const restaurarBackup = async (req, res, next) => {
  try {
    const backup = req.body;
    if (!backup || Object.keys(backup).length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: "No se recibió ningún archivo de backup",
      });
    }

    if (Array.isArray(backup.pedidosProveedor)) {
      await PedidoProveedor.deleteMany();
      if (backup.pedidosProveedor.length > 0) {
        await PedidoProveedor.insertMany(backup.pedidosProveedor, {
          ordered: false,
        }).catch(() => {});
      }
      delete backup.pedidosProveedor;
    }

    const resumen = await restaurarDatosBackup(backup);
    res.json({
      success: true,
      mensaje: "Base de datos restaurada exitosamente",
      resumen,
    });
  } catch (error) {
    if (
      error.message.includes("backup") ||
      error.message.includes("colección")
    ) {
      return res.status(400).json({ success: false, mensaje: error.message });
    }
    next(error);
  }
};

export const crearReglaPrecio = async (req, res, next) => {
  try {
    const regla = await ReglaPrecio.create(req.body);
    res.status(201).json({ success: true, regla });
  } catch (error) {
    next(error);
  }
};

export const actualizarReglaPrecio = async (req, res, next) => {
  try {
    const regla = await ReglaPrecio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!regla) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Regla no encontrada" });
    }
    res.json({ success: true, regla });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoRegla = async (req, res, next) => {
  try {
    const { activo } = req.body;
    const regla = await ReglaPrecio.findByIdAndUpdate(
      req.params.id,
      { activo },
      { new: true },
    );
    if (!regla) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Regla no encontrada" });
    }
    res.json({ success: true, regla });
  } catch (error) {
    next(error);
  }
};

export const eliminarReglaPrecio = async (req, res, next) => {
  try {
    const regla = await ReglaPrecio.findByIdAndDelete(req.params.id);
    if (!regla) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Regla no encontrada" });
    }
    res.json({ success: true, mensaje: "Regla de precio eliminada" });
  } catch (error) {
    next(error);
  }
};

export const obtenerDetalleCliente = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-password");
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Cliente no encontrado" });
    }
    const pedidosRecientes = await Pedido.find({ usuario: req.params.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id total createdAt estado");
    res.json({
      success: true,
      cliente: { ...usuario.toObject(), pedidosRecientes },
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarCliente = async (req, res, next) => {
  try {
    const { nombre, apellido, email, telefono, direccion } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, email, telefono, direccion },
      { new: true, runValidators: true },
    ).select("-password");
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Cliente no encontrado" });
    }
    res.json({ success: true, usuario });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoCliente = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { estadoManual: estado },
      { new: true },
    ).select("-password");
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Cliente no encontrado" });
    }
    res.json({ success: true, usuario });
  } catch (error) {
    next(error);
  }
};

export const eliminarCliente = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Cliente no encontrado" });
    }
    if (usuario.rol === "admin") {
      return res.status(403).json({
        success: false,
        mensaje: "No se puede eliminar una cuenta de administrador",
      });
    }
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ success: true, mensaje: "Cuenta eliminada exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const obtenerProveedores = async (req, res, next) => {
  try {
    const proveedores = await Proveedor.find().sort("nombre");
    res.json({ success: true, proveedores });
  } catch (error) {
    next(error);
  }
};

export const obtenerDetalleProveedor = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Proveedor no encontrado" });
    }
    const pedidos = await PedidoProveedor.find({ proveedor: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, proveedor, pedidos });
  } catch (error) {
    next(error);
  }
};

export const crearProveedor = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.create(req.body);
    res.status(201).json({ success: true, proveedor });
  } catch (error) {
    next(error);
  }
};

export const actualizarProveedor = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!proveedor) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Proveedor no encontrado" });
    }
    res.json({ success: true, proveedor });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoProveedor = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const proveedor = await Proveedor.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true },
    );
    if (!proveedor) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Proveedor no encontrado" });
    }
    res.json({ success: true, proveedor });
  } catch (error) {
    next(error);
  }
};

export const eliminarProveedor = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findByIdAndDelete(req.params.id);
    if (!proveedor) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Proveedor no encontrado" });
    }
    // Also remove all orders for this supplier
    await PedidoProveedor.deleteMany({ proveedor: req.params.id });
    res.json({ success: true, mensaje: "Proveedor eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const obtenerPedidosProveedor = async (req, res, next) => {
  try {
    const pedidos = await PedidoProveedor.find({
      proveedor: req.params.id,
    })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, pedidos });
  } catch (error) {
    next(error);
  }
};

export const crearPedidoProveedor = async (req, res, next) => {
  try {
    const { items, notas } = req.body;
    const pedido = await PedidoProveedor.create({
      proveedor: req.params.id,
      items,
      notas,
    });
    // Update proveedor's ultimoPedido
    await Proveedor.findByIdAndUpdate(req.params.id, {
      ultimoPedido: new Date(),
    });
    res.status(201).json({ success: true, pedido });
  } catch (error) {
    next(error);
  }
};

export const actualizarPedidoProveedor = async (req, res, next) => {
  try {
    const { items, notas } = req.body;
    const pedido = await PedidoProveedor.findByIdAndUpdate(
      req.params.id,
      { items, notas },
      { new: true, runValidators: true },
    );
    if (!pedido) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Pedido no encontrado" });
    }
    res.json({ success: true, pedido });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoPedidoProveedor = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const pedido = await PedidoProveedor.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true },
    );
    if (!pedido) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Pedido no encontrado" });
    }
    res.json({ success: true, pedido });
  } catch (error) {
    next(error);
  }
};

export const eliminarPedidoProveedor = async (req, res, next) => {
  try {
    const pedido = await PedidoProveedor.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Pedido no encontrado" });
    }
    res.json({ success: true, mensaje: "Pedido eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const obtenerAlertas = async (req, res, next) => {
  try {
    const { alertas, resumen } = await obtenerAlertasConResumen();
    res.json({ success: true, alertas, resumen });
  } catch (error) {
    next(error);
  }
};

export const marcarAlertaLeida = async (req, res, next) => {
  try {
    const alerta = await Alerta.findByIdAndUpdate(
      req.params.id,
      { leida: true },
      { new: true },
    );
    if (!alerta) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Alerta no encontrada" });
    }
    res.json({ success: true, alerta });
  } catch (error) {
    next(error);
  }
};

export const marcarTodasAlertasLeidas = async (req, res, next) => {
  try {
    await Alerta.updateMany({ leida: { $ne: true } }, { leida: true });
    res.json({
      success: true,
      mensaje: "Todas las alertas marcadas como leídas",
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarAlerta = async (req, res, next) => {
  try {
    const alerta = await Alerta.findByIdAndDelete(req.params.id);
    if (!alerta) {
      return res
        .status(404)
        .json({ success: false, mensaje: "Alerta no encontrada" });
    }
    res.json({ success: true, mensaje: "Alerta eliminada" });
  } catch (error) {
    next(error);
  }
};
