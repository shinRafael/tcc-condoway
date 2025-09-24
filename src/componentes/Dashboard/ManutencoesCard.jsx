import styles from './Dashboard.module.css';
import { FiTool } from 'react-icons/fi';

export function ManutencoesCard({ title = 'Manutenções', manutencoes: itens }) {
  const manutencoes = itens && itens.length ? itens : [
    { id: 1, item: 'Portão principal', prazo: 'Hoje' },
    { id: 2, item: 'Elevador Torre B', prazo: 'Amanhã' },
    { id: 3, item: 'Piscina - Aquecedor', prazo: 'Em 3 dias' },
  ];

  // Função para determinar a classe CSS do prazo baseada na urgência
  const getPrazoClass = (prazo) => {
    if (prazo.toLowerCase().includes('hoje')) return styles.prazoUrgente;
    if (prazo.toLowerCase().includes('amanhã') || prazo.includes('em 1 dia') || prazo.includes('em 2 dia') || prazo.includes('em 3 dia')) return styles.prazoModerado;
    return styles.prazo;
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <ul className={styles.manutencoesList}>
        {manutencoes.map(m => (
          <li key={m.id} className={styles.manutencaoItem}>
            <div className={styles.manutencaoInfo}>
              <FiTool className={styles.manutencaoIcon} />
              <span className={styles.manutencaoTexto}>{m.item}</span>
            </div>
            <span className={getPrazoClass(m.prazo)}>{m.prazo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}