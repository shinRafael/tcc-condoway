import React, { useState, useEffect } from 'react';
import styles from './ocorrencias.module.css'; // Usaremos o mesmo CSS
import api from '@/services/api';
import { useModal } from '@/context/ModalContext';

// --- Componente ChatModal ---
function ChatModal({ ocorrencia, onClose }) {
  const { showModal } = useModal();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Simulação do ID do usuário logado (Síndico/ADM = 3).
  // **IMPORTANTE**: Substitua isso pela sua lógica de autenticação!
  const SINDICO_USER_ID = 3;

  useEffect(() => {
    const fetchMensagens = async () => {
      if (!ocorrencia?.oco_id) return; // Sai se não houver ID
      setLoading(true);
      try {
        const response = await api.get(`/ocorrencias/${ocorrencia.oco_id}/mensagens`);
        setMensagens(response.data?.dados || []);
      } catch (error) {
        console.error("Erro ao buscar mensagens da ocorrência:", error);
        setMensagens([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMensagens();
  }, [ocorrencia?.oco_id]); // Dependência segura

  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() || enviando || !ocorrencia?.oco_id) return;
    setEnviando(true);
    try {
      const response = await api.post(`/ocorrencias/${ocorrencia.oco_id}/mensagens`, {
        ocomsg_mensagem: novaMensagem
        // A API assume o user_id do remetente (síndico) baseado na autenticação (ou no ID fixo)
      });
      if (response.data?.sucesso) {
        setMensagens(prev => [...prev, response.data.dados]);
        setNovaMensagem("");
      } else {
        throw new Error(response.data?.mensagem || "Erro desconhecido da API");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      showModal('Erro', `Falha ao enviar mensagem: ${error.message}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  // Não renderiza nada se não houver ocorrência
  if (!ocorrencia) return null;

  return (
    // Permite fechar clicando fora
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Impede que o clique dentro do modal o feche */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Chat - Ocorrência {ocorrencia.oco_protocolo || 'N/D'}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>Morador:</strong> {ocorrencia.morador_nome || 'N/A'} ({ocorrencia.apartamento || 'N/A'})</p>
          <p><strong>Assunto:</strong> {ocorrencia.oco_descricao || 'N/A'}</p>
          <hr className={styles.divider}/>
          <div className={styles.chatMessages}>
            {loading ? <p>Carregando mensagens...</p> : (
              !Array.isArray(mensagens) || mensagens.length === 0 ? <p>Nenhuma mensagem ainda.</p> : (
                mensagens.map(msg => {
                   // Pula renderização de mensagens inválidas
                   if (!msg || msg.ocomsg_id == null) return null;
                   return (
                      <div
                        key={msg.ocomsg_id}
                        // Define classe baseado em quem enviou
                        className={`${styles.chatMessage} ${msg.user_id === SINDICO_USER_ID ? styles.sindico : styles.morador}`}
                      >
                        <span className={styles.msgSender}>{msg.remetente_nome || 'Usuário'}</span>
                        <p>{msg.ocomsg_mensagem}</p>
                        <span className={styles.msgTimestamp}>{msg.ocomsg_data_envio ? new Date(msg.ocomsg_data_envio).toLocaleString('pt-BR', {hour: '2-digit', minute: '2-digit'}) : ''}</span>
                      </div>
                   );
                })
              )
            )}
          </div>
        </div>
        {/* Formulário de envio */}
        <form onSubmit={handleEnviarMensagem} className={styles.modalFooter}>
          <input
            type="text"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={enviando}
            className={styles.chatInput}
            autoFocus // Foca no input ao abrir
          />
          <button type="submit" disabled={!novaMensagem.trim() || enviando} className={styles.sendButton}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;