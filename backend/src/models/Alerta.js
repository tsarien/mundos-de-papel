import mongoose from "mongoose";

const alertaSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["critico", "advertencia", "info"],
      required: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    mensaje: {
      type: String,
      required: true,
      trim: true,
    },
    icono: {
      type: String,
      default: "ti-bell",
    },
    accion: {
      type: String,
      default: "Revisar",
    },
    leida: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Alerta = mongoose.model("Alerta", alertaSchema);

export default Alerta;
