import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../services/pedidoService";

const Carrito = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const { isAuthenticated } = useAuth();
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

    try {
      setLoading(true);
      const datosPedido = {
        items: cart.map((item) => ({
          producto: item.id,
          cantidad: item.cantidad,
        })),
        direccionEnvio: {
          direccion: "Dirección del usuario",
          ciudad: "Bogotá",
          departamento: "Cundinamarca",
          telefono: "300-123-4567",
        },
        metodoPago: "tarjeta",
      };

      const resultado = await crearPedido(datosPedido);

      if (resultado.success) {
        clearCart();
        alert("¡Pedido realizado con éxito!");
        navigate("/cuenta");
      }
    } catch (error) {
      alert(error.mensaje || "Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="mt-[94px] mb-10 container mx-auto px-4 max-w-7xl">
        <h1 className="font-poppins text-4xl font-bold text-accent-purple mb-9 text-center">
          Tu Carrito
        </h1>
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 mb-6">Tu carrito está vacío</p>
          <Link
            to="/catalogo"
            className="inline-block bg-accent-blue text-bg font-semibold py-3 px-8 rounded-2xl no-underline hover:bg-accent-pink transition-all"
          >
            Ver catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-[94px] mb-10 container mx-auto px-4 max-w-7xl">
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
                key={producto.id}
                className="bg-white rounded-2xl shadow-md flex items-center gap-6 p-6 relative transition-all hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]"
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-20 h-20 rounded-xl object-cover bg-accent-purple"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="font-poppins text-lg font-bold text-accent-blue m-0">
                    {producto.nombre}
                  </h3>
                  <span className="text-base text-accent-pink font-semibold">
                    ${precio.toLocaleString()}
                  </span>

                  {/* Cantidad */}
                  <div className="flex items-center gap-3 my-2">
                    <button
                      onClick={() =>
                        updateQuantity(producto.id, producto.cantidad - 1)
                      }
                      className="bg-gray-200 text-accent-purple border-none rounded-full w-8 h-8 text-xl font-bold cursor-pointer hover:bg-accent-purple hover:text-white transition-all flex items-center justify-center"
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-800 min-w-[1.5em] text-center">
                      {producto.cantidad}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(producto.id, producto.cantidad + 1)
                      }
                      className="bg-gray-200 text-accent-purple border-none rounded-full w-8 h-8 text-xl font-bold cursor-pointer hover:bg-accent-purple hover:text-white transition-all flex items-center justify-center"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-base text-accent-blue font-semibold">
                    Subtotal: ${subtotalProducto.toLocaleString()}
                  </span>
                </div>

                {/* Botón eliminar */}
                <button
                  onClick={() => removeFromCart(producto.id)}
                  className="bg-gray-200 text-red-500 border-none rounded-full w-9 h-9 text-2xl font-bold cursor-pointer hover:bg-red-500 hover:text-white transition-all ml-4 flex items-center justify-center"
                  aria-label="Eliminar producto"
                >
                  ×
                </button>
              </div>
            );
          })}
        </section>

        {/* Resumen del pedido */}
        <aside className="bg-white rounded-2xl shadow-md p-9 min-w-[260px] max-w-[340px] w-full lg:sticky lg:top-24">
          <h2 className="font-poppins text-xl font-bold text-accent-pink mb-5">
            Resumen del pedido
          </h2>
          <div className="flex justify-between text-base text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base text-gray-700 mb-2">
            <span>IVA (19%)</span>
            <span>${Math.round(iva).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-accent-purple my-5">
            <span>Total</span>
            <span>${Math.round(total).toLocaleString()}</span>
          </div>
          <button
            onClick={handleFinalizarCompra}
            disabled={loading}
            className="w-full text-lg font-bold py-4 rounded-xl bg-accent-blue text-bg hover:bg-accent-pink transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Finalizar compra"}
          </button>
        </aside>
      </div>
    </main>
  );
};

export default Carrito;
