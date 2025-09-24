import styles from './Dashboard.module.css';
import { FiUsers, FiHome, FiCircle, FiCheck, FiX, FiClock } from 'react-icons/fi';

// Classes reutilizadas para categorias
const categoryClassMap = {
  visitante: styles.badgePriorityMedia, // amarelo
  reserva: styles.badgePriorityAlta,    // vermelho
};

// Função para determinar o status e cor do indicador
const getStatusInfo = (titulo, status = null) => {
  if (status === 'pendente') {
    return { color: '#f59e0b', label: 'pendente' }; // amarelo
  }
  
  const tituloLower = titulo.toLowerCase();
  if (tituloLower.includes('entrada') || tituloLower.includes('confirmação') || tituloLower.includes('confirmada') || tituloLower.includes('aprovada')) {
    return { color: '#10b981', label: 'confirmado' }; // verde
  }
  if (tituloLower.includes('saída') || tituloLower.includes('cancelada') || tituloLower.includes('cancelamento') || tituloLower.includes('rejeitada')) {
    return { color: '#ef4444', label: 'cancelado' }; // vermelho
  }
  return { color: '#f59e0b', label: 'pendente' }; // amarelo
};

// Função para formatar timestamp mais amigável
const formatTimestamp = (data) => {
  if (!data) return '';
  
  if (data.includes(':') && data.length <= 5) {
    // Formato "08:45" - assumir hoje
    return `Hoje ${data}`;
  }
  
  if (data.includes('SEG') || data.includes('TER') || data.includes('QUA')) {
    return data;
  }
  
  return data;
};

export default function RecentOccurrences({ occurrences = [], onApprove, onReject }) {
  // Estrutura esperada agora: { id, categoria: 'visitante'|'reserva', titulo, data, status?, canApprove? }
  
  // Separar notificações por categoria
  const notificacoesVisitantes = occurrences.filter(n => n.categoria === 'visitante');
  const notificacoesReservas = occurrences.filter(n => n.categoria === 'reserva');

  const handleAction = (notificacao, action) => {
    if (action === 'approve' && onApprove) {
      onApprove(notificacao);
    } else if (action === 'reject' && onReject) {
      onReject(notificacao);
    }
  };

  const renderSecao = (titulo, notificacoes, categoria) => {
    if (notificacoes.length === 0) return null;
    
    const icon = categoria === 'visitante' ? <FiUsers /> : <FiHome />;
    const corSecao = categoria === 'visitante' ? '#3b82f6' : '#10b981';
    const bgBadge = categoria === 'visitante' ? '#dbeafe' : '#dcfce7';
    const corBadge = categoria === 'visitante' ? '#1e40af' : '#166534';
    
    return (
      <div className={styles.notificacaoSecao}>
        <h4 className={styles.secaoTitulo}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: corSecao }}>
            {icon}
            {titulo}
          </span>
          <span style={{
            background: bgBadge,
            color: corBadge,
            padding: '0.2rem 0.5rem',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: '600',
            minWidth: '20px',
            textAlign: 'center'
          }}>
            {notificacoes.length}
          </span>
        </h4>
        <ul className={styles.secaoLista}>
          {notificacoes.map((n) => {
            const statusInfo = getStatusInfo(n.titulo, n.status);
            const timestampFormatado = formatTimestamp(n.data);
            const isPendente = n.status === 'pendente' || statusInfo.label === 'pendente';
            
            return (
              <li key={n.id} className={styles.secaoItem} title={`${n.titulo} - ${timestampFormatado}`}>
                <div className={styles.secaoItemConteudo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiCircle 
                      size={8} 
                      style={{ color: statusInfo.color, fill: statusInfo.color, flexShrink: 0 }} 
                    />
                    <p className={styles.secaoItemTexto}>
                      {n.titulo}
                    </p>
                  </div>
                  {timestampFormatado && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FiClock size={12} style={{ color: '#9ca3af' }} />
                      <span 
                        className={styles.secaoHorario}
                        style={{ 
                          background: timestampFormatado.includes('Agora') ? '#dcfce7' : undefined,
                          color: timestampFormatado.includes('Agora') ? '#166534' : undefined
                        }}
                      >
                        {timestampFormatado}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Botões de ação para itens pendentes */}
                {isPendente && n.canApprove && (
                  <div className={styles.acoesBotoes}>
                    <button 
                      className={styles.botaoAprovar}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(n, 'approve');
                      }}
                      title="Aprovar"
                    >
                      <FiCheck size={14} />
                    </button>
                    <button 
                      className={styles.botaoRejeitar}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(n, 'reject');
                      }}
                      title="Rejeitar"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}
                
                {/* Ícone de status para itens não acionáveis */}
                {!isPendente && (
                  <div style={{ opacity: 0.6 }}>
                    {statusInfo.label === 'confirmado' ? <FiCheck size={14} color="#10b981" /> : <FiX size={14} color="#ef4444" />}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.recentContainer}>
      <div className={styles.recentHeader}>
        <h2 className={styles.recentTitle}>Notificações Recentes</h2>
      </div>
      {occurrences.length === 0 ? (
        <div className={styles.recentEmpty}>
          <p className={styles.recentEmptyText}>Nenhuma notificação recente.</p>
        </div>
      ) : (
        <div className={styles.notificacoesContainer}>
          {renderSecao('Visitantes', notificacoesVisitantes, 'visitante')}
          {renderSecao('Reservas de Ambientes', notificacoesReservas, 'reserva')}
        </div>
      )}
    </div>
  );
}