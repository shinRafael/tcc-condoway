"use client";
import { useState, useEffect } from 'react';
import styles from "./ocorrencias.module.css";
import api from '@/services/api';
import OcorrenciaCard from './OcorrenciaCard';
// import ChatModal from './ChatModal'; // RECURSO DE CHAT DESATIVADO
import { useModal } from '@/context/ModalContext';

export default function OcorrenciasList({ initialOcorrencias, onUpdate, refreshList }) {
  const { showModal } = useModal();
  
  const [ocorrenciasAgrupadas, setOcorrenciasAgrupadas] = useState(() => {
      const grupos = { Aberta: [], 'Em Andamento': [], Resolvida: [], Cancelada: [] };
      return initialOcorrencias && typeof initialOcorrencias === 'object' ? { ...grupos, ...initialOcorrencias } : grupos;
  });
  const [abaAtiva, setAbaAtiva] = useState('Aberta');
  // const [chatAberto, setChatAberto] = useState(null); // RECURSO DE CHAT DESATIVADO

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
        novosGrupos[statusDestino].unshift(ocorrenciaMovida);
    } else {
        console.warn(`Ocorrência com ID ${id} não encontrada localmente para mover.`);
        if (refreshList) refreshList();
        return;
    }

    setOcorrenciasAgrupadas(novosGrupos);
  };

   const handleLocalPriorityUpdate = (id, novaPrioridade) => {
        const novosGrupos = { ...ocorrenciasAgrupadas };
        for (const status in novosGrupos) {
             if (!Array.isArray(novosGrupos[status])) novosGrupos[status] = [];
            novosGrupos[status] = novosGrupos[status].map(o =>
                o && o.oco_id === id ? { ...o, oco_prioridade: novaPrioridade } : o
            ).filter(Boolean);
        }
        setOcorrenciasAgrupadas(novosGrupos);
   };

  const handleUpdateStatusAPI = async (id, novoStatus) => {
    try {
        await api.patch(`/ocorrencias/${id}`, { oco_status: novoStatus });
        console.log(`✅ Status atualizado com sucesso: ${novoStatus}`);
    } catch (error) {
        console.error(`Falha ao atualizar status:`, error);
        showModal('Erro', 'Erro ao salvar a alteração de status.', 'error');
        if (refreshList) refreshList();
    }
  };

   const handleUpdatePriorityAPI = async (id, novaPrioridade) => {
        try {
            await api.patch(`/ocorrencias/${id}`, { oco_prioridade: novaPrioridade });
            console.log(`✅ Prioridade atualizada com sucesso: ${novaPrioridade}`);
        } catch (error) {
            console.error(`Falha ao atualizar prioridade:`, error);
            showModal('Erro', 'Erro ao salvar a alteração de prioridade.', 'error');
            if (refreshList) refreshList();
        }
   };

   const updateStatusHandler = async (id, novoStatus) => {
       handleLocalStatusUpdate(id, novoStatus);
       await handleUpdateStatusAPI(id, novoStatus);
       if (onUpdate) { onUpdate(id, { oco_status: novoStatus }); }
   };

    const updatePriorityHandler = async (id, novaPrioridade) => {
       handleLocalPriorityUpdate(id, novaPrioridade);
       await handleUpdatePriorityAPI(id, novaPrioridade);
   };

  const listaParaExibir = ocorrenciasAgrupadas[abaAtiva] || [];
  const ordemAbas = ['Aberta', 'Em Andamento', 'Resolvida', 'Cancelada'];

  return (
    <div className={styles.containerPrincipalAbas}>
        <div className={styles.botoesNavegacao}>
            {ordemAbas.map(status => (
                <button
                    key={status}
                    onClick={() => setAbaAtiva(status)}
                    className={abaAtiva === status ? styles.ativo : ''}
                >
                    {status} ({(ocorrenciasAgrupadas[status] ?? []).length})
                </button>
            ))}
        </div>

        <div className={styles.gridCards}>
            {listaParaExibir.length > 0 ? (
                listaParaExibir.map((o) => (
                    <OcorrenciaCard
                        key={o?.oco_id}
                        ocorrencia={o}
                        onUpdateStatus={updateStatusHandler}
                        onUpdatePriority={updatePriorityHandler}
                        // onOpenChat={setChatAberto} // RECURSO DE CHAT DESATIVADO
                    />
                ))
            ) : (
                <p className={styles.emptyColumnMessage}>Nenhuma ocorrência neste status.</p>
            )}
        </div>

      {/* RECURSO DE CHAT DESATIVADO TEMPORARIAMENTE
      {chatAberto && (
        <ChatModal
          ocorrencia={chatAberto}
          onClose={() => setChatAberto(null)}
        />
      )}
      */}
    </div>
  );
}