import Pedido from "../models/Pedido.js";
import Producto from "../models/Producto.js";
import { calcularPrecioFinal } from "../utils/formateadores.js";
import { obtenerConfigEnvio } from "./configService.js";

/**
 * Procesa los items de un pedido y verifica stock
 * @param {Array} items - Items del pedido
 * @returns {Promise<object>} Items procesados y descuento total
 */
export const procesarItemsPedido = async (items) => {
  const itemsProcesados = [];
  let descuentoTotal = 0;

  for (const item of items) {
    const producto = await Producto.findById(item.producto);

    if (!producto) {
      throw new Error(`Producto ${item.producto} no encontrado`);
    }

    if (producto.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }

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
      subtotal,
    });

    // Reducir stock
    producto.stock -= item.cantidad;
    await producto.save();
  }

  return { itemsProcesados, descuentoTotal };
};

/**
 * Calcula los totales de un pedido
 * @param {number} subtotal - Subtotal del pedido
 * @param {number} descuentoTotal - Descuento total aplicado
 * @returns {Promise<object>} Totales calculados
 */
export const calcularTotalesPedido = async (subtotal, descuentoTotal = 0) => {
  const configEnvio = await obtenerConfigEnvio();
  const costoEnvio =
    subtotal >= configEnvio.envioGratisDesde ? 0 : configEnvio.costoEnvio;
  const iva = subtotal * (configEnvio.iva / 100);
  const total = subtotal + iva + costoEnvio - descuentoTotal;

  return { subtotal, iva, total, descuentoTotal, costoEnvio };
};

/**
 * Crea un nuevo pedido
 * @param {string} usuarioId - ID del usuario
 * @param {object} datosPedido - Datos del pedido
 * @returns {Promise<object>} Pedido creado
 */
export const crearNuevoPedido = async (usuarioId, datosPedido) => {
  const { items, direccionEnvio, metodoPago, notas } = datosPedido;

  const { itemsProcesados, descuentoTotal } = await procesarItemsPedido(items);
  const subtotalPedido = itemsProcesados.reduce(
    (acc, item) => acc + item.subtotal,
    0,
  );
  const totales = await calcularTotalesPedido(subtotalPedido, descuentoTotal);

  const pedido = await Pedido.create({
    usuario: usuarioId,
    items: itemsProcesados,
    direccionEnvio,
    metodoPago,
    descuentoTotal,
    notas,
    ...totales,
  });

  pedido.agregarHistorial("procesando", "Pedido creado");
  await pedido.save();
  await pedido.populate("items.producto", "nombre imagen");

  return pedido;
};

/**
 * Cancela un pedido y restaura stock
 * @param {object} pedido - Pedido a cancelar
 * @param {string} motivo - Motivo de cancelación
 * @returns {Promise<object>} Pedido cancelado
 */
export const cancelarPedidoConStock = async (pedido, motivo) => {
  // Restaurar stock
  for (const item of pedido.items) {
    const producto = await Producto.findById(item.producto);
    if (producto) {
      producto.stock += item.cantidad;
      await producto.save();
    }
  }

  pedido.estado = "cancelado";
  pedido.agregarHistorial("cancelado", motivo || "Cancelado por el usuario");
  await pedido.save();

  return pedido;
};
