"use client";
import React from 'react';
import styles from './RecentOccurrences.module.css';

const RecentOccurrences = ({ occurrences }) => {
  // Mock data para demonstração
  const mockOccurrences = [
    {
      id: '1',
      title: 'Vazamento na Garagem',
      apartment: 'Apto 201',
      status: 'Aberta',
      priority: 'Alta',
    },
    {
      id: '2',
      title: 'Problema no Elevador',
      apartment: 'Bloco A',
      status: 'Em Andamento',
      priority: 'Média',
    },
    {
      id: '3',
      title: 'Barulho Excessivo',
      apartment: 'Apto 305',
      status: 'Concluída',
      priority: 'Baixa',
    },
    {
      id: '4',
      title: 'Lâmpada Queimada no Hall',
      apartment: 'Bloco B',
      status: 'Aberta',
      priority: 'Baixa',
    },
    {
      id: '5',
      title: 'Portão da Garagem com Defeito',
      apartment: 'Entrada Principal',
      status: 'Em Andamento',
      priority: 'Alta',
    },
  ];

  const displayOccurrences = occurrences || mockOccurrences;

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Aberta':
        return styles.badgeStatusAberta;
      case 'Em Andamento':
        return styles.badgeStatusEmAndamento;
      case 'Concluída':
        return styles.badgeStatusConcluida;
      default:
        return styles.badgePriorityBaixa;
    }
  };

  const getPriorityBadgeClasses = (priority) => {
    switch (priority) {
      case 'Alta':
        return styles.badgePriorityAlta;
      case 'Média':
        return styles.badgePriorityMedia;
      case 'Baixa':
        return styles.badgePriorityBaixa;
      default:
        return styles.badgePriorityBaixa;
    }
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <div className={styles.header}>
        <h3 className={styles.title}>Últimas Ocorrências</h3>
        <a
          href="/ocorrencias"
          className={styles.viewAllLink}
        >
          Ver tudo
        </a>
      </div>

      {/* Lista de Ocorrências */}
      <ul className={styles.list}>
        {displayOccurrences.map((occurrence, index) => (
          <li 
            key={occurrence.id} 
            className={styles.listItem}
          >
            {/* Título e Apartamento */}
            <div className={styles.itemTitle}>
              <span className={styles.itemText}>
                {occurrence.title} ({occurrence.apartment})
              </span>
            </div>

            {/* Badges */}
            <div className={styles.badges}>
              {/* Badge de Status */}
              <span
                className={`${styles.badge} ${getStatusBadgeClasses(occurrence.status)}`}
              >
                {occurrence.status}
              </span>

              {/* Badge de Prioridade */}
              <span
                className={`${styles.badge} ${getPriorityBadgeClasses(occurrence.priority)}`}
              >
                {occurrence.priority}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Caso não haja ocorrências */}
      {displayOccurrences.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Nenhuma ocorrência recente</p>
        </div>
      )}
    </div>
  );
};

export default RecentOccurrences;
