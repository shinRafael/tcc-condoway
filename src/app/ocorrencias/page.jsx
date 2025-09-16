"use client";
import { useState, useEffect } from "react";
import OcorrenciasList from "./OcorrenciasList";
import PageHeader from "@/componentes/PageHeader";

export default function Page() {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar as ocorrências da API
  const fetchOcorrencias = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3333/ocorrencias");
      if (!response.ok) {
        throw new Error("Erro ao buscar ocorrências da API.");
      }
      const data = await response.json();
      setOcorrencias(data.dados);

      const ocorrenciasPendentes = data.dados.filter(o => o.oco_status === "Aberta").length;
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
      console.error("Falha ao buscar ocorrências:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o status de uma ocorrência
  const handleUpdateStatus = async (id, novoStatus) => {
    try {
      const response = await fetch(`http://localhost:3333/ocorrencias/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oco_status: novoStatus }),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar o status da ocorrência na API.");
      }
      // Após a atualização, recarrega a lista de ocorrências
      fetchOcorrencias();
    } catch (error) {
      console.error("Falha ao atualizar o status:", error);
    }
  };

  useEffect(() => {
    fetchOcorrencias();
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