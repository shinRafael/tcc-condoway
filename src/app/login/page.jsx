"use client";

export default function LoginPage() {
  return (
    <div className="loginBox">
      <h2>Melhorando </h2>
      <p>Cadastre-se para receber novidades e acessar nossos recursos.</p>

      <form className="loginForm">
        <label>Email:</label>
        <input type="email" placeholder="Digite seu email" required />

        <label>Senha:</label>
        <input type="password" placeholder="Digite sua senha" required />

        <button type="submit">Entrar</button>
      </form>

      <style jsx>{`
        .loginBox {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }

        .loginBox h2 {
          color: #4a90e2;
          margin-bottom: 0.5rem;
        }

        .loginBox p {
          font-size: 0.9rem;
          color: #666; 
          margin-bottom: 1.5rem;
        }
        .loginForm {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .loginForm input {
          padding: 0.7rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
        }

        .loginForm input:focus {
          border-color: #4a90e2;
          outline: none;
          box-shadow: 0 0 4px rgba(74, 144, 226, 0.5);
        }

        .loginForm button {
          padding: 0.8rem;
          background: #4a90e2;
          color: #fff;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .loginForm button:hover {
          background: #357ab8;
        }
      `}</style>
    </div>
  );
}