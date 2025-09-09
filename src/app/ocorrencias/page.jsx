"use client";
import OcorrenciasList from "./OcorrenciasList";
import PageHeader from "@/componentes/PageHeader";
import { useEffect } from "react";

const initialOcorrencias = [
  {
    id: 1,
    titulo: "Barulho Excessivo",
    mensagem: "O morador do 302 está fazendo muito barulho após as 23h.",
    data: "2025-08-28",
    status: "pendente",
  },
  {
    id: 2,
    titulo: "Problema na Garagem",
    mensagem: "Carro estacionado na vaga errada do bloco B.",
    data: "2025-08-27",
    status: "visto",
  },
  {
    id: 3,
    titulo: "Iluminação Queimada",
    mensagem: "Lâmpada queimada no corredor do 1º andar.",
    data: "2025-08-25",
    status: "pendente",
  },
];

export default function Page() {
  useEffect(() => {
    const ocorrenciasPendentes = initialOcorrencias.filter(o => o.status === "pendente").length;
    try {
      const ev = new CustomEvent("sidebar-badge-event", {
        detail: { type: "sidebar-badge-update", key: "ocorrencias", count: ocorrenciasPendentes },
      });
      window.dispatchEvent(ev);
      const map = JSON.parse(localStorage.getItem("sidebarBadges") || "{}");
      map.ocorrencias = ocorrenciasPendentes;
      localStorage.setItem("sidebarBadges", JSON.stringify(map));
    } catch {}
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Controle de Ocorrências" />
      <div className="page-content">
        <OcorrenciasList initialOcorrencias={initialOcorrencias} />
      </div>
    </div>
  );
}
