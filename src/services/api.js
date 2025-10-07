import axios from 'axios';

// Crie a instância do Axios com a URL base
const api = axios.create({
<<<<<<< Updated upstream
  baseURL: 'http://localhost:3333',
=======
  baseURL: "http://localhost:3333",
>>>>>>> Stashed changes
});

// Adicione o interceptor de requisições
api.interceptors.request.use(
  (config) => {
    // 1. Tenta pegar o token de autenticação do localStorage do navegador
    //    IMPORTANTE: Se você salvou o token com outro nome (ex: 'user-token'), troque 'authToken' abaixo.
    const token = localStorage.getItem('authToken');

    // 2. Se o token existir, ele é adicionado no cabeçalho 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. A requisição continua, agora com o token
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição, ele é rejeitado
    return Promise.reject(error);
  }
);

export default api;