"use client";
import { useState, useEffect } from "react";
import api from "@/services/api"; // Certifique-se que o caminho para seu 'api.js' está correto
import styles from "./usuario.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";

// Objeto para limpar o formulário
const usuarioInicial = {
  user_nome: "",
  user_email: "",
  user_senha: "",
  user_telefone: "",
  user_tipo: "Morador",
};

// Função para formatar o telefone
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

  // Busca os usuários da API
  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/Usuario");
      setUsuarios(response.data.dados);
    } catch (error) {
      // Este erro de 401 é o que estamos vendo.
      // Significa que a API exige login.
      if (error.response && error.response.status === 401) {
        alert("Acesso não autorizado. A API está exigindo autenticação.");
      } else {
        alert("Não foi possível carregar os usuários. Verifique se a API está online.");
      }
    }
  };
  
  // Roda a busca de usuários quando a página é carregada
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // --- Funções de Ação ---

  const handleAddUsuario = async () => {
    try {
      const dadosParaEnviar = {
        ...usuarioEmEdicao,
        user_telefone: usuarioEmEdicao.user_telefone.replace(/\D/g, ""),
      };
      await api.post("/Usuario", dadosParaEnviar);
      alert("Usuário cadastrado com sucesso!");
      fetchUsuarios();
      setShowForm(false);
    } catch (error) {
      const erroMsg = error.response?.data?.nmensagem || "Verifique o console da API para mais detalhes.";
      alert(`Erro ao cadastrar: ${erroMsg}`);
      console.error("Erro detalhado:", error.response || error);
    }
  };

  const handleUpdateUsuario = async () => {
    try {
      const { user_id, ...dadosParaAtualizar } = usuarioEmEdicao;
      dadosParaAtualizar.user_telefone = dadosParaAtualizar.user_telefone.replace(/\D/g, "");
      
      await api.patch(`/Usuario/${user_id}`, dadosParaAtualizar);
      alert("Usuário atualizado com sucesso!");
      fetchUsuarios();
      setShowForm(false);
    } catch (error) {
      const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido.";
      alert(`Erro ao atualizar: ${erroMsg}`);
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/Usuario/${id}`);
        alert("Usuário excluído com sucesso!");
        fetchUsuarios();
      } catch (error) {
        const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido.";
        alert(`Erro ao excluir: ${erroMsg}`);
      }
    }
  };

  // --- Funções de Controle do Formulário ---

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
          <button className={styles.addUserBtn} onClick={handleAddClick}>
            + Adicionar Usuário
          </button>
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
                  <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancelar</button>
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
                        <button className={styles.editBtn} onClick={() => handleEditClick(user)}>Editar</button>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteUsuario(user.user_id)}>Excluir</button>
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