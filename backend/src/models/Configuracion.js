import mongoose from "mongoose";

const configuracionSchema = new mongoose.Schema(
  {
    clave: {
      type: String,
      unique: true,
      default: "general",
    },
    tienda: {
      nombre: { type: String, default: "Mundos de Papel" },
      email: { type: String, default: "contacto@mundosdepapel.com" },
      telefono: { type: String, default: "+57 300 123 4567" },
      direccion: { type: String, default: "Calle 45 #67-89, Bogotá" },
    },
    pedidos: {
      pedidoMinimo: { type: Number, default: 30000 },
      envioGratisDesde: { type: Number, default: 100000 },
      costoEnvio: { type: Number, default: 10000 },
      iva: { type: Number, default: 19 },
    },
    inventario: {
      umbralStockBajo: { type: Number, default: 5 },
      umbralStockCritico: { type: Number, default: 2 },
    },
    metodosPago: [
      {
        nombre: String,
        activo: { type: Boolean, default: true },
      },
    ],
    notificaciones: [
      {
        nombre: String,
        desc: String,
        activo: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true },
);

const Configuracion = mongoose.model("Configuracion", configuracionSchema);

export default Configuracion;
