'use client';
import React, { useState } from 'react';
import { FiCalendar, FiBox, FiBell, FiUsers, FiCheckCircle, FiMessageSquare, FiUserPlus } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { KpiCard } from './KpiCard';
import ActionListCard from '../ActionListCard/ActionListCard';
import ChartCard from './ChartCard';
import CalendarCard from './CalendarCard';
import ActivityFeedCard from './ActivityFeedCard';
import { EnquetesCard } from './EnquetesCard';
import { ManutencoesCard } from './ManutencoesCard';
import { MensagensNaoLidasCard } from './MensagensNaoLidasCard';
import { StatusChamadosCard } from './StatusChamadosCard';
import { StatusOcorrenciasCard } from './StatusOcorrenciasCard';
import RecentOccurrences from './RecentOccurrences';
import styles from './Dashboard.module.css';

// Fonte de dados por filtro
function getDashboardData(scope) {
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
      usoAreasComunsData: [
        { name: 'Salão', value: 32 },
        { name: 'Churrasqueira', value: 21 },
        { name: 'Academia', value: 17 },
        { name: 'Piscina', value: 14 },
      ],
      calendarEvents: [
        { id: 1, date: 'QUA', title: 'Assembleia Ordinária' },
        { id: 2, date: 'SEX', title: 'Manutenção Portão' },
        { id: 3, date: 'SÁB', title: 'Festa no Salão (Apto 305)' },
        { id: 4, date: 'DOM', title: 'Limpeza Piscina' },
      ],
      atividadesRecentes: [
        { id: 1, time: 'Ontem 18:10', description: 'Visitante autorizado (Apto 802)' },
        { id: 2, time: 'Ontem 12:05', description: 'Encomenda entregue (Apto 504)' },
        { id: 3, time: 'Seg 09:12', description: 'Ocorrência registrada (barulho)' },
        { id: 4, time: 'Seg 08:30', description: 'Reserva confirmada: Academia' },
      ],
      manutencoesData: [
        { id: 1, item: 'Portão principal', prazo: 'Hoje' },
        { id: 2, item: 'Elevador Torre B', prazo: 'Amanhã' },
        { id: 3, item: 'Piscina - Aquecedor', prazo: 'Em 3 dias' },
        { id: 4, item: 'Gerador - Revisão', prazo: 'Em 5 dias' },
      ],
      enquete: { titulo: 'Mudança horário da academia aos sábados', prazo: 'termina em 2 dias', participacao: 64 },
      ocorrenciasRecentes: [
        { id: 1, title: 'Vazamento no corredor da Torre A', status: 'Em Andamento', priority: 'Alta' },
        { id: 2, title: 'Barulho após horário', status: 'Aberta', priority: 'Média' },
        { id: 3, title: 'Lâmpada queimada no térreo', status: 'Concluída', priority: 'Baixa' },
      ],
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
      usoAreasComunsData: [
        { name: 'Salão', value: 120 },
        { name: 'Churrasqueira', value: 78 },
        { name: 'Academia', value: 64 },
        { name: 'Piscina', value: 53 },
      ],
      calendarEvents: [
        { id: 1, date: '05 OUT', title: 'Reforma jardim interno' },
        { id: 2, date: '12 OUT', title: 'Pintura garagem' },
        { id: 3, date: '19 OUT', title: 'Reunião Conselho' },
        { id: 4, date: '28 OUT', title: 'Confraternização dos moradores' },
      ],
      atividadesRecentes: [
        { id: 1, time: '10/10 17:45', description: 'Entrega de encomenda (Apto 1502)' },
        { id: 2, time: '08/10 08:10', description: 'Registro de ocorrência (elevador parou)' },
        { id: 3, time: '03/10 19:20', description: 'Reserva Churrasqueira confirmada' },
        { id: 4, time: '01/10 07:05', description: 'Visita de manutenção programada' },
      ],
      manutencoesData: [
        { id: 1, item: 'Dedetização Áreas Comuns', prazo: 'em 10 dias' },
        { id: 2, item: 'Revisão Elétrica Garagem', prazo: 'em 14 dias' },
        { id: 3, item: 'Troca filtros da piscina', prazo: 'em 20 dias' },
      ],
      enquete: { titulo: 'Implantar coleta seletiva no condomínio?', prazo: 'termina em 5 dias', participacao: 72 },
      ocorrenciasRecentes: [
        { id: 1, title: 'Porta do hall com problema', status: 'Aberta', priority: 'Média' },
        { id: 2, title: 'Problema no interfone', status: 'Em Andamento', priority: 'Alta' },
      ],
    };
  }

  // Default: Hoje
  return {
    kpis: {
      reservas: { value: 3, title: 'Reservas Pendentes', icon: <FiCalendar />, href: '/reservas?status=pendente' },
      encomendas: { value: 7, title: 'Encomendas a Retirar', icon: <FiBox />, href: '/encomendas' },
      ocorrencias: { value: 2, title: 'Ocorrências Abertas', icon: <FiBell />, href: '/ocorrencias' },
      visitantes: { value: 12, title: 'Visitantes Hoje', icon: <FiUsers />, href: '/visitantes' },
    },
    acoesRequeridas: [
      { id: 1, type: 'aprovar', description: 'Aprovar Reserva: Salão de Festas (Apto 101)', link: '/reservas/123', icon: <FiCheckCircle /> },
      { id: 2, type: 'responder', description: 'Responder Mensagem: Maria (Apto 302)', link: '/mensagens/456', icon: <FiMessageSquare /> },
      { id: 3, type: 'validar', description: 'Validar Novo Cadastro: Apto 504', link: '/usuarios/789', icon: <FiUserPlus /> },
    ],
    usoAreasComunsData: [
      { name: 'Salão', value: 18 },
      { name: 'Churrasqueira', value: 12 },
      { name: 'Academia', value: 6 },
      { name: 'Piscina', value: 9 },
    ],
    calendarEvents: [
      { id: 1, date: '25 SET', title: 'Reunião de Condomínio' },
      { id: 2, date: '28 SET', title: 'Manutenção Elevador B' },
      { id: 3, date: '02 OUT', title: 'Festa no Salão (Apto 301)' },
    ],
    atividadesRecentes: [
      { id: 1, time: '14:30', description: 'Chegou encomenda para Apto 201' },
      { id: 2, time: '11:15', description: 'Morador Apto 404 registrou ocorrência' },
      { id: 3, time: '09:00', description: 'Reserva Salão de Festas confirmada (Apto 301)' },
    ],
    manutencoesData: [
      { id: 1, item: 'Manutenção Elevador B', prazo: 'em 15 dias' },
      { id: 2, item: "Limpeza Caixa d'Água", prazo: 'em 40 dias' },
      { id: 3, item: 'Dedetização Áreas Comuns', prazo: 'em 60 dias' },
    ],
    enquete: { titulo: 'Nova regra sobre pets na área da piscina', prazo: 'termina em 3 dias', participacao: 78 },
    ocorrenciasRecentes: [],
  };
}

const Dashboard = () => {
  const [filter, setFilter] = useState('Hoje');
  const data = getDashboardData(filter);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} >
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
          <ActionListCard title="Ações Requeridas" actions={data.acoesRequeridas} viewAllLink="/reservas" />
          <div className={styles.cardLarge}>
            <RecentOccurrences occurrences={data.ocorrenciasRecentes} />
          </div>

          {/* Linha 3 */}
          <CalendarCard title="Calendário de Eventos" events={data.calendarEvents} />
          <ChartCard title="Uso de Áreas Comuns (Último Mês)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.usoAreasComunsData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip wrapperClassName={styles.tooltip} />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Linha 4 */}
          <ManutencoesCard title="Manutenções Preventivas" manutencoes={data.manutencoesData} />
          <MensagensNaoLidasCard count={5} href="/mensagens" />
          <ActivityFeedCard title="Atividades Recentes" activities={data.atividadesRecentes} />
          <EnquetesCard title="Enquetes Ativas" enquete={data.enquete} />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
