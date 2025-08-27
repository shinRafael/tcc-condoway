// Dados simulados dos ambientes
export const ambientes = [
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
