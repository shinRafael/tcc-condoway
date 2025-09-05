"use client";
import React, { useState } from "react";
import styles from "./apartamentos.module.css";
import PageHeader from "@/componentes/PageHeader";

export default function Apartamentos() {
  const [showModal, setShowModal] = useState(false);
  const [editingAp, setEditingAp] = useState(null);

  const [apartamentos, setApartamentos] = useState([
    { id: 101, bloco: "A", numero: 12, andar: "1º" },
    { id: 102, bloco: "B", numero: 34, andar: "3º" },
    { id: 103, bloco: "C", numero: 21, andar: "2º" },
  ]);

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

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAp = Object.fromEntries(formData);
    newAp.id = Number(newAp.id);
    newAp.numero = Number(newAp.numero);

    if (editingAp) {
      setApartamentos(
        apartamentos.map((a) => (a.id === editingAp.id ? { ...a, ...newAp } : a))
      );
    } else {
      setApartamentos([...apartamentos, newAp]);
    }

    handleClose();
  };

  const handleDelete = (id) => {
    if (confirm("Deseja realmente excluir este apartamento?")) {
      setApartamentos(apartamentos.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Apartamentos"
        rightContent={
          <div className={styles.userInfo}>
            <span>Síndico</span>
            <img src="https://via.placeholder.com/35" alt="User" />
          </div>
        }
      />

      <div className="page-content">
        <div className={styles.content}>
          <button className={styles.addBtn} onClick={handleAddAp}>
            + Adicionar Apartamento
          </button>

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
                <tr key={ap.id} className={styles.apRow}>
                  <td>
                    {ap.id}
                    <div className={styles.tooltip}>
                      <p>
                        <strong>ID:</strong> {ap.id}
                      </p>
                      <p>
                        <strong>Bloco:</strong> {ap.bloco}
                      </p>
                      <p>
                        <strong>Número:</strong> {ap.numero}
                      </p>
                      <p>
                        <strong>Andar:</strong> {ap.andar}
                      </p>
                    </div>
                  </td>
                  <td>{ap.bloco}</td>
                  <td>{ap.numero}</td>
                  <td>{ap.andar}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditAp(ap)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(ap.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                placeholder="ID"
                defaultValue={editingAp?.id || ""}
                required
              />
              <input
                type="text"
                name="bloco"
                placeholder="Bloco"
                defaultValue={editingAp?.bloco || ""}
                required
              />
              <input
                type="number"
                name="numero"
                placeholder="Número"
                defaultValue={editingAp?.numero || ""}
                required
              />
              <input
                type="text"
                name="andar"
                placeholder="Andar"
                defaultValue={editingAp?.andar || ""}
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
