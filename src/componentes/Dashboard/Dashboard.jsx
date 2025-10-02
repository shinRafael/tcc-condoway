'use client';
import React, { useState, useEffect } from 'react';
import { FiCalendar, FiBox, FiBell, FiUsers, FiCheckCircle, FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import { KpiCard } from './KpiCard';
import ActionListCard from '../ActionListCard/ActionListCard';
import { StatusChamadosCard } from './StatusChamadosCard';
import { StatusOcorrenciasCard } from './StatusOcorrenciasCard';
import RecentOccurrences from './RecentOccurrences';
import styles from './Dashboard.module.css';
import api from '../../services/api'; // Importe o serviço da API

// Dados iniciais para KPIs e Ações (pode ser removido quando a API estiver integrada)
const initialKpis = {
  reservas: { value: 0, title: 'Reservas Pendentes', icon: <FiCalendar />, href: '/reservas?status=pendente' },
  encomendas: { value: 0, title: 'Encomendas a Retirar', icon: <FiBox />, href: '/encomendas' },
  ocorrencias: { value: 0, title: 'Ocorrências Abertas', icon: <FiBell />, href: '/ocorrencias' },
  visitantes: { value: 0, title: 'Visitantes Hoje', icon: <FiUsers />, href: '/visitantes' },
};

const initialActions = [
  { id: 1, type: 'aprovar', description: 'Aprovar Reserva: Salão de Festas (Apto 101)', link: '/reservas/123', icon: <FiCheckCircle /> },
  { id: 2, type: 'responder', description: 'Responder Mensagem: Maria (Apto 302)', link: '/mensagens/456', icon: <FiMessageSquare /> },
  { id: 3, type: 'validar', description: 'Validar Novo Cadastro: Apto 504', link: '/usuarios/789', icon: <FiUserPlus /> },
];

const Dashboard = () => {
  const [kpis, setKpis] = useState(initialKpis);
  const [actions, setActions] = useState([]); // agora será preenchido pela API
  const [processedActions, setProcessedActions] = useState(new Set());
  const [notifications, setNotifications] = useState([]); // Visitantes ativos
  const [isExpanded, setIsExpanded] = useState(false);
  const [removedActions, setRemovedActions] = useState(new Set());
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Helper para que uma falha na API não quebre todas as chamadas
        const safeGet = (url) => 
          api.get(url).catch(error => {
            console.warn(`Falha ao buscar dados de '${url}':`, error.message);
            // Retorna um objeto padrão para não quebrar o resto do código
            return { data: { sucesso: false, dados: [] } };
          });

        // Usando Promise.all com o helper
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
        
        // Visitantes (dashboard)
        let visitantesDados = [];
        if (visitorsResponse.data && visitorsResponse.data.sucesso && Array.isArray(visitorsResponse.data.dados)) {
          visitantesDados = visitorsResponse.data.dados;
          setNotifications(visitantesDados);
        } else {
          setNotifications([]);
          console.warn('API de visitantes não retornou dados válidos.');
        }

        // Mapa de ambientes (id -> nome)
        let ambientesMap = new Map();
        console.log('Resposta da API de ambientes:', ambientesResponse?.data);
        if (ambientesResponse?.data?.sucesso && Array.isArray(ambientesResponse.data.dados)) {
          console.log('Dados dos ambientes:', ambientesResponse.data.dados);
          ambientesMap = new Map(
            ambientesResponse.data.dados.map((a) => {
              console.log('Mapeando ambiente:', a.id, '->', a.nome);
              return [a.id, a.nome];
            })
          );
          console.log('Mapa de ambientes criado:', Array.from(ambientesMap.entries()));
        } else {
          console.warn("API de ambientes falhou ou não retornou dados válidos. Os nomes dos ambientes podem não ser exibidos.");
        }

        const newKpis = { ...initialKpis };
        const combinedActions = [];

        // KPI Visitantes: usa a contagem que veio da API (Aguardando/Entrou)
        newKpis.visitantes.value = visitantesDados.length;

        // Reservas: filtra status 'Pendente' e usa o nome do ambiente
        if (reservationsResponse.data && reservationsResponse.data.sucesso && Array.isArray(reservationsResponse.data.dados)) {
          const pendingReservations = reservationsResponse.data.dados.filter(r => r.res_status === 'Pendente');
          newKpis.reservas.value = pendingReservations.length;
          pendingReservations.forEach(item => {
            console.log('Processando reserva:', item.res_id, 'com amd_id:', item.amd_id);
            const ambNome = item.amd_nome || ambientesMap.get(item.amd_id) || `Ambiente #${item.amd_id}`;
            console.log('Nome do ambiente encontrado:', ambNome);
            combinedActions.push({
              id: `res_${item.res_id}`,
              type: 'aprovar',
              description: `Aprovar Reserva: ${ambNome}`,
              link: `/reservas/${item.res_id}`,
              icon: <FiCheckCircle />,
              createdAt: item.res_data_reserva, // Passa a data
            });
          });
        }

        // Encomendas: status 'aguardando_retirada'
        if (encomendasResponse.data && encomendasResponse.data.sucesso && Array.isArray(encomendasResponse.data.dados)) {
          const pendingEncomendas = encomendasResponse.data.dados.filter(e => e.enc_status === 'aguardando_retirada');
          newKpis.encomendas.value = pendingEncomendas.length;
          pendingEncomendas.forEach(item => {
            combinedActions.push({
              id: `enc_${item.enc_id}`,
              type: 'notificar',
              description: `Notificar Retirada: ${item.enc_nome_loja || 'Encomenda'}`,
              link: `/encomendas/${item.enc_id}`,
              icon: <FiBox />,
              createdAt: item.enc_data_chegada || item.created_at, // Passa a data
            });
          });
        }

        // Ocorrências: status 'Aberta'
        if (ocorrenciasResponse.data && ocorrenciasResponse.data.sucesso && Array.isArray(ocorrenciasResponse.data.dados)) {
          const openOcorrencias = ocorrenciasResponse.data.dados.filter(o => o.oco_status === 'Aberta');
          newKpis.ocorrencias.value = openOcorrencias.length;
          openOcorrencias.forEach(item => {
            const dataFormatada = new Date(item.oco_data).toLocaleDateString('pt-BR');
            combinedActions.push({
              id: `oco_${item.oco_id}`,
              type: 'analisar',
              description: `Analisar ${item.oco_categoria || 'Ocorrência'}: ${dataFormatada}`,
              link: `/ocorrencias/${item.oco_id}`,
              icon: <FiBell />,
              createdAt: item.oco_data, // Passa a data
            });
          });
        }

        // Mensagens: status 'pendente' (só entram como ação, sem KPI)
        if (mensagensResponse.data && mensagensResponse.data.sucesso && Array.isArray(mensagensResponse.data.dados)) {
          const pendingMessages = mensagensResponse.data.dados.filter(m => m.msg_status === 'pendente');
          pendingMessages.forEach(item => {
            combinedActions.push({
              id: `msg_${item.msg_id}`,
              type: 'responder',
              description: `Responder Mensagem ID: ${item.msg_id}`,
              link: `/mensagens/${item.msg_id}`,
              icon: <FiMessageSquare />,
              createdAt: item.msg_data_envio || item.created_at, // Passa a data
            });
          });
        }

        // Visitantes como ação: status 'Aguardando'
        const waitingVisitors = visitantesDados.filter(v => v.vst_status === 'Aguardando');
        waitingVisitors.forEach(item => {
          combinedActions.push({
            id: `vst_${item.vst_id}`,
            type: 'liberar',
            description: `Liberar Entrada: ${item.vst_nome}`,
            link: `/visitantes/${item.vst_id}`,
            icon: <FiUserPlus />,
            createdAt: item.vst_data_prevista || item.created_at, // Passa a data
          });
        });

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
  }, []);

  // Filtrar ações removidas
  const filteredActions = actions.filter(action => !removedActions.has(action.id));

  // Handlers para aprovar/rejeitar notificações
  // NOTA: Para produção, integre com NotificationService
  const handleApproveNotification = async (notificacao) => {
    console.log('Aprovando notificação:', notificacao);
    // Simulação mantida, mas ajustada para não quebrar o estado
    setNotifications(prev => prev.map(n => (n.id === notificacao.id ? n : n)));
  };

  const handleRejectNotification = async (notificacao) => {
    console.log('Rejeitando notificação:', notificacao);
    // Simulação mantida, mas ajustada para não quebrar o estado
    setNotifications(prev => prev.map(n => (n.id === notificacao.id ? n : n)));
  };

  // Handler para ações rápidas do ActionListCard
  const handleQuickAction = (actionId, actionType) => {
    console.log(`Ação rápida: ${actionType} para ação ${actionId}`);
    
    // Marcar ação como processada temporariamente
    setProcessedActions(prev => new Set([...prev, `${actionId}_${actionType}`]));
    
    // Implementar lógica de ação rápida (placeholder)
    // ...
    
    // Remover a ação da lista após 2 segundos
    setTimeout(() => {
      // Adicionar à lista de ações removidas
      setRemovedActions(prev => new Set([...prev, actionId]));
      
      // Limpar do estado de processamento
      setProcessedActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${actionId}_${actionType}`);
        return newSet;
      });
    }, 2000);
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
            viewAllLink="/reservas"
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
