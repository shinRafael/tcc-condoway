"use client";

import NotificacoesList from "./NotificacoesList";
import PageHeader from "@/componentes/PageHeader";
import { useEffect, useState } from "react";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from "@/services/api";

export default function Page() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Busca os envios de notificação já agrupados pela API.
   */
  const axiosNotificacoes = async () => {
    setLoading(true);
    try {
      // 1. Chama o endpoint que retorna os dados já agrupados.
      const response = await api.get("/notificacoes/envios");
      
      // 2. Formata os dados para o frontend.
      const notificacoesFormatadas = response.data.dados.map(envio => {
        // Como não temos um ID do banco para o grupo, criamos um ID único para o React
        // usando o conteúdo da notificação. btoa() cria uma string Base64.
        const idUnicoParaReact = btoa(encodeURIComponent(envio.not_titulo + envio.not_mensagem + envio.not_prioridade + envio.not_tipo));
        
        return {
          id: idUnicoParaReact,
          titulo: envio.not_titulo,
          mensagem: envio.not_mensagem,
          data: envio.data_ultimo_envio,
          prioridade: envio.not_prioridade,
          tipo: envio.not_tipo, // Guardamos o tipo, é essencial para editar/excluir
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

  /**
   * Envia uma nova notificação para a API.
   */
  const adicionarNotificacao = async (nova) => {
    try {
      const novaNotificacaoAPI = {
        not_titulo: nova.titulo,
        not_mensagem: nova.mensagem,
        not_prioridade: nova.prioridade,
        alvo: nova.alvo,
      };
      await api.post("/notificacao", novaNotificacaoAPI);
      axiosNotificacoes(); // Recarrega a lista para mostrar o novo envio
    } catch (error) {
      console.error("Falha ao adicionar notificação:", error);
    }
  };

  /**
   * Salva a edição de um grupo de notificações.
   */
  const salvarEdicao = async (original, atualizado) => {
    try {
      // A API precisa do conteúdo original para encontrar os registros
      // e do novo conteúdo para realizar a atualização.
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
      axiosNotificacoes(); // Recarrega a lista para mostrar os dados atualizados
    } catch (error) {
      console.error("Falha ao editar o envio:", error);
      alert("Erro ao editar o envio.");
    }
  };

  /**
   * Exclui um grupo inteiro de notificações.
   */
  const excluirNotificacao = async (notificacaoParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir este envio para TODOS os destinatários?")) {

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

      // Helper para log detalhado
      const logError = (prefix, err) => {
        console.error(prefix, err);
        if (err?.response) {
          console.error(prefix + ' - status:', err.response.status);
          console.error(prefix + ' - data:', err.response.data);
        }
      };

      try {
        console.log("Tentando excluir envio com payload (body):", payload);
        // 1) DELETE com body (Axios suporta via `data`)
        await api.delete("/notificacoes/envio", { data: payload });
        axiosNotificacoes(); // Recarrega a lista
        return;
      } catch (error) {
        logError('Falha ao excluir (DELETE body)', error);

        // 2) Tentar DELETE usando query params (alguns servidores aceitam)
        try {
          console.log('Tentando DELETE com query params', payload);
          await api.delete('/notificacoes/envio', { params: payload });
          axiosNotificacoes();
          return;
        } catch (err2) {
          logError('Falha ao excluir (DELETE params)', err2);

          // 3) Fallback: POST com _method=DELETE
          try {
            console.log('Tentando fallback via POST com _method=DELETE', payload);
            await api.post("/notificacoes/envio", { ...payload, _method: "DELETE" });
            axiosNotificacoes();
            return;
          } catch (err3) {
            logError('Falha no fallback (POST _method)', err3);

            // Por fim, mostra mensagem de erro amigável
            const status = err3?.response?.status || err2?.response?.status || error?.response?.status;
            const data = err3?.response?.data || err2?.response?.data || error?.response?.data;
            alert(`Erro ao excluir o envio. Status: ${status || 'desconhecido'}. Veja console para detalhes.`);
          }
        }
      }
    }
  };

  // Executa a busca inicial de notificações quando o componente é montado.
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
    </div>
  );
}