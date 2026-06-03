// Helper de Cloudinary (extraído de productoController)
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary (debe estar configurada en cloudinary.config)
const FOLDER = "mundos-de-papel/productos";

/**
 * Sube un buffer a Cloudinary
 * @param {Buffer} buffer - Buffer de la imagen
 * @param {string} publicId - ID público para la imagen
 * @returns {Promise<object>} Resultado de Cloudinary
 */
export const subirACloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: FOLDER,
          public_id: publicId,
          overwrite: true,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });
};

/**
 * Renombra una imagen en Cloudinary
 * @param {string} oldPublicId - ID público actual
 * @param {string} newPublicId - Nuevo ID público
 * @returns {Promise<void>}
 */
export const renombrarImagen = async (oldPublicId, newPublicId) => {
  try {
    await cloudinary.uploader.rename(oldPublicId, newPublicId, {
      overwrite: true,
    });
  } catch (error) {
    // No crítico, solo log
    console.warn("No se pudo renombrar imagen en Cloudinary:", error.message);
  }
};

/**
 * Elimina una imagen de Cloudinary
 * @param {string} publicId - ID público de la imagen
 * @returns {Promise<void>}
 */
export const eliminarImagen = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
  }
};
