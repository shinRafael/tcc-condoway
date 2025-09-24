import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiEye, FiEdit, FiBell, FiPlus, FiClock, FiMapPin, FiUser, FiGrid, FiList } from 'react-icons/fi';

const CalendarCard = ({ title, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('detailed'); // 'compact' | 'detailed'
  const [filter, setFilter] = useState('all'); // 'all' | 'manutencao' | 'reserva' | 'assembleia' | 'social'

  // Função para obter categoria e cor do evento
  const getEventCategory = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('manutenção') || titleLower.includes('manutenção')) {
      return { type: 'manutencao', color: '#3b82f6', bgColor: '#eff6ff', label: 'Manutenção' };
    } else if (titleLower.includes('festa') || titleLower.includes('reserva')) {
      return { type: 'reserva', color: '#f59e0b', bgColor: '#fffbeb', label: 'Reserva' };
    } else if (titleLower.includes('assembleia') || titleLower.includes('reunião')) {
      return { type: 'assembleia', color: '#dc2626', bgColor: '#fef2f2', label: 'Assembleia' };
    } else {
      return { type: 'social', color: '#16a34a', bgColor: '#f0fdf4', label: 'Social' };
    }
  };

  // Função para obter status do evento
  const getEventStatus = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    
    if (eventDate < today) {
      return { status: 'concluido', label: 'Concluído', icon: '✅' };
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { status: 'andamento', label: 'Hoje', icon: '🔄' };
    } else {
      return { status: 'pendente', label: 'Agendado', icon: '⏳' };
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return getEventCategory(event.title).type === filter;
  });

  // Função para ações rápidas
  const handleEventAction = (eventId, action) => {
    console.log(`Ação ${action} para evento ${eventId}`);
    // Implementar lógica específica para cada ação
  };



  return (
    <div className={`${styles.card} ${styles.cardLarge}`}>
      <div className={styles.cardHeader}>
        <div className={styles.calendarTitleSection}>
          <h3>{title}</h3>
          <div className={styles.calendarControls}>
            <button 
              onClick={goToToday} 
              className={styles.todayButton}
            >
              Hoje
            </button>
            <button 
              onClick={() => setViewMode(viewMode === 'detailed' ? 'compact' : 'detailed')}
              className={styles.viewToggle}
              title={viewMode === 'detailed' ? 'Modo Compacto' : 'Modo Detalhado'}
            >
              {viewMode === 'detailed' ? <FiList /> : <FiGrid />}
            </button>
          </div>
        </div>
        
        {/* Filtros por categoria */}
        <div className={styles.eventFilters}>
          {[
            { key: 'all', label: 'Todos', color: '#6b7280' },
            { key: 'manutencao', label: 'Manutenções', color: '#3b82f6' },
            { key: 'reserva', label: 'Reservas', color: '#f59e0b' },
            { key: 'assembleia', label: 'Assembleia', color: '#dc2626' },
            { key: 'social', label: 'Social', color: '#16a34a' }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`${styles.filterChip} ${filter === filterOption.key ? styles.active : ''}`}
              style={{
                backgroundColor: filter === filterOption.key ? filterOption.color : 'transparent',
                borderColor: filterOption.color,
                color: filter === filterOption.key ? 'white' : filterOption.color
              }}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.calendarContent}>
        {/* Lista de Eventos Simplificada */}
        <div className={styles.eventsSection}>
          <div className={styles.eventListHeader}>
            <h4>Próximos Eventos ({filteredEvents.length})</h4>
          </div>
          
          {filteredEvents.length === 0 ? (
            <div className={styles.emptyState}>
              <FiCalendar size={32} />
              <p>Nenhum evento encontrado para este filtro</p>
            </div>
          ) : (
            <div className={styles.eventList}>
              {filteredEvents.map((event) => {
                const category = getEventCategory(event.title);
                const status = getEventStatus(event.date);
                
                return (
                  <div key={event.id} className={styles.eventItem}>
                    <div className={styles.eventItemLeft}>
                      <div 
                        className={styles.eventIndicator}
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div className={styles.eventContent}>
                        <div className={styles.eventHeader}>
                          <span className={styles.eventTitle}>{event.title}</span>
                          <div className={styles.eventBadges}>
                            <span 
                              className={styles.categoryBadge}
                              style={{ 
                                backgroundColor: category.bgColor,
                                color: category.color 
                              }}
                            >
                              {category.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className={styles.eventMeta}>
                          <div className={styles.eventDate}>
                            <FiClock size={12} />
                            {event.date}
                          </div>
                          <span className={styles.statusBadge}>
                            {status.icon} {status.label}
                          </span>
                          {viewMode === 'detailed' && (
                            <div className={styles.eventLocation}>
                              <FiMapPin size={12} />
                              {category.type === 'manutencao' ? 'Área Técnica' : 'Área Social'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.eventActions}>
                      <button 
                        onClick={() => handleEventAction(event.id, 'view')}
                        className={styles.actionButton}
                        title="Ver detalhes"
                      >
                        <FiEye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEventAction(event.id, 'reminder')}
                        className={styles.actionButton}
                        title="Adicionar lembrete"
                      >
                        <FiBell size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
