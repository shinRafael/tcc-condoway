"use client";
import React, { useState, useEffect } from "react";
import styles from "./apartamentos.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from "@/services/api";
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction'; // Importado
import { FiEdit2, FiTrash2 } from 'react-icons/fi'; // Importado

export default function Apartamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editingAp, setEditingAp] = useState(null);

  const [showLoteModal, setShowLoteModal] = useState(false);

  const [apartamentos, setApartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showList, setShowList] = useState(true);
  const [filterField, setFilterField] = useState('bloco');

  const [searchTerm, setSearchTerm] = useState('');

  const listarApartamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/apartamentos');
      setApartamentos(response.data.dados); 
    } catch(error) {
      console.error('Erro ao buscar apartamentos:', error);
      alert('Não foi possível carregar a lista de apartamentos');
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
      bloc: formAp.bloco, 
      numero: Number(formAp.numero),
      andar: formAp.andar,
    };
    
    const url = `/apartamentos/${editingAp?.ap_id}`;
    
    try {
      if (editingAp) {
          await api.patch(url, payload); 
      } else {
          await api.post('/apartamentos', payload);
      }
      
      await listarApartamentos(); 
      handleClose();
      
    } catch (error) {
      console.error(`Erro ao salvar apartamento:`, error);
      alert(`Erro ao salvar apartamento. Verifique o console.`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir este apartamento?")) {
      return;
    }

    try {
      await api.delete(`/apartamentos/${id}`);
      await listarApartamentos(); 
    } catch (error) {
      console.error("Erro ao excluir apartamento:", error);
      alert("Erro ao excluir apartamento. Veja o console.");
    }
  };

  const handleSaveLote = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formLote = Object.fromEntries(formData);
    
    const bloco = formLote.bloco;
    const andar = formLote.andar;
    const numInicial = Number(formLote.numInicial);
    const numFinal = Number(formLote.numFinal);
    
    if (numFinal <= numInicial) {
      alert("O número final deve ser maior que o número inicial.");
      return;
    }
    
    const total = numFinal - numInicial + 1;
    let requests = [];
    
    for (let i = 0; i < total; i++) {
        const apNumero = numInicial + i;
        const payload = {
            bloc: bloco,
            numero: apNumero,
            andar: andar
        };
        requests.push(api.post('/apartamentos', payload));
    }
    
    try {
        await Promise.all(requests);
        alert(`${total} apartamentos cadastrados com sucesso no Bloco ${bloco}!`);
        await listarApartamentos();
        handleClose();
    } catch (error) {
        console.error('Erro ao cadastrar lote:', error);
        alert('Erro ao cadastrar apartamentos em lote. Verifique o console.');
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
          
          {/* APLICAÇÃO DA CLASSE CSS: Contêiner de Filtro */}
          <div className={styles.filterContainer}>
            
            {/* Rádio Buttons com Classes CSS */}
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
            
            {/* Input de Pesquisa com Classe CSS */}
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
            ) : filteredApartamentos.length === 0 && searchTerm !== '' ? ( // Se não houver resultados E a busca não for vazia
              <p>Nenhum apartamento encontrado com o filtro atual.</p>
            ) : filteredApartamentos.length === 0 && searchTerm === '' ? ( // Se não houver resultados e a lista estiver vazia (problema na API)
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
                            <strong>Bloco:</strong> {ap.bloco_id}
                          </p>
                          <p>
                            <strong>Número:</strong> {ap.ap_numero}
                          </p>
                          <p>
                            <strong>Andar:</strong> {ap.ap_andar}
                          </p>
                        </div>
                      </td>
                      <td>{ap.bloco_id}</td>
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
                            onClick={() => handleDelete(ap.ap_id)} 
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
      
      {/* MODAL PADRÃO (Adicionar/Editar) */}
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
                // APLICAÇÃO DA CLASSE CONDICIONAL
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
      
      {/* NOVO MODAL DE CADASTRO EM LOTE */}
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
    </div>
  );
}