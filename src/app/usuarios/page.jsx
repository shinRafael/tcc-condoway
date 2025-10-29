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
  const { showModal: showInfoModal } = useModal();

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  const axiosUsuarios = async () => {
    try {
      const response = await api.get("/Usuario");
      setUsuarios(response.data.dados || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      if (error.response && error.response.status === 401) {
        showInfoModal("Erro", "Acesso não autorizado. A API está exigindo autenticação.", "error");
      } else {
        showInfoModal("Erro", "Não foi possível carregar os usuários. Verifique se a API está online.", "error");
      }
      setUsuarios([]);
    }
  };

  useEffect(() => {
    axiosUsuarios();
  }, []);

  const handleAddUsuario = async () => {
    try {
      const dadosParaEnviar = {
        ...usuarioEmEdicao,
        user_telefone: usuarioEmEdicao.user_telefone.replace(/\D/g, ""),
      };
      if (!dadosParaEnviar.user_senha) delete dadosParaEnviar.user_senha;

      await api.post("/Usuario", dadosParaEnviar);
      showInfoModal("Sucesso", "Usuário cadastrado com sucesso!");
      axiosUsuarios();
      setShowForm(false);
      setUsuarioEmEdicao(usuarioInicial);
    } catch (error) {
      // console.error("Erro detalhado ao cadastrar:", error.response || error);

      const isDuplicateError =
        error.response &&
        (error.response.status === 409 ||
         (error.response.status === 400 && error.response.data?.nmensagem?.toLowerCase().includes("já existe")) ||
         (error.response.data?.message?.toLowerCase().includes("duplicate"))
        );

      if (isDuplicateError) {
        showInfoModal("Erro ao Cadastrar", "Já existe um registro com essas informações.", "error");
      } else {
        const erroMsg = error.response?.data?.mensagem || "Ocorreu um erro inesperado. Verifique os dados ou tente novamente.";
        showInfoModal("Erro ao Cadastrar", erroMsg, "error");
      }
    }
  };

  // ✅ Atualizado: Tratamento de erro genérico ao atualizar
  const handleUpdateUsuario = async () => {
    try {
      const { user_id, ...dadosParaAtualizar } = usuarioEmEdicao;
      dadosParaAtualizar.user_telefone = dadosParaAtualizar.user_telefone.replace(/\D/g, "");
      if (!dadosParaAtualizar.user_senha) delete dadosParaAtualizar.user_senha;

      await api.patch(`/Usuario/${user_id}`, dadosParaAtualizar);
      showInfoModal("Sucesso", "Usuário atualizado com sucesso!");
      axiosUsuarios();
      setShowForm(false);
      setUsuarioEmEdicao(usuarioInicial);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error.response || error);

      const isDuplicateError =
        error.response &&
        (error.response.status === 409 ||
         (error.response.status === 400 && error.response.data?.nmensagem?.toLowerCase().includes("já existe")) ||
         (error.response.data?.message?.toLowerCase().includes("duplicate"))
        );

      if (isDuplicateError) {
        showInfoModal("Erro ao Atualizar", "Já existe um registro com essas informações.", "error");
      } else {
        const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido ao atualizar.";
        showInfoModal("Erro ao Atualizar", erroMsg, "error");
      }
    }
  };

  const handleDeleteUsuario = (usuario) => {
    setUsuarioParaExcluir(usuario);
    setShowConfirmDeleteModal(true);
  };

  const confirmarExclusao = async () => {
    if (!usuarioParaExcluir) return;

    try {
      await api.delete(`/Usuario/${usuarioParaExcluir.user_id}`);
      showInfoModal("Sucesso", "Usuário excluído com sucesso!");
      axiosUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error.response || error);
      const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido ao excluir.";
      showInfoModal("Erro ao Excluir", erroMsg, "error");
    } finally {
      setShowConfirmDeleteModal(false);
      setUsuarioParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setShowConfirmDeleteModal(false);
    setUsuarioParaExcluir(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdateUsuario();
    } else {
      handleAddUsuario();
    }
  };

  const handleEditClick = (usuario) => {
    setIsEditing(true);
    setUsuarioEmEdicao({ ...usuario, user_senha: '', user_telefone: formatarTelefone(usuario.user_telefone) });
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
          <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>{isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input type="text" name="user_nome" placeholder="Nome Completo" value={usuarioEmEdicao.user_nome} onChange={handleFormChange} required />
                <input type="email" name="user_email" placeholder="E-mail" value={usuarioEmEdicao.user_email} onChange={handleFormChange} required />
                <input type="tel" name="user_telefone" placeholder="Telefone (Opcional)" value={usuarioEmEdicao.user_telefone} onChange={handleFormChange} maxLength="15" />
                <input type="password" name="user_senha" placeholder={isEditing ? "Nova Senha (deixe em branco para manter)" : "Senha"} value={usuarioEmEdicao.user_senha} onChange={handleFormChange} required={!isEditing} autoComplete="new-password" />
                <select name="user_tipo" value={usuarioEmEdicao.user_tipo} onChange={handleFormChange}>
                  {isEditing && usuarioEmEdicao.user_tipo === 'ADM' ? (<option value="ADM">ADM</option>) : null}
                  <option value="Sindico">Síndico</option>
                  <option value="Funcionario">Funcionário</option>
                  <option value="Morador">Morador</option>
                </select>
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.saveBtn}>Salvar</button>
                  <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmDeleteModal && usuarioParaExcluir && (
          <div className={styles.modalOverlay} onClick={cancelarExclusao}>
            <div className={`${styles.modal} ${styles.confirmDeleteModal}`} onClick={(e) => e.stopPropagation()}>
              <h2>Confirmar Exclusão</h2>
              <p>
                Deseja realmente excluir o usuário{" "}
                <strong>{usuarioParaExcluir.user_nome}</strong>? Esta ação não pode ser desfeita.
              </p>
              <div className={styles.modalActions}>
                <button type="button" onClick={confirmarExclusao} className={styles.confirmBtnBlue}>Confirmar Exclusão</button>
                <button type="button" onClick={cancelarExclusao} className={styles.cancelBtnRed}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <section className={styles.tableSection}>
          <h2>Lista de Usuários</h2>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.user_id}>
                    <td data-label="ID">{user.user_id}</td>
                    <td data-label="Nome">{user.user_nome}</td>
                    <td data-label="Email">{user.user_email}</td>
                    <td data-label="Telefone">{formatarTelefone(user.user_telefone)}</td>
                    <td data-label="Tipo">
                      <span className={`${styles.status} ${styles[user.user_tipo?.toLowerCase() || 'morador']}`}>
                        {user.user_tipo || 'N/A'}
                      </span>
                    </td>
                    <td data-label="Ações">
                      <div className={styles.actionButtons}>
                        <IconAction icon={FiEdit2} label="Editar" onClick={() => handleEditClick(user)} variant="edit" />
                        <IconAction icon={FiTrash2} label="Excluir" onClick={() => handleDeleteUsuario(user)} variant="delete" />
                      </div>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#6c757d' }}>Nenhum usuário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
