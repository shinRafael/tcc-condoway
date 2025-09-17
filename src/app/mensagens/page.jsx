"use client";
import MensagensList from "./MensagensList";
import PageHeader from "@/componentes/PageHeader";
import { useEffect, useState } from "react";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";

const conversasIniciais = [
  {
    moradorId: 1,
    moradorNome: "João Silva",
    apartamento: "Bloco A - 102",
    mensagens: [
      {
        id: 1,
        remetente: "morador",
        texto: "Boa noite, estou com problema na garagem.",
        data: "2025-08-28 20:10",
      },
      {
        id: 2,
        remetente: "sindico",
        texto: "Boa noite! Qual seria o problema?",
        data: "2025-08-28 20:12",
      },
    ],
  },
  {
    moradorId: 2,
    moradorNome: "Maria Souza",
    apartamento: "Bloco B - 305",
    mensagens: [
      {
        id: 1,
        remetente: "morador",
        texto: "Gostaria de agendar uma reunião.",
        data: "2025-08-28 18:00",
      },
    ],
  },
];

export default function Page() {
  const [conversas, setConversas] = useState(conversasIniciais);

  // Função para atualizar o badge quando as mensagens mudarem
  const atualizarBadge = (conversasAtualizadas) => {
    const mensagensNaoLidas = conversasAtualizadas.filter(conversa => 
      conversa.mensagens.some(msg => msg.remetente === "morador" && !msg.lida)
    ).length;
    
    try {
      const ev = new CustomEvent("sidebar-badge-event", {
        detail: { type: "sidebar-badge-update", key: "mensagens", count: mensagensNaoLidas },
      });
      window.dispatchEvent(ev);
      const map = JSON.parse(localStorage.getItem("sidebarBadges") || "{}");
      map.mensagens = mensagensNaoLidas;
      localStorage.setItem("sidebarBadges", JSON.stringify(map));
    } catch {}
  };

  // Calcular badge inicial
  useEffect(() => {
    atualizarBadge(conversas);
  }, []);

  // Callback para quando as mensagens forem atualizadas no componente filho
  const handleMensagensUpdate = (conversasAtualizadas) => {
    setConversas(conversasAtualizadas);
    atualizarBadge(conversasAtualizadas);
  };

  return (
    <div className="page-container">
      <PageHeader title="Mensagens" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        <MensagensList 
          conversasIniciais={conversas} 
          onMensagensUpdate={handleMensagensUpdate}
        />
      </div>
    </div>
  );
}
