import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ReviewSystem from '../components/ReviewSystem';
import { productos } from '../data/productos';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [productosRelacionados, setProductosRelacionados] = useState([]);

  useEffect(() => {
    // Buscar producto por ID
    const productoEncontrado = productos.find(p => p.id === parseInt(id));
    
    if (productoEncontrado) {
      setProducto(productoEncontrado);
      
      // Buscar productos relacionados (misma categoría)
      const relacionados = productos
        .filter(p => p.categoria === productoEncontrado.categoria && p.id !== productoEncontrado.id)
        .slice(0, 4);
      setProductosRelacionados(relacionados);
    }
  }, [id]);

  const handleAgregarAlCarrito = () => {
    if (producto && cantidad > 0) {
      addToCart(producto, cantidad);
      // Mostrar notificación visual
      alert(`${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de "${producto.nombre}" agregado${cantidad === 1 ? '' : 's'} al carrito`);
    }
  };

  const incrementar = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  if (!producto) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl text-white mb-2">Producto no encontrado</h2>
          <p className="text-gray-400 mb-6">El producto que buscas no existe o fue eliminado</p>
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
    ? producto.precio - (producto.precio * producto.descuento / 100)
    : producto.precio;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-accent-blue transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo" className="hover:text-accent-blue transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-white">{producto.nombre}</span>
        </div>

        {/* Detalle del producto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Imagen */}
          <div className="bg-bg-light rounded-2xl p-8 flex items-center justify-center">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="max-h-[500px] w-auto object-contain"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center">
            {/* Categoría */}
            <div className="inline-block bg-accent-purple/20 text-accent-purple px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
              {producto.categoria}
            </div>

            {/* Título */}
            <h1 className="text-4xl font-bold text-white mb-4">
              {producto.nombre}
            </h1>

            {/* Autor */}
            <p className="text-xl text-gray-300 mb-2">
              Por <span className="text-accent-blue">{producto.autor}</span>
            </p>

            {/* Editorial */}
            <p className="text-gray-400 mb-6">
              {producto.editorial}
            </p>

            {/* Descripción */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {producto.descripcionCompleta || producto.descripcion}
            </p>

            {/* Detalles técnicos */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-bg-light rounded-xl p-6">
              <div>
                <p className="text-gray-400 text-sm">Páginas</p>
                <p className="text-white font-medium">{producto.paginas}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Idioma</p>
                <p className="text-white font-medium">{producto.idioma}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Presentación</p>
                <p className="text-white font-medium">{producto.presentacion}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Stock</p>
                <p className={`font-medium ${producto.stock > 5 ? 'text-accent-green' : 'text-yellow-500'}`}>
                  {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
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
                  <span className="bg-accent-pink text-white px-3 py-1 rounded-full text-sm font-bold">
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
              {/* Selector de cantidad */}
              <div className="flex items-center bg-bg-light rounded-lg overflow-hidden">
                <button
                  onClick={decrementar}
                  disabled={cantidad <= 1}
                  className="px-4 py-3 text-white hover:bg-accent-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="px-6 py-3 text-white font-medium min-w-[60px] text-center">
                  {cantidad}
                </span>
                <button
                  onClick={incrementar}
                  disabled={cantidad >= producto.stock}
                  className="px-4 py-3 text-white hover:bg-accent-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={handleAgregarAlCarrito}
                disabled={producto.stock === 0}
                className="flex-1 bg-accent-blue text-bg px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </button>
            </div>

            {/* Botón continuar comprando */}
            <Link
              to="/catalogo"
              className="inline-block text-center border border-accent-purple text-accent-purple px-8 py-3 rounded-lg font-bold hover:bg-accent-purple hover:text-bg transition-all"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Sistema de reseñas */}
        <div className="mb-16">
          <ReviewSystem 
            productoId={producto.id}
            resenasIniciales={producto.valoraciones || []}
          />
        </div>

        {/* Productos relacionados */}
        {productosRelacionados.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosRelacionados.map(prod => {
                const precioRel = prod.enOferta 
                  ? prod.precio - (prod.precio * prod.descuento / 100)
                  : prod.precio;
                
                return (
                  <Link
                    key={prod.id}
                    to={`/producto/${prod.id}`}
                    className="bg-bg-light rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all group"
                  >
                    {prod.enOferta && (
                      <div className="absolute top-4 right-4 bg-accent-pink text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                        -{prod.descuento}%
                      </div>
                    )}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-1 line-clamp-1">
                        {prod.nombre}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{prod.autor}</p>
                      <div className="flex items-baseline gap-2">
                        {prod.enOferta ? (
                          <>
                            <span className="text-xl font-bold text-accent-blue">
                              ${precioRel.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${prod.precio.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-white">
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
    </div>
  );
};

export default ProductoDetalle;
