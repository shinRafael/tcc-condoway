import React from 'react';
import styles from './Dashboard.module.css';

const ChartCard = ({ title, children, className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.cardHeader}>
        <h3>{title}</h3>
      </div>
      <div className={styles.chartContainer}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
