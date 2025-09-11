import React from 'react';
import styles from './Dashboard.module.css';

export function KpiCard({ icon, value, title, label }) {
  const finalTitle = title || label;
  const renderedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon, { className: styles.kpiIcon, size: 40 })
    : null;

  return (
    <div className={`${styles.card} ${styles.kpiLinkCard}`}>
      {renderedIcon}
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiTitle}>{finalTitle}</div>
    </div>
  );
}
