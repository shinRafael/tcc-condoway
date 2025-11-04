// =============================================================
// 🧪 DADOS MOCKADOS PARA DESENVOLVIMENTO SEM BACKEND
// =============================================================

export const mockDashboardData = {
  visitantes: {
    sucesso: true,
    dados: [
      {
        vst_id: 1,
        vst_nome: 'João Silva',
        vst_status: 'Aguardando',
        vst_data_prevista: new Date().toISOString(),
        vst_apartamento: '101'
      },
      {
        vst_id: 2,
        vst_nome: 'Maria Santos',
        vst_status: 'Entrou',
        vst_data_entrada: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        vst_apartamento: '205'
      },
      {
        vst_id: 3,
        vst_nome: 'Pedro Costa',
        vst_status: 'Aguardando',
        vst_data_prevista: new Date().toISOString(),
        vst_apartamento: '302'
      }
    ]
  },

  reservas: {
    sucesso: true,
    dados: [
      {
        res_id: 1,
        res_status: 'Pendente',
        res_data_reserva: new Date().toISOString(),
        amd_id: 1,
        amd_nome: 'Salão de Festas',
        usr_nome: 'Carlos Oliveira',
        apt_numero: '101'
      },
      {
        res_id: 2,
        res_status: 'Pendente',
        res_data_reserva: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        amd_id: 2,
        amd_nome: 'Churrasqueira',
        usr_nome: 'Ana Paula',
        apt_numero: '203'
      },
      {
        res_id: 3,
        res_status: 'Aprovado',
        res_data_reserva: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        amd_id: 3,
        amd_nome: 'Quadra',
        usr_nome: 'Roberto Lima',
        apt_numero: '305'
      }
    ]
  },

  encomendas: {
    sucesso: true,
    dados: [
      {
        enc_id: 1,
        enc_status: 'aguardando_retirada',
        enc_descricao: 'Caixa Correios',
        enc_data_recebimento: new Date().toISOString(),
        apt_numero: '102',
        usr_nome: 'Fernanda Souza'
      },
      {
        enc_id: 2,
        enc_status: 'aguardando_retirada',
        enc_descricao: 'Pacote Mercado Livre',
        enc_data_recebimento: new Date(Date.now() - 3600000).toISOString(),
        apt_numero: '204',
        usr_nome: 'Ricardo Alves'
      },
      {
        enc_id: 3,
        enc_status: 'retirado',
        enc_descricao: 'Envelope',
        enc_data_recebimento: new Date(Date.now() - 86400000).toISOString(),
        apt_numero: '301',
        usr_nome: 'Juliana Reis'
      }
    ]
  },

  ocorrencias: {
    sucesso: true,
    dados: [
      {
        ocr_id: 1,
        ocr_status: 'aberto',
        ocr_titulo: 'Barulho excessivo',
        ocr_descricao: 'Barulho após 22h no apartamento vizinho',
        ocr_data_criacao: new Date().toISOString(),
        apt_numero: '103',
        usr_nome: 'Lucas Martins'
      },
      {
        ocr_id: 2,
        ocr_status: 'aberto',
        ocr_titulo: 'Vazamento',
        ocr_descricao: 'Vazamento no teto do banheiro',
        ocr_data_criacao: new Date(Date.now() - 7200000).toISOString(),
        apt_numero: '206',
        usr_nome: 'Patricia Costa'
      },
      {
        ocr_id: 3,
        ocr_status: 'resolvido',
        ocr_titulo: 'Lâmpada queimada',
        ocr_descricao: 'Lâmpada do corredor queimada',
        ocr_data_criacao: new Date(Date.now() - 172800000).toISOString(),
        apt_numero: '304',
        usr_nome: 'Bruno Silva'
      }
    ]
  },

  mensagens: {
    sucesso: true,
    dados: [
      {
        msg_id: 1,
        msg_status: 'nao_lido',
        msg_assunto: 'Dúvida sobre taxa',
        msg_conteudo: 'Gostaria de saber sobre o valor da taxa extra',
        msg_data: new Date().toISOString(),
        usr_nome: 'Amanda Lima',
        apt_numero: '105'
      },
      {
        msg_id: 2,
        msg_status: 'lido',
        msg_assunto: 'Agendamento de mudança',
        msg_conteudo: 'Preciso agendar mudança para próximo sábado',
        msg_data: new Date(Date.now() - 3600000).toISOString(),
        usr_nome: 'Rafael Santos',
        apt_numero: '207'
      }
    ]
  },

  ambientes: {
    sucesso: true,
    dados: [
      { id: 1, nome: 'Salão de Festas' },
      { id: 2, nome: 'Churrasqueira' },
      { id: 3, nome: 'Quadra' },
      { id: 4, nome: 'Piscina' },
      { id: 5, nome: 'Academia' }
    ]
  }
};

// Função para simular delay de rede
export const mockApiCall = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};
