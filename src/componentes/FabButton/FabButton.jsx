"use client";

import React from "react";
import styles from "./FabButton.module.css";
import { FiPlus } from "react-icons/fi";

export default function FabButton({ label = "Adicionar", onClick = () => {} }) {
  return (
    <div className={styles.fabContainer}>
      <button type="button" className={styles.fab} onClick={onClick} aria-label={label}>
        <span className={styles.icon} aria-hidden>
          <FiPlus size={16} />
        </span>
        <span className={styles.text}>{label}</span>
      </button>
    </div>
  );
}
