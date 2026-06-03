import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    contacto: {
      type: String,
      required: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
      default: "",
    },
    productos: {
      type: Number,
      default: 0,
      min: 0,
    },
    ultimoPedido: Date,
    estado: {
      type: String,
      enum: ["activo", "pendiente"],
      default: "activo",
    },
  },
  { timestamps: true },
);

const Proveedor = mongoose.model("Proveedor", proveedorSchema);

export default Proveedor;
