'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';



export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@exemplo.com' && senha === '123456') {
      router.push('/dashboard');
    } else {
      setErro('Credenciais inválidas.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Login</h1>

        <label className={styles.label}>E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          required
          className={styles.input}
        />

        <label className={styles.label}>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          required
          className={styles.input}
        />

        {erro && <p className={styles.error}>{erro}</p>}

        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}
