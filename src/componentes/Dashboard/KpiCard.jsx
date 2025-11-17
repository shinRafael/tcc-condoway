"use client";
import React from 'react';
import Link from 'next/link'; // 1. Importar o Link
import styles from './Dashboard.module.css';

export function KpiCard({ icon, value, title, label, href }) {
  // const router = useRouter(); // 2. Remover o useRouter
  const finalTitle = title || label;
  const renderedIcon = icon && React.isValidElement(icon)
    ? React.cloneElement(icon, { className: styles.kpiIcon, size: 40 })
    : null;

  // 3. Remover a função handleClick

  // 4. Criar o conteúdo do card
  const cardContent = (
    <>
      {renderedIcon}
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiTitle}>{finalTitle}</div>
    </>
  );

  // 5. Retornar uma div simples se não houver link
  if (!href) {
    return (
      <div className={`${styles.card} ${styles.kpiLinkCard}`}>
        {cardContent}
      </div>
    );
  }

  // 6. Retornar o componente <Link> se houver href
  return (
    <Link 
      href={href}
      className={`${styles.card} ${styles.kpiLinkCard} ${styles.clickable}`}
      style={{ cursor: 'pointer' }}
    >
      {cardContent}
    </Link>
  );
}