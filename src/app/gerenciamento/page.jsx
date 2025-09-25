'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css';

// Componentes da UI
import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
// componente botão/modal
import BotaoCadastrar from './botãoCadastrar'; 

// Serviço da API
import api from '../../services/api';

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/gerenciamento");
        console.log("Dados recebidos:", response.data);
        const dadosDaApi = response.data.dados;
        setDados(Array.isArray(dadosDaApi) ? dadosDaApi : []);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setDados([]);
      }
    };

    fetchData();
  }, []);

  // Função para adicionar item novo na tabela
  const handleSaved = (item) => {
    if (!item) return;
    const safeItem = item.ger_id ? item : { ...item, ger_id: `local-${Date.now()}` };
    setDados(prev => [...prev, safeItem]);
  };

  return (
    <div className="page-container">
      <PageHeader title="Gerenciamento" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Despesas do Condomínio</h2>
            {/* Botão de cadastrar agora controla o modal internamente */}
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
                </tr>
              </thead>
              <tbody>
                {dados.length > 0 ? (
                  dados.map((item, index) => (
                    <tr key={item.ger_id ?? `row-${index}`}>
                      <td>{item.cond_nome}</td>
                      <td>{item.ger_data}</td>
                      <td>{item.ger_descricao}</td>
                      <td>{Number(item.ger_valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>Nenhuma despesa encontrada.</td>
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
