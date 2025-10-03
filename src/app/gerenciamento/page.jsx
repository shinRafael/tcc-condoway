'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css'; // caminho compartilhado

import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import BotaoCadastrar from './botãoCadastrar';

import api from '@/services/api';

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({
    cond_nome: "",
    ger_data: "",
    ger_descricao: "",
    ger_valor: ""
  });

  // UTIL: formata data pra mostrar na tabela sem causar "Invalid Date"
  const formatDisplayDate = (val) => {
    if (!val) return '—';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val; // já está dd/mm/yyyy
    const d = new Date(val);
    if (!isNaN(d)) return d.toLocaleDateString('pt-BR');
    return val;
  };

  // UTIL: converte dd/mm/aaaa ou outros formatos para yyyy-mm-dd (input type=date)
  const toISODate = (val) => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.split('T')[0]; // já ISO
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
      const [d, m, y] = val.split('/');
      return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
    }
    const d = new Date(val);
    if (!isNaN(d)) return d.toISOString().split('T')[0];
    return '';
  };

  // Buscar lista inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/gerenciamento");
        // sua API pode retornar response.data.dados ou response.data
        const dadosDaApi = response.data?.dados ?? response.data ?? [];
        setDados(Array.isArray(dadosDaApi) ? dadosDaApi : []);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setDados([]);
      }
    };
    fetchData();
  }, []);

  // Cadastro (recebe item do BotaoCadastrar via callback)
  const handleSaved = async (item) => {
    // item já deve ser o objeto criado (retorno da API). Se for só form, adiciona assim mesmo.
    setDados(prev => [...prev, item]);
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
      cond_nome: item.cond_nome ?? '',
      ger_data: toISODate(item.ger_data),
      ger_descricao: item.ger_descricao ?? '',
      ger_valor: item.ger_valor ?? ''
    });
  };

  // Salvar edição
  const salvarEdicao = async () => {
    if (!editando) return;
    try {
      const atualizado = {
        ...editando,
        ...formEdit
      };

      const response = await api.put(`/gerenciamento/${editando.ger_id}`, atualizado);
      // aceita response.data.dados ou response.data ou fallback para atualizado
      const updatedItem = response.data?.dados ?? response.data ?? atualizado;

      setDados(prev =>
        prev.map(item =>
          Number(item.ger_id) === Number(editando.ger_id) ? updatedItem : item
        )
      );

      fecharModal();
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  const fecharModal = () => {
    setEditando(null);
    setFormEdit({ cond_nome: "", ger_data: "", ger_descricao: "", ger_valor: "" });
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
                      <td>{formatDisplayDate(item.ger_data)}</td>
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
                        <button className={styles.iconButton} onClick={() => abrirEdicao(item)}>✏️</button>
                        <button className={styles.iconButton} onClick={() => handleDelete(item.ger_id)}>🗑️</button>
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

      {/* Modal de edição padronizado */}
      {editando && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Despesa</h3>

            <div className={styles.formGroup}>
              <label>Condomínio:</label>
              <input className={styles.input} type="text" value={formEdit.cond_nome}
                onChange={(e) => setFormEdit({ ...formEdit, cond_nome: e.target.value })}/>
            </div>

            <div className={styles.formGroup}>
              <label>Data:</label>
              <input className={styles.input} type="date" value={formEdit.ger_data}
                onChange={(e) => setFormEdit({ ...formEdit, ger_data: e.target.value })}/>
            </div>

            <div className={styles.formGroup}>
              <label>Descrição:</label>
              <input className={styles.input} type="text" value={formEdit.ger_descricao}
                onChange={(e) => setFormEdit({ ...formEdit, ger_descricao: e.target.value })}/>
            </div>

            <div className={styles.formGroup}>
              <label>Valor:</label>
              <input className={styles.input} type="number" value={formEdit.ger_valor}
                onChange={(e) => setFormEdit({ ...formEdit, ger_valor: e.target.value })}/>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={salvarEdicao}>Salvar</button>
              <button className={styles.cancelButton} onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
