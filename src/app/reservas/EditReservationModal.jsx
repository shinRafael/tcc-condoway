"use client";
import { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { IoClose } from 'react-icons/io5';
import "react-datepicker/dist/react-datepicker.css";
import styles from './page.module.css';

registerLocale('pt-BR', ptBR);

export default function EditReservationModal({ isOpen, onClose, reserva, onUpdate, excludeDatesArray }) {
  const [novaData, setNovaData] = useState(null);

  useEffect(() => {
    if (reserva && reserva.dataReserva) {
      const d = new Date(reserva.dataReserva);
      setNovaData(isNaN(d.getTime()) ? null : d);
    } else {
      setNovaData(null);
    }
  }, [reserva]);

  if (!isOpen || !reserva) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Editar Reserva de <strong>{reserva.morador}</strong></h3>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <IoClose size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Ambiente:</strong> {reserva.ambiente}</p>
          <label>Selecione a nova data e hora:</label>
          <DatePicker
            selected={novaData && !isNaN(novaData.getTime()) ? novaData : null}
            onChange={(date) => setNovaData(date)}
            locale="pt-BR"
            dateFormat="dd/MM/yyyy, HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            excludeDates={excludeDatesArray}
            className={styles.datePickerInput}
            popperPlacement="top-end"
            placeholderText="Selecione uma data e horário"
          />
        </div>
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
          <button onClick={() => onUpdate(reserva.id, novaData)} className={styles.saveButton}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
}
