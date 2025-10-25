import axios from 'axios';

// Cria instância base
const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// Interceptor de requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // ou 'token', se preferir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respostas — trata token expirado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token inválido ou expirado.');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;