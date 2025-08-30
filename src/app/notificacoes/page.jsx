"use client";
import NotificacoesList from "./NotificacoesList";

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
  return (
    <div>
      <h1>Controle de Notificações</h1>
      <p style={{ marginBottom: "24px" }}>
        Administração de notificações do condomínio.
      </p>
      <NotificacoesList initialNotificacoes={initialNotificacoes} />
    </div>
  );
}
