import axios from 'axios';

// SINGLETON PATTERN: Axios Instance
// Configuración centralizada para todas las peticiones HTTP.
// Maneja URLs base, headers comunes y tokens de autenticación automáticamente.
// Esto evita repetir código en cada llamada (DRY).

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar Token (cuando tengamos Auth real)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo global de errores (Observabilidad)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podríamos loguear a Sentry o mostrar un Toast global
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
