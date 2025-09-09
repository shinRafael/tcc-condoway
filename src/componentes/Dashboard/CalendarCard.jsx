import React from 'react';
import styles from './Dashboard.module.css';
import { FiCalendar } from 'react-icons/fi';

const CalendarCard = ({ title, events }) => {
  // TODO: Integrar uma biblioteca de calendário como 'react-big-calendar'
  return (
    <div className={`${styles.card} ${styles.cardLarge}`}>
      <div className={styles.cardHeader}>
        <h3>{title}</h3>
      </div>
      <div className={styles.calendarPlaceholder}>
        <FiCalendar size={48} />
        <p>Calendário de Eventos e Reservas</p>
        <div className={styles.eventList}>
            <h4>Próximos Eventos:</h4>
            {events.map(event => (
                <div key={event.id} className={styles.eventItem}>
                    <span className={styles.eventDate}>{event.date}</span>
                    <span className={styles.eventTitle}>{event.title}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
