"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api"; // sua conexão axios configurada

export default function HomePage() {
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
      user_email: email,
      user_senha: senha,
    });

    // Ajuste aqui, conforme o retorno da API
    const { dados } = response.data;

    const token = dados.token; // vem dentro de "dados"
    const usuario = dados.usuario;npm 

    if (!token) {
      setErro("Resposta inesperada da API.");
      return;
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("userType", usuario.user_tipo);

    if (usuario.user_tipo === "Sindico") {
      router.push("/dashboard");
    } else if (usuario.user_tipo === "Funcionario") {
      router.push("/porteiro");
    } else if (usuario.user_tipo === "Morador") {
      router.push("/home");
    } else {
      setErro("Tipo de usuário desconhecido.");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    setErro(error.response?.data?.mensagem || "Email ou senha incorretos!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="loginContainer">
      <header className="loginHeader">
        <h1>CondoWay</h1>
      </header>

      <main className="loginMain">
        <aside className="leftSection">
          <div className="logoCircle">
            <img src="/temp/logosemtransparente.png" alt="Logo CondoWay" />
          </div>
          <div className="aboutSection">
            <h2>Sobre Nós</h2>
            <p>
              Não somos apenas uma equipe — somos um conceito!<br />
              Não entregamos só software: entregamos{" "}
              <strong>tempo, praticidade e conforto</strong>.<br />
              Nascemos para simplificar o dia a dia, com foco total na
              experiência do usuário.<br />
              Síndicos, moradores e porteiros: cada detalhe foi pensado para
              vocês.<br />
              Somos a <strong>CondoWay</strong>. Mais que condomínio, a sua
              última chance de mudar a rotina.
            </p>
          </div>
        </aside>

        <section className="loginSection">
          <div className="welcomeText">
            <h2>Facilitando o seu dia!</h2>
            <p>Entre ou cadastre-se para acessar nossos recursos.</p>
          </div>

          <form className="loginForm" onSubmit={handleLogin}>
            <label>
              Email:
              <input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Senha:
              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </label>

            {erro && <p className="erroLogin">{erro}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>

      <footer className="loginFooter">
        <p>
          &copy; {new Date().getFullYear()} CondoWay. Todos os direitos
          reservados.
        </p>
      </footer>

      {/* 🎨 CSS embutido */}
      <style jsx>{`
        .loginContainer {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #5ba8f0, #5bd1c5);
          color: #333;
        }

        .loginHeader {
          padding: 1rem;
          text-align: center;
          color: white;
          font-size: 1.8rem;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .loginMain {
          flex: 1;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          padding: 2rem 3rem;
        }

        /* LADO ESQUERDO */
        .leftSection {
          flex: 1;
          max-width: 45%;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .logoCircle {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
        }

        .logoCircle img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }

        .aboutSection {
          background: rgba(255, 255, 255, 0.3);
          padding: 2rem;
          border-radius: 20px;
          max-width: 90%;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #1e1e1e;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .aboutSection h2 {
          margin-bottom: 1rem;
          color: #1e1e1e;
          font-size: 1.5rem;
          font-weight: 600;
        }

        /* FORMULÁRIO */
        .loginSection {
          background: white;
          padding: 3rem 2.5rem;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .welcomeText h2 {
          margin-bottom: 0.4rem;
          color: #327ae0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .welcomeText p {
          font-size: 0.95rem;
          margin-bottom: 1.8rem;
          color: #555;
        }

        .loginForm {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .loginForm label {
          display: flex;
          flex-direction: column;
          text-align: left;
          color: #444;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .loginForm input {
          margin-top: 0.4rem;
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .loginForm input:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 4px rgba(74, 144, 226, 0.3);
        }

        .loginForm button {
          padding: 0.9rem;
          background: linear-gradient(135deg, #4a90e2, #357ab8);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .loginForm button:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #3d7ed0, #2f66a2);
          box-shadow: 0 6px 15px rgba(74, 144, 226, 0.3);
        }

        .erroLogin {
          color: red;
          text-align: center;
          font-weight: 500;
        }

        .loginFooter {
          text-align: center;
          padding: 1rem;
          font-size: 0.85rem;
          color: white;
          opacity: 0.9;
        }

        /* RESPONSIVO */
        @media (max-width: 900px) {
          .loginMain {
            flex-direction: column;
            gap: 2rem;
          }
          .leftSection,
          .loginSection {
            max-width: 100%;
          }
          .aboutSection {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}
