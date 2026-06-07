import cloudinary from "../config/cloudinary.js";

const FOLDER = "productos";

/**
 * @param {Buffer} buffer
 * @param {string} publicId
 * @returns {Promise<object>}
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
 * @param {string} oldPublicId
 * @param {string} newPublicId
 * @returns {Promise<void>}
 */
export const renombrarImagen = async (oldPublicId, newPublicId) => {
  try {
    await cloudinary.uploader.rename(oldPublicId, newPublicId, {
      overwrite: true,
    });
  } catch (error) {
    console.warn("No se pudo renombrar imagen en Cloudinary:", error.message);
  }
};

/**
 * @param {string} publicId
 * @returns {Promise<void>}
 */
export const eliminarImagen = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
  }
};
