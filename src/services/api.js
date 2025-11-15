import axios from "axios";

// =============================================================
// 🌐 CONFIGURAÇÃO BASE DA API
// =============================================================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  timeout: 10000,
});

// =============================================================
// ⚙️ MODO DEV - Permite acessar sem autenticação real
// =============================================================
// Basta adicionar no seu .env:
// NEXT_PUBLIC_DEV_MODE=true
const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

// =============================================================
// 🔐 INTERCEPTOR DE REQUISIÇÕES
// =============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    console.log(`📤 [${config.method?.toUpperCase()}] → ${config.baseURL}${config.url}`);

    // Se estiver em modo DEV, ignora autenticação
    if (isDevMode) {
      console.warn("🧩 [DEV_MODE] Ignorando autenticação. Usuário simulado: Síndico");
      config.headers["X-Dev-User"] = JSON.stringify({
        userId: 1,
        userType: "Sindico", // "Sindico" | "Funcionario" | "Morador"
      });
      return config;
    }

    // Se não estiver em modo DEV, usa o token real
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token incluído no header Authorization.");
    } else {
      console.warn("⚠️ Nenhum token encontrado no localStorage.");
    }

    return config;
  },
  (error) => {
    console.error("❌ Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

// =============================================================
// 🧾 INTERCEPTOR DE RESPOSTAS
// =============================================================
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.config.url}] → ${response.status}`);
    return response;
  },
  (error) => {
    const status = error.response?.status || "Network Error";
    const url = error.config?.url || "URL desconhecida";

    console.error(`❌ Erro na resposta: ${url} → ${status}`);
    console.error("📄 Detalhes do erro:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      stack: error.stack
    });

    if (status === 401 && !isDevMode) {
      console.warn("🚫 Token inválido ou expirado. Redirecionando para login...");
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    } else if (status === "Network Error") {
      console.error("📡 Servidor inacessível ou problema de CORS.");
      console.error("💡 Verifique se o backend está rodando em http://localhost:3333");
    }

    return Promise.reject(error);
  }
);

// =============================================================
// 🔑 FUNÇÕES DE RECUPERAÇÃO DE SENHA
// =============================================================

/**
 * Solicita o código de recuperação de senha
 * @param {string} email - Email do usuário
 * @returns {Promise} Resposta da API
 */
export const solicitarResetSenha = async (email) => {
  return await api.post('/usuario/recuperar-senha', { 
    user_email: email.trim().toLowerCase() 
  });
};

/**
 * Redefine a senha do usuário usando o código recebido
 * @param {string} email - Email do usuário (não usado no backend, mas mantido por compatibilidade)
 * @param {string} codigo - Código de recuperação recebido por email (6 dígitos)
 * @param {string} novaSenha - Nova senha do usuário
 * @returns {Promise} Resposta da API
 */
export const resetarSenha = async (email, codigo, novaSenha) => {
  return await api.post('/usuario/redefinir-senha', { 
    codigo: codigo, 
    novaSenha: novaSenha 
  });
};

export default api;
