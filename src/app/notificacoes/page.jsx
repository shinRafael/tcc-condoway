"use client";
import NotificacoesList from "./NotificacoesList";
import PageHeader from "@/componentes/PageHeader";
import { useEffect } from "react";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";

const initialNotificacoes = [
  {
    id: 101,
    titulo: "Manutenção",
    mensagem: "A manutenção da piscina será realizada amanhã.",
    data: "2025-08-26",
    tipo: "moderada",
  },
  {
    id: 102,
    titulo: "Reunião de Condomínio",
    mensagem: "Assembleia marcada para o dia 30/08 às 19h.",
    data: "2025-08-28",
    tipo: "importante",
  },
  {
    id: 103,
    titulo: "Limpeza",
    mensagem: "Equipe de limpeza estará no bloco B pela manhã.",
    data: "2025-08-25",
    tipo: "basica",
  },
];

export default function Page() {
  useEffect(() => {
    const novasNotificacoes = initialNotificacoes.filter((n) => n.tipo === "importante").length;
    try {
      const ev = new CustomEvent("sidebar-badge-event", {
        detail: { type: "sidebar-badge-update", key: "notificacoes", count: novasNotificacoes },
      });
      window.dispatchEvent(ev);
      const map = JSON.parse(localStorage.getItem("sidebarBadges") || "{}");
      map.notificacoes = novasNotificacoes;
      localStorage.setItem("sidebarBadges", JSON.stringify(map));
    } catch {}
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Controle de Notificações" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        <NotificacoesList initialNotificacoes={initialNotificacoes} />
      </div>
    </div>
  );
}
