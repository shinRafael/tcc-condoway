"use client";
import { useState } from "react";
import styles from "./notificacoes.module.css";

export default function NotificacoesList({ initialNotificacoes }) {
  const [notificacoes, setNotificacoes] = useState(initialNotificacoes);
  const [editandoId, setEditandoId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nova, setNova] = useState({ titulo: "", mensagem: "", tipo: "basica" });

  // Adicionar nova notificação
  const adicionarNotificacao = () => {
    if (!nova.titulo || !nova.mensagem) return;
    setNotificacoes([
      ...notificacoes,
      { id: Date.now(), ...nova, data: new Date().toISOString().split("T")[0] },
    ]);
    setNova({ titulo: "", mensagem: "", tipo: "basica" });
    setShowModal(false);
  };

  // Salvar edição
  const salvarEdicao = (id, atualizado) => {
    setNotificacoes(notificacoes.map((n) => (n.id === id ? { ...n, ...atualizado } : n)));
    setEditandoId(null);
  };

  // Excluir
  const excluirNotificacao = (id) => setNotificacoes(notificacoes.filter((n) => n.id !== id));

  return (
    <div>
      {/* Botão adicionar */}
      <button className={styles.addButton} onClick={() => setShowModal(true)}>
        + Adicionar Notificação
      </button>

      {/* Modal de adição */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Nova Notificação</h3>
            <input
              type="text"
              placeholder="Título"
              value={nova.titulo}
              onChange={(e) => setNova({ ...nova, titulo: e.target.value })}
            />
            <textarea
              placeholder="Mensagem"
              value={nova.mensagem}
              onChange={(e) => setNova({ ...nova, mensagem: e.target.value })}
            />
            <select
              value={nova.tipo}
              onChange={(e) => setNova({ ...nova, tipo: e.target.value })}
            >
              <option value="basica">Básica</option>
              <option value="moderada">Moderada</option>
              <option value="importante">Importante</option>
            </select>
            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={adicionarNotificacao}>Salvar</button>
              <button className={styles.cancelButton} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de notificações */}
      <div className={styles.grid}>
        {notificacoes.map((n) =>
          editandoId === n.id ? (
            <div key={n.id} className={`${styles.card} ${styles[n.tipo]}`}>
              <input
                type="text"
                defaultValue={n.titulo}
                onChange={(e) => (n.titulo = e.target.value)}
              />
              <textarea
                defaultValue={n.mensagem}
                onChange={(e) => (n.mensagem = e.target.value)}
              />
              <select
                defaultValue={n.tipo}
                onChange={(e) => (n.tipo = e.target.value)}
              >
                <option value="basica">Básica</option>
                <option value="moderada">Moderada</option>
                <option value="importante">Importante</option>
              </select>
              <div className={styles.actions}>
                <button className={styles.saveButton} onClick={() => salvarEdicao(n.id, n)}>Salvar</button>
                <button className={styles.cancelButton} onClick={() => setEditandoId(null)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div key={n.id} className={`${styles.card} ${styles[n.tipo]}`}>
              <div className={styles.cardHeader}>
                <h3>{n.titulo}</h3>
                <span className={styles.data}>
                  {new Date(n.data).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className={styles.mensagem}>{n.mensagem}</p>
              <div className={styles.actions}>
                <button className={styles.editButton} onClick={() => setEditandoId(n.id)}>Editar</button>
                <button className={styles.deleteButton} onClick={() => excluirNotificacao(n.id)}>Excluir</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
