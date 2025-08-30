"use client";
import styles from "../styles/LoginForm.module.css";

export default function LoginForm() {
  return (
    <form className={styles.loginForm}>
      <label htmlFor="nome">Seu nome completo</label>
      <input type="text" id="nome" name="nome" placeholder="Ex: João da Silva" required />

      <label htmlFor="email">Seu melhor e-mail</label>
      <input type="email" id="email" name="email" placeholder="exemplo@email.com" required />

      <label htmlFor="whatsapp">
        Número de WhatsApp <span style={{ color: "red" }}>*</span>
      </label>

      <div className={styles.whatsappInput}>
        <select id="country-code" className={styles.countryCode} required>
          <option disabled selected>Carregando códigos...</option>
        </select>
        <input type="tel" id="whatsapp" name="whatsapp" placeholder="(99) 91234-5678" required />
      </div>

      <button type="submit" id="entrar">Começar agora</button>
    </form>
  );
}
