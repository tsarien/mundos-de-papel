import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      obtenerUsuarioActual();
    } else {
      setLoading(false);
    }
  }, []);

  const obtenerUsuarioActual = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.usuario);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      setUser(usuario);

      return { success: true, user: usuario };
    } catch (error) {
      return {
        success: false,
        mensaje: error.response?.data?.mensaje || "Error al iniciar sesión",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/registro", userData);
      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      setUser(usuario);

      return { success: true, user: usuario };
    } catch (error) {
      return {
        success: false,
        mensaje: error.response?.data?.mensaje || "Error al registrar",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await api.put("/auth/perfil", updatedData);
      setUser(response.data.usuario);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        mensaje: error.response?.data?.mensaje || "Error al actualizar perfil",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
