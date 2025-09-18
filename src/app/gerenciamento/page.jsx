'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css';
import PageHeader from '@/componentes/PageHeader';
import Sidebar from '@/componentes/Sidebar/sidebar';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import api from '@/services/api'; // importa a configuração do axios

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [form, setForm] = useState({
    cond_id: "",
    ger_data: "",
    ger_descricao: "",
    ger_valor: "",
  });
  const [showModal, setShowModal] = useState(false);

  // 🔹 Buscar dados com Axios
 useEffect(() => {
  const fetchData = async () => {
    try {
      const responseGerenciamento = await api.get("/gerenciamento");
      console.log("Gerenciamento:", responseGerenciamento.data);
      setDados(Array.isArray(responseGerenciamento.data) ? responseGerenciamento.data : []);

      const responseCondominios = await api.get("/condominios");
      console.log("Condomínios:", responseCondominios.data);
      setCondominios(Array.isArray(responseCondominios.data) ? responseCondominios.data : []);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  fetchData();
}, []);

  // 🔹 Atualiza o valor formatado em R$
  const handleValorChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // só números

    if (value === "") {
      setForm({ ...form, ger_valor: "" });
      return;
    }

    const numberValue = Number(value) / 100;
    const formattedValue = numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setForm({ ...form, ger_valor: formattedValue });
  };

  // 🔹 Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cond_id || !form.ger_data || !form.ger_descricao || !form.ger_valor) return;

    // Converte "R$ 500,00" → 500.00
    const valorNumerico = parseFloat(
      form.ger_valor.replace(/[^\d,]/g, "").replace(",", ".")
    ) || 0;

    const novoLancamento = {
      ...form,
      ger_valor: valorNumerico,
    };

    try {
      const response = await api.post("/gerenciamento", novoLancamento);
      const novoItemSalvo = response.data;

      setDados([
        ...dados,
        {
          ...novoItemSalvo,
          ger_valor: novoItemSalvo.ger_valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        },
      ]);

      setForm({ cond_id: "", ger_data: "", ger_descricao: "", ger_valor: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Erro no submit:", error);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Gerenciamento" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Despesas do Condomínio</h2>
            <button
              onClick={() => setShowModal(true)}
              className={styles.addButton}
            >
              + Adicionar
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
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

                  const dataFormatada = item.ger_data.includes("-")
                    ? new Date(item.ger_data + "T00:00:00").toLocaleDateString(
                        "pt-BR"
                      )
                    : item.ger_data;

                  const valorFormatado =
                    typeof item.ger_valor === "number"
                      ? item.ger_valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : item.ger_valor;

                  return (
                    <tr key={item.ger_id}>
                      <td>{condNome}</td>
                      <td>{dataFormatada}</td>
                      <td>{item.ger_descricao}</td>
                      <td>{valorFormatado}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Adicionar Lançamento</h3>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Condomínio</label>
                  <select
                    value={form.cond_id}
                    onChange={(e) =>
                      setForm({ ...form, cond_id: e.target.value })
                    }
                    className={styles.select}
                  >
                    <option value="">Selecione</option>
                    {condominios.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Data</label>
                  <input
                    type="date"
                    value={form.ger_data}
                    onChange={(e) =>
                      setForm({ ...form, ger_data: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Descrição</label>
                  <input
                    type="text"
                    placeholder="Ex: Reparo no portão"
                    value={form.ger_descricao}
                    onChange={(e) =>
                      setForm({ ...form, ger_descricao: e.target.value })
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Valor</label>
                  <input
                    type="text"
                    placeholder="Ex: R$ 500,00"
                    value={form.ger_valor}
                    onChange={handleValorChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={styles.cancelButton}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}