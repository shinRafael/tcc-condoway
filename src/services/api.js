import axios from 'axios';

// Cria instância base
const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// Interceptor de requisições
api.interceptors.request.use(
  (config) => {
    console.log('📤 Fazendo requisição:', config.method?.toUpperCase(), config.baseURL + config.url);
    const token = localStorage.getItem('authToken'); // ou 'token', se preferir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token incluído na requisição');
    } else {
      console.warn('⚠️  Nenhum token encontrado no localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respostas — trata token expirado
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.config.url, '→', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.config?.url, '→', error.response?.status || 'Network Error');
    console.error('Detalhes do erro:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response && error.response.status === 401) {
      console.warn('🚫 Token inválido ou expirado. Redirecionando para login...');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;