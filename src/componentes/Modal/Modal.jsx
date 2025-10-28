"use client";
import styles from "./Modal.module.css";
import { useModal } from "@/context/ModalContext";

export default function Modal() {
  const { modal, hideModal } = useModal();

  if (!modal.isOpen) {
    return null;
  }

  const handleOverlayClick = () => {
    if (modal.closeOnOverlayClick) {
      hideModal();
    }
  };

  const handleConfirm = async () => {
    if (modal.onConfirm) {
      await modal.onConfirm();
      if (modal.autoCloseOnConfirm) {
        hideModal();
      }
    } else {
      hideModal();
    }
  };

  const handleCancel = async () => {
    if (modal.onCancel) {
      await modal.onCancel();
    }
    if (modal.autoCloseOnCancel) {
      hideModal();
    }
  };

  const showActions = modal.showCancelButton || modal.onConfirm;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3
          className={styles.modalTitle}
          data-type={modal.type}
        >
          {modal.title}
        </h3>
        <p className={styles.modalMessage}>{modal.message}</p>

        {showActions ? (
          <div className={styles.modalActions}>
            {modal.showCancelButton && (
              <button
                type="button"
                className={`${styles.modalButton} ${styles.cancelButton}`}
                onClick={handleCancel}
              >
                {modal.cancelLabel}
              </button>
            )}
            <button
              type="button"
              className={`${styles.modalButton} ${styles.confirmButton}`}
              onClick={handleConfirm}
            >
              {modal.confirmLabel}
            </button>
          </div>
        ) : (
          <button
            className={`${styles.modalButton} ${styles.confirmButton}`}
            onClick={hideModal}
          >
            {modal.confirmLabel}
          </button>
        )}
      </div>
    </div>
  );
}