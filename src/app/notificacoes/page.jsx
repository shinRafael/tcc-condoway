"use client";
import NotificacoesList from "./NotificacoesList";
import PageHeader from "@/componentes/PageHeader";
import { useEffect, useState } from "react";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from "@/services/api";
import { useModal } from "@/context/ModalContext"; // Importe o hook
import useAuthGuard from "@/utils/useAuthGuard";

export default function Page() {
  useAuthGuard(["Sindico"]); // Apenas síndico pode acessar
  
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificacaoParaExcluir, setNotificacaoParaExcluir] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { showModal } = useModal(); // Use o hook

  const axiosNotificacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notificacoes/envios");
      
      const notificacoesFormatadas = response.data.dados.map(envio => {
        const idUnicoParaReact = btoa(encodeURIComponent(envio.not_titulo + envio.not_mensagem + envio.not_prioridade + envio.not_tipo));
        
        return {
          id: idUnicoParaReact,
          titulo: envio.not_titulo,
          mensagem: envio.not_mensagem,
          data: envio.data_ultimo_envio,
          prioridade: envio.not_prioridade,
          tipo: envio.not_tipo,
          destinatarios: envio.total_destinatarios,
        };
      });

      setNotificacoes(notificacoesFormatadas);

    } catch (error) {
      console.error("Falha ao buscar envios de notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarNotificacao = async (nova) => {
    try {
      const novaNotificacaoAPI = {
        not_titulo: nova.titulo,
        not_mensagem: nova.mensagem,
        not_prioridade: nova.prioridade,
        alvo: nova.alvo,
      };
      await api.post("/notificacao", novaNotificacaoAPI);
      axiosNotificacoes();
    } catch (error) {
      console.error("Falha ao adicionar notificação:", error);
    }
  };

  const salvarEdicao = async (original, atualizado) => {
    try {
      await api.patch("/notificacoes/envio", {
        original: {
          not_titulo: original.titulo,
          not_mensagem: original.mensagem,
          not_prioridade: original.prioridade,
          not_tipo: original.tipo,
        },
        novo: {
          not_titulo: atualizado.titulo,
          not_mensagem: atualizado.mensagem,
          not_prioridade: atualizado.prioridade,
        }
      });
      axiosNotificacoes();
    } catch (error) {
      console.error("Falha ao editar o envio:", error);
      showModal("Erro", "Erro ao editar o envio.", "error");
    }
  };

  const excluirNotificacao = async (notificacaoParaExcluir) => {
    setNotificacaoParaExcluir(notificacaoParaExcluir);
    setShowConfirmDelete(true);
  };

  const confirmarExclusao = async () => {
    if (!notificacaoParaExcluir) return;

    const capitalizeLocal = (s) => {
      if (!s || typeof s !== 'string') return 'Media';
      return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    };

    const payload = {
      not_titulo: notificacaoParaExcluir.titulo || notificacaoParaExcluir.not_titulo,
      not_mensagem: notificacaoParaExcluir.mensagem || notificacaoParaExcluir.not_mensagem,
      not_prioridade: capitalizeLocal(notificacaoParaExcluir.prioridade || notificacaoParaExcluir.not_prioridade),
      not_tipo: notificacaoParaExcluir.tipo || notificacaoParaExcluir.not_tipo,
    };

    const logError = (prefix, err) => {
      console.error(prefix, err);
      if (err?.response) {
        console.error(prefix + ' - status:', err.response.status);
        console.error(prefix + ' - data:', err.response.data);
      }
    };

    try {
      console.log("Tentando excluir envio com payload (body):", payload);
      await api.delete("/notificacoes/envio", { data: payload });
      axiosNotificacoes();
      setShowConfirmDelete(false);
      setNotificacaoParaExcluir(null);
      return;
    } catch (error) {
      logError('Falha ao excluir (DELETE body)', error);

      try {
        console.log('Tentando DELETE com query params', payload);
        await api.delete('/notificacoes/envio', { params: payload });
        axiosNotificacoes();
        setShowConfirmDelete(false);
        setNotificacaoParaExcluir(null);
        return;
      } catch (err2) {
        logError('Falha ao excluir (DELETE params)', err2);

        try {
          console.log('Tentando fallback via POST com _method=DELETE', payload);
          await api.post("/notificacoes/envio", { ...payload, _method: "DELETE" });
          axiosNotificacoes();
          setShowConfirmDelete(false);
          setNotificacaoParaExcluir(null);
          return;
        } catch (err3) {
          logError('Falha no fallback (POST _method)', err3);

          const status = err3?.response?.status || err2?.response?.status || error?.response?.status;
          showModal("Erro", `Erro ao excluir o envio. Status: ${status || 'desconhecido'}. Veja console para detalhes.`, "error");
          setShowConfirmDelete(false);
          setNotificacaoParaExcluir(null);
        }
      }
    }
  };

  const cancelarExclusao = () => {
    setShowConfirmDelete(false);
    setNotificacaoParaExcluir(null);
  };

  useEffect(() => {
    axiosNotificacoes();
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Controle de Notificações" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        {loading ? (
          <p>Carregando envios de notificação...</p>
        ) : (
          <NotificacoesList
            initialNotificacoes={notificacoes}
            adicionarNotificacao={adicionarNotificacao}
            salvarEdicao={salvarEdicao}
            excluirNotificacao={excluirNotificacao}
          />
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Confirmar Exclusão</h3>
            <p style={{ marginBottom: '24px' }}>
              Tem certeza que deseja excluir este envio para TODOS os destinatários?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelarExclusao}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '32px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  backgroundColor: '#6c757d',
                  color: 'white'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '32px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  backgroundColor: '#dc3545',
                  color: 'white'
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}