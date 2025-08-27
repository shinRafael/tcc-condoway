"use client";
import { useState } from "react";

import styles from './page.module.css';

const ambientes = [
  {
    id: 1,
    nome: 'Salão de Festas',
    icone: '🎉',
    status: 'disponível',
    detalhes: 'Capacidade para 50 pessoas.',
    proximaReserva: '2025-08-28 18:00',
    historico: [
      { data: '25/08/2025', usuario: 'João Silva' },
      { data: '20/08/2025', usuario: 'Maria Souza' }
    ]
  },
  {
    id: 2,
    nome: 'Churrasqueira',
    icone: '🍖',
    status: 'ocupado',
    detalhes: 'Área externa coberta.',
    proximaReserva: '2025-08-26 20:00',
    historico: [
      { data: '22/08/2025', usuario: 'Carlos Lima' },
      { data: '18/08/2025', usuario: 'Ana Paula' }
    ]
  },
  {
    id: 3,
    nome: 'Piscina',
    icone: '🏊',
    status: 'manutenção',
    detalhes: 'Manutenção até 30/08.',
    proximaReserva: null,
    historico: [
      { data: '15/08/2025', usuario: 'Pedro Santos' }
    ]
  },
  {
    id: 4,
    nome: 'Quadra Poliesportiva',
    icone: '⚽',
    status: 'disponível',
    detalhes: 'Iluminação noturna.',
    proximaReserva: null,
    historico: [
      { data: '10/08/2025', usuario: 'Lucas Godoi' }
    ]
  }
];

const icones = {
  "Salão de Festas": "🎉",
  "Churrasqueira": "🍖",
  "Piscina": "🏊",
  "Quadra Poliesportiva": "⚽",
};

const statusStyle = {
  disponível: "bg-green-100 text-green-700",
  ocupado: "bg-red-100 text-red-700",
  manutenção: "bg-yellow-100 text-yellow-700",
};

export default function Reservas() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const ambientesFiltrados = ambientes.filter(
    (a) =>
      (filtro === "todos" || a.status === filtro) &&
      a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={`flex min-h-screen bg-gray-50 ${styles.reservasContainer}`}> 
      {/* Sidebar fixa */}
      <aside className={`w-64 text-white flex flex-col py-8 px-6 min-h-screen shadow-lg ${styles.sidebar}`}> 
        <h2 className={`text-2xl font-bold mb-8 ${styles.logo}`}>CondoWay</h2>
        <nav className="flex-1">
          <ul className={`space-y-4 text-lg ${styles.menu}`}>
            <li>
              <a href="#" className="hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Usuários
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Apartamentos
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-semibold underline"
              >
                Reservas
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Visitantes
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Encomendas
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Notificações
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Mensagens
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Cabeçalho fixo CondoWay */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700 tracking-wide">Reservas</h1>
          <span className="font-semibold text-gray-500">CondoWay</span>
        </header>
        <main className={`px-8 py-10 ${styles.mainContent}`}> 
          <h2 className={`text-3xl font-bold mb-2 ${styles.titulo}`}>Controle de Reservas</h2>
          <p className={`mb-6 text-gray-700 ${styles.subtitulo}`}>Aqui você pode visualizar e gerenciar reservas dos ambientes do condomínio.</p>
          {/* Filtro e busca */}
          <div className={`flex flex-col md:flex-row gap-4 mb-8 ${styles.filtros}`}>
            <input
              type="text"
              placeholder="Buscar ambiente..."
              className="border rounded px-4 py-2 w-full md:w-1/2 focus:outline-blue-400"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <select
              className="border rounded px-4 py-2 w-full md:w-1/4 focus:outline-blue-400"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="disponível">Disponível</option>
              <option value="ocupado">Ocupado</option>
              <option value="manutenção">Manutenção</option>
            </select>
          </div>
          {/* Grid de cards */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${styles.cardsGrid}`}>
            {ambientesFiltrados.map((ambiente) => (
              <div
                key={ambiente.id}
                className={`bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 transition-transform hover:scale-105 duration-200 ${styles.card}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-4xl"
                    aria-label={ambiente.nome}
                  >
                    {icones[ambiente.nome]}
                  </span>
                  <h2 className="text-xl font-bold text-blue-700">
                    {ambiente.nome}
                  </h2>
                </div>
                <div className="mb-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusStyle[ambiente.status]}`}
                  >
                    {ambiente.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-1">{ambiente.detalhes}</p>
                <div className="mb-2">
                  <span className="font-semibold text-gray-600">
                    Próxima reserva:
                  </span>
                  {ambiente.proximaReserva ? (
                    <span className="ml-2 text-blue-700 font-bold">
                      {ambiente.proximaReserva}
                    </span>
                  ) : (
                    <span className="ml-2 text-gray-400">Sem reservas futuras.</span>
                  )}
                </div>
                {/* Histórico resumido */}
                <div className="mb-2">
                  <span className="font-semibold text-gray-600">Histórico:</span>
                  <ul className="list-disc ml-6 text-sm text-gray-500">
                    <li>25/08/2025 - João Silva</li>
                    <li>20/08/2025 - Maria Souza</li>
                  </ul>
                </div>
                {/* Botões de ação */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                    Reservar
                  </button>
                  <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition">
                    Editar Reserva
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Cancelar Reserva
                  </button>
                  <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition">
                    Histórico
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
