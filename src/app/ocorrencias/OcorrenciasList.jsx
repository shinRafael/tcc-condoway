"use client";
import { useState, useEffect } from 'react';
import styles from "./ocorrencias.module.css";
import api from '@/services/api';
import OcorrenciaCard from './OcorrenciaCard'; // Importa o componente de card
import ChatModal from './ChatModal';     // Importa o modal de chat

// --- Componente principal da lista ---
export default function OcorrenciasList({ initialOcorrencias, onUpdate, refreshList }) {
  // Estado para armazenar as ocorrências agrupadas
  const [ocorrenciasAgrupadas, setOcorrenciasAgrupadas] = useState(() => {
      const grupos = { Aberta: [], 'Em Andamento': [], Resolvida: [], Cancelada: [] };
      return initialOcorrencias && typeof initialOcorrencias === 'object' ? { ...grupos, ...initialOcorrencias } : grupos;
  });
  // Estado para controlar qual aba (status) está ativa
  const [abaAtiva, setAbaAtiva] = useState('Aberta'); // Começa mostrando as 'Abertas'
  // Estado para controlar qual ocorrência está com o chat aberto
  const [chatAberto, setChatAberto] = useState(null);

  // Sincroniza o estado interno se a prop inicial (dados da API) mudar
  useEffect(() => {
     const gruposPadrao = { Aberta: [], 'Em Andamento': [], Resolvida: [], Cancelada: [] };
     if (initialOcorrencias && typeof initialOcorrencias === 'object') {
        const dadosValidos = {};
        for (const key in gruposPadrao) {
            dadosValidos[key] = Array.isArray(initialOcorrencias[key]) ? initialOcorrencias[key] : [];
        }
        setOcorrenciasAgrupadas(dadosValidos);
     } else {
        setOcorrenciasAgrupadas(gruposPadrao);
     }
  }, [initialOcorrencias]);

  // Função para mover o card localmente após mudança de status
  const handleLocalStatusUpdate = (id, novoStatus) => {
    let ocorrenciaMovida = null;
    const novosGrupos = { ...ocorrenciasAgrupadas };

    for (const status in novosGrupos) {
      if (!Array.isArray(novosGrupos[status])) novosGrupos[status] = [];
      const index = novosGrupos[status].findIndex(o => o && o.oco_id === id);
      if (index !== -1) {
        ocorrenciaMovida = { ...novosGrupos[status][index], oco_status: novoStatus };
        novosGrupos[status].splice(index, 1);
        break;
      }
    }

    if (ocorrenciaMovida) {
        const statusDestino = novosGrupos.hasOwnProperty(novoStatus) ? novoStatus : 'Aberta';
        if (!Array.isArray(novosGrupos[statusDestino])) novosGrupos[statusDestino] = [];
        ocorrenciaMovida.oco_status = statusDestino;
        // Adiciona no início da lista do novo status
        novosGrupos[statusDestino].unshift(ocorrenciaMovida);
    } else {
        console.warn(`Ocorrência com ID ${id} não encontrada localmente para mover.`);
        // Considerar chamar refreshList() se a ocorrência sumir for um problema
        if (refreshList) refreshList(); // Recarrega se não achar localmente
        return; // Sai para evitar erro
    }

    setOcorrenciasAgrupadas(novosGrupos);
    if (onUpdate) { onUpdate(id, { oco_status: novoStatus }); }
  };

  // Função para atualizar prioridade VISUALMENTE
   const handleLocalPriorityUpdate = (id, novaPrioridade) => {
        const novosGrupos = { ...ocorrenciasAgrupadas };
        for (const status in novosGrupos) {
             if (!Array.isArray(novosGrupos[status])) novosGrupos[status] = [];
            novosGrupos[status] = novosGrupos[status].map(o =>
                o && o.oco_id === id ? { ...o, oco_prioridade: novaPrioridade } : o
            ).filter(Boolean);
        }
        setOcorrenciasAgrupadas(novosGrupos);
        if (onUpdate) { onUpdate(id, { oco_prioridade: novaPrioridade }); }
   };

  // Chama a API para PERSISTIR a mudança de status
  const handleUpdateStatusAPI = async (id, novoStatus) => {
    try {
        await api.patch(`/ocorrencias/${id}`, { oco_status: novoStatus });
    } catch (error) {
        console.error(`Falha ao atualizar status:`, error);
        alert(`Erro ao salvar a alteração de status.`);
        if (refreshList) refreshList(); // Recarrega tudo em caso de erro
    }
  };

  // Chama a API para PERSISTIR a mudança de prioridade
   const handleUpdatePriorityAPI = async (id, novaPrioridade) => {
        try {
            await api.patch(`/ocorrencias/${id}`, { oco_prioridade: novaPrioridade });
        } catch (error) {
            console.error(`Falha ao atualizar prioridade:`, error);
            alert(`Erro ao salvar a alteração de prioridade.`);
            if (refreshList) refreshList();
        }
   };

   // Handler COMBINADO para STATUS: Atualiza UI e depois chama API
   const updateStatusHandler = (id, novoStatus) => {
       handleLocalStatusUpdate(id, novoStatus); // Atualiza UI imediatamente
       handleUpdateStatusAPI(id, novoStatus);   // Chama API em seguida
   };

    // Handler COMBINADO para PRIORIDADE: Atualiza UI e depois chama API
    const updatePriorityHandler = (id, novaPrioridade) => {
       handleLocalPriorityUpdate(id, novaPrioridade); // Atualiza UI imediatamente
       handleUpdatePriorityAPI(id, novaPrioridade);  // Chama API em seguida
   };

  // Determina a lista de ocorrências a serem exibidas com base na aba ativa
  const listaParaExibir = ocorrenciasAgrupadas[abaAtiva] || [];
  // Define a ordem das abas
  const ordemAbas = ['Aberta', 'Em Andamento', 'Resolvida', 'Cancelada'];

  return (
    // Usa o container principal para abas
    <div className={styles.containerPrincipalAbas}>
        {/* Botões/Abas de Navegação */}
        <div className={styles.botoesNavegacao}>
            {ordemAbas.map(status => (
                <button
                    key={status}
                    onClick={() => setAbaAtiva(status)}
                    // Aplica a classe 'ativo' se for a aba selecionada
                    className={abaAtiva === status ? styles.ativo : ''}
                >
                    {/* Exibe o nome do status e a contagem */}
                    {status} ({(ocorrenciasAgrupadas[status] ?? []).length})
                </button>
            ))}
        </div>

        {/* Grid de Cards da Aba Ativa */}
        <div className={styles.gridCards}>
            {listaParaExibir.length > 0 ? (
                listaParaExibir.map((o) => (
                    // Renderiza o OcorrenciaCard para cada item da lista ativa
                    <OcorrenciaCard
                        key={o?.oco_id}
                        ocorrencia={o}
                        onUpdateStatus={updateStatusHandler}
                        onUpdatePriority={updatePriorityHandler}
                        onOpenChat={setChatAberto}
                    />
                ))
            ) : (
                // Mensagem se a aba estiver vazia
                <p className={styles.emptyColumnMessage}>Nenhuma ocorrência neste status.</p>
            )}
        </div>

      {/* Renderiza o Modal do Chat (igual antes) */}
      {chatAberto && (
        <ChatModal
          ocorrencia={chatAberto}
          onClose={() => setChatAberto(null)}
        />
      )}
    </div>
  );
}