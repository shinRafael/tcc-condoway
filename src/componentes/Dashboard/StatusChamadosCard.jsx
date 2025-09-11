import styles from './Dashboard.module.css';

export function StatusChamadosCard() {
  const data = [
    { name: 'Aberto', value: 12, color: '#3b82f6' },
    { name: 'Em Andamento', value: 7, color: '#f59e0b' },
    { name: 'Resolvido', value: 20, color: '#10b981' },
  ];
  return (
    <div className={`${styles.card} ${styles.cardSpan2}`}>
      <h3>Status de Chamados</h3>
      <div className={styles.chartWrapper}>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Gráfico de chamados (placeholder)</span>
      </div>
    </div>
  );
}