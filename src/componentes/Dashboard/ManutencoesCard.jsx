import styles from './Dashboard.module.css';

export function ManutencoesCard({ title = 'Manutenções', manutencoes: itens }) {
  const manutencoes = itens && itens.length ? itens : [
    { id: 1, item: 'Portão principal', prazo: 'Hoje' },
    { id: 2, item: 'Elevador Torre B', prazo: 'Amanhã' },
    { id: 3, item: 'Piscina - Aquecedor', prazo: 'Em 3 dias' },
  ];
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <ul className={styles.list}>
        {manutencoes.map(m => (
          <li key={m.id} className={styles.listItem}>
            <span>{m.item}</span>
            <span className={styles.prazo}>{m.prazo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}