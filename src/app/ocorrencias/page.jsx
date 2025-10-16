"use client";
import { useState, useEffect } from "react";
import OcorrenciasList from "./OcorrenciasList"; // Importa o componente da lista
import PageHeader from "@/componentes/PageHeader"; // Seu componente de cabeçalho
import api from '@/services/api'; // Seu serviço de API

export default function Page() {
  const [ocorrencias, setOcorrencias] = useState({
    abertas: [],
    emAndamento: [],
    resolvidas: [],
    canceladas: []
  });
  const [loading, setLoading] = useState(true);

  const axiosOcorrencias = async () => {
    setLoading(true);
    try {
      // Lembre-se que sua API deve retornar os dados já agrupados por status
      const response = await api.get("/ocorrencias");
      
      if (response && response.data && response.data.dados) {
        setOcorrencias(response.data.dados);

        // Lógica para atualizar o badge no sidebar
        const ocorrenciasPendentes = response.data.dados.abertas?.length || 0;
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
      } else {
         setOcorrencias({ abertas: [], emAndamento: [], resolvidas: [], canceladas: [] });
      }
      
    } catch (error) {
      console.error("Falha ao buscar ocorrências:", error);
      setOcorrencias({ abertas: [], emAndamento: [], resolvidas: [], canceladas: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, novoStatus) => {
    try {
      await api.patch(`/ocorrencias/${id}`, { oco_status: novoStatus });
      axiosOcorrencias(); // Recarrega os dados para refletir a mudança
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
            ocorrenciasPorStatus={ocorrencias}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
}
import styles from './ocorrencias.module.css'; // Importando o CSS Module

// Componente para renderizar um card individual
const OcorrenciaCard = ({ ocorrencia, onUpdateStatus }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case "Aberta": return styles.pendente;
            case "Em Andamento": return styles.emAndamento;
            case "Resolvida": return styles.resolvida;
            case "Cancelada": return styles.cancelada;
            default: return styles.pendente;
        }
    };

    return (
        <div className={`${styles.card} ${getStatusClass(ocorrencia.oco_status)}`}>
            <div className={styles.cardHeader}>
                <h3>{ocorrencia.oco_protocolo}</h3>
                <span className={styles.data}>
                    {new Date(ocorrencia.oco_data).toLocaleDateString("pt-BR")}
                </span>
            </div>
            <p className={styles.mensagem}>{ocorrencia.oco_descricao}</p>
            <div className={styles.actions}>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Aberta")} disabled={ocorrencia.oco_status === "Aberta"}>Aberta</button>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Em Andamento")} disabled={ocorrencia.oco_status === "Em Andamento"}>Em Andamento</button>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Resolvida")} disabled={ocorrencia.oco_status === "Resolvida"}>Resolvida</button>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Cancelada")} disabled={ocorrencia.oco_status === "Cancelada"}>Cancelada</button>
            </div>
        </div>
    );
};
