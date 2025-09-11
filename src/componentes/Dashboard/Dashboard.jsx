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

// Mock Data
const kpiData = {
  reservas: { value: 3, title: 'Reservas Pendentes', icon: <FiCalendar />, href: '/reservas?status=pendente' },
  encomendas: { value: 7, title: 'Encomendas a Retirar', icon: <FiBox />, href: '/encomendas' },
  ocorrencias: { value: 2, title: 'Ocorrências Abertas', icon: <FiBell />, href: '/ocorrencias' },
  visitantes: { value: 12, title: 'Visitantes Hoje', icon: <FiUsers />, href: '/visitantes' },
};

const acoesRequeridas = [
  { id: 1, type: 'aprovar', description: 'Aprovar Reserva: Salão de Festas (Apto 101)', link: '/reservas/123', icon: <FiCheckCircle /> },
  { id: 2, type: 'responder', description: 'Responder Mensagem: Maria (Apto 302)', link: '/mensagens/456', icon: <FiMessageSquare /> },
  { id: 3, type: 'validar', description: 'Validar Novo Cadastro: Apto 504', link: '/usuarios/789', icon: <FiUserPlus /> },
];

const usoAreasComunsData = [
  { name: 'Salão', value: 18 },
  { name: 'Churrasqueira', value: 12 },
  { name: 'Academia', value: 6 },
  { name: 'Piscina', value: 9 },
];

const calendarEvents = [
    { id: 1, date: '25 SET', title: 'Reunião de Condomínio' },
    { id: 2, date: '28 SET', title: 'Manutenção Elevador B' },
    { id: 3, date: '02 OUT', title: 'Festa no Salão (Apto 301)' },
];

const atividadesRecentes = [
  { id: 1, time: '14:30', description: 'Chegou encomenda para Apto 201' },
  { id: 2, time: '11:15', description: 'Morador Apto 404 registrou ocorrência' },
  { id: 3, time: '09:00', description: 'Reserva Salão de Festas confirmada (Apto 301)' },
];

const manutencoesData = [
    { id: 1, item: 'Manutenção Elevador B', prazo: 'em 15 dias' },
    { id: 2, item: 'Limpeza Caixa d\'Água', prazo: 'em 40 dias' },
    { id: 3, item: 'Dedetização Áreas Comuns', prazo: 'em 60 dias' },
];

const enquetesData = {
    titulo: 'Nova regra sobre pets na área da piscina',
    prazo: 'termina em 3 dias',
    participacao: 78
};


const Dashboard = () => {
  const [filter, setFilter] = useState('Hoje');

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} >
          <option>Hoje</option>
          <option>Esta Semana</option>
          <option>Este Mês</option>
        </select>
      </header>

      <div className={styles.dashboardGrid}>
        {/* Linha 1 */}
        <KpiCard {...kpiData.reservas} />
        <KpiCard {...kpiData.encomendas} />
        <KpiCard {...kpiData.ocorrencias} />
        <KpiCard {...kpiData.visitantes} />

        {/* Linha 2 */}
        <ActionListCard title="Ações Requeridas" actions={acoesRequeridas} viewAllLink="/reservas" />
        <div className={styles.cardLarge}>
          <RecentOccurrences />
        </div>

        {/* Linha 3 */}
        <CalendarCard title="Calendário de Eventos" events={calendarEvents} />
        <ChartCard title="Uso de Áreas Comuns (Último Mês)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usoAreasComunsData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip wrapperClassName={styles.tooltip} />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Linha 4 */}
        <ManutencoesCard title="Manutenções Preventivas" manutencoes={manutencoesData} />
        <MensagensNaoLidasCard count={5} href="/mensagens" />
        <ActivityFeedCard title="Atividades Recentes" activities={atividadesRecentes} />
        <EnquetesCard title="Enquetes Ativas" enquete={enquetesData} />

      </div>
    </div>
  );
};

export default Dashboard;
