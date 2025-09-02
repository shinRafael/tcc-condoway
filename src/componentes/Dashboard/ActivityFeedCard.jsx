import React from 'react';
import styles from './Dashboard.module.css';

const ActivityFeedCard = ({ title, activities }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>{title}</h3>
      </div>
      <ul className={styles.activityFeed}>
        {activities.map((activity) => (
          <li key={activity.id} className={styles.activityItem}>
            <div className={styles.activityTime}>{activity.time}</div>
            <div className={styles.activityDescription}>{activity.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeedCard;
