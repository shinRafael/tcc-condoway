"use client";
import React, { useState, useEffect } from "react";
import styles from "./apartamentos.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import api from "@/services/api";

export default function Apartamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editingAp, setEditingAp] = useState(null);

  const [apartamentos, setApartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

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
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingAp(null);
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
    
<<<<<<< Updated upstream
    const url = `/apartamentos/${editingAp?.ap_id}`;
=======
    const url = editingAp ? `/apartamentos/${editingAp.ap_id}` : "/apartamentos";
>>>>>>> Stashed changes
    
    try {
      if (editingAp) {
          await api.patch(url, payload); 
      } else {
<<<<<<< Updated upstream
          await api.post('/apartamentos', payload);
=======
          await api.post(url, payload);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
      
>>>>>>> Stashed changes
      await listarApartamentos(); 
    } catch (error) {
      console.error("Erro ao excluir apartamento:", error);
      alert("Erro ao excluir apartamento. Veja o console.");
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Apartamentos"
        rightContent={<RightHeaderBrand />}
      />

      <div className="page-content">
        <div className={styles.content}>
          <button className={styles.addBtn} onClick={handleAddAp}>
            + Adicionar Apartamento
          </button>

          {loading ? (
            <p>Carregando lista de apartamentos...</p>
          ) : apartamentos.length === 0 ? (
            <p>Nenhum apartamento encontrado.</p>
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
                {apartamentos.map((ap) => (
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
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEditAp(ap)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deleteBtn}
<<<<<<< Updated upstream
                        onClick={() => handleDelete(ap.ap_id)}
=======
                        onClick={() => handleDelete(ap.ap_id)} 
>>>>>>> Stashed changes
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
                disabled={editingAp ? true : false} 
                required
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
    </div>
  );
}