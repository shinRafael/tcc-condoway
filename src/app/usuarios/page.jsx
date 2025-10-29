"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import styles from "./usuario.module.css"; // Certifique-se que a importação está correta
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useModal } from "@/context/ModalContext";

// Estado inicial para o formulário de usuário
const usuarioInicial = {
  user_nome: "",
  user_email: "",
  user_senha: "",
  user_telefone: "",
  user_tipo: "Morador", // Valor padrão
};

// Função para formatar o número de telefone (máscara)
const formatarTelefone = (telefone) => {
  if (!telefone) return "";
  const digitos = telefone.replace(/\D/g, ""); // Remove tudo que não for dígito
  if (digitos.length > 10) { // Celular (com 9º dígito)
    return digitos.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  // Telefone fixo ou celular antigo
  return digitos.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]); // Lista de usuários
  const [showForm, setShowForm] = useState(false); // Controla modal de add/edit
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(usuarioInicial); // Dados do formulário
  const [isEditing, setIsEditing] = useState(false); // Flag para saber se está editando ou adicionando
  const { showModal: showInfoModal } = useModal(); // Hook do modal de informação (renomeado)

  // Estados para o Modal de Confirmação de Exclusão
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  // Função para buscar usuários da API
  const axiosUsuarios = async () => {
    try {
      const response = await api.get("/Usuario");
      setUsuarios(response.data.dados || []); // Garante que seja um array
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      if (error.response && error.response.status === 401) {
        showInfoModal("Erro", "Acesso não autorizado. A API está exigindo autenticação.", "error");
      } else {
        showInfoModal("Erro", "Não foi possível carregar os usuários. Verifique se a API está online.", "error");
      }
      setUsuarios([]); // Define como array vazio em caso de erro
    }
  };

  // Busca usuários ao carregar a página
  useEffect(() => {
    axiosUsuarios();
  }, []); // Array de dependências vazio para rodar só uma vez

  // Função para ADICIONAR um novo usuário
  const handleAddUsuario = async () => {
    try {
      const dadosParaEnviar = {
        ...usuarioEmEdicao,
        user_telefone: usuarioEmEdicao.user_telefone.replace(/\D/g, ""), // Limpa máscara do telefone
      };
       // Remove a senha se estiver vazia (caso não seja obrigatória na API para adicionar)
       if (!dadosParaEnviar.user_senha) {
           delete dadosParaEnviar.user_senha;
       }
      await api.post("/Usuario", dadosParaEnviar);
      showInfoModal("Sucesso", "Usuário cadastrado com sucesso!"); // Usa o showInfoModal do useModal
      axiosUsuarios(); // Atualiza a lista
      setShowForm(false); // Fecha o modal do formulário
      setUsuarioEmEdicao(usuarioInicial); // Reseta o formulário
    } catch (error) {
      console.error("Erro detalhado ao cadastrar:", error.response || error);

      // Verificação de Erro de Duplicidade
      const isDuplicateError =
        error.response &&
        (error.response.status === 409 || // Código comum para conflito/duplicidade
         (error.response.status === 400 && error.response.data?.nmensagem?.toLowerCase().includes("já existe")) || // Ou se a mensagem indicar duplicidade
         (error.response.data?.message?.toLowerCase().includes("duplicate")) // Outra verificação comum
        );

      if (isDuplicateError) {
        // Mostra a mensagem personalizada para duplicidade
        showInfoModal("Erro ao Cadastrar", "Este e-mail ou telefone já está cadastrado.", "error");
      } else {
        // Para outros erros, mostra a mensagem da API ou uma genérica
        const erroMsg = error.response?.data?.nmensagem || "Ocorreu um erro inesperado. Verifique os dados ou tente novamente.";
        showInfoModal("Erro ao Cadastrar", erroMsg, "error");
      }
    }
  };


  // Função para ATUALIZAR um usuário existente
  const handleUpdateUsuario = async () => {
    try {
      // Desestrutura para pegar o ID e o resto dos dados
      const { user_id, ...dadosParaAtualizar } = usuarioEmEdicao;
      dadosParaAtualizar.user_telefone = dadosParaAtualizar.user_telefone.replace(/\D/g, ""); // Limpa máscara

      // Se a senha estiver vazia no formulário de edição, não a envie para a API
      if (!dadosParaAtualizar.user_senha) {
        delete dadosParaAtualizar.user_senha;
      }

      await api.patch(`/Usuario/${user_id}`, dadosParaAtualizar);
      showInfoModal("Sucesso", "Usuário atualizado com sucesso!");
      axiosUsuarios(); // Atualiza a lista
      setShowForm(false); // Fecha o modal do formulário
      setUsuarioEmEdicao(usuarioInicial); // Reseta o formulário
      setIsEditing(false); // Sai do modo de edição
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error.response || error);
      const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido ao atualizar.";
      showInfoModal("Erro ao Atualizar", erroMsg, "error");
    }
  };

  // Função chamada ao clicar no ícone de lixeira (ABRE o modal de confirmação)
  const handleDeleteUsuario = (usuario) => {
    setUsuarioParaExcluir(usuario); // Guarda o usuário que será excluído
    setShowConfirmDeleteModal(true); // Abre o modal de confirmação
  };

  // Função chamada pelo botão "Confirmar Exclusão" do modal
  const confirmarExclusao = async () => {
    if (!usuarioParaExcluir) return; // Segurança extra

    try {
      await api.delete(`/Usuario/${usuarioParaExcluir.user_id}`);
      showInfoModal("Sucesso", "Usuário excluído com sucesso!");
      axiosUsuarios(); // Atualiza a lista após excluir
    } catch (error) {
      console.error("Erro ao excluir usuário:", error.response || error);
      const erroMsg = error.response?.data?.nmensagem || "Erro desconhecido ao excluir.";
      showInfoModal("Erro ao Excluir", erroMsg, "error");
    } finally {
      // Fecha o modal e limpa o estado, independentemente do resultado
      setShowConfirmDeleteModal(false);
      setUsuarioParaExcluir(null);
    }
  };

  // Função chamada pelo botão "Cancelar" do modal de exclusão
  const cancelarExclusao = () => {
    setShowConfirmDeleteModal(false); // Apenas fecha o modal
    setUsuarioParaExcluir(null); // Limpa o estado
  };

  // Função chamada ao submeter o formulário (decide entre adicionar ou atualizar)
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (isEditing) {
      handleUpdateUsuario();
    } else {
      handleAddUsuario();
    }
  };

  // Função chamada ao clicar no ícone de editar na tabela
  const handleEditClick = (usuario) => {
    setIsEditing(true); // Define que estamos editando
    // Preenche o formulário com os dados do usuário, formatando o telefone e limpando senha
    setUsuarioEmEdicao({ ...usuario, user_senha: '', user_telefone: formatarTelefone(usuario.user_telefone) });
    setShowForm(true); // Abre o modal do formulário
  };

  // Função chamada ao clicar no botão "Adicionar Usuário"
  const handleAddClick = () => {
    setIsEditing(false); // Garante que não estamos editando
    setUsuarioEmEdicao(usuarioInicial); // Limpa o formulário
    setShowForm(true); // Abre o modal do formulário
  };

  // Função para atualizar o estado `usuarioEmEdicao` conforme o usuário digita
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "user_telefone") {
      // Aplica a máscara enquanto o usuário digita o telefone
      const digitos = value.replace(/\D/g, "");
      // Limita o número de dígitos para evitar máscara incorreta
      if (digitos.length <= 11) {
        setUsuarioEmEdicao({ ...usuarioEmEdicao, [name]: formatarTelefone(digitos) });
      }
    } else {
      // Para outros campos, apenas atualiza o valor
      setUsuarioEmEdicao({ ...usuarioEmEdicao, [name]: value });
    }
  };

  return (
    <div className="page-container">
      {/* Cabeçalho da Página */}
      <PageHeader title="Gerenciamento de Usuários" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        {/* Botão Flutuante para Adicionar */}
        <div style={{ marginBottom: "20px" }}>
          <FabButton label="Adicionar Usuário" onClick={handleAddClick} />
        </div>

        {/* Modal de Formulário (Adicionar/Editar) */}
        {showForm && (
          <div className={styles.modalOverlay} onClick={(e) => { if(e.target === e.currentTarget) setShowForm(false)}}> {/* Fecha ao clicar fora */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}> {/* Impede de fechar ao clicar dentro */}
              <h2>{isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Campos do formulário... */}
                <input
                  type="text"
                  name="user_nome"
                  placeholder="Nome Completo"
                  value={usuarioEmEdicao.user_nome}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="email"
                  name="user_email"
                  placeholder="E-mail"
                  value={usuarioEmEdicao.user_email}
                  onChange={handleFormChange}
                  required
                />
                <input
                  type="tel"
                  name="user_telefone"
                  placeholder="Telefone (Opcional)"
                  value={usuarioEmEdicao.user_telefone}
                  onChange={handleFormChange}
                  maxLength="15"
                />
                <input
                  type="password"
                  name="user_senha"
                  placeholder={isEditing ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                  value={usuarioEmEdicao.user_senha}
                  onChange={handleFormChange}
                  required={!isEditing}
                  autoComplete="new-password"
                />
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

        {showConfirmDeleteModal && usuarioParaExcluir && (
        <div className={styles.modalOverlay} onClick={cancelarExclusao}>
          <div className={`${styles.modal} ${styles.confirmDeleteModal}`} onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Exclusão</h2>
            <p>
              Deseja realmente excluir o usuário{" "}
              <strong>{usuarioParaExcluir.user_nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className={styles.modalActions}>
               {/* Botão Confirmar (Azul) - Primeiro no JSX */}
              <button
                type="button"
                onClick={confirmarExclusao}
                className={styles.confirmBtnBlue}
              >
                Confirmar Exclusão
              </button>
              {/* Botão Cancelar (Vermelho) - Segundo no JSX */}
              <button
                type="button"
                onClick={cancelarExclusao}
                className={styles.cancelBtnRed} 
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Seção da Tabela */}
        <section className={styles.tableSection}>
          <h2>Lista de Usuários</h2>
          <div style={{ overflowX: "auto" }}> {/* Permite rolagem horizontal em telas pequenas */}
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
                {/* Mapeia a lista de usuários para criar as linhas da tabela */}
                {usuarios.map((user) => (
                  <tr key={user.user_id}>
                    {/* Atribui data-label para responsividade */}
                    <td data-label="ID">{user.user_id}</td>
                    <td data-label="Nome">{user.user_nome}</td>
                    <td data-label="Email">{user.user_email}</td>
                    <td data-label="Telefone">{formatarTelefone(user.user_telefone)}</td>
                    <td data-label="Tipo">
                      <span className={`${styles.status} ${styles[user.user_tipo?.toLowerCase() || 'morador']}`}>
                        {user.user_tipo || 'N/A'}
                      </span>
                    </td>
                    <td data-label="Ações"> {/* Label para a coluna de ações */}
                      <div className={styles.actionButtons}>
                        {/* --- CORREÇÃO SEM VÍRGULAS --- */}
                        <IconAction icon={FiEdit2} label="Editar" onClick={() => handleEditClick(user)} variant="edit" />
                        <IconAction icon={FiTrash2} label="Excluir" onClick={() => handleDeleteUsuario(user)} variant="delete" />
                        {/* --- FIM DA CORREÇÃO --- */}
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Mensagem se a lista estiver vazia */}
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