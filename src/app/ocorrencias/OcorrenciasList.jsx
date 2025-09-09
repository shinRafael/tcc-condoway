"use client";
import { useState } from "react";
import styles from "./ocorrencias.module.css";

export default function OcorrenciasList({ initialOcorrencias }) {
  const [ocorrencias, setOcorrencias] = useState(initialOcorrencias);

  const atualizarStatus = (id, novoStatus) => {
    setOcorrencias(
      ocorrencias.map((o) =>
        o.id === id ? { ...o, status: novoStatus } : o
      )
    );
  };

  return (
    <div className={styles.grid}>
      {ocorrencias.map((o) => (
        <div
          key={o.id}
          className={`${styles.card} ${
            o.status === "pendente" ? styles.pendente : styles.visto
          }`}
        >
          <div className={styles.cardHeader}>
            <h3>{o.titulo}</h3>
            <span className={styles.data}>
              {new Date(o.data).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <p className={styles.mensagem}>{o.mensagem}</p>
          <div className={styles.actions}>
            {o.status === "pendente" ? (
              <button
                className={styles.saveButton}
                onClick={() => atualizarStatus(o.id, "visto")}
              >
                Marcar como Visto
              </button>
            ) : (
              <button
                className={styles.editButton}
                onClick={() => atualizarStatus(o.id, "pendente")}
              >
                Voltar para Pendente
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
