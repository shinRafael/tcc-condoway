"use client";

export default function GerenciamentoPage() {
  // 🔹 Mock de dados só para exibir
  const dados = [
    { ger_id: 1, cond_id: 1, ger_data: "18/08/2025", ger_descricao: "Reparo no portão eletrônico", ger_valor: "R$ 750,00" },
    { ger_id: 2, cond_id: 1, ger_data: "19/08/2025", ger_descricao: "Pintura da fachada", ger_valor: "R$ 1.200,00" },
    { ger_id: 3, cond_id: 2, ger_data: "20/08/2025", ger_descricao: "Troca de lâmpadas externas", ger_valor: "R$ 300,00" },
    { ger_id: 4, cond_id: 3, ger_data: "21/08/2025", ger_descricao: "Limpeza da caixa d’água", ger_valor: "R$ 500,00" },
    { ger_id: 5, cond_id: 1, ger_data: "22/08/2025", ger_descricao: "Instalação de câmeras de segurança", ger_valor: "R$ 2.500,00" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Gerenciamento</h1>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Condomínio</th>
              <th className="px-4 py-2 border">Data</th>
              <th className="px-4 py-2 border">Descrição</th>
              <th className="px-4 py-2 border">Valor</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.ger_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.ger_id}</td>
                <td className="px-4 py-2 border">{item.cond_id}</td>
                <td className="px-4 py-2 border">{item.ger_data}</td>
                <td className="px-4 py-2 border">{item.ger_descricao}</td>
                <td className="px-4 py-2 border">{item.ger_valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}