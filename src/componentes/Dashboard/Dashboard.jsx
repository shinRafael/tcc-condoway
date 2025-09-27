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
  const [actions, setActions] = useState(initialActions);
  const [processedActions, setProcessedActions] = useState(new Set());
  const [notifications, setNotifications] = useState([]); // Visitantes ativos
  const [isExpanded, setIsExpanded] = useState(false);
  const [removedActions, setRemovedActions] = useState(new Set());
  
  useEffect(() => {
    const fetchVisitorNotifications = async () => {
      try {
        // Chama a rota da API que você criou
        const response = await api.get("/visitantes/dashboard");
        
        // Acessa a chave "dados" da resposta da API
        if (response.data && response.data.sucesso && Array.isArray(response.data.dados)) {
          setNotifications(response.data.dados);
        } else {
          // Limpa a lista se a resposta não for o esperado
          setNotifications([]);
          console.warn("A resposta da API de visitantes não continha dados válidos.", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações de visitantes:", error);
        setNotifications([]); // Limpa a lista em caso de erro
      }
    };

    fetchVisitorNotifications();
    // Atualiza a lista a cada 30 segundos
    const intervalId = setInterval(fetchVisitorNotifications, 30000);

    return () => clearInterval(intervalId); // Limpa o intervalo ao sair da página
  }, []);

  // Obter dados do dashboard filtrando ações removidas
  const getDashboardDataFiltered = (scope) => {
    const data = getDashboardData(scope, notifications);
    data.acoesRequeridas = data.acoesRequeridas.filter(action => !removedActions.has(action.id));
    return data;
  };
  
  const data = getDashboardDataFiltered(filter);

  // Handlers para aprovar/rejeitar notificações
  // NOTA: Para produção, integre com NotificationService
  const handleApproveNotification = async (notificacao) => {
    console.log('Aprovando notificação:', notificacao);
    
    // Versão com integração real (descomente quando estiver pronto):
    // try {
    //   if (notificacao.categoria === 'reserva') {
    //     await NotificationService.aprovarReserva(notificacao.detalhes.reservaId);
    //   } else if (notificacao.categoria === 'visitante') {
    //     await NotificationService.autorizarVisitante(notificacao.detalhes.visitorId);
    //   }
    //   // Recarregar notificações após aprovação
    //   const novasNotificacoes = await NotificationService.getAllNotifications();
    //   setNotificacoes(novasNotificacoes);
    // } catch (error) {
    //   console.error('Erro ao aprovar:', error);
    //   return;
    // }
    
    // Versão atual (simulada):
    // Atualizar status da notificação
    setNotificacoes(prev => prev.map(n => 
      n.id === notificacao.id 
        ? { ...n, status: 'aprovada', canApprove: false, titulo: n.titulo.replace('Solicitação:', 'Aprovado:').replace('na portaria:', 'autorizado:') }
        : n
    ));
  };

  const handleRejectNotification = async (notificacao) => {
    console.log('Rejeitando notificação:', notificacao);
    
    // Versão com integração real (descomente quando estiver pronto):
    // try {
    //   if (notificacao.categoria === 'reserva') {
    //     await NotificationService.rejeitarReserva(notificacao.detalhes.reservaId);
    //   } else if (notificacao.categoria === 'visitante') {
    //     await NotificationService.negarVisitante(notificacao.detalhes.visitorId);
    //   }
    //   // Recarregar notificações após rejeição
    //   const novasNotificacoes = await NotificationService.getAllNotifications();
    //   setNotificacoes(novasNotificacoes);
    // } catch (error) {
    //   console.error('Erro ao rejeitar:', error);
    //   return;
    // }
    
    // Versão atual (simulada):
    // Atualizar status da notificação
    setNotificacoes(prev => prev.map(n => 
      n.id === notificacao.id 
        ? { ...n, status: 'rejeitada', canApprove: false, titulo: n.titulo.replace('Solicitação:', 'Rejeitado:').replace('na portaria:', 'negado:') }
        : n
    ));
  };

  // Handler para ações rápidas do ActionListCard
  const handleQuickAction = (actionId, actionType) => {
    console.log(`Ação rápida: ${actionType} para ação ${actionId}`);
    
    // Marcar ação como processada temporariamente
    setProcessedActions(prev => new Set([...prev, `${actionId}_${actionType}`]));
    
    // Implementar lógica de ação rápida
    if (actionType === 'approve') {
      // Lógica para aprovar
      console.log(`Ação ${actionId} aprovada com sucesso!`);
    } else if (actionType === 'reject') {
      // Lógica para rejeitar
      console.log(`Ação ${actionId} rejeitada.`);
    }
    
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
          <KpiCard {...data.kpis.reservas} />
          <KpiCard {...data.kpis.encomendas} />
          <KpiCard {...data.kpis.ocorrencias} />
          <KpiCard {...data.kpis.visitantes} />

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
