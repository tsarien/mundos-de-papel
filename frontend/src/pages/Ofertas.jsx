import { useState, useEffect } from "react";
import ChatBot from "../components/chatbot/Chatbot";
import ProductCard from "../components/ui/ProductCard";
import { obtenerProductos } from "../services/productoService";
import { obtenerCategorias } from "../services/catalogoService";
import { TbTag, TbTagOff, TbFilterOff } from "react-icons/tb";

const SinOfertas = ({ hayFiltros, onLimpiar }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 px-6">
    <div className="glass-panel rounded-3xl border border-white/8 p-12 max-w-md w-full flex flex-col items-center gap-6 relative overflow-hidden">
      {/* glow de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-pink/5 pointer-events-none" />

      {/* icono */}
      <div className="relative z-10 p-5 rounded-2xl bg-gradient-to-br from-accent-purple/15 to-accent-pink/15 border border-white/10">
        <TbTagOff size={48} className="text-accent-purple/70" />
      </div>

      {/* textos */}
      <div className="relative z-10 text-center flex flex-col gap-2">
        <h3 className="font-poppins text-xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
          {hayFiltros ? "Sin resultados" : "No hay ofertas activas"}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {hayFiltros
            ? "Ningún producto coincide con los filtros seleccionados. Prueba cambiando la categoría o el porcentaje de descuento."
            : "En este momento no hay promociones disponibles. ¡Vuelve pronto para no perderte las próximas ofertas!"}
        </p>
      </div>

      {/* botón limpiar filtros (solo si hay filtros activos) */}
      {hayFiltros && (
        <button
          onClick={onLimpiar}
          className="relative z-10 flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-accent-purple/15 text-accent-purple border border-accent-purple/25 hover:bg-accent-purple hover:text-white transition-all"
        >
          <TbFilterOff size={14} />
          Limpiar filtros
        </button>
      )}

      {/* línea decorativa inferior */}
      <div className="relative z-10 w-16 h-0.5 rounded-full bg-gradient-to-r from-accent-purple/40 to-accent-pink/40" />
    </div>
  </div>
);

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroDescuento, setFiltroDescuento] = useState("");

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const cats = await obtenerCategorias();
        setCategorias(cats);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    cargarCategorias();
  }, []);

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

      let resultado = data.productos.filter((p) => p.enOferta);

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

  const limpiarFiltros = () => {
    setFiltroCategoria("");
    setFiltroDescuento("");
  };

  const hayFiltros = filtroCategoria !== "" || filtroDescuento !== "";

  return (
    <main className="mb-10 container mx-auto px-4 max-w-7xl pt-10">
      <h1 className="font-poppins text-4xl font-bold text-accent-pink mb-9 text-center flex items-center justify-center gap-3">
        <TbTag size={38} className="text-accent-pink" />
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
      <div className="flex gap-5 justify-center items-center mb-9 flex-wrap">
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="py-3 px-5 rounded-xl border border-white/10 text-base bg-[#232632]/80 text-white focus:border-accent-pink outline-none transition-all cursor-pointer"
          aria-label="Categoría"
        >
          <option value="" className="bg-[#232632] text-white">
            Categoría
          </option>
          {categorias.map((cat) => (
            <option
              key={cat._id}
              value={cat._id}
              className="bg-[#232632] text-white"
            >
              {cat.nombre}
            </option>
          ))}
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

        {hayFiltros && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent-pink transition-colors"
          >
            <TbFilterOff size={16} />
            Limpiar
          </button>
        )}
      </div>

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
          <SinOfertas hayFiltros={hayFiltros} onLimpiar={limpiarFiltros} />
        ) : (
          productos.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))
        )}
      </section>

      <ChatBot />
    </main>
  );
};

export default Ofertas;
