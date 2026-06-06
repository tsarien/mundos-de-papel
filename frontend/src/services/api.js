import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const protectedAuthRoutes = [
      "/auth/login",
      "/auth/registro",
      "/auth/me",
      "/auth/perfil",
      "/auth/cambiar-password",
    ];
    const isAuthRoute = protectedAuthRoutes.some((route) =>
      error.config?.url?.includes(route),
    );
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("mundos-papel-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
