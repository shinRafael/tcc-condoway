"use client";
import OcorrenciasList from "./OcorrenciasList";

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
  return (
    <div>
      <h1>Controle de Ocorrências</h1>
      <p style={{ marginBottom: "24px" }}>
        Administração das ocorrências enviadas pelos moradores.
      </p>
      <OcorrenciasList initialOcorrencias={initialOcorrencias} />
    </div>
  );
}
