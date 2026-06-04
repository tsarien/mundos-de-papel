import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la categoría es requerido"],
      unique: true,
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    descripcion: {
      type: String,
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    icono: {
      type: String,
      default: "ti-book",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

categoriaSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.nombre.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

const Categoria = mongoose.model("Categoria", categoriaSchema);
export default Categoria;
