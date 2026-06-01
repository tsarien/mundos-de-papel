import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  obtenerResenas,
  agregarResena,
  marcarResenaUtil,
} from "../services/resenaService";

const ReviewSystem = ({ productoId, resenasIniciales = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState(resenasIniciales);
  const [selectedRating, setSelectedRating] = useState(0);
  const [activeFilter, setActiveFilter] = useState(0);
  const [formData, setFormData] = useState({ nombre: "", comentario: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        nombre: `${user.nombre} ${user.apellido}`,
      }));
    }
  }, [isAuthenticated, user]);

  const cargarResenas = async () => {
    try {
      setLoading(true);
      const data = await obtenerResenas(productoId, activeFilter);
      setReviews(data.valoraciones);
      setError(null);
    } catch (err) {
      console.error("Error al cargar reseñas:", err);
      setError("Error al cargar las reseñas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productoId) {
      cargarResenas();
    }
  }, [productoId, activeFilter]);

  // Colores para avatares
  const avatarColors = [
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-yellow-100", text: "text-yellow-700" },
    { bg: "bg-red-100", text: "text-red-700" },
  ];

  // Usa el índice del array en vez del id para evitar undefined
  const getAvatarStyle = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  // Formatear fecha ISO de MongoDB a texto legible
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calcular estadísticas
  const calcStats = () => {
    const total = reviews.length;
    const sum = reviews.reduce((a, r) => a + r.puntuacion, 0);
    const avg = total ? (sum / total).toFixed(1) : "0.0";
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => dist[r.puntuacion - 1]++);
    return { total, avg, dist };
  };

  const { total, avg, dist } = calcStats();

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-base ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        {i < rating ? "★" : "☆"}
      </span>
    ));
  };

  const filteredReviews =
    activeFilter === 0
      ? reviews
      : reviews.filter((r) => r.puntuacion === activeFilter);

  const toggleHelpful = async (valoracionId) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para marcar reseñas como útiles");
      return;
    }

    try {
      const data = await marcarResenaUtil(productoId, valoracionId);

      // Actualizar estado local usando _id
      setReviews(
        reviews.map((r) =>
          r._id === valoracionId
            ? { ...r, helpful: data.helpful, userHelpful: data.userHelpful }
            : r
        )
      );
    } catch (err) {
      console.error("Error al marcar como útil:", err);
      alert("Error al marcar la reseña como útil");
    }
  };

  const submitReview = async () => {
    if (!formData.nombre || !formData.comentario || !selectedRating) return;

    if (!isAuthenticated) {
      alert("Debes iniciar sesión para escribir una reseña");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const datos = {
        puntuacion: selectedRating,
        comentario: formData.comentario,
        nombre: formData.nombre,
      };

      await agregarResena(productoId, datos);

      setFormData({
        nombre: isAuthenticated ? `${user.nombre} ${user.apellido}` : "",
        comentario: "",
      });
      setSelectedRating(0);
      setShowSuccess(true);
      setActiveFilter(0);

      await cargarResenas();

      setTimeout(() => setShowSuccess(false), 3500);
    } catch (err) {
      console.error("Error al enviar reseña:", err);
      setError(err.mensaje || "Error al publicar la reseña");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.nombre.trim() && formData.comentario.trim() && selectedRating > 0;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">
        Calificaciones y reseñas
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Tarjeta de resumen */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 flex gap-8 items-center">
        <div className="text-center min-w-[90px]">
          <div className="text-5xl font-medium text-gray-900">{avg}</div>
          <div className="flex gap-1 justify-center my-2">
            {renderStars(Math.round(parseFloat(avg)))}
          </div>
          <div className="text-sm text-gray-500">
            {total} {total === 1 ? "reseña" : "reseñas"}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = dist[stars - 1];
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2 text-right">{stars}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActiveFilter(0)}
          className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
            activeFilter === 0
              ? "bg-gray-900 text-white border-transparent"
              : "bg-white text-gray-600 border-gray-300 hover:border-gray-900 hover:text-gray-900"
          }`}
        >
          Todas
        </button>
        {[5, 4, 3, 2, 1].map((stars) => (
          <button
            key={stars}
            onClick={() => setActiveFilter(stars)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-all ${
              activeFilter === stars
                ? "bg-gray-900 text-white border-transparent"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-900 hover:text-gray-900"
            }`}
          >
            ★ {stars}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && !reviews.length ? (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          Cargando reseñas...
        </div>
      ) : (
        <div className="mb-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <div className="text-2xl mb-2">📭</div>
              No hay reseñas para este filtro.
            </div>
          ) : (
            // ✅ Usa index para el color del avatar y _id para key y acciones
            filteredReviews.map((review, index) => {
              const style = getAvatarStyle(index);
              return (
                <div
                  key={review._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 mb-3"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-9 h-9 rounded-full ${style.bg} ${style.text} flex items-center justify-center text-sm font-medium flex-shrink-0`}
                    >
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {review.nombre}
                        </span>
                        {review.verificada && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            Compra verificada
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatearFecha(review.fecha)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(review.puntuacion)}
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 leading-relaxed mt-2">
                    {review.comentario}
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">¿Útil?</span>
                    <button
                      onClick={() => toggleHelpful(review._id)}
                      className={`flex items-center gap-1.5 px-3 py-1 text-xs border rounded-lg transition-all ${
                        review.userHelpful
                          ? "border-green-500 text-green-700 bg-green-50"
                          : "border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>👍</span> {review.helpful}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Formulario de nueva reseña */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
        <div className="text-base font-medium text-gray-900 mb-4">
          Escribe una reseña
        </div>

        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4 text-sm">
            Debes iniciar sesión para escribir una reseña
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              disabled={!isAuthenticated}
              className={`text-3xl transition-all ${
                star <= selectedRating ? "text-yellow-400 scale-110" : "text-gray-300"
              } hover:text-yellow-400 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>

        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1.5">Tu nombre</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Ej. María García"
            disabled={!isAuthenticated}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs text-gray-600 mb-1.5">Comentario</label>
          <textarea
            value={formData.comentario}
            onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
            placeholder="¿Qué te pareció el producto?"
            rows={3}
            disabled={!isAuthenticated}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={submitReview}
          disabled={!isFormValid || loading}
          className="bg-gray-900 text-white px-6 py-2.5 text-sm font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          {loading ? "Publicando..." : "Publicar reseña"}
        </button>

        {showSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg mt-3 text-sm">
            <span>✓</span> ¡Tu reseña fue publicada exitosamente!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
