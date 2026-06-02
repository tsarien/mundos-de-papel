import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../services/pedidoService";
import { toast } from "sonner";

const Carrito = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const getPrecioProducto = (producto) => {
    return producto.enOferta
      ? producto.precio - (producto.precio * producto.descuento) / 100
      : producto.precio;
  };

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
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 mb-6">Tu carrito está vacío</p>
          <Link
            to="/catalogo"
            className="inline-block bg-accent-blue text-bg font-semibold py-3 px-8 rounded-2xl no-underline hover:bg-accent-pink transition-all shadow-md"
          >
            Ver catálogo
          </Link>
        </div>
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
    </main>
  );
};

export default Carrito;
