"use client";
import { useState, useEffect } from "react";
import styles from "./mensagens.module.css";
import api from "@/services/api";

// Renomeamos onMensagensUpdate para onBadgeUpdate para ser mais específico
export default function MensagensList({ conversasIniciais, onBadgeUpdate }) {
  const [conversas, setConversas] = useState(conversasIniciais || []);
  const [conversaAtivaId, setConversaAtivaId] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const conversaAtiva = conversaAtivaId
    ? conversas.find((c) => c.moradorId === conversaAtivaId)
    : null;

  // Sincroniza o estado interno se a prop inicial mudar
  useEffect(() => {
    setConversas(conversasIniciais || []);
  }, [conversasIniciais]);

  const selecionarConversa = (moradorId) => {
    setConversaAtivaId(moradorId);
    
    const conversasAtualizadas = conversas.map((c) =>
      c.moradorId === moradorId
        ? {
            ...c,
            mensagens: c.mensagens.map((msg) =>
              msg.remetente === "morador" ? { ...msg, lida: true } : msg
            ),
          }
        : c
    );
    setConversas(conversasAtualizadas);
    // Notifica o pai para atualizar o badge
    if (onBadgeUpdate) {
      onBadgeUpdate(conversasAtualizadas);
    }
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !conversaAtiva || enviando) return;
    setEnviando(true);
    const payload = {
      cond_id: conversaAtiva.cond_id,
      userap_id: conversaAtiva.moradorId,
      msg_mensagem: novaMensagem,
    };

    try {
      const response = await api.post('/mensagens', payload);
      if (response.data?.sucesso) {
        const mensagemRecebida = response.data.dados;
        
        const conversasAtualizadas = conversas.map((c) =>
            c.moradorId === conversaAtiva.moradorId
              ? { ...c, mensagens: [...c.mensagens, mensagemRecebida] }
              : c
        );
        setConversas(conversasAtualizadas);
        setNovaMensagem("");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Falha ao enviar a mensagem. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Conversas</h3>
        {Array.isArray(conversas) && conversas.map((c) => {
          const temMensagensNaoLidas = c.mensagens.some(
            (msg) => msg.remetente === "morador" && !msg.lida
          );
          
          return (
            <div
              key={c.moradorId}
              className={`${styles.conversaItem} ${
                conversaAtivaId === c.moradorId ? styles.ativo : ""
              } ${temMensagensNaoLidas ? styles.naoLida : ""}`}
              onClick={() => selecionarConversa(c.moradorId)}
            >
              <div className={styles.conversaInfo}>
                <strong>{c.moradorNome}</strong>
                <span className={styles.apartamento}>{c.apartamento}</span>
                {temMensagensNaoLidas && (
                  <span className={styles.badgeNaoLida}>●</span>
                )}
              </div>
              <p>
                {c.mensagens.length > 0 ? c.mensagens[c.mensagens.length - 1].texto.slice(0, 30) + '...' : 'Nenhuma mensagem'}
              </p>
            </div>
          );
        })}
      </div>
      <div className={styles.chatArea}>
        {conversaAtiva ? (
          <>
            <div className={styles.chatHeader}>
              <h3>{conversaAtiva.moradorNome}</h3>
              <span>{conversaAtiva.apartamento}</span>
            </div>
            <div className={styles.mensagens}>
              {conversaAtiva.mensagens.map((m) => (
                <div
                  key={m.id}
                  className={`${styles.mensagem} ${
                    m.remetente === "sindico"
                      ? styles.sindico
                      : styles.morador
                  }`}
                >
                  <p className={styles.texto}>{m.texto}</p>
                  <span className={styles.data}>{m.data}</span>
                </div>
              ))}
            </div>
            <div className={styles.inputArea}>
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    enviarMensagem();
                  }
                }}
                disabled={enviando}
              />
              <button className={styles.sendButton} onClick={enviarMensagem} disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>
            <p>Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  );
}