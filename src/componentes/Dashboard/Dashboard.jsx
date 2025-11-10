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
import { mockDashboardData, mockApiCall } from '../../services/mockData'; // Dados mockados

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
    const axiosDashboardData = async () => {
      console.log('🔄 Dashboard: Iniciando busca de dados da API...');
      
      try {
        // Helper para que uma falha na API não quebre todas as chamadas
        const safeGet = async (url, mockDataKey) => {
          try {
            const response = await api.get(url);
            console.log(`✅ Dados recebidos de ${url}`);
            return response;
          } catch (error) {
            console.warn(`⚠️ Falha em ${url}, usando dados mockados`);
            // Retorna dados mockados como fallback
            return await mockApiCall(mockDashboardData[mockDataKey], 100);
          }
        };

        console.log('📡 Buscando dados do backend...');
        
        // Usando Promise.all com o helper
        const [
          visitorsResponse,
          reservationsResponse,
          encomendasResponse,
          ocorrenciasResponse,
          mensagensResponse,
          ambientesResponse
        ] = await Promise.all([
          safeGet('/visitantes/dashboard', 'visitantes'),
          safeGet('/reservas_ambientes', 'reservas'),
          safeGet('/encomendas', 'encomendas'),
          safeGet('/ocorrencias', 'ocorrencias'),
          safeGet('/mensagens', 'mensagens'),
          safeGet('/ambientes', 'ambientes')
        ]);
        
        console.log('✅ Requisições concluídas');
        console.log('📊 VISITANTES:', JSON.stringify(visitorsResponse?.data, null, 2));
        console.log('📊 RESERVAS:', JSON.stringify(reservationsResponse?.data, null, 2));
        console.log('📊 ENCOMENDAS:', JSON.stringify(encomendasResponse?.data, null, 2));
        console.log('📊 OCORRENCIAS:', JSON.stringify(ocorrenciasResponse?.data, null, 2));
        console.log('📊 AMBIENTES:', JSON.stringify(ambientesResponse?.data, null, 2));
        
        // Visitantes (dashboard)
        let visitantesDados = [];
        if (visitorsResponse.data && visitorsResponse.data.sucesso && Array.isArray(visitorsResponse.data.dados)) {
          // Normaliza os campos para o formato esperado pelo componente
          visitantesDados = visitorsResponse.data.dados.map(v => ({
            vst_id: v.id || v.vst_id,
            vst_nome: v.nome || v.vst_nome,
            vst_status: v.status || v.vst_status,
            vst_data_entrada: v.dataEntrada || v.vst_data_entrada,
            vst_data_prevista: v.dataPrevista || v.vst_data_prevista,
            vst_apartamento: v.unidade || v.vst_apartamento,
            morador_nome: v.morador || v.morador_nome
          }));
          console.log('👥 Total de visitantes:', visitantesDados.length);
          console.log('👥 Visitantes normalizados:', visitantesDados);
          setNotifications(visitantesDados);
        } else {
          console.warn('⚠️ API de visitantes não retornou dados válidos:', visitorsResponse.data);
          setNotifications([]);
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
        console.log('🔍 Verificando reservas...', reservationsResponse.data);
        if (reservationsResponse.data && reservationsResponse.data.sucesso && Array.isArray(reservationsResponse.data.dados)) {
          console.log('📋 Total de reservas recebidas:', reservationsResponse.data.dados.length);
          
          // Log detalhado de cada reserva para debug
          reservationsResponse.data.dados.forEach((r, index) => {
            console.log(`🔍 Reserva ${index + 1}:`, {
              id: r.res_id,
              status: `"${r.res_status}"`,
              statusType: typeof r.res_status,
              todosOsCampos: Object.keys(r)
            });
          });
          
          const pendingReservations = reservationsResponse.data.dados.filter(r => {
            // Remove aspas extras se houver
            const status = typeof r.res_status === 'string' ? r.res_status.replace(/['"]/g, '') : r.res_status;
            const isPendente = status === 'Pendente';
            console.log(`⏳ ID ${r.res_id}: Status="${status}" → Pendente? ${isPendente}`);
            return isPendente;
          });
          console.log('⏳ Total de Reservas Pendentes encontradas:', pendingReservations.length);
          
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
        } else {
          console.warn('❌ Dados de reservas inválidos ou não retornados');
        }

        // Encomendas: SOMENTE status 'Aguardando' ou 'aguardando_retirada'
        if (encomendasResponse.data && encomendasResponse.data.sucesso && Array.isArray(encomendasResponse.data.dados)) {
          const pendingEncomendas = encomendasResponse.data.dados.filter(e => {
            const status = typeof e.enc_status === 'string' ? e.enc_status.replace(/['"]/g, '') : e.enc_status;
            return status === 'Aguardando' || status === 'aguardando_retirada';
          });
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

        // Ocorrências: SOMENTE status 'Aberta' (não "Em Andamento")
        if (ocorrenciasResponse.data && ocorrenciasResponse.data.sucesso) {
          let openOcorrencias = [];
          
          // Se os dados vierem agrupados por status
          if (ocorrenciasResponse.data.dados && typeof ocorrenciasResponse.data.dados === 'object' && !Array.isArray(ocorrenciasResponse.data.dados)) {
            openOcorrencias = ocorrenciasResponse.data.dados['Aberta'] || [];
          } 
          // Se os dados vierem como array simples
          else if (Array.isArray(ocorrenciasResponse.data.dados)) {
            openOcorrencias = ocorrenciasResponse.data.dados.filter(o => {
              const status = typeof o.oco_status === 'string' ? o.oco_status.replace(/['"]/g, '') : o.oco_status;
              return status === 'Aberta';
            });
          }
          
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

    axiosDashboardData();
    const intervalId = setInterval(axiosDashboardData, 30000);
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
