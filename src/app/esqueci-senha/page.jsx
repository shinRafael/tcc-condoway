"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { solicitarResetSenha } from '@/services/api';
import styles from '../login/page.module.css';

export default function EsqueciSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Validação básica
    if (!email || !email.includes('@')) {
      setErro('Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);

    console.log('📤 Enviando email:', email);

    try {
      const response = await solicitarResetSenha(email);
      
      console.log('✅ Resposta:', response.data);
      
      // Usar a mensagem do backend
      const mensagem = response.data?.mensagem || 'Código de verificação enviado para seu email!';
      setSucesso(mensagem);
      
      // Aguarda 2 segundos para o usuário ler a mensagem
      setTimeout(() => {
        // Redireciona para a página de redefinir senha passando o email
        router.push(`/redefinir-senha?email=${encodeURIComponent(email)}`);
      }, 2000);

    } catch (error) {
      console.error('❌ Erro ao solicitar reset:', error);
      console.error('📄 Resposta do backend:', error.response?.data);
      console.error('📄 Status:', error.response?.status);
      
      // Usar mensagem do backend
      const mensagem = error.response?.data?.mensagem || 'Erro ao enviar código de recuperação. Tente novamente.';
      setErro(mensagem);
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
            <h2>Recuperar Senha</h2>
            <p>
              Esqueceu sua senha?<br />
              Digite seu e-mail e enviaremos um código para redefinir sua senha.
            </p>
          </div>
        </aside>

        <section className={styles.loginSection}>
          <h2>Recuperar Acesso</h2>
          <p>Digite seu e-mail cadastrado</p>

          {erro && <p className={styles.erroLogin}>{erro}</p>}
          {sucesso && (
            <p style={{ 
              color: '#166534', 
              backgroundColor: '#dcfce7', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {sucesso}
            </p>
          )}

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <label>E-mail:</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link href="/login" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem' }}>
                Voltar para o login
              </Link>
            </div>
          </form>
        </section>
      </main>

      <footer className={styles.loginFooter}>
        © {new Date().getFullYear()} CondoWay
      </footer>
    </div>
  );
}
