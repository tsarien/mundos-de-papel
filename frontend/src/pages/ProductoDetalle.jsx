import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ChatBot from "../components/chatbot/Chatbot";
import ReviewSystem from "../components/ui/ReviewSystem";
import {
  obtenerProductoPorId,
  obtenerProductos,
} from "../services/productoService";
import {
  TbBook,
  TbUser,
  TbBuilding,
  TbLanguage,
  TbFileText,
  TbPackage,
  TbShoppingCartPlus,
  TbArrowLeft,
  TbMinus,
  TbPlus,
  TbHome,
  TbBooks,
} from "react-icons/tb";

const ProductoDetalle = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      setCantidad(1);

      const data = await obtenerProductoPorId(id);
      setProducto(data.producto);

      // Cargar productos relacionados de la misma categoría
      const relacionadosData = await obtenerProductos({
        categoria: data.producto.categoria?._id || data.producto.categoria,
        limite: 5,
      });
      const relacionados = relacionadosData.productos
        .filter((p) => p._id !== data.producto._id)
        .slice(0, 4);
      setProductosRelacionados(relacionados);

      setError(null);
    } catch (err) {
      setError("Producto no encontrado");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (producto && cantidad > 0) {
      addToCart(producto, cantidad);
      toast.success(`"${producto.nombre}" agregado al carrito`, {
        description: `${cantidad} ${cantidad === 1 ? "unidad" : "unidades"}`,
      });
    }
  };

  const incrementar = () => {
    if (cantidad < producto.stock) setCantidad(cantidad + 1);
  };

  const decrementar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  // Estado: cargando
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-xl text-gray-400">Cargando producto...</p>
      </div>
    );
  }

  // Estado: error o no encontrado
  if (error || !producto) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4 text-accent-purple">
            <TbBook size={72} />
          </div>
          <h2 className="text-2xl text-white mb-2">Producto no encontrado</h2>
          <p className="text-gray-400 mb-6">
            El producto que buscas no existe o fue eliminado
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-accent-blue text-bg px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const precioFinal = producto.enOferta
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link
            to="/"
            className="hover:text-accent-blue transition-colors flex items-center gap-1"
          >
            <TbHome size={16} />
            Inicio
          </Link>
          <span>/</span>
          <Link
            to="/catalogo"
            className="hover:text-accent-blue transition-colors flex items-center gap-1"
          >
            <TbBooks size={16} />
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-white">{producto.nombre}</span>
        </div>

        {/* Detalle del producto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Imagen */}
          <div className="glass-panel rounded-2xl p-8 flex items-center justify-center relative overflow-hidden shadow-hard border border-white/5 hover:border-accent-purple/20 transition-all duration-300 group self-start h-[480px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/5 to-accent-pink/5 opacity-50 pointer-events-none" />
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="h-full w-auto object-contain transition-all duration-500 group-hover:scale-[1.02] drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center">
            <div className="inline-block bg-accent-purple/20 text-accent-purple px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
              {producto.categoria?.nombre || producto.categoria}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {producto.nombre}
            </h1>

            <div className="flex items-center gap-2 text-xl text-gray-300 mb-2">
              <TbUser size={20} className="text-accent-blue" />
              <span className="text-accent-blue">{producto.autor}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-6">
              <TbBuilding size={18} />
              {producto.editorial}
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {producto.descripcionCompleta || producto.descripcion}
            </p>

            {/* Detalles técnicos */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-bg-light/50 border border-white/5 rounded-xl p-6">
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <TbFileText size={16} />
                  Páginas
                </p>
                <p className="text-white font-medium">{producto.paginas}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <TbLanguage size={16} />
                  Idioma
                </p>
                <p className="text-white font-medium">{producto.idioma}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <TbBook size={16} />
                  Presentación
                </p>
                <p className="text-white font-medium">
                  {producto.presentacion}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <TbPackage size={16} />
                  Stock
                </p>
                <p
                  className={`font-medium ${producto.stock > 5 ? "text-accent-green" : "text-yellow-500"}`}
                >
                  {producto.stock > 0
                    ? `${producto.stock} disponibles`
                    : "Agotado"}
                </p>
              </div>
            </div>

            {/* Precio */}
            <div className="mb-6">
              {producto.enOferta ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-white">
                    ${precioFinal.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-500 line-through">
                    ${producto.precio.toLocaleString()}
                  </span>
                  <span className="bg-gradient-to-r from-accent-pink to-accent-purple text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    -{producto.descuento}%
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-white">
                  ${producto.precio.toLocaleString()}
                </span>
              )}
            </div>

            {/* Cantidad y botón agregar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-[#13151b] border border-white/5 rounded-xl overflow-hidden h-12">
                <button
                  onClick={decrementar}
                  disabled={cantidad <= 1}
                  className="px-4 h-full text-white hover:bg-accent-blue hover:text-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <TbMinus size={18} />
                </button>
                <span className="px-6 text-white font-medium min-w-[60px] text-center">
                  {cantidad}
                </span>
                <button
                  onClick={incrementar}
                  disabled={cantidad >= producto.stock}
                  className="px-4 h-full text-white hover:bg-accent-blue hover:text-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <TbPlus size={18} />
                </button>
              </div>

              <button
                onClick={handleAgregarAlCarrito}
                disabled={producto.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-accent-blue to-accent-purple text-bg hover:from-accent-pink hover:to-accent-purple hover:text-white px-8 py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed border-none h-12"
              >
                <TbShoppingCartPlus size={20} />
                {producto.stock > 0 ? "Agregar al Carrito" : "Agotado"}
              </button>
            </div>

            <Link
              to="/catalogo"
              className="inline-block text-center border border-accent-purple/40 text-accent-purple px-8 py-3 rounded-xl font-bold hover:bg-accent-purple hover:text-bg transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <TbArrowLeft size={18} />
                Continuar Comprando
              </span>
            </Link>
          </div>
        </div>

        {/* Sistema de reseñas */}
        <div className="mb-16">
          <ReviewSystem
            productoId={producto._id}
            resenasIniciales={producto.valoraciones || []}
          />
        </div>

        {/* Productos relacionados */}
        {productosRelacionados.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosRelacionados.map((prod) => {
                const precioRel = prod.enOferta
                  ? prod.precio - (prod.precio * prod.descuento) / 100
                  : prod.precio;

                return (
                  <Link
                    key={prod._id}
                    to={`/producto/${prod._id}`}
                    className="glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent-purple/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:-translate-y-1 group"
                  >
                    <div className="relative aspect-[3/4] bg-[#13151b] flex items-center justify-center p-4 overflow-hidden border-b border-white/5">
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="h-full w-auto object-contain transition-all duration-300 group-hover:scale-[1.05]"
                      />
                      {prod.enOferta && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-accent-pink to-accent-purple text-white px-3 py-1 rounded-lg text-xs font-bold z-10 shadow-md">
                          -{prod.descuento}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-1 line-clamp-1 group-hover:text-accent-blue transition-colors text-sm">
                        {prod.nombre}
                      </h3>
                      <p className="text-gray-400 text-xs mb-2">{prod.autor}</p>
                      <div className="flex items-baseline gap-2">
                        {prod.enOferta ? (
                          <>
                            <span className="text-base font-bold text-accent-blue">
                              ${precioRel.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              ${prod.precio.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-bold text-white">
                            ${prod.precio.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default ProductoDetalle;
