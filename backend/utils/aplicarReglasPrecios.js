import ReglaPrecio from "../models/ReglaPrecio.js";

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
      return true;

    case "Compras superiores a $100.000":
    case "Compras superiores a $200.000":
    case "Clientes VIP":
      return false;

    default:
      return false;
  }
};

/**
 * @param {Array} productos
 * @returns {Promise<Array>}
 */
export const aplicarReglasAProductos = async (productos) => {
  if (!productos || productos.length === 0) return productos;

  const reglas = await ReglaPrecio.find({ activo: true }).lean();

  return productos.map((p) => {
    const prod = p.toObject ? p.toObject() : { ...p };

    prod.enOferta = false;
    prod.descuento = 0;
    delete prod._descuentoDeRegla;
    delete prod._reglaId;

    if (!reglas.length) return prod;

    for (const regla of reglas) {
      if (!condicionAplica(regla.condicion, prod)) continue;

      const valorNum = Number(regla.valor);
      if (isNaN(valorNum) || valorNum <= 0) continue;

      let descuentoRegla;

      if (regla.tipo === "Porcentaje") {
        descuentoRegla = Math.min(valorNum, 100);
      } else {
        descuentoRegla =
          prod.precio > 0 ? Math.round((valorNum / prod.precio) * 100) : 0;
      }

      if (!prod.enOferta || descuentoRegla > prod.descuento) {
        prod.enOferta = true;
        prod.descuento = descuentoRegla;
        prod._descuentoDeRegla = true;
        prod._reglaId = regla._id;
      }

      break;
    }

    return prod;
  });
};

/**
 *
 * @param {Object} producto
 * @returns {Promise<Object>}
 */
export const aplicarReglasAProducto = async (producto) => {
  const [resultado] = await aplicarReglasAProductos([producto]);
  return resultado;
};
