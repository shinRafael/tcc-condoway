"use client";

import React from "react";
import styles from "./FabButton.module.css";
import { Plus } from "lucide-react";

export default function FabButton({ label = "Adicionar", onClick = () => {} }) {
  return (
    <div className={styles.fabContainer}>
      <button type="button" className={styles.fab} onClick={onClick} aria-label={label}>
        <span className={styles.icon} aria-hidden>
          <Plus size={16} />
        </span>
        <span className={styles.text}>{label}</span>
      </button>
    </div>
  );
}
