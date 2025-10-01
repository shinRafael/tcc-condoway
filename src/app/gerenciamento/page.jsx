'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css';

import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import BotaoCadastrar from './botãoCadastrar';

import api from '../../services/api';

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/gerenciamento");
        const dadosDaApi = response.data.dados;
        setDados(Array.isArray(dadosDaApi) ? dadosDaApi : []);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setDados([]);
      }
    };
    fetchData();
  }, []);

  const handleSaved = (item) => {
    if (!item) return;
    const safeItem = item.ger_id ? item : { ...item, ger_id: `local-${Date.now()}` };
    setDados(prev => [...prev, safeItem]);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gerenciamento/${id}`);
      // Convertemos para número caso seja necessário
      setDados(prev => prev.filter(item => item.ger_id !== Number(id)));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleEdit = async (itemAtualizado) => {
    try {
      const response = await api.put(`/gerenciamento/${itemAtualizado.ger_id}`, itemAtualizado);
      setDados(prev => prev.map(item => item.ger_id === itemAtualizado.ger_id ? response.data : item));
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
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
                      <td>{item.cond_nome}</td>
                      <td>{new Date(item.ger_data).toLocaleDateString('pt-BR')}</td>
                      <td>{item.ger_descricao}</td>
                      <td>{Number(item.ger_valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>
                        <button className={styles.editButton} onClick={() => handleEdit(item)}>✏️</button>
                        <button className={styles.deleteButton} onClick={() => handleDelete(item.ger_id)}>🗑️</button>
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
    </div>
  );
}
