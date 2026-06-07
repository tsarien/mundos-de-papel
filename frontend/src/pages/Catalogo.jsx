import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ChatBot from "../components/chatbot/Chatbot";
import ProductCard from "../components/ui/ProductCard";
import { obtenerProductos } from "../services/productoService";
import {
  obtenerCategorias,
  obtenerEditoriales,
} from "../services/catalogoService";
import { TbSearch } from "react-icons/tb";

const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(() => ({
    categorias: searchParams.get("categoria")
      ? [searchParams.get("categoria")]
      : [],
    autor: "",
    editorial: "",
    precioMin: "",
    precioMax: "",
  }));

  useEffect(() => {
    const cargarFiltros = async () => {
      try {
        const [cats, edits] = await Promise.all([
          obtenerCategorias(),
          obtenerEditoriales(),
        ]);
        setCategorias(cats);
        setEditoriales(edits);
      } catch (err) {
        console.error("Error al cargar filtros:", err);
      }
    };
    cargarFiltros();
  }, []);

  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    setFiltros((prev) => ({
      ...prev,
      categorias: categoriaParam ? [categoriaParam] : [],
    }));
  }, [searchParams]);

  useEffect(() => {
    cargarProductos();
  }, [busqueda, filtros]);

  const cargarProductos = async () => {
    try {
      setLoading(true);

      if (filtros.categorias.length > 1) {
        const peticiones = filtros.categorias.map((catId) =>
          obtenerProductos({
            busqueda,
            categoria: catId,
            autor: filtros.autor,
            editorial: filtros.editorial,
            precioMin: filtros.precioMin,
            precioMax: filtros.precioMax,
          }),
        );
        const resultados = await Promise.all(peticiones);
        const todos = resultados.flatMap((r) => r.productos);
        const unicos = Array.from(
          new Map(todos.map((p) => [p._id, p])).values(),
        );
        setProductos(unicos);
      } else {
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
      }

      setError(null);
    } catch (err) {
      setError("Error al cargar productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (categoriaId) => {
    setFiltros((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoriaId)
        ? prev.categorias.filter((c) => c !== categoriaId)
        : [...prev.categorias, categoriaId],
    }));
  };

  const handleBusqueda = (e) => {
    e.preventDefault();
  };

  return (
    <main className="mb-10 container mx-auto px-4 max-w-7xl pt-10">
      <h1 className="font-poppins text-4xl font-bold text-accent-purple mb-9 text-center">
        Catálogo de Libros
      </h1>

      {/* Barra de búsqueda */}
      <form
        onSubmit={handleBusqueda}
        className="flex items-center justify-center gap-3 mb-9"
      >
        <input
          type="search"
          placeholder="Buscar libros, autores, editoriales..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="py-3 px-5 rounded-2xl border border-white/10 text-base outline-none bg-[#232632]/80 text-white w-80 focus:border-accent-pink focus:ring-1 focus:ring-accent-pink transition-all shadow-inner"
          aria-label="Buscar libros"
        />
        <button
          type="submit"
          className="bg-accent-purple border-none rounded-2xl w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-accent-pink hover:shadow-lg transition-all"
          aria-label="Buscar"
        >
          <TbSearch size={22} className="text-white" />
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Filtros laterales */}
        <aside className="glass-panel rounded-2xl p-8 min-w-[220px] max-w-[260px] w-full lg:sticky lg:top-24 text-white">
          <h2 className="font-poppins text-lg font-bold text-accent-pink mb-5 border-b border-white/5 pb-2">
            Filtrar por
          </h2>

          {/* Categoría */}
          <div className="mb-6 flex flex-col gap-2.5">
            <span className="text-sm font-bold text-accent-purple uppercase tracking-wider mb-1">
              Categoría
            </span>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <label
                  key={cat._id}
                  className="text-sm text-gray-300 hover:text-white font-medium cursor-pointer flex items-center gap-2.5 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filtros.categorias.includes(cat._id)}
                    onChange={() => handleCategoriaChange(cat._id)}
                    className="cursor-pointer accent-accent-purple rounded"
                  />
                  {cat.nombre}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-400">Cargando categorías...</p>
            )}
          </div>

          {/* Autor */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-sm font-bold text-accent-purple uppercase tracking-wider mb-1">
              Autor
            </span>
            <input
              type="text"
              placeholder="Nombre del autor"
              value={filtros.autor}
              onChange={(e) =>
                setFiltros({ ...filtros, autor: e.target.value })
              }
              className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1"
            />
          </div>

          {/* Editorial */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-sm font-bold text-accent-purple uppercase tracking-wider mb-1">
              Editorial
            </span>
            <select
              value={filtros.editorial}
              onChange={(e) =>
                setFiltros({ ...filtros, editorial: e.target.value })
              }
              className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input mt-1 cursor-pointer"
            >
              <option value="" className="bg-[#232632] text-white">
                Todas
              </option>
              {editoriales.length > 0 ? (
                editoriales.map((ed) => (
                  <option
                    key={ed._id}
                    value={ed.nombre}
                    className="bg-[#232632] text-white"
                  >
                    {ed.nombre}
                  </option>
                ))
              ) : (
                <option className="bg-[#232632] text-gray-400" disabled>
                  Cargando...
                </option>
              )}
            </select>
          </div>

          {/* Precio */}
          <div className="mb-6 flex flex-col gap-2">
            <span className="text-sm font-bold text-accent-purple uppercase tracking-wider mb-1">
              Precio
            </span>
            <input
              type="number"
              placeholder="$ Mínimo"
              value={filtros.precioMin}
              onChange={(e) =>
                setFiltros({ ...filtros, precioMin: e.target.value })
              }
              className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input"
            />
            <input
              type="number"
              placeholder="$ Máximo"
              value={filtros.precioMax}
              onChange={(e) =>
                setFiltros({ ...filtros, precioMax: e.target.value })
              }
              className="py-2.5 px-4 rounded-lg border border-white/10 text-sm premium-input"
            />
          </div>
        </aside>

        {/* Resultados */}
        <section className="flex-1 min-w-0">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400 animate-pulse">
                Cargando productos...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-400">{error}</p>
              <button
                onClick={cargarProductos}
                className="mt-4 bg-accent-purple text-white py-2 px-6 rounded-lg hover:bg-accent-pink transition-colors shadow-md"
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
                  <ProductCard key={producto._id} producto={producto} />
                ))}
              </div>

              {/* Paginación */}
              <nav className="flex gap-3 justify-center items-center mt-12">
                <button className="bg-[#232632] text-gray-300 border border-white/5 rounded-lg py-2.5 px-4 font-semibold cursor-pointer hover:bg-accent-purple hover:text-white transition-all duration-200">
                  1
                </button>
                <button className="bg-[#232632] text-gray-300 border border-white/5 rounded-lg py-2.5 px-4 font-semibold cursor-pointer hover:bg-accent-purple hover:text-white transition-all duration-200">
                  2
                </button>
                <button className="bg-[#232632] text-gray-300 border border-white/5 rounded-lg py-2.5 px-4 font-semibold cursor-pointer hover:bg-accent-purple hover:text-white transition-all duration-200">
                  3
                </button>
              </nav>
            </>
          )}
        </section>
      </div>
      <ChatBot />
    </main>
  );
};

export default Catalogo;
