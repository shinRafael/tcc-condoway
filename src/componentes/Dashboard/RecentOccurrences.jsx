import styles from './Dashboard.module.css';

const statusClassMap = {
  Aberta: styles.badgeStatusAberta,
  'Em Andamento': styles.badgeStatusEmAndamento,
  Concluída: styles.badgeStatusConcluida,
};

const priorityClassMap = {
  Alta: styles.badgePriorityAlta,
  Média: styles.badgePriorityMedia,
  Baixa: styles.badgePriorityBaixa,
};

export default function RecentOccurrences({ occurrences = [] }) {
  return (
    <div className={styles.recentContainer}>
      <div className={styles.recentHeader}>
        <h2 className={styles.recentTitle}>Ocorrências Recentes</h2>
      </div>
      {occurrences.length === 0 ? (
        <div className={styles.recentEmpty}>
          <p className={styles.recentEmptyText}>Nenhuma ocorrência recente.</p>
        </div>
      ) : (
        <ul className={styles.recentList}>
          {occurrences.map((occurrence) => (
            <li key={occurrence.id} className={styles.recentItem}>
              <div className={styles.recentItemTitle}>
                <p className={styles.recentItemText}>{occurrence.title}</p>
              </div>
              <div className={styles.recentBadges}>
                <span className={`${styles.recentBadge} ${statusClassMap[occurrence.status] || ''}`}>
                  {occurrence.status}
                </span>
                <span className={`${styles.recentBadge} ${priorityClassMap[occurrence.priority] || ''}`}>
                  {occurrence.priority}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}