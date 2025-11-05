
'use client';
import { useState, useEffect } from 'react';
import styles from './index.module.css'; // <<< VERIFIQUE SE O NOME DO ARQUIVO CSS ESTÁ CORRETO
import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import BotaoCadastrar from './botãoCadastrar';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '@/services/api';
import { useModal } from "@/context/ModalContext"; // Importe o hook

export default function GerenciamentoPage() {
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({
    cond_nome: "",
    ger_data: "",
    ger_descricao: "",
    ger_valor: ""
  });
  const { showModal: showInfoModal } = useModal(); // Use o hook

  // --- INÍCIO: Adicionado estado para o modal de exclusão ---
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  // --- FIM: Adicionado estado para o modal de exclusão ---


  const formatDisplayDate = (val) => {
    if (!val) return '—';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d)) return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    return val;
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/gerenciamento");
        const dadosDaApi = response.data?.dados ?? response.data ?? [];
        setDados(Array.isArray(dadosDaApi) ? dadosDaApi : []);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setDados([]);
        showInfoModal("Erro", "Não foi possível carregar as despesas.", "error"); // Adicionado feedback de erro
      }
    };
    fetchData();
  }, [showInfoModal]); // Adicionado showInfoModal como dependência

  const handleSaved = (item) => {
    // Adiciona o item novo no início da lista para melhor visibilidade
    setDados(prev => [item, ...prev]);
    showInfoModal("Sucesso", "Despesa cadastrada com sucesso!"); // Feedback de sucesso
  };

  // --- INÍCIO: Funções do modal de exclusão ---
  const handleDelete = (item) => {
    setItemParaExcluir(item);
    setShowConfirmDeleteModal(true);
  };

  const confirmarExclusao = async () => {
    if (!itemParaExcluir) return;
    try {
      await api.delete(`/gerenciamento/${itemParaExcluir.ger_id}`);
      setDados(prev => prev.filter(item => Number(item.ger_id) !== Number(itemParaExcluir.ger_id)));
      showInfoModal("Sucesso", "Despesa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      const erroMsg = error.response?.data?.mensagem || "Não foi possível excluir a despesa.";
      showInfoModal("Erro", erroMsg, "error");
    } finally {
      setShowConfirmDeleteModal(false);
      setItemParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setShowConfirmDeleteModal(false);
    setItemParaExcluir(null);
  };
  // --- FIM: Funções do modal de exclusão ---


  const abrirEdicao = (item) => {
    setEditando(item);
    setFormEdit({
      cond_nome: item.cond_nome ?? '',
      ger_data: toISODate(item.ger_data),
      ger_descricao: item.ger_descricao ?? '',
      ger_valor: item.ger_valor ?? ''
    });
  };

  const salvarEdicao = async () => {
    if (!editando) return;
    try {
      const payload = {
        cond_id: editando.cond_id,
        ger_data: formEdit.ger_data,
        ger_descricao: formEdit.ger_descricao,
        ger_valor: formEdit.ger_valor,
      };

      await api.patch(`/gerenciamento/${editando.ger_id}`, payload);
      
      // Atualiza o item na lista localmente após sucesso da API
      setDados(prev =>
        prev.map(item =>
          Number(item.ger_id) === Number(editando.ger_id) 
            ? { ...item, ...payload, ger_data: formatDisplayDate(payload.ger_data) } // Atualiza com dados do payload
            : item
        )
      );

      fecharModal();
      showInfoModal("Sucesso", "Despesa atualizada com sucesso!"); // Feedback de sucesso

    } catch (error) {
      console.error("Erro ao editar:", error);
      const erroMsg = error.response?.data?.mensagem || "Não foi possível salvar as alterações.";
      showInfoModal("Erro", erroMsg, "error");
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
                      <td data-label="Condomínio">{item.cond_nome ?? "—"}</td>
                      <td data-label="Data">{formatDisplayDate(item.ger_data)}</td>
                      <td data-label="Descrição">{item.ger_descricao ?? "—"}</td>
                      <td data-label="Valor">
                        {item.ger_valor != null
                          ? Number(item.ger_valor).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "—"}
                      </td>
                      <td data-label="Ações">
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
                            onClick={() => handleDelete(item)} // <<< ATUALIZADO: Passa o objeto 'item'
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#6c757d' }}>Nenhuma despesa encontrada.</td>
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

       {/* --- INÍCIO: Modal de exclusão --- */}
       {showConfirmDeleteModal && itemParaExcluir && (
        <div className={styles.modalOverlay} onClick={cancelarExclusao}>
          <div className={`${styles.modal} ${styles.confirmDeleteModal}`} onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Exclusão</h2>
            <p>
              Deseja realmente excluir a despesa{" "}
              <strong>"{itemParaExcluir.ger_descricao}"</strong> do condomínio{" "}
              <strong>{itemParaExcluir.cond_nome}</strong>?
            </p>
            <div className={styles.modalActions}>
              <button type="button" onClick={confirmarExclusao} className={styles.confirmBtnBlue}>Confirmar Exclusão</button>
              <button type="button" onClick={cancelarExclusao} className={styles.cancelBtnRed}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {/* --- FIM: Modal de exclusão --- */}

    </div>
  );
}