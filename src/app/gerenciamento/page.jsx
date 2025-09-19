'use client';

import { useState, useEffect } from 'react';
import styles from './index.module.css';

// Componentes da UI
import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
// ✅ CORREÇÃO: Substitua pelo caminho REAL para o seu componente de botão.
import BotaoCadastrar from './botãoCadastrar'; 

// Serviço da API
import api from '../../services/api';

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);
  // 🧹 MELHORIA: O estado 'condominios' não estava sendo usado. Se não for usar, pode ser removido.
  // const [condominios, setCondominios] = useState([]); 

  const [form, setForm] = useState({
    cond_id: "",
    ger_data: "",
    ger_descricao: "",
    ger_valor: "",
  });
  const [showModal, setShowModal] = useState(false);

  // ✅ CORREÇÃO: useEffect para buscar dados agora está correto e funcional.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/gerenciamento");
        console.log("Dados recebidos:", response.data);
        
        // Boa prática: Garante que o que você passa para setDados é sempre um array.
        const dadosDaApi = response.data.dados;
        setDados(Array.isArray(dadosDaApi) ? dadosDaApi : []);

      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setDados([]); // Em caso de erro, define como um array vazio para evitar que o .map quebre.
      }
    };

    fetchData(); // A função agora é chamada.
  }, []); // A dependência vazia [] garante que isso só roda uma vez.

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cond_id || !form.ger_data || !form.ger_descricao || !form.ger_valor) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Lógica para converter o valor monetário para número antes de enviar
    const valorNumerico = parseFloat(
      form.ger_valor.replace("R$", "").replace(".", "").replace(",", ".").trim()
    ) || 0;

    const novoLancamento = {
      ...form,
      ger_valor: valorNumerico,
    };

    try {
      const response = await api.post("/gerenciamento", novoLancamento);
      
      // Atualiza o estado local com os dados que a API retornou
      setDados([...dados, response.data]);

      // Limpa o formulário e fecha o modal
      setForm({ cond_id: "", ger_data: "", ger_descricao: "", ger_valor: "" });
      setShowModal(false);

    } catch (error) {
      console.error("Erro ao cadastrar novo lançamento:", error);
      alert("Houve um erro ao tentar cadastrar.");
    }
  };

  // Função para lidar com a mudança e formatação do campo de valor
  const handleValorChange = (e) => {
    // Implemente sua lógica de formatação de moeda aqui se necessário
    setForm({ ...form, ger_valor: e.target.value });
  }

  return (
    // 🧹 MELHORIA: Removida a div externa desnecessária e o Sidebar não utilizado
    <div className="page-container">
      <PageHeader title="Gerenciamento" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Despesas do Condomínio</h2>
            <BotaoCadastrar onClick={() => setShowModal(true)} />
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
                {/* Boa prática: Adicionar uma verificação caso 'dados' esteja vazio */}
                {dados.length > 0 ? (
                  dados.map((item) => (
                    <tr key={item.ger_id}>
                      <td>{item.cond_nome}</td>
                      <td>{item.ger_data}</td>
                      <td>{item.ger_descricao}</td>
                      {/* Formatação do valor para moeda local */}
                      <td>{Number(item.ger_valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Nenhuma despesa encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              {/* Aqui dentro você deve colocar o seu formulário (form) */}
              <h2>Cadastrar Nova Despesa</h2>
              {/* Exemplo de formulário (você precisa criar os inputs) */}
              <form onSubmit={handleSubmit}>
                {/* Inputs para cond_id, ger_data, ger_descricao, ger_valor */}
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}