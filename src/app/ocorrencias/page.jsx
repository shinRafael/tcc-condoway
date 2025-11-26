"use client";
import { useState, useEffect } from "react";
import OcorrenciasList from "./OcorrenciasList";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from '@/services/api';
import useAuthGuard from "@/utils/useAuthGuard";

export default function Page() {
  useAuthGuard(["Sindico", "Funcionario"]); // Síndico e Porteiro podem acessar
  
  // O estado agora armazena o objeto agrupado pela API
  const [ocorrenciasAgrupadas, setOcorrenciasAgrupadas] = useState({
      Aberta: [], 'Em Andamento': [], Resolvida: [], Cancelada: []
  });
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados (agora agrupados pela API)
  const axiosOcorrencias = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ocorrencias");
      const dados = response.data?.dados;
      const gruposPadrao = { Aberta: [], 'Em Andamento': [], Resolvida: [], Cancelada: [] };

      if (dados && typeof dados === 'object') {
           // Mescla os dados recebidos com a estrutura padrão para garantir que todas as chaves existam
           const dadosValidos = {
                Aberta: Array.isArray(dados.Aberta) ? dados.Aberta : [],
                'Em Andamento': Array.isArray(dados['Em Andamento']) ? dados['Em Andamento'] : [],
                Resolvida: Array.isArray(dados.Resolvida) ? dados.Resolvida : [],
                Cancelada: Array.isArray(dados.Cancelada) ? dados.Cancelada : [],
           };
           setOcorrenciasAgrupadas(dadosValidos);
           atualizarBadge(dadosValidos.Aberta); // Atualiza badge com as 'Abertas'
      } else {
           console.warn("API não retornou dados agrupados esperados.");
           setOcorrenciasAgrupadas(gruposPadrao);
           atualizarBadge([]);
      }

    } catch (error) {
      console.error("Falha ao buscar ocorrências:", error);
      setOcorrenciasAgrupadas({ Aberta: [], 'Em Andamento': [], Resolvida: [], Cancelada: [] });
      atualizarBadge([]);
    } finally {
      setLoading(false);
    }
  };

   // Função para atualizar o badge (conta apenas as Abertas)
   const atualizarBadge = (ocorrenciasAbertas) => {
        const numAbertas = Array.isArray(ocorrenciasAbertas) ? ocorrenciasAbertas.length : 0;
        try {
            const ev = new CustomEvent("sidebar-badge-event", {
            detail: { type: "sidebar-badge-update", key: "ocorrencias", count: numAbertas },
            });
            window.dispatchEvent(ev);
            const map = JSON.parse(localStorage.getItem("sidebarBadges") || "{}");
            map.ocorrencias = numAbertas;
            localStorage.setItem("sidebarBadges", JSON.stringify(map));
        } catch (e) {
            console.error("Erro ao atualizar badge:", e);
        }
   };

  // Função para lidar com atualizações vindas do filho (para o badge)
  const handleUpdateFromChild = (id, updatedFields) => {
     // Se o status mudou, é crucial recarregar para atualizar a contagem do badge
     if (updatedFields.oco_status) {
          axiosOcorrencias();
     }
     // Se apenas a prioridade mudou, não precisamos recarregar tudo aqui,
     // pois o OcorrenciasList já atualizou a UI localmente.
  };

  // Busca os dados apenas uma vez quando o componente é montado
  useEffect(() => {
    axiosOcorrencias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Controle de Ocorrências" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        {loading ? (
          <p>Carregando ocorrências...</p>
        ) : (
          <OcorrenciasList
            initialOcorrencias={ocorrenciasAgrupadas} // Passa o objeto agrupado
            onUpdate={handleUpdateFromChild} // O filho chama isso quando algo muda
            refreshList={axiosOcorrencias} // O filho chama isso se a API falhar
          />
        )}
      </div>
    </div>
  );
}