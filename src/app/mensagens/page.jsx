"use client";
import MensagensList from "./MensagensList";
import PageHeader from "@/componentes/PageHeader";
import { useEffect, useState } from "react";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from "@/services/api";

export default function Page() {
  const [conversasIniciais, setConversasIniciais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados iniciais da API
  useEffect(() => {
    const fetchConversas = async () => {
      try {
        setLoading(true);
        const response = await api.get('/mensagens');
        if (response.data?.sucesso) {
          const conversasDaApi = response.data.dados;
          setConversasIniciais(conversasDaApi);
          // Atualiza o badge uma vez após carregar os dados
          atualizarBadge(conversasDaApi);
        }
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversas();
  }, []);
  
  // Função para atualizar o badge (agora chamada internamente ou pelo filho)
  const atualizarBadge = (conversas) => {
    const mensagensNaoLidas = conversas.filter(conversa => 
      conversa.mensagens.some(msg => msg.remetente === "morador" && !msg.lida)
    ).length;
    
    // Dispara um evento customizado que o Sidebar pode ouvir
    try {
      const ev = new CustomEvent("sidebar-badge-event", {
        detail: { type: "sidebar-badge-update", key: "mensagens", count: mensagensNaoLidas },
      });
      window.dispatchEvent(ev);
      // Salva no localStorage para persistir
      const map = JSON.parse(localStorage.getItem("sidebarBadges") || "{}");
      map.mensagens = mensagensNaoLidas;
      localStorage.setItem("sidebarBadges", JSON.stringify(map));
    } catch {}
  };

  return (
    <div className="page-container">
      <PageHeader title="Mensagens" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        {loading ? (
          <p>Carregando conversas...</p>
        ) : (
          // Passamos a função de atualizar o badge para o filho
          <MensagensList 
            conversasIniciais={conversasIniciais} 
            onBadgeUpdate={atualizarBadge}
          />
        )}
      </div>
    </div>
  );
}