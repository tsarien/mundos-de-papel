import multer from "multer";

// Guardar el archivo en memoria (buffer) para luego enviarlo a Cloudinary
const storage = multer.memoryStorage();

// Solo permitir imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

export default upload;
