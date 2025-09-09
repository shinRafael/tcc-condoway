import React from 'react';
import styles from './Dashboard.module.css';
import { FiChevronRight } from 'react-icons/fi';

const ActionListCard = ({ title, actions }) => {
  return (
    <div className={`${styles.card} ${styles.cardLarge}`}>
      <div className={styles.cardHeader}>
        <h3>{title}</h3>
        <a href="#" className={styles.viewAllLink}>Ver tudo</a>
      </div>
      <ul className={styles.actionList}>
        {actions.map((action) => (
          <li key={action.id} className={styles.actionItem}>
            <div className={styles.actionDetails}>
              {action.icon}
              <span>{action.description}</span>
            </div>
            <a href={action.link} className={styles.actionLink}>
              Abrir <FiChevronRight />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionListCard;
