import React from 'react';
import styles from './ocorrencias.module.css';
import { FaCommentDots, FaPaperclip } from 'react-icons/fa'; // Adicionado FaPaperclip

const OcorrenciaCard = ({ ocorrencia, onUpdateStatus, onUpdatePriority, onOpenChat }) => {

    const getPrioridadeClass = (prioridade) => {
        switch (prioridade) {
            case "Baixa": return styles.prioridadeBaixa;
            case "Média": return styles.prioridadeMedia;
            case "Alta": return styles.prioridadeAlta;
            case "Urgente": return styles.prioridadeUrgente;
            default: return styles.prioridadeMedia;
        }
    };
    
    // Verifica se a ocorrência já foi encerrada para bloquear edições
    const isFinalizado = ["Resolvida", "Cancelada"].includes(ocorrencia.oco_status);

    // Função auxiliar para montar a URL da imagem
    const getImageUrl = (url) => {
        if (!url) return null;
        // Se já vier com http (do mobile antigo com IP), usa ela mesma. 
        // Se vier relativa (/uploads/...), adiciona a base do backend local.
        if (url.startsWith('http')) return url;
        return `http://localhost:3333${url}`; 
    };

    const imagemUrl = getImageUrl(ocorrencia.oco_imagem);

    if (!ocorrencia || ocorrencia.oco_id == null) {
        console.warn("Tentativa de renderizar OcorrenciaCard inválido:", ocorrencia);
        return null;
    }

    return (
        <div className={`${styles.card} ${getPrioridadeClass(ocorrencia.oco_prioridade)}`}>
            <div className={styles.cardHeader}>
                <h3>{ocorrencia.oco_protocolo || 'N/D'}</h3>
                <span className={styles.data}>
                    {ocorrencia.oco_data ? new Date(ocorrencia.oco_data).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' }) : '-'}
                </span>
            </div>

            <div className={styles.moradorInfo}>
                <p><strong>Morador:</strong> {ocorrencia.morador_nome || 'N/A'}</p>
                <p><strong>Apto:</strong> {ocorrencia.apartamento || 'N/A'}</p>
                {/* Mostra a prioridade como texto simples se estiver finalizado (já que o seletor some) */}
                {isFinalizado && (
                    <p><strong>Prioridade:</strong> {ocorrencia.oco_prioridade}</p>
                )}
            </div>

            <p className={styles.mensagem}>{ocorrencia.oco_descricao || 'Sem descrição'}</p>

            {/* --- BLOCO: EXIBIÇÃO DA IMAGEM --- */}
            {imagemUrl && (
                <div className={styles.anexoContainer}>
                    <p className={styles.anexoLabel}><FaPaperclip /> Anexo:</p>
                    <a href={imagemUrl} target="_blank" rel="noopener noreferrer" title="Clique para ampliar">
                        <div className={styles.imagemWrapper}>
                            <img 
                                src={imagemUrl} 
                                alt="Evidência da Ocorrência" 
                                className={styles.imagemOcorrencia}
                                onError={(e) => {e.target.style.display='none';}} // Esconde se falhar ao carregar
                            />
                        </div>
                        <span className={styles.verImagemTexto}>Clique para ver original</span>
                    </a>
                </div>
            )}
            {/* --------------------------------------- */}

            {/* Botões de Status */}
            <div className={styles.statusButtons}>
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Aberta")}
                    disabled={true} 
                    className={`${styles.statusButton} ${styles.statusAberta} ${ocorrencia.oco_status === "Aberta" ? styles.activeStatusButton : ''}`}
                 > Aberta </button>
                 
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Em Andamento")}
                    // Desabilita se já for 'Em Andamento' OU se estiver finalizado
                    disabled={ocorrencia.oco_status === "Em Andamento" || isFinalizado}
                    className={`${styles.statusButton} ${styles.statusEmAndamento} ${ocorrencia.oco_status === "Em Andamento" ? styles.activeStatusButton : ''}`}
                 > Em Andamento </button>
                 
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Resolvida")}
                    // Desabilita se já for 'Resolvida' OU se estiver finalizado (Cancelada)
                    disabled={ocorrencia.oco_status === "Resolvida" || isFinalizado}
                    className={`${styles.statusButton} ${styles.statusResolvida} ${ocorrencia.oco_status === "Resolvida" ? styles.activeStatusButton : ''}`}
                 > Resolvida </button>
                 
                 <button
                    onClick={() => onUpdateStatus(ocorrencia.oco_id, "Cancelada")}
                    // Desabilita se já for 'Cancelada' OU se estiver finalizado (Resolvida)
                    disabled={ocorrencia.oco_status === "Cancelada" || isFinalizado}
                     className={`${styles.statusButton} ${styles.statusCancelada} ${ocorrencia.oco_status === "Cancelada" ? styles.activeStatusButton : ''}`}
                 > Cancelada </button>
            </div>

            {/* Seletor de Prioridade (SÓ APARECE SE NÃO ESTIVER FINALIZADO) */}
            {!isFinalizado && (
                <div className={styles.fieldGroup}>
                    <label htmlFor={`prioridade-${ocorrencia.oco_id}`}>Prioridade:</label>
                    <select
                        id={`prioridade-${ocorrencia.oco_id}`}
                        value={ocorrencia.oco_prioridade || 'Média'}
                        onChange={(e) => onUpdatePriority(ocorrencia.oco_id, e.target.value)}
                        className={`${styles.selectField} ${getPrioridadeClass(ocorrencia.oco_prioridade)}`}
                    >
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Urgente">Urgente</option>
                    </select>
                </div>
            )}

            {/* RECURSO DE CHAT DESATIVADO
            <div className={styles.actions}>
                <button
                  className={styles.chatButton}
                  onClick={() => onOpenChat(ocorrencia)}
                  title="Abrir chat da ocorrência"
                >
                  <FaCommentDots /> Conversar
                </button>
            </div>
            */}
        </div>
    );
};

export default OcorrenciaCard;