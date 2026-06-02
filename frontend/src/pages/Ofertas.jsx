import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { obtenerProductos } from "../services/productoService";

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroDescuento, setFiltroDescuento] = useState("");

  useEffect(() => {
    cargarOfertas();
  }, [filtroCategoria, filtroDescuento]);

  const cargarOfertas = async () => {
    try {
      setLoading(true);
      const data = await obtenerProductos({
        enOferta: true,
        categoria: filtroCategoria || undefined,
      });

      // Filtro de descuento mínimo (se aplica en el frontend
      // porque el backend no filtra por descuento mínimo aún)
      let resultado = data.productos;
      if (filtroDescuento) {
        resultado = resultado.filter(
          (p) => p.descuento >= parseInt(filtroDescuento),
        );
      }

      setProductos(resultado);
      setError(null);
    } catch (err) {
      setError("Error al cargar las ofertas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mb-10 container mx-auto px-4 max-w-7xl pt-10">
      <h1 className="font-poppins text-4xl font-bold text-accent-pink mb-9 text-center">
        Ofertas Especiales
      </h1>

      {/* Banner promocional */}
      <section className="bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl shadow-lg mb-10 py-10 px-6 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-poppins text-3xl font-bold mb-4">
            ¡Descuentos de hasta{" "}
            <span className="text-accent-blue text-4xl font-bold">40%</span> en
            tus libros favoritos!
          </h2>
          <p className="text-lg text-gray-200">
            Promociones por tiempo limitado en manga, cómics y libros de arte.
            ¡No te lo pierdas!
          </p>
        </div>
      </section>

      {/* Filtros superiores */}
      <form className="flex gap-5 justify-center items-center mb-9 flex-wrap">
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="py-3 px-5 rounded-xl border border-white/10 text-base bg-[#232632]/80 text-white focus:border-accent-pink outline-none transition-all cursor-pointer"
          aria-label="Categoría"
        >
          <option value="" className="bg-[#232632] text-white">
            Categoría
          </option>
          <option value="Manga" className="bg-[#232632] text-white">
            Manga
          </option>
          <option value="Cómic" className="bg-[#232632] text-white">
            Cómic
          </option>
          <option value="Arte" className="bg-[#232632] text-white">
            Arte
          </option>
        </select>

        <select
          value={filtroDescuento}
          onChange={(e) => setFiltroDescuento(e.target.value)}
          className="py-3 px-5 rounded-xl border border-white/10 text-base bg-[#232632]/80 text-white focus:border-accent-pink outline-none transition-all cursor-pointer"
          aria-label="Porcentaje de descuento"
        >
          <option value="" className="bg-[#232632] text-white">
            Descuento
          </option>
          <option value="10" className="bg-[#232632] text-white">
            10% o más
          </option>
          <option value="20" className="bg-[#232632] text-white">
            20% o más
          </option>
          <option value="30" className="bg-[#232632] text-white">
            30% o más
          </option>
        </select>
      </form>

      {/* Productos en oferta */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-400">Cargando ofertas...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-red-400">{error}</p>
            <button
              onClick={cargarOfertas}
              className="mt-4 bg-accent-purple text-white py-2 px-6 rounded-lg hover:bg-accent-pink transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : productos.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-400">
              No hay productos en oferta con estos filtros
            </p>
          </div>
        ) : (
          productos.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))
        )}
      </section>
    </main>
  );
};

export default Ofertas;
