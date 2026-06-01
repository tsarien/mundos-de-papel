import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categorias, editoriales } from "../data/productos";
import { obtenerProductos } from "../services/productoService";

const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({
    categorias: [],
    autor: "",
    editorial: "",
    precioMin: "",
    precioMax: "",
  });

  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    if (categoriaParam) {
      setFiltros((prev) => ({ ...prev, categorias: [categoriaParam] }));
    }
  }, [searchParams]);

  useEffect(() => {
    cargarProductos();
  }, [busqueda, filtros]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const filtrosAPI = {
        busqueda,
        categoria: filtros.categorias[0],
        autor: filtros.autor,
        editorial: filtros.editorial,
        precioMin: filtros.precioMin,
        precioMax: filtros.precioMax,
      };
      const data = await obtenerProductos(filtrosAPI);
      setProductos(data.productos);
      setError(null);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (categoria) => {
    setFiltros((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter((c) => c !== categoria)
        : [...prev.categorias, categoria],
    }));
  };

  const handleBusqueda = (e) => {
    e.preventDefault();
  };

  return (
    <main className="mt-[94px] mb-10 container mx-auto px-4 max-w-7xl">
      <h1 className="font-poppins text-4xl font-bold text-accent-purple mb-9 text-center">
        Catálogo de Libros
      </h1>

      {/* Barra de búsqueda */}
      <form
        onSubmit={handleBusqueda}
        className="flex items-center justify-center gap-2 mb-9"
      >
        <input
          type="search"
          placeholder="Buscar libros, autores, editoriales..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="py-3 px-5 rounded-2xl border-2 border-gray-300 text-base outline-none bg-white text-gray-800 w-80 focus:border-accent-pink transition-colors"
          aria-label="Buscar libros"
        />
        <button
          type="submit"
          className="bg-accent-purple border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer hover:bg-accent-pink transition-colors"
          aria-label="Buscar"
        >
          <span className="text-white text-xl">🔍</span>
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Filtros laterales */}
        <aside className="bg-white rounded-2xl shadow-md p-8 min-w-[220px] max-w-[260px] w-full lg:sticky lg:top-24">
          <h2 className="font-poppins text-lg font-bold text-accent-pink mb-5">
            Filtrar por
          </h2>

          {/* Categoría */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-base font-semibold text-accent-purple mb-1">
              Categoría
            </span>
            {categorias.map((cat) => (
              <label
                key={cat.id}
                className="text-base text-gray-700 font-medium cursor-pointer flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={filtros.categorias.includes(cat.slug)}
                  onChange={() => handleCategoriaChange(cat.slug)}
                  className="cursor-pointer"
                />
                {cat.nombre}
              </label>
            ))}
          </div>

          {/* Autor */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-base font-semibold text-accent-purple mb-1">
              Autor
            </span>
            <input
              type="text"
              placeholder="Nombre del autor"
              value={filtros.autor}
              onChange={(e) =>
                setFiltros({ ...filtros, autor: e.target.value })
              }
              className="py-2 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1"
            />
          </div>

          {/* Editorial */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-base font-semibold text-accent-purple mb-1">
              Editorial
            </span>
            <select
              value={filtros.editorial}
              onChange={(e) =>
                setFiltros({ ...filtros, editorial: e.target.value })
              }
              className="py-2 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800 mt-1"
            >
              <option value="">Todas</option>
              {editoriales.map((ed) => (
                <option key={ed.id} value={ed.nombre}>
                  {ed.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-base font-semibold text-accent-purple mb-1">
              Precio
            </span>
            <input
              type="number"
              placeholder="$ Min"
              value={filtros.precioMin}
              onChange={(e) =>
                setFiltros({ ...filtros, precioMin: e.target.value })
              }
              className="py-2 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800"
            />
            <input
              type="number"
              placeholder="$ Max"
              value={filtros.precioMax}
              onChange={(e) =>
                setFiltros({ ...filtros, precioMax: e.target.value })
              }
              className="py-2 px-4 rounded-lg border border-gray-300 text-base bg-gray-100 text-gray-800"
            />
          </div>
        </aside>

        {/* Resultados */}
        <section className="flex-1 min-w-0">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-400">{error}</p>
              <button
                onClick={cargarProductos}
                className="mt-4 bg-accent-purple text-white py-2 px-6 rounded-lg hover:bg-accent-pink transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">
                No se encontraron productos
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productos.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>

              {/* Paginación (placeholder) */}
              <nav className="flex gap-2 justify-center items-center mt-10">
                <button className="bg-gray-200 text-gray-700 border-none rounded-lg py-3 px-5 font-semibold cursor-pointer hover:bg-accent-purple hover:text-white transition-all">
                  1
                </button>
                <button className="bg-gray-200 text-gray-700 border-none rounded-lg py-3 px-5 font-semibold cursor-pointer hover:bg-accent-purple hover:text-white transition-all">
                  2
                </button>
                <button className="bg-gray-200 text-gray-700 border-none rounded-lg py-3 px-5 font-semibold cursor-pointer hover:bg-accent-purple hover:text-white transition-all">
                  3
                </button>
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Catalogo;
