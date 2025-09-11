import styles from './Dashboard.module.css';

export function StatusOcorrenciasCard() {
  const data = [
    { name: 'Aberta', value: 10, color: '#3b82f6' },
    { name: 'Em Andamento', value: 5, color: '#f59e0b' },
    { name: 'Concluída', value: 18, color: '#10b981' },
  ];
  return (
    <div className={`${styles.card} ${styles.cardSpan2}`}>
      <h3>Status de Ocorrências</h3>
      <div className={styles.chartWrapper}>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Gráfico de ocorrências (placeholder)</span>
      </div>
    </div>
  );
}