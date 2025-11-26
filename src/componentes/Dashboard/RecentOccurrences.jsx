import React from "react";
import styles from "./Dashboard.module.css";
import { FiUsers, FiLogIn, FiChevronDown } from "react-icons/fi";

// Função para formatar a data
const formatarData = (data) => {
  if (!data) return null;
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};

// Item da lista de notificação (Visitantes Ativos)
const NotificationItem = ({ item }) => {
  // Compatibilidade: aceita campos com ou sem prefixo vst_
  const status = item.status || item.vst_status;
  const nome = item.nome || item.vst_nome;
  const dataEntrada = item.dataEntrada || item.vst_data_entrada;
  
  const statusText = { 'Aguardando': 'Aguardando Entrada', 'Entrou': 'Presente no Condomínio' };
  const statusClass = { 'Aguardando': styles.statusAguardando, 'Entrou': styles.statusEntrou };

  return (
    <div className={styles.notificationItem}>
      <span className={`${styles.statusDot} ${statusClass[status] || ''}`}></span>
      <div className={styles.notificationContent}>
        <p className={styles.notificationTitle}>{nome}</p>
        <div className={styles.details}>
          <span className={`${styles.statusTag} ${statusClass[status] || ''}`}>
            {statusText[status] || status}
          </span>
          {dataEntrada && (
            <div className={styles.detailItem}><FiLogIn /> Entrada: {formatarData(dataEntrada)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente principal do card
export default function RecentOccurrences({
  notifications,
  isExpanded,
  onExpand
}) {
  const visibleNotifications = isExpanded ? notifications : notifications.slice(0, 4);
  const hasMoreNotifications = notifications.length > 4 && !isExpanded;

  return (
    <div className={styles.card}>
      <div className={styles.notificationHeader}>
        <FiUsers />
        <span>VISITANTES RECENTES</span>
        <span className={styles.notificationCount}>{notifications.length}</span>
      </div>

      <div className={styles.notificationsList}>
        {visibleNotifications.length > 0
          ? visibleNotifications.map((item, index) => (
              <NotificationItem 
                key={item.vst_id || `notification-${index}`} 
                item={item} 
              />
            ))
          : <p className={styles.emptyState}>Nenhum visitante aguardando ou presente.</p>
        }
      </div>

      {/* Botão de Ação para expandir */}
      {hasMoreNotifications && (
        <div className={styles.cardFooter}>
          <button onClick={onExpand} className={styles.expandButton}>
            Ver mais <FiChevronDown />
          </button>
        </div>
      )}
    </div>
  );
}