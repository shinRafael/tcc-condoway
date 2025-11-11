"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/Usuario/login", {
        user_email: email.trim().toLowerCase(),
        user_senha: senha,
      });

      const { dados } = response.data;
      const token = dados?.token;
      const usuario = dados?.usuario;

      if (!token) {
        setErro("Resposta inesperada da API.");
        return;
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("userType", usuario.user_tipo);

      const rotas = {
        Sindico: "/dashboard",
        Funcionario: "/porteiro",
        Morador: "/home",
      };

      router.push(rotas[usuario.user_tipo] || "/");
    } catch (error) {
      console.error(error);
      setErro(error.response?.data?.mensagem || "Email ou senha incorretos!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <header className={styles.loginHeader}>
        <h1>CondoWay</h1>
      </header>

      <main className={styles.loginMain}>
        <aside className={styles.leftSection}>
          <div className={styles.logoCircle}>
            <img src="/temp/logosemtransparente.png" alt="Logo CondoWay" />
          </div>

          <div className={styles.aboutSection}>
            <h2>Sobre Nós</h2>
            <p>
              Não somos apenas uma equipe — somos um conceito!<br />
              Nascemos para simplificar o dia a dia.<br />
              Somos a <strong>CondoWay</strong>.
            </p>
          </div>
        </aside>

        <section className={styles.loginSection}>
          <h2>Bem-vindo!</h2>
          <p>Entre com suas credenciais</p>
          
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Senha:</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <p className={styles.erroLogin}>{erro}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>

      <footer className={styles.loginFooter}>
        © {new Date().getFullYear()} CondoWay
      </footer>
    </div>
  );
}
