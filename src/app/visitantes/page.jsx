'use client';
import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import styles from './visitantes.module.css';
import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import { useModal } from "@/context/ModalContext";

export default function ControleAcessos() {
  const { showModal } = useModal();

  // Estados principais
  const [visitantesHoje, setVisitantesHoje] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAcesso, setModalAcesso] = useState(null);
  const [notificando, setNotificando] = useState(false);
  const [statusNotificacao, setStatusNotificacao] = useState('');
  const [visitanteInesperado, setVisitanteInesperado] = useState({ nome: '', apartamentoDestino: '' });

  // ==============================================================
  // 🔹 CARREGAR VISITANTES
  // ==============================================================
  useEffect(() => {
    carregarVisitantes();
  }, []);

  const carregarVisitantes = async () => {
    try {
      const response = await api.get('/visitantes/dashboard');
      setVisitantesHoje(response.data.dados || []);
    } catch (err) {
      console.error('Erro ao buscar visitantes:', err);
      showModal('Erro', 'Não foi possível carregar os visitantes.', 'error');
    }
  };

  // ==============================================================
  // 🔹 FILTRO DE VISITANTES
  // ==============================================================
  const visitantesFiltrados = useMemo(() => {
    return visitantesHoje.filter(v =>
      v.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.unidade?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visitantesHoje, searchTerm]);

  // ==============================================================
  // 🔹 AÇÕES DE ACESSO
  // ==============================================================
 const handleConfirmarAcesso = async (visitante, acao) => {
  try {
    console.log(`🔹 Ação selecionada: ${acao} para o visitante ID ${visitante.id}`);

    if (acao === "ENTROU") {
      // ✅ Registra a entrada do visitante
      await api.put(`/visitantes/${visitante.id}/entrada`);
      showModal("Sucesso", "Entrada registrada com sucesso.", "success");

    } else if (acao === "SAIU") {
      // ✅ Registra a saída do visitante
      await api.put(`/visitantes/${visitante.id}/saida`);
      showModal("Sucesso", "Saída registrada com sucesso.", "success");

    } else if (acao === "NEGADO") {
      // ❌ Agora chama a rota correta (para portaria/síndico)
      await api.patch(`/visitantes/${visitante.id}/nega`);
      showModal("Negado", "Acesso negado com sucesso.", "info");
    }

    // 🔄 Recarrega a lista de visitantes após a ação
    await carregarVisitantes();

  } catch (error) {
    console.error("❌ Erro ao confirmar acesso:", error);
    // Se o backend devolver erro 403 ou 500, exibe modal de erro
    const status = error.response?.status;
    if (status === 403) {
      showModal("Acesso negado", "Você não tem permissão para executar esta ação.", "error");
    } else if (status === 500) {
      showModal("Erro no servidor", "Ocorreu um erro interno ao processar o pedido.", "error");
    } else {
      showModal("Erro", "Falha ao registrar o acesso.", "error");
    }
  }
};

  // ==============================================================
  // 🔹 VISITANTE INESPERADO
  // ==============================================================
  const handleNotificarMorador = async () => {
    const { nome, apartamentoDestino } = visitanteInesperado;
    if (!nome || !apartamentoDestino) {
      showModal('Atenção', 'Preencha o nome e selecione o apartamento.', 'error');
      return;
    }

    setNotificando(true);
    setStatusNotificacao('Enviando notificação...');

    try {
      const response = await api.post(`/moradores/${apartamentoDestino}/notificar-visitante`, {
        vst_nome: nome,
      });

      if (response.data.sucesso) {
        setStatusNotificacao('Notificação enviada ao morador!');
      } else {
        setStatusNotificacao('Falha ao enviar notificação.');
      }
    } catch (err) {
      console.error('Erro ao notificar morador:', err);
      setStatusNotificacao('Erro ao notificar morador.');
    }
  };

  const resetFluxoInesperado = () => {
    setNotificando(false);
    setStatusNotificacao('');
    setVisitanteInesperado({ nome: '', apartamentoDestino: '' });
  };

  // ==============================================================
  // 🔹 RENDERIZAÇÃO
  // ==============================================================
  return (
    <div className="page-container">
      <PageHeader title="Controle de Acessos - Portaria" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        <div className={styles.dashboardGrid}>

          {/* === Lista de Visitantes === */}
          <div className={`${styles.widget} ${styles.listaAguardando}`}>
            <h3 className={styles.widgetTitle}>Visitantes de Hoje</h3>
            <input
              type="text"
              placeholder="Buscar visitante ou unidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.listContainer}>
              {visitantesFiltrados.length === 0 ? (
                <p className={styles.emptyList}>Nenhum visitante registrado hoje.</p>
              ) : (
                <ul className={styles.visitanteList}>
                  {visitantesFiltrados.map(v => (
                    <li key={v.id} className={styles.visitanteItem}>
                      <div className={styles.visitanteInfo}>
                        <span className={styles.visitanteNome}>{v.nome}</span>
                        <span className={styles.visitanteDestino}>Unidade: {v.unidade}</span>
                        <span className={styles.visitanteMorador}>Autorizado por: {v.morador}</span>
                      </div>
                      <div className={styles.actions}>
                        {v.status === 'Aguardando' && (
                          <>
                            <button className={styles.confirmButton} onClick={() => handleConfirmarAcesso(v, 'CONFIRMADO')}>Registrar Entrada</button>
                            <button className={styles.denyButton} onClick={() => handleConfirmarAcesso(v, 'NEGADO')}>Negar</button>
                          </>
                        )}
                        {v.status === 'Entrou' && (
                          <button className={styles.cancelButton} onClick={() => handleConfirmarAcesso(v, 'SAIDA')}>Registrar Saída</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* === Visitante Inesperado === */}
          <div className={`${styles.widget} ${styles.fluxoInesperado}`}>
            <h3 className={styles.widgetTitle}>Visitante Sem Autorização Prévia</h3>

            {notificando ? (
              <div className={styles.statusBox}>
                <p className={styles.statusText}>{statusNotificacao}</p>
                <button className={styles.cancelButton} onClick={resetFluxoInesperado}>Voltar</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleNotificarMorador(); }}>
                <div className={styles.formGroup}>
                  <label>Nome do Visitante</label>
                  <input
                    type="text"
                    value={visitanteInesperado.nome}
                    onChange={(e) => setVisitanteInesperado({ ...visitanteInesperado, nome: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Unidade de Destino</label>
                  <input
                    type="number"
                    placeholder="ID do apartamento (userap_id)"
                    value={visitanteInesperado.apartamentoDestino}
                    onChange={(e) => setVisitanteInesperado({ ...visitanteInesperado, apartamentoDestino: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className={styles.notifyButton}>Notificar Morador</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
