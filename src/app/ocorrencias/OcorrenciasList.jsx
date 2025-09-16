"use client";
import styles from "./ocorrencias.module.css";

export default function OcorrenciasList({ initialOcorrencias, onUpdateStatus }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Aberta":
        return styles.pendente;
      case "Em Andamento":
        return styles.emAndamento;
      case "Resolvida":
        return styles.resolvida;
      case "Cancelada":
        return styles.cancelada;
      default:
        return styles.pendente;
    }
  };

  return (
    <div className={styles.grid}>
      {initialOcorrencias.map((o) => (
        <div
          key={o.oco_id}
          className={`${styles.card} ${getStatusClass(o.oco_status)}`}
        >
          <div className={styles.cardHeader}>
            <h3>{o.oco_protocolo}</h3>
            <span className={styles.data}>
              {new Date(o.oco_data).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <p className={styles.mensagem}>
            <strong>Status:</strong> {o.oco_status}
          </p>
          <p className={styles.mensagem}>{o.oco_descricao}</p>
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={() => onUpdateStatus(o.oco_id, "Aberta")}
              disabled={o.oco_status === "Aberta"}
            >
              Aberta
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onUpdateStatus(o.oco_id, "Em Andamento")}
              disabled={o.oco_status === "Em Andamento"}
            >
              Em Andamento
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onUpdateStatus(o.oco_id, "Resolvida")}
              disabled={o.oco_status === "Resolvida"}
            >
              Resolvida
            </button>
            <button
              className={styles.actionButton}
              onClick={() => onUpdateStatus(o.oco_id, "Cancelada")}
              disabled={o.oco_status === "Cancelada"}
            >
              Cancelada
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}