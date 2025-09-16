"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="loginContainer">
      <header className="loginHeader">
        <h1>CondoWay</h1>
      </header>

      <main className="loginMain">
        {/* LADO ESQUERDO */}
        <aside className="leftSection">
          <div className="logoCircle">
            <img src="/temp/logosemtransparente.png" alt="Logo CondoWay" />
          </div>
          <div className="aboutSection">
            <h2>Sobre Nós</h2>
            <p>
              Não somos apenas uma equipe — somos um conceito!<br />
              Não entregamos só software: entregamos <strong>tempo, praticidade e conforto</strong>.<br />
              Nascemos para simplificar o dia a dia, com foco total na experiência do usuário.<br />
              Síndicos, moradores e porteiros: cada detalhe foi pensado para vocês.<br />
              Somos a <strong>CondoWay</strong>. Mais que condomínio, a sua última chance de mudar a rotina.
            </p>
          </div>
        </aside>

        {/* LADO DIREITO - FORMULÁRIO */}
        <section className="loginSection">
          <div className="welcomeText">
            <h2>Facilitando o seu dia!</h2>
            <p>Cadastre-se para receber novidades e acessar nossos recursos.</p>
          </div>

          <form className="loginForm">
            <label>
              Email:
              <input type="email" placeholder="Digite seu email" required />
            </label>

            <label>
              Senha:
              <input type="password" placeholder="Digite sua senha" required />
            </label>

            <button type="submit">Entrar</button>
          </form>
        </section>
      </main>

      <footer className="loginFooter">
        <p>
          &copy; {new Date().getFullYear()} CondoWay. Todos os direitos reservados.
        </p>
      </footer>

      {/* CSS */}
      <style jsx>{`
        .loginContainer {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #4a90e2, #50c9c3);
          color: #333;
        }

        .loginHeader {
          padding: 1rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(4px);
          color: white;
          font-size: 1.7rem;
          font-weight: bold;
        }

        .loginMain {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
        }

        /* LADO ESQUERDO */
        .leftSection {
          flex: 1;
          max-width: 45%;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start; /* Adicione esta linha */
        }

        .logoCircle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .logoCircle img {
          width: 85%;
          height: 80%;
          object-fit: contain;
        }

        .aboutSection {
          background: rgba(255, 255, 255, 0.34);
          padding: 2rem;
          border-radius: 25px;
          max-width: 90%;
          text-align: center;
          font-size: 1.2rem;
          line-height: 2;
          font-family: arial, sans-serif;
          box-shadow: 0 8px 32px 0 rgba(5, 163, 255, 0.54);
          backdrop-filter: blur(8.5px);
        }

        .aboutSection h2 {
          margin-bottom: 1rem;
          color: #1C1C1C;
          font-size: 1.6rem;
          text-align: center;
        }

        .aboutSection p {
          color: #1C1C1C
          font-family: arial, sans-serif;
        }

        /* LADO DIREITO (FORMULÁRIO) */
        .loginSection {
          background: white;
          padding: 4rem 3rem;
          border-radius: 20px 0 0 20px;
          box-shadow: -4px 0 15px rgba(19, 209, 243, 0.73);
          width: 100%;
          max-width: 620px;
          text-align: center;
          align-self: stretch;
        }

        .welcomeText h2 {
          margin-bottom: 0.5rem;
          color: #4a90e2ff;
          font-size: 1.6rem;
        }

        .welcomeText p {
          font-size: 1rem;
          margin-bottom: 2rem;
          color: #555;
        }

        .loginForm {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .loginForm label {
          display: flex;
          flex-direction: column;
          text-align: left;
          font-size: 1rem;
          color: #333;
        }

        .loginForm input {
          margin-top: 0.4rem;
          padding: 0.9rem;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 1rem;
          outline: none;
        }

        .loginForm input:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
        }

        .loginForm button {
          padding: 1rem;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .loginForm button:hover {
          background: #357ab8;
        }

        .loginFooter {
          text-align: center;
          padding: 1rem;
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        /* RESPONSIVO */
        @media (max-width: 900px) {
          .loginMain {
            flex-direction: column;
          }
          .leftSection,
          .loginSection {
            max-width: 100%;
          }
          .loginSection {
            border-radius: 20px 20px 0 0;
            box-shadow: none;
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
