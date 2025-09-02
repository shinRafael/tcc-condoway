import React from 'react';
import Link from 'next/link';
import styles from './KpiCard.module.css';

const KpiCard = ({ icon, value, title, href }) => {
  return (
    <Link href={href} className={styles.linkWrapper}>
      <div className={styles.card}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.textContainer}>
          <div className={styles.value}>{value}</div>
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    </Link>
  );
};

export default KpiCard;
