'use client';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { FaCalendarCheck, FaDoorOpen } from 'react-icons/fa';

import EditReservationModal from './EditReservationModal';
import AmbienteCard from './AmbienteCard';
import { KpiCard } from '@/componentes/Dashboard/KpiCard';
import styles from './page.module.css';
import api from '@/services/api';

export default function ReservasList() {
  const [todasAsReservas, setTodasAsReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('semana');

  // Controle de modais e edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [editingReserva, setEditingReserva] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  // ==============================================================
  // 🔹 BUSCAR RESERVAS NA API
  // ==============================================================
  const fetchReservas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservas_ambientes');
      if (Array.isArray(response.data.dados)) {
        setTodasAsReservas(response.data.dados);
      } else {
        setTodasAsReservas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      toast.error('Falha ao carregar as reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // ==============================================================
  // 🔹 FILTRAR RESERVAS POR PERÍODO
  // ==============================================================
  useEffect(() => {
    const hoje = new Date();
    let filtradas = [];

    try {
      if (periodo === 'semana') {
        const inicio = startOfWeek(hoje, { locale: ptBR });
        const fim = endOfWeek(hoje, { locale: ptBR });
        filtradas = todasAsReservas.filter(r =>
          new Date(r.res_data_reserva) >= inicio && new Date(r.res_data_reserva) <= fim
        );
      } else if (periodo === 'mes') {
        const inicio = startOfMonth(hoje);
        const fim = endOfMonth(hoje);
        filtradas = todasAsReservas.filter(r =>
          new Date(r.res_data_reserva) >= inicio && new Date(r.res_data_reserva) <= fim
        );
      } else {
        filtradas = todasAsReservas;
      }
    } catch (err) {
      console.error('Erro ao filtrar reservas:', err);
    }

    setReservasFiltradas(filtradas);
  }, [periodo, todasAsReservas]);

  // ==============================================================
  // 🔹 FORMATAR DATA COM SEGURANÇA
  // ==============================================================
  const formatDateSafe = (dateString, formatString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? 'Data inválida'
        : format(date, formatString, { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  // ==============================================================
  // 🔹 ATUALIZAR STATUS (Confirmar / Cancelar)
  // ==============================================================
  const handleStatus = async (id, novoStatus) => {
    const originalReservas = [...todasAsReservas];
    setTodasAsReservas(prev =>
      prev.map(r => (r.res_id === id ? { ...r, res_status: novoStatus } : r))
    );

    try {
      await api.patch(`/reservas_ambientes/${id}`, { res_status: novoStatus });
      toast.success(`Reserva ${novoStatus.toLowerCase()}!`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Falha ao atualizar status da reserva.');
      setTodasAsReservas(originalReservas);
    }
  };

  // ==============================================================
  // 🔹 EDITAR DATA DA RESERVA
  // ==============================================================
  const handleUpdateReserva = async (reservaId, dadosAtualizados) => {
    if (!dadosAtualizados || !dadosAtualizados.res_data_reserva) {
      toast.error('Dados inválidos.');
      return;
    }

    const originalReservas = [...todasAsReservas];
    setTodasAsReservas(prev =>
      prev.map(r =>
        r.res_id === reservaId
          ? {
              ...r,
              res_data_reserva: dadosAtualizados.res_data_reserva,
              res_horario_inicio: dadosAtualizados.res_horario_inicio,
              res_horario_fim: dadosAtualizados.res_horario_fim,
            }
          : r
      )
    );
    setIsEditModalOpen(false);

    try {
      await api.patch(`/reservas_ambientes/${reservaId}`, dadosAtualizados);
      toast.success('Reserva atualizada com sucesso!');
      await fetchReservas(); // Recarrega para garantir dados atualizados
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      toast.error('Falha ao salvar a nova data.');
      setTodasAsReservas(originalReservas);
    }
  };

  // ==============================================================
  // 🔹 ABRIR MODAL DE EDIÇÃO
  // ==============================================================
  const handleOpenEditModal = reserva => {
    const conflitos = todasAsReservas
      .filter(
        r =>
          r.amd_id === reserva.amd_id &&
          r.res_id !== reserva.res_id &&
          r.res_status === 'Reservado'
      )
      .map(r => new Date(r.res_data_reserva));

    setBlockedDates(conflitos);
    setEditingReserva(reserva);
    setIsEditModalOpen(true);
  };

  // ==============================================================
  // 🔹 ABRIR DETALHES DO AMBIENTE
  // ==============================================================
  const handleSelectAmbiente = ambiente => {
    setSelectedAmbiente(ambiente);
    setIsDetailsModalOpen(true);
  };

  // ==============================================================
  // 🔹 AGRUPAR RESERVAS POR AMBIENTE
  // ==============================================================
  const groupedReservas = reservasFiltradas.reduce((acc, reserva) => {
    const nomeAmbiente = reserva.amd_nome || 'Ambiente não definido';
    (acc[nomeAmbiente] = acc[nomeAmbiente] || []).push(reserva);
    return acc;
  }, {});

  const reservasSelecionadas = selectedAmbiente
    ? groupedReservas[selectedAmbiente] || []
    : [];

  const totalReservasPeriodo = reservasFiltradas.length;
  const totalAmbientesAtivos = Object.keys(groupedReservas).length;
  const nomePeriodo =
    periodo === 'semana'
      ? 'na Semana'
      : periodo === 'mes'
      ? 'no Mês'
      : 'Totais';

  // ==============================================================
  // 🔹 RENDERIZAÇÃO
  // ==============================================================
  if (loading) {
    return <div className={styles.loadingState}>Carregando reservas...</div>;
  }

  return (
    <div>
      <Toaster position="top-center" />

      {/* KPIs do topo */}
      <div className={styles.kpiContainer}>
        <KpiCard
          icon={<FaCalendarCheck size={28} />}
          value={totalReservasPeriodo}
          title={`Reservas ${nomePeriodo}`}
        />
        <KpiCard
          icon={<FaDoorOpen size={28} />}
          value={totalAmbientesAtivos}
          title="Ambientes com Atividade"
        />
      </div>

      {/* Filtros de período */}
      <div className={styles.filtrosContainer}>
        <button
          onClick={() => setPeriodo('semana')}
          className={periodo === 'semana' ? styles.filtroAtivo : styles.filtroInativo}
        >
          Esta Semana
        </button>
        <button
          onClick={() => setPeriodo('mes')}
          className={periodo === 'mes' ? styles.filtroAtivo : styles.filtroInativo}
        >
          Este Mês
        </button>
        <button
          onClick={() => setPeriodo('todos')}
          className={periodo === 'todos' ? styles.filtroAtivo : styles.filtroInativo}
        >
          Ver Todas
        </button>
      </div>

      {/* Cards dos ambientes */}
      <div className={styles.ambienteGrid}>
        {Object.keys(groupedReservas).length > 0 ? (
          Object.entries(groupedReservas).map(([ambiente, reservas]) => (
            <AmbienteCard
              key={ambiente}
              ambiente={ambiente}
              reservas={reservas}
              onSelect={handleSelectAmbiente}
            />
          ))
        ) : (
          <p className={styles.emptyState}>
            Nenhuma reserva encontrada para o período selecionado.
          </p>
        )}
      </div>

      {/* Modal de detalhes */}
      {isDetailsModalOpen && selectedAmbiente && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>
                Reservas para: <strong>{selectedAmbiente}</strong>
              </h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className={styles.modalCloseButton}
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className={styles.cardGrid}>
              {reservasSelecionadas.length > 0 ? (
                reservasSelecionadas.map(reserva => (
                  <div
                    key={reserva.res_id}
                    className={`${styles.requestCard} ${styles[reserva.res_status.toLowerCase()]}`}
                  >
                    <div className={styles.cardHeader}>
                      <strong>{reserva.user_nome || reserva.morador_nome || `Morador ID: ${reserva.userap_id}`}</strong>
                    </div>

                    <div className={styles.cardBody}>
                      <p>
                        <strong>Para:</strong>{' '}
                        {formatDateSafe(
                          `${reserva.res_data_reserva.split('T')[0]}T${reserva.res_horario_inicio}`,
                          "dd/MM/yyyy 'às' HH:mm"
                        )}
                      </p>
                    </div>

                    <div className={styles.cardFooter}>
                      <span
                        className={`${styles.statusBadge} ${styles[reserva.res_status.toLowerCase()]}`}
                      >
                        {reserva.res_status}
                      </span>

                      <div className={styles.actionButtons}>
                        {reserva.res_status === 'Pendente' && (
                          <>
                            <button
                              title="Negar"
                              className={`${styles.iconButton} ${styles.denyButton}`}
                              onClick={() =>
                                handleStatus(reserva.res_id, 'Cancelado')
                              }
                            >
                              ✕
                            </button>
                            <button
                              title="Editar"
                              className={`${styles.iconButton} ${styles.editButton}`}
                              onClick={() => handleOpenEditModal(reserva)}
                            >
                              ✎
                            </button>
                            <button
                              title="Confirmar"
                              className={`${styles.iconButton} ${styles.confirmButton}`}
                              onClick={() =>
                                handleStatus(reserva.res_id, 'Reservado')
                              }
                            >
                              ✓
                            </button>
                          </>
                        )}
                        {reserva.res_status === 'Reservado' && (
                          <>
                            <button
                              title="Cancelar Reserva"
                              className={`${styles.iconButton} ${styles.denyButton}`}
                              onClick={() =>
                                handleStatus(reserva.res_id, 'Cancelado')
                              }
                            >
                              ✕
                            </button>
                            <button
                              title="Editar"
                              className={`${styles.iconButton} ${styles.editButton}`}
                              onClick={() => handleOpenEditModal(reserva)}
                            >
                              ✎
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhuma reserva para este ambiente.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição */}
      <EditReservationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reserva={editingReserva}
        onUpdate={handleUpdateReserva}
        excludeDatesArray={blockedDates}
      />
    </div>
  );
}
