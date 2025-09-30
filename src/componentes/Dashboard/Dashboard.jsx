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

// Fonte de dados por filtro
function getDashboardData(scope, notifications) {
  if (scope === 'Esta Semana') {
    return {
      kpis: {
        reservas: { value: 12, title: 'Reservas na Semana', icon: <FiCalendar />, href: '/reservas?periodo=semana' },
        encomendas: { value: 25, title: 'Encomendas na Semana', icon: <FiBox />, href: '/encomendas?periodo=semana' },
        ocorrencias: { value: 9, title: 'Ocorrências na Semana', icon: <FiBell />, href: '/ocorrencias?periodo=semana' },
        visitantes: { value: 210, title: 'Visitantes na Semana', icon: <FiUsers />, href: '/visitantes?periodo=semana' },
      },
      acoesRequeridas: [
        { id: 1, type: 'aprovar', description: 'Aprovar Reserva: Churrasqueira (Apto 402)', link: '/reservas/321', icon: <FiCheckCircle /> },
        { id: 2, type: 'responder', description: 'Responder Mensagem: João (Apto 1203)', link: '/mensagens/654', icon: <FiMessageSquare /> },
        { id: 3, type: 'validar', description: 'Validar Novo Cadastro: Apto 804', link: '/usuarios/987', icon: <FiUserPlus /> },
        { id: 4, type: 'aprovar', description: 'Aprovar Reserva: Salão de Festas (Apto 305)', link: '/reservas/305', icon: <FiCheckCircle /> },
      ],
      ocorrenciasRecentes: notifications,
    };
  }

  if (scope === 'Este Mês') {
    return {
      kpis: {
        reservas: { value: 48, title: 'Reservas no Mês', icon: <FiCalendar />, href: '/reservas?periodo=mes' },
        encomendas: { value: 102, title: 'Encomendas no Mês', icon: <FiBox />, href: '/encomendas?periodo=mes' },
        ocorrencias: { value: 34, title: 'Ocorrências no Mês', icon: <FiBell />, href: '/ocorrencias?periodo=mes' },
        visitantes: { value: 910, title: 'Visitantes no Mês', icon: <FiUsers />, href: '/visitantes?periodo=mes' },
      },
      acoesRequeridas: [
        { id: 1, type: 'aprovar', description: 'Aprovar Reserva: Salão (Apto 1201)', link: '/reservas/1201', icon: <FiCheckCircle /> },
        { id: 2, type: 'responder', description: 'Responder Mensagem: Síndico', link: '/mensagens/777', icon: <FiMessageSquare /> },
        { id: 3, type: 'validar', description: 'Validar Cadastro: Apto 301', link: '/usuarios/301', icon: <FiUserPlus /> },
        { id: 4, type: 'aprovar', description: 'Aprovar Reserva: Churrasqueira (Apto 402)', link: '/reservas/402', icon: <FiCheckCircle /> },
        { id: 5, type: 'responder', description: 'Responder Mensagem: Portaria', link: '/mensagens/888', icon: <FiMessageSquare /> },
      ],
      ocorrenciasRecentes: notifications,
    };
  }

  // Default: Hoje
  return {
    kpis: initialKpis,
    acoesRequeridas: initialActions,
    ocorrenciasRecentes: notifications,
  };
}

const Dashboard = () => {
  const [filter, setFilter] = useState('Hoje');
  const [kpis, setKpis] = useState(initialKpis);
  const [actions, setActions] = useState([]); // agora será preenchido pela API
  const [processedActions, setProcessedActions] = useState(new Set());
  const [notifications, setNotifications] = useState([]); // Visitantes ativos
  const [isExpanded, setIsExpanded] = useState(false);
  const [removedActions, setRemovedActions] = useState(new Set());
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Usando Promise.all para buscar os dados em paralelo
        const [visitorsResponse, reservationsResponse, encomendasResponse, ocorrenciasResponse, mensagensResponse] = await Promise.all([
          api.get('/visitantes/dashboard'),
          api.get('/reservas_ambientes'),
          api.get('/encomendas'),
          api.get('/ocorrencias'),
          api.get('/mensagens'),
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

        const newKpis = { ...initialKpis };
        const combinedActions = [];

        // KPI Visitantes: usa a contagem que veio da API (Aguardando/Entrou)
        newKpis.visitantes.value = visitantesDados.length;

        // Reservas: filtra status 'Pendente'
        if (reservationsResponse.data && reservationsResponse.data.sucesso && Array.isArray(reservationsResponse.data.dados)) {
          const pendingReservations = reservationsResponse.data.dados.filter(r => r.res_status === 'Pendente');
          newKpis.reservas.value = pendingReservations.length;
          pendingReservations.forEach(item => {
            combinedActions.push({
              id: `res_${item.res_id}`,
              type: 'aprovar',
              description: `Aprovar Reserva ID: ${item.res_id}`,
              link: `/reservas/${item.res_id}`,
              icon: <FiCheckCircle />,
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
            });
          });
        }

        // Ocorrências: status 'Aberta'
        if (ocorrenciasResponse.data && ocorrenciasResponse.data.sucesso && Array.isArray(ocorrenciasResponse.data.dados)) {
          const openOcorrencias = ocorrenciasResponse.data.dados.filter(o => o.oco_status === 'Aberta');
          newKpis.ocorrencias.value = openOcorrencias.length;
          openOcorrencias.forEach(item => {
            combinedActions.push({
              id: `oco_${item.oco_id}`,
              type: 'analisar',
              description: `Analisar Ocorrência: ${item.oco_protocolo || item.oco_id}`,
              link: `/ocorrencias/${item.oco_id}`,
              icon: <FiBell />,
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

  // Obter dados do dashboard filtrando ações removidas
  const getDashboardDataFiltered = (scope) => {
    if (scope === 'Hoje') {
      return {
        kpis: { ...kpis },
        acoesRequeridas: actions.filter(action => !removedActions.has(action.id)),
        ocorrenciasRecentes: notifications,
      };
    }
    const data = getDashboardData(scope, notifications);
    data.acoesRequeridas = data.acoesRequeridas.filter(action => !removedActions.has(action.id));
    return data;
  };
  
  const data = getDashboardDataFiltered(filter);

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
      <header className={styles.dashboardHeader}>
        <select className={styles.filterSelect} value={filter} onChange={(e) => setFilter(e.target.value)} >
          <option>Hoje</option>
          <option>Esta Semana</option>
          <option>Este Mês</option>
        </select>
      </header>

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
            actions={data.acoesRequeridas} 
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
