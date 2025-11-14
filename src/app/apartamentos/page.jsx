"use client";
import React, { useState, useEffect } from "react";
import styles from "./apartamentos.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from "@/services/api";
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useModal } from "@/context/ModalContext";

export default function Apartamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editingAp, setEditingAp] = useState(null);
  const [showLoteModal, setShowLoteModal] = useState(false);
  const [showBlocoModal, setShowBlocoModal] = useState(false); // NOVO: Modal de Bloco
  const [apartamentos, setApartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(true);
  const [filterField, setFilterField] = useState('bloco');
  const [searchTerm, setSearchTerm] = useState('');
  const { showModal: showInfoModal } = useModal(); 

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [apartamentoParaExcluir, setApartamentoParaExcluir] = useState(null);

  // --- NOVOS ESTADOS PARA OS BLOCOS ---
  const [blocosDisponiveis, setBlocosDisponiveis] = useState([]);
  const [loadingBlocos, setLoadingBlocos] = useState(true);
  // Mapa para converter ID de bloco em Nome (para a tabela)
  const [mapaBlocos, setMapaBlocos] = useState(new Map());

  // --- FUNÇÃO ATUALIZADA PARA BUSCAR BLOCOS ---
  useEffect(() => {
    const fetchBlocos = async () => {
      setLoadingBlocos(true);
      try {
        const response = await api.get('/blocos');
        const blocos = response.data.dados || [];
        setBlocosDisponiveis(blocos);
        // Cria um mapa para consulta rápida (Ex: 1 => "A")
        setMapaBlocos(new Map(blocos.map(b => [b.bloc_id, b.bloc_nome])));
      } catch (error) {
        console.error('Erro ao buscar blocos:', error);
        showInfoModal('Erro', 'Não foi possível carregar a lista de blocos.', 'error');
        setBlocosDisponiveis([]);
      } finally {
        setLoadingBlocos(false);
      }
    };
    fetchBlocos();
  }, [showInfoModal]); // Dependência do showInfoModal

  const listarApartamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/apartamentos');
      const apartamentosData = response.data.dados;
      console.log('📦 Dados dos apartamentos recebidos:', apartamentosData);
      if (apartamentosData && apartamentosData.length > 0) {
        console.log('🔍 Exemplo de apartamento:', apartamentosData[0]);
        console.log('🏢 Campos de bloco disponíveis:', {
          bloco_id: apartamentosData[0].bloco_id,
          bloc_id: apartamentosData[0].bloc_id,
          bloc: apartamentosData[0].bloc,
          bloc_nome: apartamentosData[0].bloc_nome
        });
      }
      setApartamentos(apartamentosData); 
    } catch(error) {
      console.error('Erro ao buscar apartamentos:', error);
      showInfoModal('Erro', 'Não foi possível carregar a lista de apartamentos', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Só lista apartamentos depois que os blocos carregarem,
    // para que a tabela possa mostrar os nomes corretos.
    if (!loadingBlocos) {
      listarApartamentos();
    }
  }, [loadingBlocos]); // Dependência do loadingBlocos

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
    setShowBlocoModal(false); // NOVO: Fecha modal de bloco
  };

  // --- handleSave ATUALIZADO ---
  // (Garante que o ID do bloco seja enviado como número)
  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formAp = Object.fromEntries(formData);

    console.log('📝 Dados do formulário:', formAp);

    const payload = {
      bloc_id: Number(formAp.bloco), // Campo correto: bloc_id
      ap_numero: Number(formAp.numero),
      ap_andar: formAp.andar,
    };
    
    console.log('📦 Payload a ser enviado:', payload);
    
    const apiUrl = editingAp 
      ? `/apartamentos/${editingAp.ap_id}` 
      : '/apartamentos';
    
    console.log('🌐 URL da API:', apiUrl);
    
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
      console.error(`❌ Erro ao salvar apartamento:`, error);
      console.error(`❌ Resposta do backend:`, error.response?.data);
      const erroMsg = error.response?.data?.mensagem;
      if (erroMsg && (erroMsg.toLowerCase().includes("já existe") || erroMsg.toLowerCase().includes("duplicate"))) {
         showInfoModal('Erro', 'Já existe um apartamento com este Bloco e Número.', 'error');
      } else {
         showInfoModal('Erro', erroMsg || 'Erro ao salvar apartamento. Verifique o console.', 'error');
      }
    }
  };

  // Funções de exclusão (sem alteração)
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

  // --- handleSaveLote ATUALIZADO ---
  const handleSaveLote = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formLote = Object.fromEntries(formData);
    
    console.log('📦 Dados do formulário em lote:', formLote);
    
    const bloco = Number(formLote.bloco);
    const andar = formLote.andar;
    const numInicial = Number(formLote.numInicial);
    const numFinal = Number(formLote.numFinal);
    
    // Validações
    if (!bloco || isNaN(bloco)) {
      showInfoModal("Erro", "Por favor, selecione um bloco válido.", "error");
      return;
    }
    
    if (!andar) {
      showInfoModal("Erro", "Por favor, informe o andar.", "error");
      return;
    }
    
    if (!numInicial || !numFinal || isNaN(numInicial) || isNaN(numFinal)) {
      showInfoModal("Erro", "Por favor, informe os números inicial e final válidos.", "error");
      return;
    }
    
    if (numFinal <= numInicial) {
      showInfoModal("Erro", "O número final deve ser maior que o número inicial.", "error");
      return;
    }
    
    const total = numFinal - numInicial + 1;
    let requests = [];
    
    for (let i = 0; i < total; i++) {
        const apNumero = numInicial + i;
        const payload = {
            bloco_id: bloco,
            ap_numero: apNumero,
            ap_andar: andar
        };
        console.log(`📤 Enviando apartamento ${i+1}/${total}:`, payload);
        requests.push(api.post('/apartamentos', payload));
    }
    
    try {
        await Promise.all(requests);
        showInfoModal("Sucesso", `${total} apartamentos cadastrados com sucesso no Bloco ${mapaBlocos.get(bloco) || bloco}!`);
        await listarApartamentos();
        handleClose();
    } catch (error) {
        console.error('Erro ao cadastrar lote:', error);
        const erroMsg = error.response?.data?.mensagem;
        if (erroMsg && (erroMsg.toLowerCase().includes("já existe") || erroMsg.toLowerCase().includes("duplicate"))) {
           showInfoModal('Erro', 'Erro ao cadastrar em lote. Um ou mais apartamentos (Bloco/Número) já existem.', 'error');
        } else {
           showInfoModal('Erro', erroMsg || 'Erro ao cadastrar apartamentos em lote. Verifique o console.', 'error');
        }
    }
  };

  // --- NOVA FUNÇÃO: handleSaveBloco ---
  const handleSaveBloco = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formBloco = Object.fromEntries(formData);
    
    console.log('📦 Dados do bloco:', formBloco);
    
    const payload = {
      nome: formBloco.nomeBloco,
      cond_id: 1 // TODO: Pegar o ID do condomínio do usuário logado
    };
    
    if (!payload.nome || payload.nome.trim() === '') {
      showInfoModal("Erro", "Por favor, informe o nome do bloco.", "error");
      return;
    }
    
    try {
      await api.post('/blocos', payload);
      console.log('✅ Bloco criado com sucesso');
      
      // Recarrega a lista de blocos
      const response = await api.get('/blocos');
      console.log('📦 Blocos atualizados:', response.data);
      const blocos = response.data.dados || [];
      setBlocosDisponiveis(blocos);
      setMapaBlocos(new Map(blocos.map(b => [b.bloc_id, b.bloc_nome])));
      
      // Recarrega também os apartamentos para refletir o novo bloco na tabela
      await listarApartamentos();
      
      showInfoModal("Sucesso", `Bloco "${payload.nome}" cadastrado com sucesso!`);
      handleClose();
    } catch (error) {
      console.error("Erro ao cadastrar bloco:", error);
      const erroMsg = error.response?.data?.mensagem || "Erro ao cadastrar bloco.";
      showInfoModal("Erro", erroMsg, "error");
    }
  };


  const filteredApartamentos = apartamentos.filter(ap => {
    const term = searchTerm.toLowerCase();

    if (!term) return true;

    // Busca pelo NOME do bloco (usando o mapa) ou pelo NÚMERO
    if (filterField === 'bloco') {
      const nomeBloco = mapaBlocos.get(ap.bloco_id)?.toLowerCase() || '';
      return nomeBloco.includes(term);
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
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <FabButton label="➕ Novo Bloco" onClick={() => setShowBlocoModal(true)} />
            <FabButton label="🏢 Novo Apartamento" onClick={handleAddAp} />
            <FabButton label="📦 Cadastro em Lote" onClick={() => setShowLoteModal(true)} />
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
              placeholder={`Digite o ${filterField === 'bloco' ? 'Nome do Bloco (Ex: A)' : 'Número (Ex: 101)'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {showList ? (
            loading ? (
              <p>Carregando lista de apartamentos...</p>
            ) : filteredApartamentos.length === 0 ? (
              <p>Nenhum apartamento encontrado.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Bloco</th>
                    <th>Número</th>
                    <th>Andar</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApartamentos.map((ap) => (
                    <tr key={ap.ap_id} className={styles.apRow}>
                      <td data-label="Bloco">
                        {/* CORRIGIDO: Verifica múltiplos possíveis nomes de campo */}
                        {mapaBlocos.get(ap.bloco_id || ap.bloc_id || ap.bloc) || ap.bloc_nome || `ID ${ap.bloco_id || ap.bloc_id || ap.bloc || 'undefined'}`}
                      </td>
                      <td data-label="Número">{ap.ap_numero}</td>
                      <td data-label="Andar">{ap.ap_andar}</td>
                      <td data-label="Ações">
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
                            onClick={() => handleDelete(ap)}
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
      
      {/* Modal de Adicionar/Editar */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>
              {editingAp
                ? "Editar Apartamento"
                : "Adicionar Apartamento"}
            </h2>
            <form onSubmit={handleSave} className={styles.form}>
              
              {/* --- CAMPO DE BLOCO ATUALIZADO --- */}
              <select
                name="bloco" // O form envia 'bloco'
                defaultValue={editingAp?.bloco_id || ""}
                required
                disabled={loadingBlocos}
                style={{ 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc', 
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                <option value="">
                  {loadingBlocos ? "Carregando blocos..." : "Selecione o Bloco"}
                </option>
                {blocosDisponiveis.map((bloco) => (
                  <option key={bloco.bloc_id} value={bloco.bloc_id}>
                    {bloco.bloc_nome}
                  </option>
                ))}
              </select>
              {/* --- FIM DA ATUALIZAÇÃO --- */}

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
      
      {/* Modal de Cadastro em Lote */}
      {showLoteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Cadastro Rápido (Lote)</h2>
            <form onSubmit={handleSaveLote} className={styles.form}> 
              
              {/* --- CAMPO DE BLOCO ATUALIZADO --- */}
              <select
                name="bloco"
                required
                disabled={loadingBlocos}
                style={{ 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc', 
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                <option value="">
                  {loadingBlocos ? "Carregando blocos..." : "Selecione o Bloco"}
                </option>
                {blocosDisponiveis.map((bloco) => (
                  <option key={bloco.bloc_id} value={bloco.bloc_id}>
                    {bloco.bloc_nome}
                  </option>
                ))}
              </select>
              {/* --- FIM DA ATUALIZAÇÃO --- */}

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

      {/* NOVO: Modal de Adicionar Bloco */}
      {showBlocoModal && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar Bloco</h2>
            <form onSubmit={handleSaveBloco} className={styles.form}>
              <input
                type="text"
                name="nomeBloco"
                placeholder="Nome do Bloco (Ex: A, B, Único)"
                required
                autoFocus
                style={{ 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #ccc', 
                  fontSize: '14px',
                  fontWeight: 600
                }}
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

      {/* Modal de Exclusão (sem alteração) */}
      {showConfirmDeleteModal && apartamentoParaExcluir && (
        <div className={styles.modalOverlay} onClick={cancelarExclusao}>
          <div className={`${styles.modal} ${styles.confirmDeleteModal}`} onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Exclusão</h2>
            <p>
              Deseja realmente excluir o apartamento{" "}
              <strong>Bloco {mapaBlocos.get(apartamentoParaExcluir.bloco_id) || '?'} - Nº {apartamentoParaExcluir.ap_numero}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className={styles.modalActions}>
              <button type="button" onClick={confirmarExclusao} className={styles.confirmBtnBlue}>Confirmar Exclusão</button>
              <button type="button" onClick={cancelarExclusao} className={styles.cancelBtnRed}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}