import React from 'react';
import styles from './Dashboard.module.css';

const KpiCard = ({ icon, value, title, href = '#' }) => {
  return (
    <a href={href} className={styles.card}>
      <div className={styles.kpiContent}>
        <div className={styles.kpiIcon}>{icon}</div>
        <div className={styles.kpiText}>
          <span className={styles.kpiValue}>{value}</span>
          <span className={styles.kpiTitle}>{title}</span>
        </div>
      </div>
    </a>
  );
};

export default KpiCard;
