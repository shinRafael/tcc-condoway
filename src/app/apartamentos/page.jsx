
"use client";
import React, { useState, useEffect } from "react";
import styles from "./apartamentos.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from "@/services/api";
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useModal } from "@/context/ModalContext"; // Importe o hook

export default function Apartamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editingAp, setEditingAp] = useState(null);
  const [showLoteModal, setShowLoteModal] = useState(false);
  const [apartamentos, setApartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(true);
  const [filterField, setFilterField] = useState('bloco');
  const [searchTerm, setSearchTerm] = useState('');
  const { showModal: showInfoModal } = useModal(); // Renomeie para evitar conflito de nome

  // --- INÍCIO: Adicionado estado para o modal de exclusão ---
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [apartamentoParaExcluir, setApartamentoParaExcluir] = useState(null);
  // --- FIM: Adicionado estado para o modal de exclusão ---

  const listarApartamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/apartamentos');
      setApartamentos(response.data.dados); 
    } catch(error) {
      console.error('Erro ao buscar apartamentos:', error);
      showInfoModal('Erro', 'Não foi possível carregar a lista de apartamentos', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    listarApartamentos();
  }, []);

  const handleAddAp = () => {
    setEditingAp(null);
    setShowModal(true);
  };

  const handleEditAp = (ap) => {
    setEditingAp(ap);
    setShowModal(true);
    setShowLoteModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingAp(null);
    setShowLoteModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formAp = Object.fromEntries(formData);

    const payload = {
      bloco: formAp.bloco, 
      numero: Number(formAp.numero),
      andar: formAp.andar,
    };
    
    // ATUALIZAÇÃO: Nome da variável "url" alterado para "apiUrl" para evitar conflito
    const apiUrl = editingAp 
      ? `/apartamentos/${editingAp.ap_id}` 
      : '/apartamentos';
    
    try {
      if (editingAp) {
          await api.patch(apiUrl, payload); 
      } else {
          await api.post(apiUrl, payload);
      }
      
      await listarApartamentos(); 
      handleClose();
      showInfoModal("Sucesso", `Apartamento ${editingAp ? 'atualizado' : 'cadastrado'} com sucesso!`);
      
    } catch (error) {
      console.error(`Erro ao salvar apartamento:`, error);
      // MELHORIA: Tratamento de erro específico
      const erroMsg = error.response?.data?.mensagem;
      if (erroMsg && (erroMsg.toLowerCase().includes("já existe") || erroMsg.toLowerCase().includes("duplicate"))) {
         showInfoModal('Erro', 'Já existe um apartamento com este Bloco e Número.', 'error');
      } else {
         showInfoModal('Erro', erroMsg || 'Erro ao salvar apartamento. Verifique o console.', 'error');
      }
    }
  };

  // --- INÍCIO: Funções do modal de exclusão ---
  const handleDelete = (ap) => {
    setApartamentoParaExcluir(ap);
    setShowConfirmDeleteModal(true);
  };

  const confirmarExclusao = async () => {
    if (!apartamentoParaExcluir) return;
    try {
      await api.delete(`/apartamentos/${apartamentoParaExcluir.ap_id}`);
      showInfoModal("Sucesso", "Apartamento excluído com sucesso!");
      await listarApartamentos(); 
    } catch (error) {
      console.error("Erro ao excluir apartamento:", error);
      const erroMsg = error.response?.data?.mensagem || "Erro ao excluir apartamento. Verifique o console.";
      showInfoModal("Erro", erroMsg, "error");
    } finally {
      setShowConfirmDeleteModal(false);
      setApartamentoParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setShowConfirmDeleteModal(false);
    setApartamentoParaExcluir(null);
  };
  // --- FIM: Funções do modal de exclusão ---


  const handleSaveLote = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formLote = Object.fromEntries(formData);
    
    const bloco = formLote.bloco;
    const andar = formLote.andar;
    const numInicial = Number(formLote.numInicial);
    const numFinal = Number(formLote.numFinal);
    
    if (numFinal <= numInicial) {
      showInfoModal("Erro", "O número final deve ser maior que o número inicial.", "error");
      return;
    }
    
    const total = numFinal - numInicial + 1;
    let requests = [];
    
    for (let i = 0; i < total; i++) {
        const apNumero = numInicial + i;
        const payload = {
            bloco: bloco,
            numero: apNumero,
            andar: andar
        };
        requests.push(api.post('/apartamentos', payload));
    }
    
    try {
        await Promise.all(requests);
        showInfoModal("Sucesso", `${total} apartamentos cadastrados com sucesso no Bloco ${bloco}!`);
        await listarApartamentos();
        handleClose();
    } catch (error) {
        console.error('Erro ao cadastrar lote:', error);
        // MELHORIA: Tratamento de erro específico
        const erroMsg = error.response?.data?.mensagem;
        if (erroMsg && (erroMsg.toLowerCase().includes("já existe") || erroMsg.toLowerCase().includes("duplicate"))) {
           showInfoModal('Erro', 'Erro ao cadastrar em lote. Um ou mais apartamentos (Bloco/Número) já existem.', 'error');
        } else {
           showInfoModal('Erro', erroMsg || 'Erro ao cadastrar apartamentos em lote. Verifique o console.', 'error');
        }
    }
  };


  const filteredApartamentos = apartamentos.filter(ap => {
    const term = searchTerm.toLowerCase();

    if (!term) return true;

    if (filterField === 'bloco') {
      return ap.bloco_id && ap.bloco_id.toString().toLowerCase().includes(term);
    } else if (filterField === 'numero') {
      return ap.ap_numero && ap.ap_numero.toString().includes(term);
    }

    return false;
  });

  return (
    <div className="page-container">
      <PageHeader
        title="Apartamentos"
        rightContent={<RightHeaderBrand />}
      />

      <div className="page-content">
        <div className={styles.content}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <FabButton label="Adicionar Apartamento" onClick={handleAddAp} />
            <FabButton label="Cadastro Rápido (Lote)" onClick={() => setShowLoteModal(true)} />
          </div>
          
          <div className={styles.filterContainer}>
            
            <div className={styles.radioGroup}>
              <span style={{ marginRight: '10px' }}>Buscar por:</span>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name="filterGroup"
                  value="bloco"
                  checked={filterField === 'bloco'}
                  onChange={() => setFilterField('bloco')}
                  style={{ marginRight: '5px' }}
                />
                Bloco
              </label>
              <label>
                <input
                  type="radio"
                  name="filterGroup"
                  value="numero"
                  checked={filterField === 'numero'}
                  onChange={() => setFilterField('numero')}
                  style={{ marginRight: '5px' }}
                />
                Número
              </label>
            </div>
            
            <input
              type="text"
              placeholder={`Digite o ${filterField === 'bloco' ? 'Bloco (Ex: A)' : 'Número (Ex: 101)'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {showList ? (
            loading ? (
              <p>Carregando lista de apartamentos...</p>
            ) : filteredApartamentos.length === 0 && searchTerm !== '' ? (
              <p>Nenhum apartamento encontrado com o filtro atual.</p>
            ) : filteredApartamentos.length === 0 && searchTerm === '' ? (
              <p>Nenhum apartamento encontrado. Verifique o banco de dados.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Bloco</th>
                    <th>Número</th>
                    <th>Andar</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApartamentos.map((ap) => (
                    <tr key={ap.ap_id} className={styles.apRow}>
                      <td>
                        {ap.ap_id}
                        <div className={styles.tooltip}>
                          <p>
                            <strong>ID:</strong> {ap.ap_id}
                          </p>
                          <p>
                            <strong>Bloco:</strong> {ap.bloc_id}
                          </p>
                          <p>
                            <strong>Número:</strong> {ap.ap_numero}
                          </p>
                          <p>
                            <strong>Andar:</strong> {ap.ap_andar}
                          </p>
                        </div>
                      </td>
                      <td>{ap.bloc_id}</td>
                      <td>{ap.ap_numero}</td>
                      <td>{ap.ap_andar}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <IconAction 
                            icon={FiEdit2} 
                            label="Editar" 
                            variant="edit"
                            onClick={() => handleEditAp(ap)} 
                          />
                          <IconAction 
                            icon={FiTrash2} 
                            label="Excluir" 
                            variant="delete"
                            onClick={() => handleDelete(ap)} // ATUALIZADO: Passa o objeto 'ap'
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : null}
        </div>
      </div>
      
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              {editingAp
                ? "Editar Apartamento"
                : "Adicionar Apartamento"}
            </h2>
            <form onSubmit={handleSave} className={styles.form}>
              <input
                type="number"
                name="id"
                placeholder="ID (Gerado automaticamente)"
                defaultValue={editingAp?.ap_id || ""}
                className={editingAp ? styles.visibleOnEdit : styles.hiddenOnAdd}
                disabled={editingAp ? true : false} 
                required={editingAp}
              />
              <input
                type="text"
                name="bloco"
                placeholder="Bloco"
                defaultValue={editingAp?.bloco_id || ""}
                required
              />
              <input
                type="number"
                name="numero"
                placeholder="Número"
                defaultValue={editingAp?.ap_numero || ""}
                required
              />
              <input
                type="text"
                name="andar"
                placeholder="Andar"
                defaultValue={editingAp?.ap_andar || ""}
                required
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn}>
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showLoteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Cadastro Rápido (Lote)</h2>
            <form onSubmit={handleSaveLote} className={styles.form}> 
              <input
                type="text"
                name="bloco"
                placeholder="Bloco"
                required
              />
              <input
                type="text"
                name="andar"
                placeholder="Andar"
                required
              />
              <input
                type="number"
                name="numInicial"
                placeholder="Número Inicial (Ex: 101)"
                required
              />
              <input
                type="number"
                name="numFinal"
                placeholder="Número Final (Ex: 110)"
                required
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn}>
                  Criar Lote
                </button>
                <button
                  type="button"
                  onClick={handleClose} 
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INÍCIO: Modal de exclusão --- */}
      {showConfirmDeleteModal && apartamentoParaExcluir && (
        <div className={styles.modalOverlay} onClick={cancelarExclusao}>
          <div className={`${styles.modal} ${styles.confirmDeleteModal}`} onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Exclusão</h2>
            <p>
              Deseja realmente excluir o apartamento{" "}
              <strong>Bloco {apartamentoParaExcluir.bloc_id} - Nº {apartamentoParaExcluir.ap_numero}</strong>?
              Esta ação não pode ser desfeita.
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