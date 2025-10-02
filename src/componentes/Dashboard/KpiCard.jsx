import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

export function KpiCard({ icon, value, title, label, href }) {
  const router = useRouter();
  const finalTitle = title || label;
  const renderedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon, { className: styles.kpiIcon, size: 40 })
    : null;

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div 
      className={`${styles.card} ${styles.kpiLinkCard} ${href ? styles.clickable : ''}`}
      onClick={handleClick}
      style={{ cursor: href ? 'pointer' : 'default' }}
    >
      {renderedIcon}
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiTitle}>{finalTitle}</div>
    </div>
  );
}
