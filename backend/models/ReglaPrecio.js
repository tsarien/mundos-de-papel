import mongoose from "mongoose";

const reglaPrecioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      enum: ["Porcentaje", "Fijo"],
      required: true,
    },
    valor: {
      type: String,
      required: true,
    },
    condicion: {
      type: String,
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const ReglaPrecio = mongoose.model("ReglaPrecio", reglaPrecioSchema);

export default ReglaPrecio;
