"use client";
import styles from "./Modal.module.css";
import { useModal } from "@/context/ModalContext";

export default function Modal() {
  const { modal, hideModal } = useModal();

  if (!modal.isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={hideModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3
          className={styles.modalTitle}
          style={{ color: modal.type === "error" ? "#dc3545" : "#007bff" }}
        >
          {modal.title}
        </h3>
        <p className={styles.modalMessage}>{modal.message}</p>
        <button className={styles.modalButton} onClick={hideModal}>
          Fechar
        </button>
      </div>
    </div>
  );
}