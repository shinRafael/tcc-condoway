"use client";

import Header from "./components/Header";
import Footer from "../componentes/Footer";
import LoginForm from "./components/LoginForm";
import "./globals.css";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className="loginSection">
          <div className="loginContent">
            <div className="welcomeText">
              <h1>CondoWey facilitando o seu dia!</h1>
              <p>Cadastre-se para receber novidades e acessar nossos recursos.</p>
            </div>

            <LoginForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
