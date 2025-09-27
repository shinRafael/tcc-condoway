'use client';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

import EditReservationModal from './EditReservationModal';
import AmbienteCard from './AmbienteCard';
import styles from './page.module.css';
import api from '@/services/api'; // Importando a configuração da API

export default function ReservasList() {
    // 1. Inicia os estados como vazios, pois os dados virão da API
    const [todasAsReservas, setTodasAsReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservasFiltradas, setReservasFiltradas] = useState([]);
    const [periodo, setPeriodo] = useState('semana');
    
    // Estados para controle dos modais e edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedAmbiente, setSelectedAmbiente] = useState(null);
    const [editingReserva, setEditingReserva] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);

    // 2. Função para buscar os dados da API
    const fetchReservas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reservas'); // Rota da sua API
            // Garante que os dados são um array antes de setar
            setTodasAsReservas(Array.isArray(response.data.dados) ? response.data.dados : []);
        } catch (error) {
            console.error("Erro ao buscar reservas da API:", error);
            toast.error("Falha ao carregar as reservas.");
        } finally {
            setLoading(false);
        }
    };
    
    // 3. useEffect para chamar a busca de dados quando o componente carregar
    useEffect(() => {
        fetchReservas();
    }, []);

    // useEffect para filtrar as reservas com base no período selecionado
    useEffect(() => {
        const hoje = new Date();
        let filtradas = [];

        if (periodo === 'semana') {
            const inicioDaSemana = startOfWeek(hoje, { locale: ptBR });
            const fimDaSemana = endOfWeek(hoje, { locale: ptBR });
            filtradas = todasAsReservas.filter(r => {
                const dataReserva = new Date(r.dataReserva);
                return dataReserva >= inicioDaSemana && dataReserva <= fimDaSemana;
            });
        } else if (periodo === 'mes') {
            const inicioDoMes = startOfMonth(hoje);
            const fimDoMes = endOfMonth(hoje);
            filtradas = todasAsReservas.filter(r => {
                const dataReserva = new Date(r.dataReserva);
                return dataReserva >= inicioDoMes && dataReserva <= fimDoMes;
            });
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
            console.error("Erro ao formatar data:", dateString, error);
            return 'Data inválida';
        }
    };

    // Função para atualizar o STATUS (localmente e na API)
    const handleStatus = async (id, novoStatus) => {
        const originalReservas = [...todasAsReservas];
        const updatedReservas = todasAsReservas.map(r => r.id === id ? { ...r, status: novoStatus } : r);
        setTodasAsReservas(updatedReservas);
        toast.success(`Reserva marcada como ${novoStatus}`);

        try {
            // Supondo que sua API tenha uma rota PATCH para atualizar o status
            await api.patch(`/reservas/${id}/status`, { status: novoStatus });
        } catch (error) {
            console.error("Erro ao atualizar status na API:", error);
            toast.error("Falha ao salvar a alteração.");
            setTodasAsReservas(originalReservas); // Reverte a mudança em caso de erro
        }
    };

    // Função para atualizar a DATA (localmente e na API)
    const handleUpdateReserva = async (reservaId, novaData) => {
        if (!novaData || isNaN(new Date(novaData).getTime())) {
            toast.error('A data selecionada é inválida.');
            return;
        }

        const originalReservas = [...todasAsReservas];
        const updatedReservas = todasAsReservas.map(r => r.id === reservaId ? { ...r, dataReserva: novaData.toISOString() } : r);
        setTodasAsReservas(updatedReservas);
        toast.success('Reserva atualizada!');
        setIsEditModalOpen(false);

        try {
            // Supondo que sua API tenha uma rota PATCH para atualizar a reserva
            await api.patch(`/reservas/${reservaId}`, { dataReserva: novaData.toISOString() });
        } catch (error) {
            console.error("Erro ao atualizar data na API:", error);
            toast.error("Falha ao salvar a nova data.");
            setTodasAsReservas(originalReservas);
        }
    };
    
    const handleOpenEditModal = (reservaParaEditar) => {
        const conflitosPotenciais = todasAsReservas.filter(r => 
            r.ambiente === reservaParaEditar.ambiente && r.id !== reservaParaEditar.id
        );
        const datasBloqueadas = conflitosPotenciais
            .filter(r => r.status === 'Reservado' || (r.status === 'Pendente' && new Date(r.dataPedido) < new Date(reservaParaEditar.dataPedido)))
            .map(r => new Date(r.dataReserva));

        setBlockedDates(datasBloqueadas);
        setEditingReserva(reservaParaEditar);
        setIsEditModalOpen(true);
    };

    const handleSelectAmbiente = (ambiente) => {
        setSelectedAmbiente(ambiente);
        setIsDetailsModalOpen(true);
    };

    const groupedReservas = reservasFiltradas.reduce((acc, reserva) => {
        (acc[reserva.ambiente] = acc[reserva.ambiente] || []).push(reserva);
        return acc;
    }, {});

    const reservasDoAmbienteSelecionado = selectedAmbiente ? groupedReservas[selectedAmbiente] || [] : [];
    
    if (loading) {
        return <div className={styles.loadingState}>Carregando reservas...</div>;
    }

    return (
        <div>
            <Toaster position="top-center" />
            
            <div className={styles.filtrosContainer}>
                <button onClick={() => setPeriodo('semana')} className={periodo === 'semana' ? styles.filtroAtivo : styles.filtroInativo}>
                    Esta Semana
                </button>
                <button onClick={() => setPeriodo('mes')} className={periodo === 'mes' ? styles.filtroAtivo : styles.filtroInativo}>
                    Este Mês
                </button>
                <button onClick={() => setPeriodo('todos')} className={periodo === 'todos' ? styles.filtroAtivo : styles.filtroInativo}>
                    Ver Todas
                </button>
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
                            <button onClick={() => setIsDetailsModalOpen(false)} className={styles.modalCloseButton}>
                                <IoClose size={24} />
                            </button>
                        </div>
                        <div className={styles.cardGrid}>
                            {reservasDoAmbienteSelecionado.length > 0 ? (
                                reservasDoAmbienteSelecionado.map((reserva) => (
                                    <div key={reserva.id} className={`${styles.requestCard} ${styles[reserva.status.toLowerCase()]}`}>
                                        <div className={styles.cardHeader}><strong>{reserva.morador}</strong></div>
                                        <div className={styles.cardBody}>
                                            <p><strong>Para:</strong> {formatDateSafe(reserva.dataReserva, "dd/MM/yyyy 'às' HH:mm")}</p>
                                            <p><strong>Pedido em:</strong> {formatDateSafe(reserva.dataPedido, 'dd/MM/yyyy')}</p>
                                        </div>
                                        <div className={styles.cardFooter}>
                                            <span className={`${styles.statusBadge} ${styles[reserva.status.toLowerCase()]}`}>{reserva.status}</span>
                                            {reserva.status === 'Pendente' && (
                                                <div className={styles.actionButtons}>
                                                    <button title="Negar" className={`${styles.iconButton} ${styles.denyButton}`} onClick={() => handleStatus(reserva.id, 'Cancelado')}>✕</button>
                                                    <button title="Editar Horário" className={`${styles.iconButton} ${styles.editButton}`} onClick={() => handleOpenEditModal(reserva)}>✎</button>
                                                    <button title="Confirmar" className={`${styles.iconButton} ${styles.confirmButton}`} onClick={() => handleStatus(reserva.id, 'Reservado')}>✓</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma reserva para este ambiente no período selecionado.</p>
                            )}
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