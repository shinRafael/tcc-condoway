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
    const [loading, setLoading] = useState(true);
    const [reservasFiltradas, setReservasFiltradas] = useState([]);
    const [periodo, setPeriodo] = useState('semana');
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedAmbiente, setSelectedAmbiente] = useState(null);
    const [editingReserva, setEditingReserva] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reservas_ambientes');
            setTodasAsReservas(Array.isArray(response.data.dados) ? response.data.dados : []);
        } catch (error) {
            console.error("Erro ao buscar reservas da API:", error);
            toast.error("Falha ao carregar as reservas.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReservas();
    }, []);

    useEffect(() => {
        const hoje = new Date();
        let filtradas = [];

        if (periodo === 'semana') {
            const inicioDaSemana = startOfWeek(hoje, { locale: ptBR });
            const fimDaSemana = endOfWeek(hoje, { locale: ptBR });
            filtradas = todasAsReservas.filter(r => new Date(r.res_data_reserva) >= inicioDaSemana && new Date(r.res_data_reserva) <= fimDaSemana);
        } else if (periodo === 'mes') {
            const inicioDoMes = startOfMonth(hoje);
            const fimDoMes = endOfMonth(hoje);
            filtradas = todasAsReservas.filter(r => new Date(r.res_data_reserva) >= inicioDoMes && new Date(r.res_data_reserva) <= fimDoMes);
        } else {
            filtradas = todasAsReservas;
        }
        setReservasFiltradas(filtradas);
    }, [periodo, todasAsReservas]);

    const formatDateSafe = (dateString, formatString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Data inválida';
            return format(date, formatString, { locale: ptBR });
        } catch (error) {
            return 'Data inválida';
        }
    };

    const handleStatus = async (id, novoStatus) => {
        const originalReservas = [...todasAsReservas];
        const updatedReservas = todasAsReservas.map(r => r.res_id === id ? { ...r, res_status: novoStatus } : r);
        setTodasAsReservas(updatedReservas);

        try {
            await api.patch(`/reservas_ambientes/${id}`, { res_status: novoStatus });
            toast.success(`Reserva ${novoStatus.toLowerCase()}!`);
        } catch (error) {
            toast.error("Falha ao salvar a alteração.");
            setTodasAsReservas(originalReservas);
        }
    };

    const handleUpdateReserva = async (reservaId, novaData) => {
        if (!novaData || isNaN(new Date(novaData).getTime())) {
            toast.error('A data selecionada é inválida.');
            return;
        }
        const originalReservas = [...todasAsReservas];
        const updatedReservas = todasAsReservas.map(r => r.res_id === reservaId ? { ...r, res_data_reserva: novaData.toISOString(), res_horario_inicio: format(novaData, 'HH:mm:ss') } : r);
        setTodasAsReservas(updatedReservas);
        setIsEditModalOpen(false);

        try {
            await api.patch(`/reservas_ambientes/${reservaId}`, { 
                res_data_reserva: format(novaData, 'yyyy-MM-dd'),
                res_horario_inicio: format(novaData, 'HH:mm:ss')
            });
            toast.success('Reserva atualizada com sucesso!');
        } catch (error) {
            toast.error("Falha ao salvar a nova data.");
            setTodasAsReservas(originalReservas);
        }
    };
    
    const handleOpenEditModal = (reserva) => {
        const conflitos = todasAsReservas
            .filter(r => r.amd_id === reserva.amd_id && r.res_id !== reserva.res_id && r.res_status === 'Reservado')
            .map(r => new Date(r.res_data_reserva));
        
        setBlockedDates(conflitos);
        setEditingReserva(reserva);
        setIsEditModalOpen(true);
    };

    const handleSelectAmbiente = (ambiente) => {
        setSelectedAmbiente(ambiente);
        setIsDetailsModalOpen(true);
    };

    const groupedReservas = reservasFiltradas.reduce((acc, reserva) => {
        const ambienteNome = reserva.amd_nome || 'Ambiente não definido';
        (acc[ambienteNome] = acc[ambienteNome] || []).push(reserva);
        return acc;
    }, {});

    const reservasDoAmbienteSelecionado = selectedAmbiente ? groupedReservas[selectedAmbiente] || [] : [];
    
    const totalReservasPeriodo = reservasFiltradas.length;
    const totalAmbientesAtivos = Object.keys(groupedReservas).length;
    const nomePeriodo = periodo === 'semana' ? 'na Semana' : periodo === 'mes' ? 'no Mês' : 'Totais';

    if (loading) {
        return <div className={styles.loadingState}>Carregando reservas...</div>;
    }

    return (
        <div>
            <Toaster position="top-center" />
            
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

            <div className={styles.filtrosContainer}>
                <button onClick={() => setPeriodo('semana')} className={periodo === 'semana' ? styles.filtroAtivo : styles.filtroInativo}>Esta Semana</button>
                <button onClick={() => setPeriodo('mes')} className={periodo === 'mes' ? styles.filtroAtivo : styles.filtroInativo}>Este Mês</button>
                <button onClick={() => setPeriodo('todos')} className={periodo === 'todos' ? styles.filtroAtivo : styles.filtroInativo}>Ver Todas</button>
            </div>

            <div className={styles.ambienteGrid}>
                {Object.keys(groupedReservas).length > 0 ? (
                    Object.entries(groupedReservas).map(([ambiente, reservasDoAmbiente]) => (
                        <AmbienteCard 
                            key={ambiente} 
                            ambiente={ambiente} 
                            reservas={reservasDoAmbiente}
                            onSelect={handleSelectAmbiente}
                        />
                    ))
                ) : (
                    <p className={styles.emptyState}>Nenhuma reserva encontrada para o período selecionado.</p>
                )}
            </div>

            {isDetailsModalOpen && selectedAmbiente && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Reservas para: <strong>{selectedAmbiente}</strong></h3>
                            <button onClick={() => setIsDetailsModalOpen(false)} className={styles.modalCloseButton}><IoClose size={24} /></button>
                        </div>
                        <div className={styles.cardGrid}>
                            {reservasDoAmbienteSelecionado.length > 0 ? (
                                reservasDoAmbienteSelecionado.map((reserva) => (
                                    <div key={reserva.res_id} className={`${styles.requestCard} ${styles[reserva.res_status.toLowerCase()]}`}>
                                        <div className={styles.cardHeader}><strong>Morador ID: {reserva.userap_id}</strong></div>
                                        <div className={styles.cardBody}>
                                            <p><strong>Para:</strong> {formatDateSafe(`${reserva.res_data_reserva.split('T')[0]}T${reserva.res_horario_inicio}`, "dd/MM/yyyy 'às' HH:mm")}</p>
                                        </div>
                                        <div className={styles.cardFooter}>
                                            <span className={`${styles.statusBadge} ${styles[reserva.res_status.toLowerCase()]}`}>{reserva.res_status}</span>
                                            
                                            {/* --- INÍCIO DA ALTERAÇÃO --- */}
                                            <div className={styles.actionButtons}>
                                                {reserva.res_status === 'Pendente' && (
                                                    <>
                                                        <button title="Negar" className={`${styles.iconButton} ${styles.denyButton}`} onClick={() => handleStatus(reserva.res_id, 'Cancelado')}>✕</button>
                                                        <button title="Editar" className={`${styles.iconButton} ${styles.editButton}`} onClick={() => handleOpenEditModal(reserva)}>✎</button>
                                                        <button title="Confirmar" className={`${styles.iconButton} ${styles.confirmButton}`} onClick={() => handleStatus(reserva.res_id, 'Reservado')}>✓</button>
                                                    </>
                                                )}
                                                {reserva.res_status === 'Reservado' && (
                                                    <>
                                                        <button title="Cancelar Reserva" className={`${styles.iconButton} ${styles.denyButton}`} onClick={() => handleStatus(reserva.res_id, 'Cancelado')}>✕</button>
                                                        <button title="Editar" className={`${styles.iconButton} ${styles.editButton}`} onClick={() => handleOpenEditModal(reserva)}>✎</button>
                                                    </>
                                                )}
                                            </div>
                                            {/* --- FIM DA ALTERAÇÃO --- */}

                                        </div>
                                    </div>
                                ))
                            ) : (<p>Nenhuma reserva para este ambiente.</p>)}
                        </div>
                    </div>
                </div>
            )}

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