"use client";

import React from 'react';
import styles from './IconAction.module.css';

export default function IconAction({ icon: Icon, label = '', onClick = () => {}, variant = 'default' }) {
  return (
    <button type="button" className={`${styles.iconBtn} ${styles[variant] || ''}`} onClick={onClick} aria-label={label}>
      <span className={styles.icon} aria-hidden>
        {Icon ? <Icon size={16} /> : null}
      </span>
      <span className={styles.tooltip}>{label}</span>
    </button>
  );
}
