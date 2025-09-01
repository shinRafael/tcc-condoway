"use client";
import MensagensList from "./MensagensList";

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
  return (
    <div>
      <h1>Mensagens</h1>
      <p style={{ marginBottom: "24px" }}>
        Comunicação entre moradores e síndico (suporte).
      </p>
      <MensagensList conversasIniciais={conversasIniciais} />
    </div>
  );
}
