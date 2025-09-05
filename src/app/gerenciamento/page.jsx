'use client';

import { useState } from 'react';
import styles from './index.module.css'; // Corrigido para usar CSS Modules
import PageHeader from '@/componentes/PageHeader';

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

  const handleValorChange = (e) => {
    let value = e.target.value;
    // Remove tudo que não for dígito para lidar apenas com os números
    value = value.replace(/\D/g, "");

    if (value === "") {
      setForm({ ...form, ger_valor: "" });
      return;
    }

    // Converte o valor para número (em centavos) e formata como moeda
    const numberValue = Number(value) / 100;
    const formattedValue = numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    setForm({ ...form, ger_valor: formattedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.cond_id || !form.ger_data || !form.ger_descricao || !form.ger_valor) return;

    const novo = {
      ger_id: dados.length + 1,
      ...form,
    };

    setDados([...dados, novo]);
    setForm({ cond_id: "", ger_data: "", ger_descricao: "", ger_valor: "" });
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <PageHeader title="Gerenciamento" rightContent={(
        <div className={styles.userInfo}>
          <span>Administrador</span>
          <img
            src="https://via.placeholder.com/35"
            alt="User"
            className={styles.userAvatar}
          />
        </div>
      )} />

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
