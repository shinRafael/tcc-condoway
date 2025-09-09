import React from 'react';
import styles from './Cards.module.css';

const ManutencoesCard = ({ title, manutencoes }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <ul className={styles.list}>
        {manutencoes.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <span>{item.item}</span>
            <span className={styles.prazo}>{item.prazo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManutencoesCard;
