"use client";
import React, { useState } from "react";
import styles from "./usuario.module.css";
import PageHeader from "@/componentes/PageHeader";

export default function Usuarios() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = Object.fromEntries(formData);

    if (editingUser) {
      // Editar usuário existente
      setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...newUser } : u)));
    } else {
      // Adicionar novo usuário
      const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { id: nextId, ...newUser }]);
    }

    setShowModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    if (confirm("Deseja realmente excluir este usuário?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };


  const [users, setUsers] = useState([
    { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999", tipo: "Morador", senha: "123456" },
    { id: 2, nome: "Maria Oliveira", email: "maria@email.com", telefone: "(11) 98888-8888", tipo: "Síndico", senha: "abcdef" }
  ]);


  return (
    <div className="page-container">
      <PageHeader title="Usuários" rightContent={(
        <div className={styles.userInfo}>
          <span>Síndico</span>
          <img src="/placeholder.png" alt="User" />
        </div>
      )} />

      <div className="page-content">
        <div className={styles.content}>
          <button className={styles.addUserBtn} onClick={handleAddUser}>
            + Adicionar Usuário
          </button>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
              <th>Telefone</th>
              <th>Tipo</th>
              <th>Senha</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.telefone}</td>
                <td>{user.tipo}</td>
                <td>********</td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditUser(user)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Excluir
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>{editingUser ? "Editar Usuário" : "Adicionar Usuário"}</h2>
            <form onSubmit={handleSave} className={styles.form}>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                defaultValue={editingUser?.nome || ""}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={editingUser?.email || ""}
                required
              />
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                defaultValue={editingUser?.telefone || ""}
              />
              <select name="tipo" defaultValue={editingUser?.tipo || "Morador"}>
                <option value="Morador">Morador</option>
                <option value="Síndico">Síndico</option>
              </select>
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                defaultValue={editingUser?.senha || ""}
                required
              />

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn}>
                  Salvar
                </button>
                <button type="button" onClick={handleClose} className={styles.cancelBtn}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
