"use client";
import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './page.module.css';

export default function EditReservationModal({ isOpen, onClose, reserva, onUpdate, excludeDatesArray }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHoraInicio, setSelectedHoraInicio] = useState('');
  const [selectedHoraFim, setSelectedHoraFim] = useState('');

  // Gerar array de horários (07:00 até 23:00, de 30 em 30 min)
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 7; h <= 23; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      if (h < 23) slots.push(`${String(h).padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (reserva && reserva.res_data_reserva) {
      const datePart = reserva.res_data_reserva.split('T')[0];
      setSelectedDate(datePart);
      setSelectedHoraInicio(reserva.res_horario_inicio?.substring(0, 5) || '');
      setSelectedHoraFim(reserva.res_horario_fim?.substring(0, 5) || '');
    } else {
      setSelectedDate('');
      setSelectedHoraInicio('');
      setSelectedHoraFim('');
    }
  }, [reserva]);

  const handleSave = () => {
    if (!selectedDate || !selectedHoraInicio || !selectedHoraFim) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    if (selectedHoraFim <= selectedHoraInicio) {
      alert('O horário de fim deve ser maior que o horário de início');
      return;
    }

    onUpdate(reserva.res_id, {
      res_data_reserva: selectedDate,
      res_horario_inicio: selectedHoraInicio + ':00',
      res_horario_fim: selectedHoraFim + ':00',
    });
  };

  if (!isOpen || !reserva) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Editar Reserva - <strong>{reserva.user_nome || reserva.morador_nome || `Morador ID: ${reserva.userap_id}`}</strong></h3>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <IoClose size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Ambiente:</strong> {reserva.amd_nome}</p>
          
          <div className={styles.formGroup}>
            <label>Data da Reserva:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Horário de Início:</label>
            <div className={styles.timeSelectContainer}>
              {timeSlots.map(time => (
                <button
                  key={`inicio-${time}`}
                  type="button"
                  className={`${styles.timeButton} ${selectedHoraInicio === time ? styles.timeButtonActive : ''}`}
                  onClick={() => setSelectedHoraInicio(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Horário de Fim:</label>
            <div className={styles.timeSelectContainer}>
              {timeSlots.map(time => (
                <button
                  key={`fim-${time}`}
                  type="button"
                  className={`${styles.timeButton} ${selectedHoraFim === time ? styles.timeButtonActive : ''}`}
                  onClick={() => setSelectedHoraFim(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
          <button onClick={handleSave} className={styles.saveButton}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
}
