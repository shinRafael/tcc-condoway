'use client';
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiBox, FiBell, FiUsers, FiCheckCircle, FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import { KpiCard } from './KpiCard';
import ActionListCard from '../ActionListCard/ActionListCard';
import { StatusChamadosCard } from './StatusChamadosCard';
import { StatusOcorrenciasCard } from './StatusOcorrenciasCard';
import RecentOccurrences from './RecentOccurrences';
import styles from './Dashboard.module.css';
import api from '../../services/api'; 
import { useModal } from "@/context/ModalContext"; // <-- 1. Importar o useModal

// Dados iniciais para KPIs
const initialKpis = {
  reservas: { value: 0, title: 'Reservas Pendentes', icon: <FiCalendar />, href: '/reservas' }, // <-- Link corrigido
  encomendas: { value: 0, title: 'Encomendas a Retirar', icon: <FiBox />, href: '/encomendas' },
  ocorrencias: { value: 0, title: 'Ocorrências Abertas', icon: <FiBell />, href: '/ocorrencias' },
  visitantes: { value: 0, title: 'Visitantes Hoje', icon: <FiUsers />, href: '/visitantes' },
};

const Dashboard = () => {
  const { showModal } = useModal(); // <-- 2. Inicializar o hook
  const [kpis, setKpis] = useState(initialKpis);
  const [actions, setActions] = useState([]); 
  const [processedActions, setProcessedActions] = useState(new Set());
  const [notifications, setNotifications] = useState([]); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [removedActions, setRemovedActions] = useState(new Set());
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('🔄 Dashboard: Iniciando busca de dados...');
      
      try {
        const safeGet = (url) => 
          api.get(url).catch(error => {
            console.error(`❌ Falha ao buscar dados de '${url}':`, error.message);
            console.warn(`⚠️  Retornando dados vazios para '${url}'`);
            return { data: { sucesso: true, dados: [] } };
          });

        console.log('📡 Fazendo requisições paralelas...');
        
        const [
          visitorsResponse,
          reservationsResponse,
          encomendasResponse,
          ocorrenciasResponse,
          mensagensResponse,
          ambientesResponse
        ] = await Promise.all([
          safeGet('/visitantes/dashboard'),
          safeGet('/reservas_ambientes'),
          safeGet('/encomendas'),
          safeGet('/ocorrencias'),
          safeGet('/mensagens'),
          safeGet('/ambientes')
        ]);
        
        console.log('✅ Requisições concluídas');
        
        let visitantesDados = [];
        if (visitorsResponse.data && visitorsResponse.data.sucesso && Array.isArray(visitorsResponse.data.dados)) {
          visitantesDados = visitorsResponse.data.dados;
          console.log('📊 Total de visitantes retornados pela API:', visitantesDados.length);
          console.log('👤 Dados dos visitantes:', visitantesDados);
          setNotifications(visitantesDados);
        } else {
          setNotifications([]);
          console.warn('API de visitantes não retornou dados válidos.');
        }

        let ambientesMap = new Map();
        if (ambientesResponse?.data?.sucesso && Array.isArray(ambientesResponse.data.dados)) {
          ambientesMap = new Map(
            ambientesResponse.data.dados.map((a) => [a.amd_id, a.amd_nome]) // Ajustado para amd_id e amd_nome
          );
        } else {
          console.warn("API de ambientes falhou ou não retornou dados válidos.");
        }

        // Fazer cópia profunda do initialKpis para evitar mutação
        const newKpis = {
          reservas: { ...initialKpis.reservas, value: 0 },
          encomendas: { ...initialKpis.encomendas, value: 0 },
          ocorrencias: { ...initialKpis.ocorrencias, value: 0 },
          visitantes: { ...initialKpis.visitantes, value: 0 },
        };
        const combinedActions = [];

        // Contar apenas visitantes de HOJE
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const visitantesHoje = visitantesDados.filter(v => {
          if (!v.vst_validade_inicio) return false;
          const dataVisitante = new Date(v.vst_validade_inicio);
          dataVisitante.setHours(0, 0, 0, 0);
          return dataVisitante.getTime() === hoje.getTime();
        });
        
        console.log('📅 Visitantes de hoje:', visitantesHoje.length);
        newKpis.visitantes.value = visitantesHoje.length;
        console.log('🎯 KPI de visitantes atualizado:', newKpis.visitantes);

        if (reservationsResponse.data && reservationsResponse.data.sucesso && Array.isArray(reservationsResponse.data.dados)) {
          const pendingReservations = reservationsResponse.data.dados.filter(r => r.res_status === 'Pendente');
          newKpis.reservas.value = pendingReservations.length;
          
          pendingReservations.forEach(item => {
            const ambNome = item.amd_nome || ambientesMap.get(item.amd_id) || `Ambiente #${item.amd_id}`;
            combinedActions.push({
              id: `res_${item.res_id}`,
              type: 'aprovar',
              description: `Aprovar Reserva: ${ambNome}`,
              link: `/reservas`, // <-- 3. CORREÇÃO DE LINK (Problema 3)
              icon: <FiCheckCircle />,
              createdAt: item.res_data_reserva, 
            });
          });
        }

        if (encomendasResponse.data && encomendasResponse.data.sucesso && Array.isArray(encomendasResponse.data.dados)) {
          const pendingEncomendas = encomendasResponse.data.dados.filter(e => e.enc_status === 'Aguardando');
          newKpis.encomendas.value = pendingEncomendas.length;
          pendingEncomendas.forEach(item => {
            combinedActions.push({
              id: `enc_${item.enc_id}`,
              type: 'notificar',
              description: `Notificar Retirada: ${item.enc_nome_loja || 'Encomenda'}`,
              link: `/encomendas`, // <-- 3. CORREÇÃO DE LINK (Problema 3)
              icon: <FiBox />,
              createdAt: item.enc_data_chegada || item.created_at, 
            });
          });
        }

        if (ocorrenciasResponse.data && ocorrenciasResponse.data.sucesso && typeof ocorrenciasResponse.data.dados === 'object' && ocorrenciasResponse.data.dados.Aberta) {
            const openOcorrencias = ocorrenciasResponse.data.dados.Aberta;
            newKpis.ocorrencias.value = openOcorrencias.length;
            openOcorrencias.forEach(item => {
            const dataFormatada = new Date(item.oco_data).toLocaleDateString('pt-BR');
            combinedActions.push({
              id: `oco_${item.oco_id}`,
              type: 'analisar',
              description: `Analisar ${item.oco_categoria || 'Ocorrência'}: ${dataFormatada}`,
              link: `/ocorrencias`, // <-- 3. CORREÇÃO DE LINK (Problema 3)
              icon: <FiBell />,
              createdAt: item.oco_data, 
            });
          });
        }

        if (mensagensResponse.data && mensagensResponse.data.sucesso && Array.isArray(mensagensResponse.data.dados)) {
          const pendingMessages = mensagensResponse.data.dados.filter(m => m.msg_status === 'pendente');
          pendingMessages.forEach(item => {
            combinedActions.push({
              id: `msg_${item.msg_id}`,
              type: 'responder',
              description: `Responder Mensagem ID: ${item.msg_id}`,
              link: `/mensagens`, // <-- 3. CORREÇÃO DE LINK (Problema 3)
              icon: <FiMessageSquare />,
              createdAt: item.msg_data_envio || item.created_at, 
            });
          });
        }

        const waitingVisitors = visitantesDados.filter(v => v.vst_status === 'Aguardando');
        waitingVisitors.forEach(item => {
          combinedActions.push({
            id: `vst_${item.vst_id}`,
            type: 'liberar',
            description: `Liberar Entrada: ${item.vst_nome}`,
            link: `/visitantes`, // <-- 3. CORREÇÃO DE LINK (Problema 3)
            icon: <FiUserPlus />,
            createdAt: item.vst_data_prevista || item.created_at, 
          });
        });

        console.log('📦 Atualizando KPIs no estado:', newKpis);
        setKpis(newKpis);
        setActions(combinedActions);

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setKpis(initialKpis);
        setActions([]);
        setNotifications([]);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, []); // Removido showModal das dependências

  const filteredActions = actions.filter(action => !removedActions.has(action.id));

  const handleApproveNotification = async (notificacao) => {
    console.log('Aprovando notificação:', notificacao);
    setNotifications(prev => prev.map(n => (n.id === notificacao.id ? n : n)));
  };

  const handleRejectNotification = async (notificacao) => {
    console.log('Rejeitando notificação:', notificacao);
    setNotifications(prev => prev.map(n => (n.id === notificacao.id ? n : n)));
  };

  // <-- 4. CORREÇÃO DA AÇÃO RÁPIDA (Problema 2)
  const handleQuickAction = async (actionId, actionType) => {
    console.log(`Ação rápida: ${actionType} para ação ${actionId}`);

    const [type, id] = actionId.split('_'); // Ex: "res_1" -> ["res", "1"]

    if (!type || !id) {
      console.error("actionId mal formatado:", actionId);
      return;
    }

    // Marca como processando na UI
    setProcessedActions(prev => new Set([...prev, `${actionId}_${actionType}`]));

    try {
      let novoStatus = '';
      let endpoint = '';

      if (type === 'res') {
        endpoint = `/reservas_ambientes/${id}`;
        if (actionType === 'approve') novoStatus = 'Reservado';
        if (actionType === 'reject') novoStatus = 'Cancelado';
      } 
      // Adicionar lógica para 'oco', 'enc', 'vst' se necessário
      else {
        console.warn(`Ação rápida não implementada para: ${type}, ${actionType}`);
      }

      // Se for uma ação de API conhecida, execute-a
      if (endpoint && novoStatus) {
        await api.patch(endpoint, { res_status: novoStatus });
        console.log(`✅ Ação ${actionType} para ${actionId} executada com sucesso.`);
      }

      // Remove da lista da UI após sucesso
      setTimeout(() => {
        setRemovedActions(prev => new Set([...prev, actionId]));
      }, 1000); // Delay de 1s para o usuário ver o feedback

    } catch (error) {
      console.error(`Erro ao executar ação rápida ${actionType} para ${actionId}:`, error);
      showModal("Erro", `Falha ao ${actionType === 'approve' ? 'aprovar' : 'rejeitar'}. Tente novamente.`, "error");
      
      // Reverte o "processando" na UI em caso de erro
      setProcessedActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${actionId}_${actionType}`);
        return newSet;
      });
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.scrollArea}>
        <div className={styles.dashboardGrid}>
          {/* Linha 1 */}
          <KpiCard {...kpis.reservas} />
          <KpiCard {...kpis.encomendas} />
          <KpiCard {...kpis.ocorrencias} />
          <KpiCard {...kpis.visitantes} />

          {/* Linha 2 */}
          <ActionListCard 
            title="Ações Requeridas" 
            actions={filteredActions} 
            viewAllLink="/reservas" // Pode manter /reservas ou mudar para /dashboard/acoes
            onQuickAction={handleQuickAction}
            processedActions={processedActions}
          />
          <div className={styles.cardLarge}>
            <RecentOccurrences 
              notifications={notifications}
              isExpanded={isExpanded}
              onExpand={() => setIsExpanded(true)}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;