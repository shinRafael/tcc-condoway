import React from 'react';
import Link from 'next/link';
import { FiMessageSquare } from 'react-icons/fi';
import styles from './Cards.module.css';

const MensagensNaoLidasCard = ({ count, href }) => {
  return (
    <Link href={href} className={`${styles.card} ${styles.kpiLinkCard}`}>
      <FiMessageSquare size={28} className={styles.kpiIcon} />
      <div className={styles.kpiValue}>{count}</div>
      <div className={styles.kpiTitle}>Mensagens Não Lidas</div>
    </Link>
  );
};

export default MensagensNaoLidasCard;
