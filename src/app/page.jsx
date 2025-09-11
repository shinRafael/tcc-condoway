"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="loginContainer">
      <header className="loginHeader">
        <h1>CondoWey</h1>
      </header>



      <main className="loginMain">
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
        <p>&copy; {new Date().getFullYear()} CondoWey. Todos os direitos reservados.</p>
      </footer>

      {/* CSS embutido na página */}
      <style jsx>{`
        .loginContainer {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #4a90e2, #50c9c3);
          color: #333;
        }

        .loginHeader {
          padding: 1rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .loginMain {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .loginSection {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .welcomeText h2 {
          margin-bottom: 0.5rem;
          color: #4a90e2;
        }

        .welcomeText p {
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          color: #555;
        }

        .loginForm {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .loginForm label {
          display: flex;
          flex-direction: column;
          text-align: left;
          font-size: 0.9rem;
          color: #333;
        }

        .loginForm input {
          margin-top: 0.3rem;
          padding: 0.7rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
        }

        .loginForm input:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 4px rgba(74, 144, 226, 0.5);
        }

        .loginForm button {
          padding: 0.8rem;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
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
          font-size: 0.8rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
      `}</style>
    </div>
  );
}