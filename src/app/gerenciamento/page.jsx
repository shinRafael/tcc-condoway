"use client";

import { useState } from "react";
import './index.module.css';

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([
    { ger_id: 1, cond_id: 1, ger_data: "18/08/2025", ger_descricao: "Reparo no portão eletrônico", ger_valor: "R$ 750,00" },
    { ger_id: 2, cond_id: 1, ger_data: "19/08/2025", ger_descricao: "Pintura da fachada", ger_valor: "R$ 1.200,00" },
    { ger_id: 3, cond_id: 2, ger_data: "20/08/2025", ger_descricao: "Troca de lâmpadas externas", ger_valor: "R$ 300,00" },
    { ger_id: 4, cond_id: 3, ger_data: "21/08/2025", ger_descricao: "Limpeza da caixa d'água", ger_valor: "R$ 500,00" },
    { ger_id: 5, cond_id: 1, ger_data: "22/08/2025", ger_descricao: "Instalação de câmeras de segurança", ger_valor: "R$ 2.500,00" },
  ]);

  const condominios = [
    { id: 1, nome: "Condomínio Jardim" },
    { id: 2, nome: "Residencial Sol" },
    { id: 3, nome: "Condomínio das Flores" },
  ];

  const [form, setForm] = useState({
    cond_id: "",
    ger_data: "",
    ger_descricao: "",
    ger_valor: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cond_id || !form.ger_data || !form.ger_descricao || !form.ger_valor) return;

    const novo = {
      ger_id: dados.length + 1,
      ...form,
    };

    setDados([...dados, novo]);
    setForm({ cond_id: "", ger_data: "", ger_descricao: "", ger_valor: "" });
    setShowModal(false); // Fecha modal depois de salvar
  };

  return (
    <div className="main">
      {/* Header */}
      <div className="header">
        <h1 className="headerTitle">Gerenciamento</h1>
        <div className="userInfo">
          <span>Administrador</span>
          <img
            src="https://via.placeholder.com/35"
            alt="User"
            className="userAvatar"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="content">
        <div className="contentHeader">
          <h2 className="contentTitle">Despesas do Condomínio</h2>
          <button
            onClick={() => setShowModal(true)}
            className="addButton"
          >
            + Adicionar
          </button>
        </div>

        {/* Tabela */}
        <div className="tableContainer">
          <table className="table">
            <thead>
              <tr>
                <th>Condomínio</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => {
                const condNome =
                  condominios.find((c) => c.id == item.cond_id)?.nome || "N/A";
                return (
                  <tr key={item.ger_id}>
                    <td>{condNome}</td>
                    <td>{item.ger_data}</td>
                    <td>{item.ger_descricao}</td>
                    <td>{item.ger_valor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3 className="modalTitle">Adicionar Lançamento</h3>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label>Condomínio</label>
                <select
                  value={form.cond_id}
                  onChange={(e) =>
                    setForm({ ...form, cond_id: e.target.value })
                  }
                  className="w-full p-3 border rounded"
                >
                  <option value="">Selecione</option>
                  {condominios.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formGroup">
                <label>Data</label>
                <input
                  type="date"
                  value={form.ger_data}
                  onChange={(e) =>
                    setForm({ ...form, ger_data: e.target.value })
                  }
                />
              </div>

              <div className="formGroup">
                <label>Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Reparo no portão"
                  value={form.ger_descricao}
                  onChange={(e) =>
                    setForm({ ...form, ger_descricao: e.target.value })
                  }
                />
              </div>

              <div className="formGroup">
                <label>Valor</label>
                <input
                  type="text"
                  placeholder="Ex: R$ 500,00"
                  value={form.ger_valor}
                  onChange={(e) =>
                    setForm({ ...form, ger_valor: e.target.value })
                  }
                />
              </div>

              <div className="modalActions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancelButton"
                >
                  Cancelar
                </button>
                <button type="submit" className="saveButton">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
