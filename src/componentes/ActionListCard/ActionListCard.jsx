import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ActionListCard.module.css';
import { FiChevronRight, FiCheck, FiX, FiClock, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ActionListCard = ({ title, actions, viewAllLink, onQuickAction, processedActions = new Set() }) => {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);
  
  // Função para obter prioridade baseada no tipo
  const getPriority = (type) => {
    switch (type) {
      case 'aprovar': return { level: 'alta', label: 'Alta' };
      case 'validar': return { level: 'media', label: 'Média' };
      case 'responder': return { level: 'baixa', label: 'Baixa' };
      default: return { level: 'baixa', label: 'Baixa' };
    }
  };

  // Função para obter timestamp simulado
  const getTimestamp = (id) => {
    const timestamps = {
      1: 'há 15 min',
      2: 'há 2 horas', 
      3: 'há 1 dia',
      4: 'há 30 min',
      5: 'há 3 horas'
    };
    return timestamps[id] || 'há 1 hora';
  };

  // Função para obter iniciais do apartamento
  const getAvatarInitials = (description) => {
    const match = description.match(/Apto (\d+)/);
    if (match) return match[1].slice(-2);
    return '??';
  };

  // Função para verificar se é nova (últimos 30 min)
  const isNew = (id) => {
    return [1, 4].includes(id); // Simula ações recentes
  };

  // Filtrar ações
  const filteredActions = actions.filter(action => {
    if (filter === 'all') return true;
    return action.type === filter;
  });

  // Mostrar apenas primeiras 3 se não expandido
  const visibleActions = expanded ? filteredActions : filteredActions.slice(0, 3);
  
  // Contar ações pendentes
  const pendingCount = actions.length;

  // Função para ações rápidas
  const handleQuickAction = (actionId, actionType, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAction) {
      onQuickAction(actionId, actionType);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          <h3 className={styles.cardTitle}>
            {title} 
            <span className={styles.countBadge}>({pendingCount})</span>
          </h3>
          <div className={styles.filterSection}>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos</option>
              <option value="aprovar">Aprovações</option>
              <option value="responder">Mensagens</option>
              <option value="validar">Cadastros</option>
            </select>
          </div>
        </div>
        {viewAllLink && (
          <Link href={viewAllLink} className={styles.viewAllLink}>
            Ver tudo
          </Link>
        )}
      </div>
      
      <div className={styles.actionContainer}>
        {/* Agrupamento por categoria */}
        {filter === 'all' && (
          <div className={styles.categoryGroups}>
            <div className={styles.categoryGroup}>
              <h4 className={styles.categoryTitle}>Aprovações Pendentes</h4>
              {visibleActions
                .filter(action => action.type === 'aprovar')
                .map((action) => (
                  <ActionItem
                    key={action.id}
                    action={action}
                    priority={getPriority(action.type)}
                    timestamp={getTimestamp(action.id)}
                    avatarInitials={getAvatarInitials(action.description)}
                    isNew={isNew(action.id)}
                    onQuickAction={handleQuickAction}
                    processedActions={processedActions}
                  />
                ))}
            </div>
            
            <div className={styles.categoryGroup}>
              <h4 className={styles.categoryTitle}>Outras Ações</h4>
              {visibleActions
                .filter(action => action.type !== 'aprovar')
                .map((action) => (
                  <ActionItem
                    key={action.id}
                    action={action}
                    priority={getPriority(action.type)}
                    timestamp={getTimestamp(action.id)}
                    avatarInitials={getAvatarInitials(action.description)}
                    isNew={isNew(action.id)}
                    onQuickAction={handleQuickAction}
                    processedActions={processedActions}
                  />
                ))}
            </div>
          </div>
        )}
        
        {/* Lista filtrada */}
        {filter !== 'all' && (
          <ul className={styles.actionList}>
            {visibleActions.map((action) => (
              <li key={action.id}>
                <ActionItem
                  action={action}
                  priority={getPriority(action.type)}
                  timestamp={getTimestamp(action.id)}
                  avatarInitials={getAvatarInitials(action.description)}
                  isNew={isNew(action.id)}
                  onQuickAction={handleQuickAction}
                  processedActions={processedActions}
                />
              </li>
            ))}
          </ul>
        )}
        
        {/* Botão expandir/retrair */}
        {filteredActions.length > 3 && (
          <button 
            className={styles.expandButton}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>Mostrar menos <FiChevronUp /></>
            ) : (
              <>Mostrar mais ({filteredActions.length - 3}) <FiChevronDown /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Componente separado para item de ação
const ActionItem = ({ action, priority, timestamp, avatarInitials, isNew, onQuickAction, processedActions = new Set() }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Verificar se a ação foi processada
  const isApproved = processedActions.has(`${action.id}_approve`);
  const isRejected = processedActions.has(`${action.id}_reject`);
  const isProcessed = isApproved || isRejected;
  
  return (
    <div className={`${styles.actionItemContainer} ${isProcessed ? styles.processed : ''} ${isApproved ? styles.approved : ''} ${isRejected ? styles.rejected : ''}`}>
      <Link href={action.link} className={styles.actionItem}>
        <div className={styles.actionMainContent}>
          <div className={styles.actionLeft}>
            {/* Avatar */}
            <div className={styles.avatar}>
              {avatarInitials}
            </div>
            
            {/* Detalhes da ação */}
            <div className={styles.actionDetails}>
              <div className={styles.actionHeader}>
                <span className={styles.actionIcon}>{action.icon}</span>
                <span className={styles.actionDescription}>{action.description}</span>
                {isNew && !isProcessed && <span className={styles.newBadge}>Novo</span>}
                {isApproved && <span className={styles.statusBadge + ' ' + styles.approvedBadge}>✓ Aprovado</span>}
                {isRejected && <span className={styles.statusBadge + ' ' + styles.rejectedBadge}>✗ Rejeitado</span>}
              </div>
              
              <div className={styles.actionMeta}>
                <span className={styles.timestamp}>
                  <FiClock size={12} /> {timestamp}
                </span>
                <span className={`${styles.priorityBadge} ${styles[priority.level]}`}>
                  {priority.label}
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.actionRight}>
            {/* Ações rápidas para aprovações */}
            {action.type === 'aprovar' && !isProcessed && (
              <div className={styles.quickActions}>
                <button 
                  className={`${styles.quickActionBtn} ${styles.approve}`}
                  onClick={(e) => onQuickAction(action.id, 'approve', e)}
                  title="Aprovar"
                >
                  <FiCheck size={14} />
                </button>
                <button 
                  className={`${styles.quickActionBtn} ${styles.reject}`}
                  onClick={(e) => onQuickAction(action.id, 'reject', e)}
                  title="Rejeitar"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}
            
            <span className={styles.actionLink}>
              Abrir <FiChevronRight />
            </span>
          </div>
        </div>
      </Link>
      
      {/* Área expansível com detalhes */}
      {showDetails && (
        <div className={styles.expandedDetails}>
          <p className={styles.detailText}>
            Solicitação criada em: {timestamp} • Status: Pendente
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionListCard;
