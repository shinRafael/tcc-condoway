"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetarSenha } from '@/services/api';
import styles from '../login/page.module.css';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoValidado, setCodigoValidado] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Pega o email da URL quando o componente monta
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleValidarCodigo = (e) => {
    e.preventDefault();
    setErro('');
    
    if (codigo.length !== 6 || !/^\d+$/.test(codigo)) {
      setErro('O código deve conter exatamente 6 dígitos numéricos.');
      return;
    }

    setCodigoValidado(true);
    setSucesso('Código aceito! Agora defina sua nova senha.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Validações
    if (!novaSenha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    console.log('📤 Enviando dados:', {
      email,
      codigo,
      novaSenha: '***'
    });

    try {
      const response = await resetarSenha(email, codigo, novaSenha);
      
      console.log('✅ Senha redefinida:', response.data);
      
      // Usar mensagem do backend
      const mensagem = response.data?.mensagem || 'Senha redefinida com sucesso!';
      setSucesso(mensagem + ' Redirecionando para o login...');
      
      // Aguarda 2 segundos e redireciona para o login
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      console.error('❌ Erro ao redefinir senha:', error);
      console.error('📄 Resposta do backend:', error.response?.data);
      console.error('📄 Status:', error.response?.status);
      console.error('📄 Headers:', error.response?.headers);
      
      // Usar mensagem do backend
      const mensagem = error.response?.data?.mensagem || 'Erro ao redefinir senha. Verifique o código e tente novamente.';
      setErro(mensagem);
      
      // Se o código for inválido, volta para validação
      if (error.response?.status === 400) {
        setCodigoValidado(false);
      }
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
            <h2>Nova Senha</h2>
            <p>
              Digite o código recebido por e-mail<br />
              e crie sua nova senha de acesso.
            </p>
          </div>
        </aside>

        <section className={styles.loginSection}>
          <h2>Redefinir Senha</h2>
          <p>{codigoValidado ? 'Defina sua nova senha' : 'Digite o código recebido por e-mail'}</p>

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

          {!codigoValidado ? (
            // ETAPA 1: Validar código
            <form className={styles.loginForm} onSubmit={handleValidarCodigo}>
              <label>E-mail:</label>
              <input
                type="email"
                value={email}
                disabled
                readOnly
                style={{ backgroundColor: '#f3f4f6' }}
              />

              <label>Código de Recuperação (6 dígitos):</label>
              <input
                type="text"
                placeholder="123456"
                value={codigo}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCodigo(valor);
                }}
                disabled={loading}
                required
                maxLength={6}
                autoFocus
                style={{ 
                  letterSpacing: '0.5em', 
                  fontSize: '20px', 
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
              />

              <button type="submit" disabled={loading || codigo.length !== 6}>
                {loading ? 'Validando...' : 'Continuar'}
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Link href="/login" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Voltar para o login
                </Link>
              </div>
            </form>
          ) : (
            // ETAPA 2: Definir nova senha
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <label>Nova Senha:</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                autoFocus
              />

              <label>Confirmar Nova Senha:</label>
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                disabled={loading}
                required
                minLength={6}
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setCodigoValidado(false);
                    setSucesso('');
                  }}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    color: '#0066cc',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  ← Voltar para o código
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <footer className={styles.loginFooter}>
        © {new Date().getFullYear()} CondoWay
      </footer>
    </div>
  );
}
