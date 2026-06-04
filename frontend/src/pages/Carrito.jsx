import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/chatbot/Chatbot";
import { obtenerCategorias } from "../services/catalogoService";
import { crearPedido } from "../services/pedidoService";
import { toast } from "sonner";

const Carrito = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);

  const subtotal = getCartTotal();
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const getPrecioProducto = (producto) => {
    return producto.enOferta
      ? producto.precio - (producto.precio * producto.descuento) / 100
      : producto.precio;
  };

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const cats = await obtenerCategorias();
        setCategorias(cats);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setCargandoCategorias(false);
      }
    };
    cargarCategorias();
  }, []);

  const handleFinalizarCompra = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!user?.direccion || !user?.telefono) {
      toast.warning("Perfil incompleto", {
        description: "Completa tu dirección y teléfono antes de comprar",
      });
      navigate("/cuenta");
      return;
    }

    try {
      setLoading(true);
      const datosPedido = {
        items: cart.map((item) => ({
          producto: item._id,
          cantidad: item.cantidad,
        })),
        direccionEnvio: {
          direccion: user.direccion,
          telefono: user.telefono,
        },
        metodoPago: "tarjeta",
      };

      const resultado = await crearPedido(datosPedido);

      if (resultado.success) {
        clearCart();
        toast.success("¡Pedido realizado con éxito!", {
          description: `Número: ${resultado.pedido._id.toString().slice(-6).toUpperCase()}`,
        });
        navigate("/cuenta");
      }
    } catch (error) {
      toast.error(error.mensaje || error.message || "Error al crear el pedido");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="mb-10 container mx-auto px-4 max-w-7xl pt-10">
        <h1 className="font-poppins text-4xl font-bold text-accent-purple mb-9 text-center">
          Tu Carrito
        </h1>
        <div className="glass-panel rounded-2xl p-10 text-center max-w-2xl mx-auto border border-white/5 shadow-soft">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-accent-blue/10 flex items-center justify-center border border-accent-blue/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-accent-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6"
                />
              </svg>
            </div>
          </div>

          <h2 className="font-poppins text-2xl font-bold text-white mb-3">
            ¡Tu carrito está vacío!
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Parece que aún no has agregado ningún producto. Explora nuestro
            catálogo y encuentra tu próxima gran lectura.
          </p>

          {/* Botón principal */}
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-blue to-accent-purple text-bg font-bold py-3 px-8 rounded-2xl hover:from-accent-pink hover:to-accent-purple hover:text-white transition-all shadow-md mb-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Explorar catálogo
          </Link>

          {/* Enlaces rápidos a categorías con IDs reales */}
          <div className="border-t border-white/5 pt-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
              O explora por categoría
            </p>
            {cargandoCategorias ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-blue"></div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {categorias.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/catalogo?categoria=${cat._id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-colors"
                  >
                    {cat.nombre}
                  </Link>
                ))}
                <Link
                  to="/ofertas"
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                >
                  Ofertas
                </Link>
              </div>
            )}
          </div>
        </div>
        <ChatBot />
      </main>
    );
  }

  return (
    <main className="mb-10 container mx-auto px-4 max-w-7xl pt-10">
      <h1 className="font-poppins text-4xl font-bold text-accent-purple mb-9 text-center">
        Tu Carrito
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
        {/* Productos en el carrito */}
        <section className="flex flex-col gap-6">
          {cart.map((producto) => {
            const precio = getPrecioProducto(producto);
            const subtotalProducto = precio * producto.cantidad;
            return (
              <div
                key={producto._id}
                className="glass-panel rounded-2xl flex items-center gap-6 p-6 relative transition-all hover:border-accent-blue/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
              >
                <div className="w-20 h-24 bg-[#13151b] flex items-center justify-center p-2 rounded-xl border border-white/5 flex-shrink-0">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <h3 className="font-poppins text-base font-bold text-accent-blue m-0">
                    {producto.nombre}
                  </h3>
                  <span className="text-sm text-accent-pink font-semibold">
                    ${precio.toLocaleString()}
                  </span>

                  {/* Cantidad */}
                  <div className="flex items-center gap-3 my-1.5">
                    <div className="flex items-center bg-[#13151b] border border-white/5 rounded-xl overflow-hidden h-9">
                      <button
                        onClick={() =>
                          updateQuantity(producto._id, producto.cantidad - 1)
                        }
                        className="text-white hover:bg-accent-pink/20 hover:text-accent-pink w-10 h-full text-base font-bold transition-all flex items-center justify-center disabled:opacity-40"
                        aria-label="Disminuir cantidad"
                        disabled={producto.cantidad <= 1}
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-white min-w-[2.5rem] text-center">
                        {producto.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(producto._id, producto.cantidad + 1)
                        }
                        className="text-white hover:bg-accent-blue/20 hover:text-accent-blue w-10 h-full text-base font-bold transition-all flex items-center justify-center"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <span className="text-sm text-gray-400">
                    Subtotal:{" "}
                    <span className="text-accent-blue font-semibold">
                      ${subtotalProducto.toLocaleString()}
                    </span>
                  </span>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => removeFromCart(producto._id)}
                  className="bg-transparent hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl w-10 h-10 text-xl font-bold cursor-pointer transition-all ml-auto flex items-center justify-center flex-shrink-0"
                  aria-label="Eliminar producto"
                >
                  ×
                </button>
              </div>
            );
          })}
        </section>

        {/* Resumen del pedido */}
        <aside className="glass-panel rounded-2xl p-8 min-w-[260px] max-w-[340px] w-full lg:sticky lg:top-24 text-white">
          <h2 className="font-poppins text-lg font-bold text-accent-pink mb-5 border-b border-white/5 pb-2.5">
            Resumen del pedido
          </h2>
          <div className="flex justify-between text-sm text-gray-300 mb-3">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300 mb-4 pb-4 border-b border-white/5">
            <span>IVA (19%)</span>
            <span className="font-medium">
              ${Math.round(iva).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold text-accent-purple mb-6">
            <span>Total</span>
            <span>${Math.round(total).toLocaleString()}</span>
          </div>
          <button
            onClick={handleFinalizarCompra}
            disabled={loading}
            className="w-full text-base font-bold py-3.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-bg hover:from-accent-pink hover:to-accent-purple hover:text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Finalizar compra"}
          </button>
        </aside>
      </div>
      <ChatBot />
    </main>
  );
};

export default Carrito;
