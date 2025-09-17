"use client";
import { useState, useEffect } from "react";
import OcorrenciasList from "./OcorrenciasList";
import PageHeader from "@/componentes/PageHeader";
import api from '@/services/api';

export default function Page() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosOcorrencias = async () => {
    setLoading(true);
    console.log("Iniciando a busca por ocorrências..."); // Adicionado para depuração
    try {
      const response = await api.get("/ocorrencias");
      
      // Adicionado para depuração: loga a resposta completa da API
      console.log("Resposta completa da API:", response);
      
      // Adicionado para depuração: loga os dados esperados
      console.log("Dados recebidos:", response.data.dados);

      setOcorrencias(response.data.dados);

      const ocorrenciasPendentes = response.data.dados.filter(o => o.oco_status === "Aberta").length;
      try {
        const ev = new CustomEvent("sidebar-badge-event", {
          detail: { type: "sidebar-badge-update", key: "ocorrencias", count: ocorrenciasPendentes },
        });
        window.dispatchEvent(ev);
        const map = JSON.parse(localStorage.getItem("sidebarBadges") || "{}");
        map.ocorrencias = ocorrenciasPendentes;
        localStorage.setItem("sidebarBadges", JSON.stringify(map));
      } catch (e) {
        console.error("Erro ao atualizar o badge do sidebar:", e);
      }

    } catch (error) {
      // Adicionado para depuração: loga qualquer erro de requisição
      console.error("Falha ao buscar ocorrências:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/ocorrencias/${id}`, { oco_status: novoStatus });
      axiosOcorrencias();
    } catch (error) {
      console.error("Falha ao atualizar o status:", error);
    }
  };

  useEffect(() => {
    axiosOcorrencias();
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Controle de Ocorrências" />
      <div className="page-content">
        {loading ? (
          <p>Carregando ocorrências...</p>
        ) : (
          <OcorrenciasList
            initialOcorrencias={ocorrencias}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
}