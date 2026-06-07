/**
 * aplicarReglasPrecios.js
 * backend/utils/aplicarReglasPrecios.js
 *
 * Aplica las ReglaPrecio activas a un array de productos en memoria (no modifica
 * la BD). El resultado es que cada producto muestra el descuento correcto al
 * frontend, usando exactamente los mismos campos (enOferta, descuento) que ya
 * utiliza ProductCard, Catalogo, Ofertas y ProductoDetalle.
 */
import ReglaPrecio from "../models/ReglaPrecio.js";

// Mapea los valores del dropdown CONDICIONES_OFERTA a predicados sobre el producto.
// Condiciones de carrito (superiores a $X, Clientes VIP) no se evalúan a nivel
// de producto — se aplican en el checkout dentro de pedidoService.
const condicionAplica = (condicion, producto) => {
  const cat = (producto.categoria?.nombre || "").toLowerCase().trim();

  switch (condicion) {
    case "Todos los productos":
      return true;

    case "Solo Manga":
      return cat === "manga";

    case "Solo Cómic":
      return cat === "cómic" || cat === "comic";

    case "Solo Arte":
      return cat === "arte";

    case "Temporada especial":
      // Regla global de temporada: aplica a todo mientras esté activa
      return true;

    // Las siguientes se evalúan sólo en el carrito/pedido, no en el catálogo
    case "Compras superiores a $100.000":
    case "Compras superiores a $200.000":
    case "Clientes VIP":
      return false;

    default:
      return false;
  }
};

/**
 * Recibe un array de documentos Mongoose (o plain objects) y devuelve
 * plain objects con enOferta / descuento ajustados según las reglas activas.
 *
 * @param {Array} productos  - Array de Product documents o plain objects
 * @returns {Promise<Array>} - Plain objects con precios ajustados
 */
export const aplicarReglasAProductos = async (productos) => {
  if (!productos || productos.length === 0) return productos;

  const reglas = await ReglaPrecio.find({ activo: true }).lean();
  if (!reglas.length) {
    // No hay reglas activas; devolver como plain objects igual
    return productos.map((p) => (p.toObject ? p.toObject() : p));
  }

  return productos.map((p) => {
    const prod = p.toObject ? p.toObject() : { ...p };

    for (const regla of reglas) {
      if (!condicionAplica(regla.condicion, prod)) continue;

      const valorNum = Number(regla.valor);
      if (isNaN(valorNum) || valorNum <= 0) continue;

      let descuentoRegla;

      if (regla.tipo === "Porcentaje") {
        descuentoRegla = Math.min(valorNum, 100); // cap at 100%
      } else {
        // Fijo: convert to percentage for uniform frontend handling
        descuentoRegla =
          prod.precio > 0 ? Math.round((valorNum / prod.precio) * 100) : 0;
      }

      // Apply only if this rule gives a BETTER discount than the existing one
      if (!prod.enOferta || descuentoRegla > (prod.descuento || 0)) {
        prod.enOferta = true;
        prod.descuento = descuentoRegla;
        // Tag so the frontend can differentiate if needed in the future
        prod._descuentoDeRegla = true;
        prod._reglaId = regla._id;
      }

      // First matching rule wins (rules are fetched sorted by createdAt desc
      // so newest rule takes priority — adjust the .find() sort if needed)
      break;
    }

    return prod;
  });
};

/**
 * Versión para un solo producto (útil en pedidoService).
 *
 * @param {Object} producto - Mongoose document o plain object
 * @returns {Promise<Object>} - Plain object con precio ajustado
 */
export const aplicarReglasAProducto = async (producto) => {
  const [resultado] = await aplicarReglasAProductos([producto]);
  return resultado;
};
