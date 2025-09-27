// src/app/reservas/AmbienteCard.jsx
'use client';
import styles from './page.module.css';

// Ícone para a notificação
const PendingIcon = () => (
  <span className={styles.pendingIcon} title="Há reservas pendentes">
    !
  </span>
);

export default function AmbienteCard({ ambiente, reservas, onSelect }) {
  // Verifica se existe alguma reserva com status "Pendente"
  const hasPending = reservas.some(r => r.status === 'Pendente');
  
  // Conta quantas reservas existem para este ambiente
  const totalReservas = reservas.length;

  return (
    <div 
      className={`${styles.ambienteCard} ${hasPending ? styles.ambientePendente : ''}`} 
      onClick={() => onSelect(ambiente)}
    >
      <div className={styles.ambienteCardHeader}>
        <h3 className={styles.ambienteCardTitle}>{ambiente}</h3>
        {hasPending && <PendingIcon />}
      </div>
      <div className={styles.ambienteCardBody}>
        <p>{totalReservas} reserva(s) registrada(s)</p>
        <span className={styles.ambienteCardAction}>Ver Detalhes</span>
      </div>
    </div>
  );
}