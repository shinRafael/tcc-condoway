// Serviço para integração com as notificações das rotas existentes
// Este arquivo mostra como você pode integrar com dados reais das outras rotas

export class NotificationService {
  
  // Simula a busca de reservas pendentes da rota /reservas
  static async getReservasPendentes() {
    // Na implementação real, você faria uma chamada para sua API ou 
    // importaria os dados diretamente do estado global da aplicação
    
    // Exemplo de como buscar dados reais:
    try {
      // const response = await fetch('/api/reservas?status=pendente');
      // const reservas = await response.json();
      
      // Por enquanto, retornamos dados simulados baseados na estrutura real
      const reservasSimuladas = [
        {
          id: 'res_001',
          usuario: 'João Silva',
          apartamento: '201',
          ambiente: 'Salão de Festas',
          data: '2025-01-28',
          horario: '18:00',
          status: 'pendente',
          observacoes: 'Festa de aniversário'
        },
        {
          id: 'res_002', 
          usuario: 'Maria Santos',
          apartamento: '305',
          ambiente: 'Churrasqueira',
          data: '2025-01-29',
          horario: '16:00',
          status: 'pendente',
          observacoes: 'Confraternização família'
        }
      ];

      return reservasSimuladas.map(reserva => ({
        id: reserva.id,
        categoria: 'reserva',
        titulo: `Solicitação: ${reserva.ambiente} (${reserva.usuario} - Apto ${reserva.apartamento})`,
        data: this.formatarDataRelativa(reserva.data),
        status: 'pendente',
        canApprove: true,
        detalhes: {
          reservaId: reserva.id,
          usuario: reserva.usuario,
          ambiente: reserva.ambiente,
          dataReserva: `${reserva.data} ${reserva.horario}`,
          apartamento: reserva.apartamento,
          observacoes: reserva.observacoes
        }
      }));
      
    } catch (error) {
      console.error('Erro ao buscar reservas pendentes:', error);
      return [];
    }
  }

  // Simula a busca de visitantes na portaria da rota /visitantes  
  static async getVisitantesPendentes() {
    // Na implementação real, você buscaria visitantes que estão aguardando autorização
    
    try {
      // const response = await fetch('/api/visitantes?status=aguardando');
      // const visitantes = await response.json();
      
      const visitantesSimulados = [
        {
          id: 'vis_001',
          nome: 'Ana Costa',
          documento: '555.666.777-88',
          apartamento: '305',
          tipo: 'entrada',
          dataHora: new Date(),
          status: 'aguardando'
        },
        {
          id: 'vis_002',
          nome: 'Pedro Oliveira', 
          documento: '111.222.333-44',
          apartamento: '102',
          tipo: 'entrega',
          dataHora: new Date(Date.now() - 10 * 60 * 1000), // 10 min atrás
          status: 'aguardando'
        }
      ];

      return visitantesSimulados.map(visitante => ({
        id: visitante.id,
        categoria: 'visitante',
        titulo: `Visitante na portaria: ${visitante.nome} (Apto ${visitante.apartamento})`,
        data: this.formatarDataRelativa(visitante.dataHora),
        status: 'pendente',
        canApprove: true,
        detalhes: {
          visitorId: visitante.id,
          nome: visitante.nome,
          documento: visitante.documento,
          apartamento: visitante.apartamento,
          tipo: visitante.tipo,
          dataHora: visitante.dataHora
        }
      }));
      
    } catch (error) {
      console.error('Erro ao buscar visitantes pendentes:', error);
      return [];
    }
  }

  // Combina todas as notificações
  static async getAllNotifications() {
    const [reservas, visitantes] = await Promise.all([
      this.getReservasPendentes(),
      this.getVisitantesPendentes()
    ]);

    // Ordena por data mais recente primeiro
    return [...reservas, ...visitantes].sort((a, b) => {
      // Implementar ordenação por timestamp real
      return new Date(b.detalhes.dataHora || b.detalhes.dataReserva) - 
             new Date(a.detalhes.dataHora || a.detalhes.dataReserva);
    });
  }

  // Aprova uma reserva
  static async aprovarReserva(reservaId) {
    try {
      // const response = await fetch(`/api/reservas/${reservaId}/aprovar`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'aprovada' })
      // });
      
      console.log(`Reserva ${reservaId} aprovada com sucesso`);
      return { success: true };
      
    } catch (error) {
      console.error('Erro ao aprovar reserva:', error);
      return { success: false, error: error.message };
    }
  }

  // Rejeita uma reserva
  static async rejeitarReserva(reservaId, motivo = '') {
    try {
      // const response = await fetch(`/api/reservas/${reservaId}/rejeitar`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'rejeitada', motivo })
      // });
      
      console.log(`Reserva ${reservaId} rejeitada`);
      return { success: true };
      
    } catch (error) {
      console.error('Erro ao rejeitar reserva:', error);
      return { success: false, error: error.message };
    }
  }

  // Autoriza entrada de visitante
  static async autorizarVisitante(visitorId) {
    try {
      // const response = await fetch(`/api/visitantes/${visitorId}/autorizar`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'autorizado', dataAutorizacao: new Date() })
      // });
      
      console.log(`Visitante ${visitorId} autorizado`);
      return { success: true };
      
    } catch (error) {
      console.error('Erro ao autorizar visitante:', error);
      return { success: false, error: error.message };
    }
  }

  // Nega entrada de visitante
  static async negarVisitante(visitorId, motivo = '') {
    try {
      // const response = await fetch(`/api/visitantes/${visitorId}/negar`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'negado', motivo })
      // });
      
      console.log(`Visitante ${visitorId} negado`);
      return { success: true };
      
    } catch (error) {
      console.error('Erro ao negar visitante:', error);
      return { success: false, error: error.message };
    }
  }

  // Utilitário para formatar datas relativas
  static formatarDataRelativa(data) {
    const agora = new Date();
    const dataObj = new Date(data);
    const diffMs = agora - dataObj;
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutos < 1) return 'Agora mesmo';
    if (diffMinutos < 60) return `${diffMinutos} min atrás`;
    
    const diffHoras = Math.floor(diffMinutos / 60);
    if (diffHoras < 24) return `${diffHoras}h atrás`;
    
    const diffDias = Math.floor(diffHoras / 24);
    if (diffDias < 7) return `${diffDias} dias atrás`;
    
    return dataObj.toLocaleDateString('pt-BR');
  }
}

export default NotificationService;
