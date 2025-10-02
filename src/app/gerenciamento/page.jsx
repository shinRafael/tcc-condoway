'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css';

import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import BotaoCadastrar from './botãoCadastrar';

import api from '../../services/api';

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null); // item selecionado para edição
  const [formEdit, setFormEdit] = useState({
    cond_nome: "",
    ger_data: "",
    ger_descricao: "",
    ger_valor: ""
  });

  // Buscar lista inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/gerenciamento");
        const dadosDaApi = response.data?.dados ?? [];
        setDados(Array.isArray(dadosDaApi) ? dadosDaApi : []);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setDados([]);
      }
    };
    fetchData();
  }, []);

  // Cadastro
  const handleSaved = async (item) => {
    try {
      const response = await api.post("/gerenciamento", item);
      const novoItem = response.data ?? { ...item, ger_id: `local-${Date.now()}` };
      setDados(prev => [...prev, novoItem]);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  // Exclusão
  const handleDelete = async (id) => {
    try {
      await api.delete(`/gerenciamento/${id}`);
      setDados(prev => prev.filter(item => Number(item.ger_id) !== Number(id)));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  // Abrir modal de edição
  const abrirEdicao = (item) => {
    setEditando(item);
    setFormEdit({
      cond_nome: item.cond_nome,
      ger_data: item.ger_data ? item.ger_data.split("T")[0] : "",
      ger_descricao: item.ger_descricao,
      ger_valor: item.ger_valor
    });
  };

  // Salvar edição
  const salvarEdicao = async () => {
    try {
      const atualizado = {
        ...editando,
        ...formEdit
      };

      const response = await api.put(`/gerenciamento/${editando.ger_id}`, atualizado);

      setDados(prev =>
        prev.map(item =>
          Number(item.ger_id) === Number(editando.ger_id) ? response.data : item
        )
      );

      fecharModal();
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  // Fechar modal
  const fecharModal = () => {
    setEditando(null);
    setFormEdit({
      cond_nome: "",
      ger_data: "",
      ger_descricao: "",
      ger_valor: ""
    });
  };

  return (
    <div className="page-container">
      <PageHeader title="Gerenciamento" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Despesas do Condomínio</h2>
            <BotaoCadastrar onSaved={handleSaved} />
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Condomínio</th>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dados.length > 0 ? (
                  dados.map((item, index) => (
                    <tr key={item.ger_id ?? `row-${index}`}>
                      <td>{item.cond_nome ?? "—"}</td>
                      <td>
                        {item.ger_data
                          ? new Date(item.ger_data).toLocaleDateString("pt-BR")
                          : "—"}
                      </td>
                      <td>{item.ger_descricao ?? "—"}</td>
                      <td>
                        {item.ger_valor
                          ? Number(item.ger_valor).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "—"}
                      </td>
                      <td>
                        <button
                          className={styles.editButton}
                          onClick={() => abrirEdicao(item)}
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(item.ger_id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Nenhuma despesa encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO */}
      {editando && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>Editar Despesa</h3>

      <div>
        <label>Condomínio:</label>
        <input
          type="text"
          value={formEdit.cond_nome}
          onChange={(e) => setFormEdit({ ...formEdit, cond_nome: e.target.value })}
        />
      </div>

      <div>
        <label>Data:</label>
        <input
          type="date"
          value={formEdit.ger_data}
          onChange={(e) => setFormEdit({ ...formEdit, ger_data: e.target.value })}
        />
      </div>

      <div>
        <label>Descrição:</label>
        <input
          type="text"
          value={formEdit.ger_descricao}
          onChange={(e) => setFormEdit({ ...formEdit, ger_descricao: e.target.value })}
        />
      </div>

      <div>
        <label>Valor:</label>
        <input
          type="number"
          value={formEdit.ger_valor}
          onChange={(e) => setFormEdit({ ...formEdit, ger_valor: e.target.value })}
        />
      </div>

      <div className={styles.modalActions}>
        <button className={styles.saveButton} onClick={salvarEdicao}>
          Salvar
        </button>
        <button className={styles.cancelButton} onClick={fecharModal}>
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
