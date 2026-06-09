import mongoose from "mongoose";
const { Schema } = mongoose;

const itemPedidoProveedorSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, default: 0 },
  },
  { _id: false },
);

const pedidoProveedorSchema = new Schema(
  {
    proveedor: {
      type: Schema.Types.ObjectId,
      ref: "Proveedor",
      required: true,
    },
    items: {
      type: [itemPedidoProveedorSchema],
      default: [],
      validate: {
        validator: (v) => v.length > 0,
        message: "El pedido debe tener al menos un producto",
      },
    },
    total: { type: Number, default: 0 },
    estado: {
      type: String,
      enum: ["activo", "en_proceso", "incompleto", "cancelado"],
      default: "activo",
    },
    notas: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

pedidoProveedorSchema.pre("validate", function (next) {
  let total = 0;
  this.items.forEach((item) => {
    item.subtotal = item.cantidad * item.precioUnitario;
    total += item.subtotal;
  });
  this.total = total;
  next();
});

export default mongoose.model("PedidoProveedor", pedidoProveedorSchema);
