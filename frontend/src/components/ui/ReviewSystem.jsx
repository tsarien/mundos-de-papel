import { formatearFecha } from "../../utils/formatters.js";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerResenas,
  agregarResena,
  marcarResenaUtil,
} from "../../services/resenaService";

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

  const avatarColors = [
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-yellow-100", text: "text-yellow-700" },
    { bg: "bg-red-100", text: "text-red-700" },
  ];

  const getAvatarStyle = (index) => {
    return avatarColors[index % avatarColors.length];
  };

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
    if (!valoracionId) return;

    try {
      const data = await marcarResenaUtil(productoId, valoracionId);

      setReviews(
        reviews.map((r) =>
          r._id === valoracionId
            ? { ...r, helpful: data.helpful, userHelpful: data.userHelpful }
            : r,
        ),
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
    <div className="w-full">
      <p className="text-xs text-accent-pink uppercase tracking-wider mb-6 font-bold">
        Calificaciones y reseñas
      </p>

      {error && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna izquierda: resumen + filtros + lista de reseñas */}
        <div className="lg:col-span-2">
          {/* Tarjeta de resumen */}
          <div className="glass-panel rounded-2xl p-6 mb-6 flex gap-8 items-center border border-white/5 text-white">
            <div className="text-center min-w-[90px]">
              <div className="text-5xl font-bold text-white">{avg}</div>
              <div className="flex gap-1 justify-center my-2">
                {renderStars(Math.round(parseFloat(avg)))}
              </div>
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">
                {total} {total === 1 ? "reseña" : "reseñas"}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = dist[stars - 1];
                const pct = total ? Math.round((count / total) * 100) : 0;
                return (
                  <div
                    key={stars}
                    className="flex items-center gap-2.5 text-xs text-gray-400 font-medium"
                  >
                    <span className="w-2 text-right">{stars}</span>
                    <span className="text-yellow-400">★</span>
                    <div className="flex-1 h-1.5 bg-[#13151b] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2.5 mb-6 flex-wrap">
            <button
              onClick={() => setActiveFilter(0)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                activeFilter === 0
                  ? "bg-accent-purple text-bg border-transparent shadow-md"
                  : "bg-[#232632] text-gray-300 border-white/5 hover:border-accent-purple/30 hover:text-white"
              }`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => setActiveFilter(stars)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                  activeFilter === stars
                    ? "bg-accent-purple text-bg border-transparent shadow-md"
                    : "bg-[#232632] text-gray-300 border-white/5 hover:border-accent-purple/30 hover:text-white"
                }`}
              >
                ★ {stars}
              </button>
            ))}
          </div>

          {/* Loading / Lista de reseñas */}
          {loading && !reviews.length ? (
            <div className="text-center py-12 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mx-auto mb-3"></div>
              Cargando reseñas...
            </div>
          ) : (
            <div>
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm glass-panel rounded-2xl border border-white/5">
                  <div className="text-3xl mb-2">📭</div>
                  No hay reseñas para este filtro.
                </div>
              ) : (
                filteredReviews.map((review, index) => {
                  const style = getAvatarStyle(index);
                  return (
                    <div
                      key={review._id || index}
                      className="glass-panel rounded-2xl p-5 mb-4 border border-white/5 text-white"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-9 h-9 rounded-full ${style.bg} ${style.text} flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm`}
                        >
                          {review.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {review.nombre}
                            </span>
                            {review.verificada && (
                              <span className="bg-green-500/10 text-accent-green border border-accent-green/20 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                Compra verificada
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">
                            {formatearFecha(review.fecha)}
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {renderStars(review.puntuacion)}
                        </div>
                      </div>

                      <div className="text-sm text-gray-300 leading-relaxed mt-2.5 pl-0.5">
                        {review.comentario}
                      </div>

                      <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-white/5">
                        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          ¿Útil?
                        </span>
                        <button
                          onClick={() => toggleHelpful(review._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-all cursor-pointer ${
                            review.userHelpful
                              ? "border-accent-green/30 text-accent-green bg-accent-green/10"
                              : "border-white/10 text-gray-300 bg-bg/50 hover:bg-bg hover:text-white"
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
        </div>

        {/* Columna derecha: formulario sticky */}
        <div className="lg:sticky lg:top-8">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 text-white">
            <div className="text-base font-bold text-white mb-4 border-b border-white/5 pb-2.5">
              Escribe una reseña
            </div>

            {!isAuthenticated && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 rounded-xl p-4 mb-4 text-xs font-semibold">
                Debes iniciar sesión para escribir una reseña
              </div>
            )}

            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  disabled={!isAuthenticated}
                  className={`text-3xl transition-all cursor-pointer ${
                    star <= selectedRating
                      ? "text-yellow-400 scale-110"
                      : "text-gray-600"
                  } hover:text-yellow-400 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed`}
                  aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-accent-purple uppercase tracking-wider mb-2">
                Tu nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej. María García"
                disabled={!isAuthenticated}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-white/10 premium-input disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-accent-purple uppercase tracking-wider mb-2">
                Comentario
              </label>
              <textarea
                value={formData.comentario}
                onChange={(e) =>
                  setFormData({ ...formData, comentario: e.target.value })
                }
                placeholder="¿Qué te pareció el producto?"
                rows={4}
                disabled={!isAuthenticated}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-white/10 premium-input resize-none disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={submitReview}
              disabled={!isFormValid || loading}
              className="w-full bg-gradient-to-r from-accent-blue to-accent-purple text-bg font-bold py-2.5 px-6 rounded-xl hover:from-accent-pink hover:to-accent-purple hover:text-white hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-1 border-none cursor-pointer"
            >
              {loading ? "Publicando..." : "Publicar reseña"}
            </button>

            {showSuccess && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-accent-green px-4 py-2.5 rounded-lg mt-4 text-sm font-semibold">
                <span>✓</span> ¡Tu reseña fue publicada exitosamente!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSystem;
