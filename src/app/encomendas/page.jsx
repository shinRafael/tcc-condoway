"use client";
import { useState, useEffect } from "react"; // 1. Importar useEffect
import styles from "./encomendas.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useModal } from "@/context/ModalContext";
import api from "../../services/api"; // 2. Importar o 'api'

export default function Page() {
  const { showModal } = useModal();
  
  // 3. Remover dados mockados e adicionar 'loading'
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [novaEncomenda, setNovaEncomenda] = useState({
    userap_id: "", // A API espera userap_id
    enc_nome_loja: "",
    enc_status: "Aguardando", // Status padrão da API
    enc_data_chegada: new Date().toISOString().split("T")[0], // Data de hoje por padrão
    enc_data_retirada: null,
  });

  const [editandoId, setEditandoId] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [encomendaParaExcluir, setEncomendaParaExcluir] = useState(null);

  // 4. Função para buscar dados da API
  const fetchEncomendas = async () => {
    try {
      setLoading(true);
      // A rota '/encomendas' no backend (routes-enc.js) lista todas
      const response = await api.get("/encomendas");
      setEncomendas(response.data.dados || []);
    } catch (error) {
      console.error("Erro ao buscar encomendas:", error);
      showModal("Erro", "Não foi possível carregar as encomendas.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 5. Buscar dados quando o componente montar
  useEffect(() => {
    fetchEncomendas();
    // Adicionamos showModal como dependência (boa prática do hook)
  }, [showModal]);

  // Totais (agora são calculados dinamicamente)
  const totalEncomendas = encomendas.length;
  // A API usa 'Aguardando', então filtramos por ele
  const encomendasPendentes = encomendas.filter((e) => e.enc_status === "Aguardando").length;
  const encomendasRetiradas = encomendas.filter((e) => e.enc_status === "Entregue").length;

  // 6. Adicionar encomenda (com API)
  const handleAddEncomenda = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...novaEncomenda,
      userap_id: parseInt(novaEncomenda.userap_id), // API espera um número
    };
    
    try {
      await api.post("/encomendas", payload);
      showModal("Sucesso", "Encomenda cadastrada!");
      setNovaEncomenda({
        userap_id: "",
        enc_nome_loja: "",
        enc_status: "Aguardando",
        enc_data_chegada: new Date().toISOString().split("T")[0],
        enc_data_retirada: null,
      });
      setShowForm(false);
      fetchEncomendas(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao adicionar encomenda:", error);
      showModal("Erro", error.response?.data?.mensagem || "Falha ao cadastrar.", "error");
    }
  };

  // 7. Salvar status (AGORA COM API)
  const handleSalvarStatus = async (id) => {
    // Precisamos encontrar a encomenda original para enviar todos os dados
    // pois o controller 'editarEncomendas' espera o nome da loja
    const encOriginal = encomendas.find(e => e.enc_id === id);
    if (!encOriginal) {
      showModal("Erro", "Erro local: encomenda original não encontrada.", "error");
      return;
    }

    const payloadAPI = {
      // Campos que o controller espera (de encomendas.js)
      enc_nome_loja: encOriginal.enc_nome_loja,
      enc_codigo_rastreio: encOriginal.enc_codigo_rastreio,
      
      // Campos atualizados
      enc_status: novoStatus,
      enc_data_retirada: novoStatus === "Entregue" ? new Date().toISOString().split("T")[0] : null,
    };

    try {
      // Faz o PATCH para a API
      await api.patch(`/encomendas/${id}`, payloadAPI);
      showModal("Sucesso", "Status da encomenda atualizado!");
      fetchEncomendas(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao salvar status:", error);
      showModal("Erro", error.response?.data?.mensagem || "Não foi possível salvar a alteração.", "error");
    } finally {
      // Fecha o modo de edição
      setEditandoId(null);
      setNovoStatus("");
    }
  };

  // 8. Excluir encomenda (com API)
  const handleExcluirEncomenda = (id) => {
    setEncomendaParaExcluir(id);
    setShowConfirmDelete(true);
  };

  const confirmarExclusao = async () => {
    if (!encomendaParaExcluir) return;
    try {
      await api.delete(`/encomendas/${encomendaParaExcluir}`);
      showModal("Sucesso", "Encomenda excluída com sucesso!");
      fetchEncomendas(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao excluir:", error);
      showModal("Erro", error.response?.data?.mensagem || "Falha ao excluir.", "error");
    } finally {
      setShowConfirmDelete(false);
      setEncomendaParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setShowConfirmDelete(false);
    setEncomendaParaExcluir(null);
  };
  
  // 9. Helper para formatar data (a API envia data completa)
  const formatarData = (dataString) => {
    if (!dataString) return "Não retirada";
    try {
      return new Date(dataString).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
    } catch (e) {
      return dataString;
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Encomendas" rightContent={(<RightHeaderBrand />)} />

      <div className="page-content">
        {/* Cards */}
        <section className={styles.dashboardCards}>
          <div className={styles.card}>
            <h3>Total de Encomendas</h3>
            <p>{totalEncomendas}</p>
          </div>
          <div className={styles.card}>
            <h3>Pendentes</h3>
            <p>{encomendasPendentes}</p>
          </div>
          <div className={styles.card}>
            <h3>Retiradas</h3>
            <p>{encomendasRetiradas}</p>
          </div>
        </section>

        {/* Botão adicionar */}
        <div style={{ marginBottom: "20px" }}>
          <FabButton label={showForm ? "Cancelar" : "Adicionar Encomenda"} onClick={() => setShowForm(!showForm)} />
        </div>

      {/* Formulário */}
      {showForm && (
        <div className={styles.formContainer}>
          <h2>Nova Encomenda</h2>
          <form onSubmit={handleAddEncomenda}>
            <input
              type="number"
              placeholder="ID do Apartamento (userap_id)"
              value={novaEncomenda.userap_id}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, userap_id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Loja / Transportadora"
              value={novaEncomenda.enc_nome_loja}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, enc_nome_loja: e.target.value })}
              required
            />
            <input
              type="date"
              value={novaEncomenda.enc_data_chegada}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, enc_data_chegada: e.target.value })}
              required
            />
            <select
              value={novaEncomenda.enc_status}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, enc_status: e.target.value })}
            >
              <option value="Aguardando">Aguardando Retirada</option>
              <option value="Entregue">Entregue</option>
            </select>
            <button type="submit" className={styles.submitButton}>Salvar</button>
          </form>
        </div>
      )}

      {/* Tabela */}
      <section className={styles.tableSection}>
        <h2>Encomendas Recentes</h2>
        {loading ? (<p>Carregando encomendas...</p>) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Morador (ID Apto)</th>
                  <th>Data de Recebimento</th>
                  <th>Data de Retirada</th>
                  <th>Loja / Transportadora</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {encomendas.map((enc) => (
                  <tr key={enc.enc_id}>
                    <td>Apto {enc.userap_id}</td>
                    <td>{formatarData(enc.enc_data_chegada)}</td>
                    <td>{formatarData(enc.enc_data_retirada)}</td>
                    <td>{enc.enc_nome_loja}</td>
                    <td>
                      {editandoId === enc.enc_id ? (
                        <select 
                          value={novoStatus} 
                          onChange={(e) => setNovoStatus(e.target.value)}
                          // Classes de estilo dinâmicas
                          className={`
                            ${styles.statusSelect} 
                            ${novoStatus === 'Entregue' ? styles.statusSelectEntregue : styles.statusSelectPendente}
                          `}
                        >
                          <option value="Aguardando">Aguardando Retirada</option>
                          <option value="Entregue">Entregue</option>
                        </select>
                      ) : (
                        <>
                          {enc.enc_status === "Entregue" && (
                            <span className={styles.statusEntregue}>Entregue</span>
                          )}
                          {enc.enc_status === "Aguardando" && (
                            <span className={styles.statusPendente}>Aguardando Retirada</span>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      {editandoId === enc.enc_id ? (
                        <button className={styles.saveButton} onClick={() => handleSalvarStatus(enc.enc_id)}>
                          Salvar
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IconAction 
                            icon={FiEdit2} 
                            label="Editar" 
                            onClick={() => { 
                              setEditandoId(enc.enc_id); 
                              setNovoStatus(enc.enc_status); 
                            }} 
                            variant="edit" 
                          />
                          <IconAction 
                            icon={FiTrash2} 
                            label="Excluir" 
                            onClick={() => handleExcluirEncomenda(enc.enc_id)} 
                            variant="delete" 
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </section>

        {/* Modal de Confirmação de Exclusão */}
        {showConfirmDelete && (
          <div className={styles.modalOverlay} onClick={cancelarExclusao}>
            <div className={styles.modalConfirm} onClick={(e) => e.stopPropagation()}>
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir esta encomenda?</p>
              <div className={styles.modalButtons}>
                <button onClick={cancelarExclusao} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button onClick={confirmarExclusao} className={styles.deleteBtn}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}