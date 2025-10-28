"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import styles from "./usuario.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useModal } from "@/context/ModalContext";

const usuarioInicial = {
  user_nome: "",
  user_email: "",
  user_senha: "",
  user_telefone: "",
  user_tipo: "Morador",
};

const formatarTelefone = (telefone) => {
  if (!telefone) return "";
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.length > 10) {
    return digitos.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return digitos.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(usuarioInicial);
  const [isEditing, setIsEditing] = useState(false);
  const { showModal, hideModal } = useModal();

  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/Usuario");
      setUsuarios(response.data.dados);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showModal("Erro", "Acesso não autorizado. A API está exigindo autenticação.", "error");
      } else {
        showModal("Erro", "Não foi possível carregar os usuários. Verifique se a API está online.", "error");
      }
    }
  };
  
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleAddUsuario = async () => {
    try {
      const dadosParaEnviar = {
        ...usuarioEmEdicao,
        user_telefone: usuarioEmEdicao.user_telefone.replace(/\D/g, ""),
      };
      await api.post("/Usuario", dadosParaEnviar);
      showModal("Sucesso", "Usuário cadastrado com sucesso!");
      fetchUsuarios();
      setShowForm(false);
      setUsuarioEmEdicao(usuarioInicial);
      setIsEditing(false);
    } catch (error) {
      const erroMsg = error.response?.data?.nmensagem || "Verifique o console da API para mais detalhes.";
      showModal("Erro ao cadastrar", erroMsg, "error");
      console.error("Erro detalhado:", error.response || error);
    }
  };

  const handleUpdateUsuario = async () => {
    try {
      const { user_id, ...dadosParaAtualizar } = usuarioEmEdicao;
      dadosParaAtualizar.user_telefone = dadosParaAtualizar.user_telefone.replace(/\D/g, "");
      if (!dadosParaAtualizar.user_senha) {
        delete dadosParaAtualizar.user_senha;
      }
      
      await api.patch(`/Usuario/${user_id}`, dadosParaAtualizar);
      showModal("Sucesso", "Usuário atualizado com sucesso!");
      fetchUsuarios();
      setShowForm(false);
      setUsuarioEmEdicao(usuarioInicial);
      setIsEditing(false);
    } catch (error) {
      const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido.";
      showModal("Erro ao atualizar", erroMsg, "error");
    }
  };

  const handleDeleteUsuario = (id) => {
    showModal(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este usuário?",
      "warning",
      {
        confirmLabel: "Excluir",
        cancelLabel: "Cancelar",
        showCancelButton: true,
        onConfirm: async () => {
          hideModal();
          try {
            await api.delete(`/Usuario/${id}`);
            showModal("Sucesso", "Usuário excluído com sucesso!");
            fetchUsuarios();
          } catch (error) {
            const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido.";
            showModal("Erro ao excluir", erroMsg, "error");
          }
        },
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) handleUpdateUsuario();
    else handleAddUsuario();
  };

  const handleEditClick = (usuario) => {
    setIsEditing(true);
    setUsuarioEmEdicao({ ...usuario, user_telefone: formatarTelefone(usuario.user_telefone) });
    setShowForm(true);
  };
  
  const handleAddClick = () => {
    setIsEditing(false);
    setUsuarioEmEdicao(usuarioInicial);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "user_telefone") {
      const digitos = value.replace(/\D/g, "");
      if (digitos.length <= 11) {
        setUsuarioEmEdicao({ ...usuarioEmEdicao, [name]: formatarTelefone(digitos) });
      }
    } else {
      setUsuarioEmEdicao({ ...usuarioEmEdicao, [name]: value });
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Gerenciamento de Usuários" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        <div style={{ marginBottom: "20px" }}>
          <FabButton label="Adicionar Usuário" onClick={handleAddClick} />
        </div>

        {showForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>{isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" name="user_nome" placeholder="Nome Completo" value={usuarioEmEdicao.user_nome} onChange={handleFormChange} required />
                <input type="email" name="user_email" placeholder="E-mail" value={usuarioEmEdicao.user_email} onChange={handleFormChange} required />
                <input 
                  type="tel" 
                  name="user_telefone" 
                  placeholder="Telefone" 
                  value={usuarioEmEdicao.user_telefone} 
                  onChange={handleFormChange}
                  maxLength="15" 
                />
                <input type="password" name="user_senha" placeholder={isEditing ? "Nova Senha (deixe em branco)" : "Senha"} onChange={handleFormChange} required={!isEditing} />
                <select name="user_tipo" value={usuarioEmEdicao.user_tipo} onChange={handleFormChange}>
                  {isEditing && usuarioEmEdicao.user_tipo === 'ADM' ? (
                    <option value="ADM">ADM</option>
                  ) : null}
                  <option value="Sindico">Síndico</option>
                  <option value="Funcionario">Funcionário</option>
                  <option value="Morador">Morador</option>
                </select>
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.saveBtn}>Salvar</button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setIsEditing(false);
                      setUsuarioEmEdicao(usuarioInicial);
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className={styles.tableSection}>
          <h2>Lista de Usuários</h2>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Tipo</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.user_nome}</td>
                    <td>{user.user_email}</td>
                    <td>{formatarTelefone(user.user_telefone)}</td>
                    <td>
                      <span className={`${styles.status} ${styles[user.user_tipo?.toLowerCase() || '']}`}>
                        {user.user_tipo}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <IconAction icon={FiEdit2} label="Editar" onClick={() => handleEditClick(user)} variant="edit" />
                        <IconAction icon={FiTrash2} label="Excluir" onClick={() => handleDeleteUsuario(user.user_id)} variant="delete" />
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}