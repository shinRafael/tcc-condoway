import React from 'react';
import styles from './Cards.module.css';

const EnquetesCard = ({ title, enquete }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.enqueteContent}>
        <p className={styles.enqueteTitle}>{enquete.titulo}</p>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${enquete.participacao}%` }}
          />
        </div>
        <div className={styles.enqueteFooter}>
          <span>{enquete.participacao}% de participação</span>
          <span>{enquete.prazo}</span>
        </div>
      </div>
    </div>
  );
};

export default EnquetesCard;
