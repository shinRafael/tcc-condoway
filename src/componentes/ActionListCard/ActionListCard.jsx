import React from 'react';
import Link from 'next/link';
import styles from './ActionListCard.module.css';
import { FiChevronRight } from 'react-icons/fi';

const ActionListCard = ({ title, actions, viewAllLink }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {viewAllLink && (
          <Link href={viewAllLink} className={styles.viewAllLink}>
            Ver tudo
          </Link>
        )}
      </div>
      <ul className={styles.actionList}>
        {actions.map((action) => (
          <li key={action.id}>
            <Link href={action.link} className={styles.actionItem}>
              <div className={styles.actionDetails}>
                <span className={styles.actionIcon}>{action.icon}</span>
                <span className={styles.actionDescription}>{action.description}</span>
              </div>
              <span className={styles.actionLink}>
                Abrir <FiChevronRight />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionListCard;
