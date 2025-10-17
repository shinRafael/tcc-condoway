'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css'; // caminho compartilhado

import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import BotaoCadastrar from './botãoCadastrar';
import IconAction from '@/componentes/IconAction/IconAction'; // Importado
import { FiEdit2, FiTrash2 } from 'react-icons/fi'; // Importado

import api from '@/services/api';

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({
    cond_nome: "", // Mantemos para exibição, mas não será editável
    ger_data: "",
    ger_descricao: "",
    ger_valor: ""
  });

  // UTIL: formata data pra mostrar na tabela
  const formatDisplayDate = (val) => {
    if (!val) return '—';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d)) return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // Adicionado timeZone para evitar problemas de fuso
    return val;
  };

  // UTIL: converte data para o formato yyyy-mm-dd
  const toISODate = (val) => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.split('T')[0];
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
        const dadosDaApi = response.data?.dados ?? response.data ?? [];
        setDados(Array.isArray(dadosDaApi) ? dadosDaApi : []);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setDados([]);
      }
    };
    fetchData();
  }, []);

  // Cadastro
  const handleSaved = (item) => {
    setDados(prev => [...prev, item]);
  };

  // Exclusão
  const handleDelete = async (id) => {
    // Adicionado um pop-up de confirmação para segurança
    if (window.confirm("Tem certeza que deseja excluir esta despesa?")) {
      try {
        await api.delete(`/gerenciamento/${id}`);
        setDados(prev => prev.filter(item => Number(item.ger_id) !== Number(id)));
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Não foi possível excluir a despesa.");
      }
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
      const payload = {
        cond_id: editando.cond_id,
        ger_data: formEdit.ger_data,
        ger_descricao: formEdit.ger_descricao,
        ger_valor: formEdit.ger_valor,
      };

      const response = await api.patch(`/gerenciamento/${editando.ger_id}`, payload);
      
      // ***** CORREÇÃO AQUI *****
      // Mesclamos o item original (que tem o cond_nome) com a resposta da API.
      const updatedItem = {
        ...editando, 
        ...(response.data?.dados ?? {})
      };

      setDados(prev =>
        prev.map(item =>
          Number(item.ger_id) === Number(editando.ger_id) ? updatedItem : item
        )
      );

      fecharModal();
    } catch (error) {
      console.error("Erro ao editar:", error);
      alert("Não foi possível salvar as alterações. Verifique o console para mais detalhes.");
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
                        {item.ger_valor != null
                          ? Number(item.ger_valor).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "—"}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IconAction 
                            icon={FiEdit2} 
                            label="Editar" 
                            variant="edit"
                            onClick={() => abrirEdicao(item)} 
                          />
                          <IconAction 
                            icon={FiTrash2} 
                            label="Excluir" 
                            variant="delete"
                            onClick={() => handleDelete(item.ger_id)} 
                          />
                        </div>
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

      {editando && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Despesa</h3>
            <div className={styles.formGroup}>
              <label>Condomínio:</label>
              <p className={`${styles.input} ${styles.disabledInput}`}>
                {formEdit.cond_nome}
              </p>
            </div>
            <div className={styles.formGroup}>
              <label>Data:</label>
              <input className={styles.input} type="date" value={formEdit.ger_data} onChange={(e) => setFormEdit({ ...formEdit, ger_data: e.target.value })}/>
            </div>
            <div className={styles.formGroup}>
              <label>Descrição:</label>
              <input className={styles.input} type="text" value={formEdit.ger_descricao} onChange={(e) => setFormEdit({ ...formEdit, ger_descricao: e.target.value })}/>
            </div>
            <div className={styles.formGroup}>
              <label>Valor:</label>
              <input className={styles.input} type="number" step="0.01" value={formEdit.ger_valor} onChange={(e) => setFormEdit({ ...formEdit, ger_valor: e.target.value })}/>
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