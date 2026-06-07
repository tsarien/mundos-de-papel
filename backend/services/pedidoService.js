import Pedido from "../models/Pedido.js";
import Product from "../models/Product.js";
import { aplicarReglasAProducto } from "../utils/aplicarReglasPrecios.js";
import { calcularPrecioFinal } from "../utils/formatters.js";
import { obtenerConfigEnvio } from "./configService.js";

/**
 * @param {Array} items
 * @returns {Promise<object>}
 */
export const procesarItemsPedido = async (items) => {
  const itemsProcesados = [];
  let descuentoTotal = 0;

  for (const item of items) {
    const productoRaw = await Product.findById(item.producto);
    if (!productoRaw)
      throw new Error(`Producto ${item.producto} no encontrado`);
    if (productoRaw.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para ${productoRaw.nombre}`);
    }

    const producto = await aplicarReglasAProducto(productoRaw);
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

    producto.stock -= item.cantidad;
    await producto.save();
  }

  return { itemsProcesados, descuentoTotal };
};

/**
 * @param {number} subtotal
 * @param {number} descuentoTotal
 * @returns {Promise<object>}
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
 * @param {string} usuarioId
 * @param {object} datosPedido
 * @returns {Promise<object>}
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
 * @param {object} pedido
 * @param {string} motivo
 * @returns {Promise<object>}
 */
export const cancelarPedidoConStock = async (pedido, motivo) => {
  for (const item of pedido.items) {
    const producto = await Product.findById(item.producto);
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
