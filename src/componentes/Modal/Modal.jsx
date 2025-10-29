"use client";
import styles from "./Modal.module.css";
import { useModal } from "@/context/ModalContext";

export default function Modal() {
  const { modal, hideModal } = useModal();


  // Add basic error check for debugging
  if (typeof hideModal !== 'function') {
    console.error("Modal: hideModal is not a function!", { modal });
    // You might want to return null or an error message here
    // return null;
  }

  if (!modal.isOpen) {
    return null;
  }

  // Function to handle clicking the overlay (background)
  const handleOverlayClick = (e) => {
    // Only close if the click is directly on the overlay div
    if (e.target === e.currentTarget && typeof hideModal === 'function') {
      hideModal();
    }
  };


  return (
    // Pass the overlay click handler here
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      {/* Prevent clicks inside the modal from closing it */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3
          className={styles.modalTitle}
          style={{ color: modal.type === "error" ? "#dc3545" : "#007bff" }}
        >
          {modal.title}
        </h3>
        <p className={styles.modalMessage}>{modal.message}</p>
        {/* --- Button Text Changed --- */}
        <button
          className={styles.modalButton}
          // Ensure hideModal is callable before assigning onClick
          onClick={typeof hideModal === 'function' ? hideModal : undefined}
        >
          OK {/* Changed from "Fechar" */}
        </button>
      </div>
    </div>
  );
}