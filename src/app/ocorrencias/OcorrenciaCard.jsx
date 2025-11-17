import React from 'react';
import styles from './ocorrencias.module.css'; // Usaremos o CSS compartilhado
import { FaCommentDots } from 'react-icons/fa';

// Componente para renderizar um card individual de ocorrência
const OcorrenciaCard = ({ ocorrencia, onUpdateStatus, onUpdatePriority, onOpenChat }) => {

    // Funções para obter classes CSS dinâmicas
    const getPrioridadeClass = (prioridade) => {
        switch (prioridade) {
            case "Baixa": return styles.prioridadeBaixa;
            case "Média": return styles.prioridadeMedia;
            case "Alta": return styles.prioridadeAlta;
            case "Urgente": return styles.prioridadeUrgente;
            default: return styles.prioridadeMedia; // Padrão
        }
    };
    // Helper para converter status para nome de classe CSS (sem espaço)
     const getStatusClass = (status) => {
        switch (status) {
            case "Aberta": return styles.statusAberta;
            case "Em Andamento": return styles.statusEmAndamento;
            case "Resolvida": return styles.statusResolvida;
            case "Cancelada": return styles.statusCancelada;
            default: return styles.statusAberta;
        }
    };

    // Validação básica: não renderiza nada se a ocorrência for inválida
    if (!ocorrencia || ocorrencia.oco_id == null) {
        console.warn("Tentativa de renderizar OcorrenciaCard inválido:", ocorrencia);
        return null;
    }

    return (
        // Aplica classe de prioridade para a borda esquerda do card
        <div className={`${styles.card} ${getPrioridadeClass(ocorrencia.oco_prioridade)}`}>
            {/* Cabeçalho do Card */}
            <div className={styles.cardHeader}>
                <h3>{ocorrencia.oco_protocolo || 'N/D'}</h3>
                <span className={styles.data}>
                    {/* Formata a data para dd/mm */}
                    {ocorrencia.oco_data ? new Date(ocorrencia.oco_data).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' }) : '-'}
                </span>
            </div>

            {/* Informações do Morador */}
            <div className={styles.moradorInfo}>
                <p><strong>Morador:</strong> {ocorrencia.morador_nome || 'N/A'}</p>
                <p><strong>Apto:</strong> {ocorrencia.apartamento || 'N/A'}</p>
            </div>

            {/* Descrição da Ocorrência */}
            <p className={styles.mensagem}>{ocorrencia.oco_descricao || 'Sem descrição'}</p>

            {/* Botões para Alterar Status */}
            <div className={styles.statusButtons}>
                 {/* * AQUI ESTÁ A MUDANÇA:
                   * O botão "Aberta" agora tem 'disabled={true}'.
                   * Isso acontece porque:
                   * 1. Se o status FOR "Aberta", ele já deve ser desabilitado (lógica antiga).
                   * 2. Se o status NÃO FOR "Aberta", ele também deve ser desabilitado (sua nova regra).
                   * Portanto, ele fica sempre desabilitado.
                 */}
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Aberta")}
                    disabled={true} 
                    className={`${styles.statusButton} ${styles.statusAberta} ${ocorrencia.oco_status === "Aberta" ? styles.activeStatusButton : ''}`}
                 > Aberta </button>
                 
                 {/* Os outros botões continuam com a lógica original */}
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Em Andamento")}
                    disabled={ocorrencia.oco_status === "Em Andamento"}
                    className={`${styles.statusButton} ${styles.statusEmAndamento} ${ocorrencia.oco_status === "Em Andamento" ? styles.activeStatusButton : ''}`}
                 > Em Andamento </button>
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Resolvida")}
                    disabled={ocorrencia.oco_status === "Resolvida"}
                    className={`${styles.statusButton} ${styles.statusResolvida} ${ocorrencia.oco_status === "Resolvida" ? styles.activeStatusButton : ''}`}
                 > Resolvida </button>
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Cancelada")}
                    disabled={ocorrencia.oco_status === "Cancelada"}
                     className={`${styles.statusButton} ${styles.statusCancelada} ${ocorrencia.oco_status === "Cancelada" ? styles.activeStatusButton : ''}`}
                 > Cancelada </button>
            </div>

            {/* Seletor para Alterar Prioridade */}
            <div className={styles.fieldGroup}>
                <label htmlFor={`prioridade-${ocorrencia.oco_id}`}>Prioridade:</label>
                <select
                    id={`prioridade-${ocorrencia.oco_id}`}
                    value={ocorrencia.oco_prioridade || 'Média'} // Garante valor padrão
                    onChange={(e) => onUpdatePriority(ocorrencia.oco_id, e.target.value)}
                    className={`${styles.selectField} ${getPrioridadeClass(ocorrencia.oco_prioridade)}`}
                >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                </select>
            </div>

            {/* Botão para Abrir Chat */}
            <div className={styles.actions}>
                <button
                  className={styles.chatButton}
                  onClick={() => onOpenChat(ocorrencia)} // Passa a ocorrência inteira para o modal
                  title="Abrir chat da ocorrência"
                >
                  <FaCommentDots /> Conversar
                </button>
            </div>
        </div>
    );
};

export default OcorrenciaCard;