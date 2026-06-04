import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("mundos-papel-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mundos-papel-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto, cantidad = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === producto._id);

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === producto._id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item,
        );
      }

      return [...prevCart, { ...producto, cantidad }];
    });
  };

  const removeFromCart = (productoId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productoId));
  };

  const updateQuantity = (productoId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productoId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productoId ? { ...item, cantidad } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const precio = item.enOferta
        ? item.precio - (item.precio * item.descuento) / 100
        : item.precio;
      return total + precio * item.cantidad;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cantidad, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
