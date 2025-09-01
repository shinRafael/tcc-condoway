"use client";
import { useState } from "react";
import styles from "./mensagens.module.css";

export default function MensagensList({ conversasIniciais }) {
  const [conversas, setConversas] = useState(conversasIniciais);
  const [conversaAtivaId, setConversaAtivaId] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState("");

  // Pega a conversa ativa já atualizada
  const conversaAtiva = conversas.find((c) => c.moradorId === conversaAtivaId);

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
          ? { ...c, mensagens: [...c.mensagens, nova] }
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
        {conversas.map((c) => (
          <div
            key={c.moradorId}
            className={`${styles.conversaItem} ${
              conversaAtivaId === c.moradorId ? styles.ativo : ""
            }`}
            onClick={() => setConversaAtivaId(c.moradorId)}
          >
            <div className={styles.conversaInfo}>
              <strong>{c.moradorNome}</strong>
              <span className={styles.apartamento}>{c.apartamento}</span>
            </div>
            <p>
              {c.mensagens[c.mensagens.length - 1]?.texto.slice(0, 30) || ""}
              ...
            </p>
          </div>
        ))}
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
