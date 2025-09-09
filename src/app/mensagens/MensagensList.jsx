"use client";
import { useState, useEffect } from "react";
import styles from "./mensagens.module.css";

export default function MensagensList({ conversasIniciais, onMensagensUpdate }) {
  const [conversas, setConversas] = useState(conversasIniciais);
  const [conversaAtivaId, setConversaAtivaId] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState("");

  // Pega a conversa ativa já atualizada
  const conversaAtiva = conversas.find((c) => c.moradorId === conversaAtivaId);

  // Marcar mensagens como lidas quando uma conversa é selecionada
  const selecionarConversa = (moradorId) => {
    setConversaAtivaId(moradorId);
    
    // Marcar todas as mensagens do morador como lidas
    setConversas((prev) =>
      prev.map((c) =>
        c.moradorId === moradorId
          ? {
              ...c,
              mensagens: c.mensagens.map((msg) =>
                msg.remetente === "morador" ? { ...msg, lida: true } : msg
              ),
            }
          : c
      )
    );
  };

  // Notificar sobre mudanças nas conversas
  useEffect(() => {
    if (onMensagensUpdate) {
      onMensagensUpdate(conversas);
    }
  }, [conversas, onMensagensUpdate]);

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaAtiva) return;

    const nova = {
      id: Date.now(),
      remetente: "sindico",
      texto: novaMensagem,
      data: new Date().toLocaleString("pt-BR"),
    };

    setConversas((prev) =>
      prev.map((c) =>
        c.moradorId === conversaAtiva.moradorId
          ? { 
              ...c, 
              mensagens: [
                ...c.mensagens.map(msg => 
                  msg.remetente === "morador" ? { ...msg, lida: true } : msg
                ),
                nova
              ]
            }
          : c
      )
    );

    setNovaMensagem("");
  };

  return (
    <div className={styles.container}>
      {/* Sidebar de conversas */}
      <div className={styles.sidebar}>
        <h3>Conversas</h3>
        {conversas.map((c) => {
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
                {c.mensagens[c.mensagens.length - 1]?.texto.slice(0, 30) || ""}
                ...
              </p>
            </div>
          );
        })}
      </div>

      {/* Área do chat */}
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
              />
              <button className={styles.sendButton} onClick={enviarMensagem}>
                Enviar
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
