'use client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import EditReservationModal from './EditReservationModal';
import styles from './page.module.css';

export default function ReservasList({ initialReservas }) {
  const initialMock = [
    { id: 'reserva-1', morador: 'João Silva', ambiente: 'Salão de Festas', dataReserva: '2025-09-15T18:00:00', dataPedido: '2025-09-01T00:00:00', status: 'Confirmado' },
    // Conflito (A vs B): Maria pediu primeiro, então ela tem prioridade.
    { id: 'reserva-2', morador: 'Maria Oliveira', ambiente: 'Churrasqueira', dataReserva: '2025-09-20T12:00:00', dataPedido: '2025-09-02T00:00:00', status: 'Pendente' }, // (A) - Prioridade
    { id: 'reserva-3', morador: 'Carlos Souza', ambiente: 'Churrasqueira', dataReserva: '2025-09-20T19:00:00', dataPedido: '2025-09-03T00:00:00', status: 'Pendente' }, // (B) - Conflitante
    { id: 'reserva-4', morador: 'Ana Pereira', ambiente: 'Salão de Festas', dataReserva: '2025-09-22T20:00:00', dataPedido: '2025-09-04T00:00:00', status: 'Negado' },
    { id: 'reserva-5', morador: 'Lucas Godoi', ambiente: 'Piscina', dataReserva: '2025-09-18T14:00:00', dataPedido: '2025-09-05T00:00:00', status: 'Pendente' },
  ];
  // Função de formatação segura para datas
  const formatDateSafe = (dateString, formatString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      return format(date, formatString, { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", dateString, error);
      return 'Data inválida';
    }
  };
  const [reservas, setReservas] = useState(initialMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  const handleStatus = (id, novoStatus) => {
    setReservas(prev => prev.map(r => r.id === id ? { ...r, status: novoStatus } : r));
    toast.success(`Reserva ${id} marcada como ${novoStatus}`);
  };

  const handleOpenEditModal = (reservaParaEditar) => {
    // 1. Encontra todas as reservas no mesmo ambiente para identificar conflitos.
    const conflitosPotenciais = reservas.filter(r => 
      r.ambiente === reservaParaEditar.ambiente && 
      r.id !== reservaParaEditar.id
    );

    // 2. Filtra para encontrar os dias que devem ser bloqueados.
    // Um dia é bloqueado se houver uma reserva 'Confirmada' ou 'Pendente' com maior prioridade.
    const datasBloqueadas = conflitosPotenciais
      .filter(r => 
        r.status === 'Confirmado' || 
        (r.status === 'Pendente' && new Date(r.dataPedido) < new Date(reservaParaEditar.dataPedido))
      )
      .map(r => new Date(r.dataReserva));

    setBlockedDates(datasBloqueadas);
    setEditingReserva(reservaParaEditar);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReserva(null);
  };

  const handleUpdateReserva = (reservaId, novaData) => {
    // 1. Verifica se a nova data é válida antes de prosseguir.
    if (!novaData || isNaN(new Date(novaData).getTime())) {
      toast.error('A data selecionada é inválida.');
      return;
    }

    // 2. Mapeia o array de reservas para criar uma nova versão atualizada.
    const updatedReservas = reservas.map(reserva => {
      if (reserva.id === reservaId) {
        // Salva a data no formato ISO 8601 universal
        return { ...reserva, dataReserva: novaData.toISOString() };
      }
      return reserva;
    });

    // 3. Atualiza o estado principal com o novo array.
    setReservas(updatedReservas);

    // 4. Dá feedback ao usuário e fecha o modal.
    toast.success('Reserva atualizada com sucesso!');
    handleCloseModal();
  };

  // Ordena por ambiente e dataPedido
  const sortedReservas = [...reservas].sort((a, b) => {
    if (a.ambiente < b.ambiente) return -1;
    if (a.ambiente > b.ambiente) return 1;
    return new Date(a.dataPedido) - new Date(b.dataPedido);
  });

  return (
    <div>
      <Toaster position="top-center" />
      <EditReservationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reserva={editingReserva}
        onUpdate={handleUpdateReserva}
        excludeDatesArray={blockedDates}
      />
      <div className={styles.cardGrid}>
        {sortedReservas.map((reserva, index) => (
          <div key={reserva.id} className={`${styles.requestCard} ${styles[reserva.status.toLowerCase()]}`}>
            <div className={styles.cardHeader}>
              <strong>{reserva.morador}</strong>
              <span>{reserva.ambiente}</span>
              {/* Badge de prioridade */}
              {reserva.status === 'Pendente' &&
                (index === 0 || sortedReservas[index - 1].ambiente !== reserva.ambiente) && (
                  <span className={styles.priorityBadge}>Prioridade</span>
                )
              }
            </div>
            <div className={styles.cardBody}>
              <p><strong>Para:</strong> {formatDateSafe(reserva.dataReserva, "dd/MM/yyyy 'às' HH:mm")}</p>
              <p><strong>Pedido em:</strong> {formatDateSafe(reserva.dataPedido, 'dd/MM/yyyy')}</p>
            </div>
            <div className={styles.cardFooter}>
              <span className={`${styles.statusBadge} ${styles[reserva.status.toLowerCase()]}`}>
                {reserva.status}
              </span>
              {reserva.status === 'Pendente' && (
                <div className={styles.actionButtons}>
                  <button title="Negar" className={`${styles.iconButton} ${styles.denyButton}`} onClick={() => handleStatus(reserva.id, 'Negado')}>✕</button>
                  <button title="Editar Horário" className={`${styles.iconButton} ${styles.editButton}`} onClick={() => handleOpenEditModal(reserva)}>✎</button>
                  <button title="Confirmar" className={`${styles.iconButton} ${styles.confirmButton}`} onClick={() => handleStatus(reserva.id, 'Confirmado')}>✓</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
