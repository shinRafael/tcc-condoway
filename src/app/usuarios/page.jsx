"use client";
import { useState, useEffect } from "react";
// Correção: Usando caminhos relativos para importações
import api from "../../services/api";
import styles from "./usuario.module.css"; // Mantido relativo, verificar se o arquivo existe com este nome
import PageHeader from "../../componentes/PageHeader";
import RightHeaderBrand from "../../componentes/PageHeader/RightHeaderBrand";
import FabButton from '../../componentes/FabButton/FabButton';
import IconAction from '../../componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi'; // Import padrão para react-icons
import { useModal } from "../../context/ModalContext";

// --- Estado Inicial Atualizado ---
const usuarioInicial = {
  user_nome: "",
  user_email: "",
  user_senha: "",
  user_telefone: "",
  user_tipo: "Morador", // Padrão para Morador
  ap_id: "", // ID do apartamento selecionado
  bloco_id: "", // ID do bloco selecionado (para controle do filtro)
};

// --- Função para formatar telefone ---
const formatarTelefone = (telefone) => {
  if (!telefone) return "";
  const digitos = telefone.replace(/\D/g, "");
  // Formato (XX) XXXXX-XXXX para celular
  if (digitos.length === 11) {
    return digitos.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  // Formato (XX) XXXX-XXXX para fixo
  if (digitos.length === 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  // Retorna os dígitos se não se encaixar nos formatos
  return digitos;
};

// --- Componente Principal ---
export default function UsuariosPage() {
  // Estados existentes
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(usuarioInicial);
  const [isEditing, setIsEditing] = useState(false);
  const { showModal: showInfoModal } = useModal();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  // --- Novos Estados para Blocos e Apartamentos ---
  const [blocosDisponiveis, setBlocosDisponiveis] = useState([]);
  const [apartamentosDisponiveis, setApartamentosDisponiveis] = useState([]); // Lista completa
  const [apartamentosFiltrados, setApartamentosFiltrados] = useState([]); // Lista filtrada por bloco
  const [loadingOptions, setLoadingOptions] = useState(false);
  // --- Fim Novos Estados ---

  // --- Função para buscar a lista de usuários ---
  const axiosUsuarios = async () => {
    try {
      // Idealmente, a API /Usuario deveria retornar o bloco/apto do morador no JOIN
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

  // --- useEffect para buscar Usuários (ao montar) ---
  useEffect(() => {
    axiosUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependência vazia para rodar só uma vez

  // --- useEffect para buscar Blocos e Apartamentos (ao montar ou se precisar recarregar) ---
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Busca blocos e apartamentos em paralelo
        const [blocosRes, apsRes] = await Promise.all([
          api.get('/blocos'), // Ajuste a rota se necessário
          api.get('/apartamentos') // Ajuste a rota se necessário
        ]);
        // Atualiza os estados com os dados da API ou arrays vazios
        setBlocosDisponiveis(blocosRes.data?.dados || []);
        setApartamentosDisponiveis(apsRes.data?.dados || []);
      } catch (error) {
        console.error("Erro ao buscar blocos/apartamentos:", error);
        showInfoModal("Erro", "Não foi possível carregar as opções de bloco/apartamento.", "error");
        setBlocosDisponiveis([]); // Garante que é array em caso de erro
        setApartamentosDisponiveis([]); // Garante que é array em caso de erro
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, [showInfoModal]); // Re-executa se showInfoModal mudar (improvável, mas boa prática)
  // --- Fim useEffect fetchOptions ---

  // --- useEffect para filtrar Apartamentos quando o Bloco muda no formulário ---
  useEffect(() => {
    // Só filtra se um bloco_id estiver selecionado
    if (usuarioEmEdicao.bloco_id && apartamentosDisponiveis.length > 0) {
      const blocoIdNum = parseInt(usuarioEmEdicao.bloco_id); // Garante que é número
      // Filtra a lista completa de apartamentos
      const filtrados = apartamentosDisponiveis.filter(
        (ap) => ap.bloc_id === blocoIdNum // Comparação numérica
      );
      setApartamentosFiltrados(filtrados);

      // Validação: Se o ap_id atualmente selecionado NÃO pertence ao novo bloco, limpa a seleção
      const apIdNum = parseInt(usuarioEmEdicao.ap_id); // Garante que é número
      if (usuarioEmEdicao.ap_id && !filtrados.some(ap => ap.ap_id === apIdNum)) {
        setUsuarioEmEdicao(prev => ({ ...prev, ap_id: "" })); // Limpa ap_id
      }
    } else {
      // Se nenhum bloco está selecionado, limpa os apartamentos filtrados e o ap_id
      setApartamentosFiltrados([]);
      if (usuarioEmEdicao.ap_id !== "") { // Evita loop infinito
          setUsuarioEmEdicao(prev => ({ ...prev, ap_id: "" }));
      }
    }
  }, [usuarioEmEdicao.bloco_id, usuarioEmEdicao.ap_id, apartamentosDisponiveis]); // Dependências corretas
  // --- Fim useEffect filtro Apartamentos ---

  // --- Handler para Adicionar Usuário ---
  const handleAddUsuario = async () => {
    try {
      // Prepara os dados para enviar, incluindo o ap_id
      const dadosParaEnviar = {
        user_nome: usuarioEmEdicao.user_nome.trim(),
        user_email: usuarioEmEdicao.user_email.trim(),
        user_telefone: usuarioEmEdicao.user_telefone.replace(/\D/g, ""), // Remove formatação do telefone
        user_senha: usuarioEmEdicao.user_senha,
        user_tipo: usuarioEmEdicao.user_tipo,
        // Converte ap_id para número ou null se vazio
        ap_id: usuarioEmEdicao.ap_id ? parseInt(usuarioEmEdicao.ap_id) : null,
      };
      if (!dadosParaEnviar.user_senha) {
          showInfoModal("Erro", "A senha é obrigatória para novos usuários.", "error");
          return; // Impede o envio sem senha
      }

      // Validação: Morador DEVE ter um apartamento selecionado
      if (dadosParaEnviar.user_tipo === 'Morador' && !dadosParaEnviar.ap_id) {
        showInfoModal("Erro", "Para cadastrar um Morador, selecione o Bloco e o Apartamento.", "error");
        return; // Impede o envio
      }
      // Se não for Morador, remove o ap_id para não enviar desnecessariamente
      if (dadosParaEnviar.user_tipo !== 'Morador') {
        delete dadosParaEnviar.ap_id;
      }

      // Envia os dados para a API
      await api.post("/Usuario", dadosParaEnviar);
      showInfoModal("Sucesso", "Usuário cadastrado com sucesso!");
      axiosUsuarios(); // Recarrega a lista de usuários
      setShowForm(false); // Fecha o modal
      setUsuarioEmEdicao(usuarioInicial); // Reseta o formulário
    } catch (error) {
      // Tratamento de Erro (igual ao anterior)
      const erroMsg = error.response?.data?.mensagem;
      const isDuplicateError = error.response && (error.response.status === 409 || (error.response.status === 400 && erroMsg?.toLowerCase().includes("e-mail já cadastrado")) || (erroMsg?.toLowerCase().includes("duplicate")));
      if (isDuplicateError) {
        showInfoModal("Erro ao Cadastrar", "Já existe um usuário cadastrado com este e-mail.", "error");
      } else {
        const msg = erroMsg || "Ocorreu um erro inesperado. Verifique os dados ou tente novamente.";
        showInfoModal("Erro ao Cadastrar", msg, "error");
      }
    }
  };
  // --- Fim Handler Adicionar ---

  // --- Handler para Atualizar Usuário ---
  const handleUpdateUsuario = async () => {
    try {
      // Extrai IDs e dados a serem atualizados
      const { user_id, ap_id, bloco_id, ...dadosParaAtualizar } = usuarioEmEdicao;
      dadosParaAtualizar.user_telefone = dadosParaAtualizar.user_telefone.replace(/\D/g, ""); // Limpa telefone

      // Remove a senha se estiver vazia (para não atualizar sem querer)
      if (!dadosParaAtualizar.user_senha) {
          delete dadosParaAtualizar.user_senha;
      }

       // Validação: Morador DEVE ter um apartamento selecionado (se estiver editando para morador)
       // NOTA: A API de PATCH não suporta alterar o ap_id. A validação aqui previne salvar um Morador sem AP,
       // mas não permite *trocar* o AP pela UI.
      if (dadosParaAtualizar.user_tipo === 'Morador' && !ap_id) { // Usa o ap_id original do estado
        showInfoModal("Erro", "Moradores devem estar associados a um Bloco e Apartamento.", "error");
        return; // Impede o envio
      }

      // Envia a atualização para a API
      await api.patch(`/Usuario/${user_id}`, dadosParaAtualizar);
      showInfoModal("Sucesso", "Usuário atualizado com sucesso!");
      axiosUsuarios(); // Recarrega a lista
      setShowForm(false); // Fecha o modal
      setUsuarioEmEdicao(usuarioInicial); // Reseta o formulário
      setIsEditing(false);
    } catch (error) {
      // Tratamento de Erro (igual ao anterior)
      console.error("Erro ao atualizar usuário:", error.response || error);
      const erroMsg = error.response?.data?.mensagem;
      const isDuplicateError = error.response && (error.response.status === 409 || (error.response.status === 400 && erroMsg?.toLowerCase().includes("e-mail já cadastrado")) || (erroMsg?.toLowerCase().includes("duplicate")));
      if (isDuplicateError) {
        showInfoModal("Erro ao Atualizar", "Já existe um usuário cadastrado com este e-mail.", "error");
      } else {
        const msg = erroMsg || "Erro desconhecido ao atualizar.";
        showInfoModal("Erro ao Atualizar", msg, "error");
      }
    }
  };
  // --- Fim Handler Atualizar ---

  // --- Funções de Exclusão (sem alterações) ---
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
      const erroMsg = error.response?.data?.mensagem || "Erro desconhecido ao excluir.";
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
  // --- Fim Funções Exclusão ---

  // --- Handler do Submit do Formulário ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne recarregamento da página
    if (isEditing) {
      handleUpdateUsuario(); // Chama a função de atualizar
    } else {
      handleAddUsuario(); // Chama a função de adicionar
    }
  };

  // --- Handler para Abrir Modal de Edição ---
  const handleEditClick = (usuario) => {
     setIsEditing(true);

     // Tenta encontrar o apartamento associado a este usuário na lista completa
     // A API de listar usuários (/Usuario) NÃO retorna o ap_id ou bloc_id diretamente.
     // Precisaríamos de outra chamada (ex: /Usuario/{id}/perfil) ou ajustar a API de listar.
     // SOLUÇÃO TEMPORÁRIA: Buscar na lista completa de APs (pode não ser ideal se houver muitos usuários/APs)
     // ou deixar vazio e o usuário seleciona novamente. Vamos tentar buscar:
     let apAssociado = null;
     let blocoAssociadoId = "";

     // A API /Usuario não retorna o userap_id ou ap_id, então buscar o perfil seria o ideal.
     // Alternativa: Se a API /apartamentos retornasse user_id associado (improvável), poderíamos usar.
     // Como não temos essa informação na lista, vamos deixar os campos vazios na edição
     // e confiar que a API de PATCH não altera o vínculo (conforme controller original).

     // Se sua API de listar usuários (/Usuario) for atualizada para incluir ap_id e bloc_id,
     // descomente e ajuste a lógica abaixo:
     /*
     if (usuario.ap_id) {
         apAssociado = apartamentosDisponiveis.find(ap => ap.ap_id === usuario.ap_id);
         if (apAssociado) {
             blocoAssociadoId = apAssociado.bloc_id.toString(); // Garante que é string para o select
         }
     }
     */

     // Define o estado do formulário com os dados do usuário, limpando a senha
     setUsuarioEmEdicao({
       ...usuarioInicial, // Reseta para o padrão
       ...usuario, // Popula com dados do usuário clicado
       user_senha: '', // Limpa o campo senha
       user_telefone: formatarTelefone(usuario.user_telefone), // Formata o telefone
       ap_id: apAssociado ? apAssociado.ap_id.toString() : "", // Define ap_id se encontrado
       bloco_id: blocoAssociadoId, // Define bloco_id se encontrado
     });
     setShowForm(true); // Abre o modal
  };


  // --- Handler para Abrir Modal de Adição ---
  const handleAddClick = () => {
    setIsEditing(false); // Garante que não está em modo de edição
    setUsuarioEmEdicao(usuarioInicial); // Reseta o formulário para o estado inicial
    setShowForm(true); // Abre o modal
  };

  // --- Handler para Mudanças no Formulário ---
  const handleFormChange = (e) => {
    const { name, value } = e.target; // Pega o nome e valor do campo alterado

    // Tratamento especial para telefone (formatação)
    if (name === "user_telefone") {
      const digitos = value.replace(/\D/g, ""); // Remove não-dígitos
      // Limita a 11 dígitos e aplica a formatação
      if (digitos.length <= 11) {
        setUsuarioEmEdicao({ ...usuarioEmEdicao, [name]: formatarTelefone(digitos) });
      }
    }
    // Tratamento especial para seleção de bloco
    else if (name === "bloco_id") {
      // Atualiza o bloco_id e LIMPA o ap_id (pois a lista de APs vai mudar)
      setUsuarioEmEdicao({ ...usuarioEmEdicao, bloco_id: value, ap_id: "" });
    }
    // Para todos os outros campos, atualiza o valor diretamente
    else {
      setUsuarioEmEdicao({ ...usuarioEmEdicao, [name]: value });
    }
  };

  // --- Renderização do Componente ---
  return (
    <div className="page-container">
      {/* Cabeçalho da Página */}
      <PageHeader title="Gerenciamento de Usuários" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        {/* Botão Flutuante para Adicionar */}
        <div style={{ marginBottom: "20px" }}>
          <FabButton label="Adicionar Usuário" onClick={handleAddClick} />
        </div>

        {/* Modal de Adicionar/Editar Usuário */}
        {showForm && (
          // Overlay do modal (fundo escuro)
          <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
            {/* Conteúdo do modal */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2>{isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}</h2>
              {/* Formulário */}
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Campos do formulário */}
                <input type="text" name="user_nome" placeholder="Nome Completo" value={usuarioEmEdicao.user_nome} onChange={handleFormChange} required />
                <input type="email" name="user_email" placeholder="E-mail" value={usuarioEmEdicao.user_email} onChange={handleFormChange} required />
                <input type="tel" name="user_telefone" placeholder="Telefone (Opcional)" value={usuarioEmEdicao.user_telefone} onChange={handleFormChange} maxLength="15" />
                <input type="password" name="user_senha" placeholder={isEditing ? "Nova Senha (deixe em branco para manter)" : "Senha"} value={usuarioEmEdicao.user_senha} onChange={handleFormChange} required={!isEditing} autoComplete="new-password" />

                {/* --- Novos Selects para Bloco e Apartamento --- */}
                {/* Mostrar selects APENAS se o tipo for Morador */}
                {usuarioEmEdicao.user_tipo === 'Morador' && (
                  <>
                    <select
                      name="bloco_id"
                      value={usuarioEmEdicao.bloco_id}
                      onChange={handleFormChange}
                      required // Obrigatório para morador
                      disabled={loadingOptions || blocosDisponiveis.length === 0}
                    >
                      <option value="">{loadingOptions ? 'Carregando Blocos...' : blocosDisponiveis.length === 0 ? 'Nenhum bloco encontrado' : '-- Selecione o Bloco --'}</option>
                      {blocosDisponiveis.map((bloco) => (
                        <option key={bloco.bloc_id} value={bloco.bloc_id}>
                          {bloco.bloc_nome} {/* Ajuste para bloc_nome se necessário */}
                        </option>
                      ))}
                    </select>

                    <select
                      name="ap_id"
                      value={usuarioEmEdicao.ap_id}
                      onChange={handleFormChange}
                      required // Obrigatório para morador
                      disabled={!usuarioEmEdicao.bloco_id || apartamentosFiltrados.length === 0 || loadingOptions}
                    >
                      <option value="">
                        {!usuarioEmEdicao.bloco_id
                          ? 'Selecione um bloco primeiro'
                          : loadingOptions
                          ? 'Carregando Aps...'
                          : apartamentosFiltrados.length === 0
                          ? 'Nenhum ap neste bloco'
                          : '-- Selecione o Apartamento --'}
                      </option>
                      {apartamentosFiltrados.map((ap) => (
                        <option key={ap.ap_id} value={ap.ap_id}>
                           {/* Exibe número e andar para facilitar */}
                           Apto {ap.ap_numero} (Andar: {ap.ap_andar || 'N/A'})
                        </option>
                      ))}
                    </select>
                  </>
                )}
                 {/* --- Fim Novos Selects --- */}

                {/* Select de Tipo de Usuário */}
                <select name="user_tipo" value={usuarioEmEdicao.user_tipo} onChange={handleFormChange}>
                  {/* Permite manter ADM apenas se já for ADM na edição */}
                  {isEditing && usuarioEmEdicao.user_tipo === 'ADM' && (<option value="ADM">ADM</option>)}
                  {/* Não permite selecionar ADM ao criar ou mudar de outro tipo para ADM */}
                  {usuarioEmEdicao.user_tipo !== 'ADM' && (
                      <>
                          <option value="Sindico">Síndico</option>
                          <option value="Funcionario">Funcionário</option>
                          <option value="Morador">Morador</option>
                      </>
                  )}
                </select>

                {/* Botões de Ação do Modal */}
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.saveBtn}>Salvar</button>
                  <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showConfirmDeleteModal && usuarioParaExcluir && (
          <div className={styles.modalOverlay} onClick={cancelarExclusao}>
            <div className={`${styles.modal} ${styles.confirmDeleteModal}`} onClick={(e) => e.stopPropagation()}>
              <h2>Confirmar Exclusão</h2>
              <p>
                Deseja realmente excluir o usuário{" "}
                <strong>{usuarioParaExcluir.user_nome}</strong>? Esta ação não pode ser desfeita.
              </p>
              {/* Botões de Ação do Modal de Exclusão */}
              <div className={styles.modalActions}>
                <button type="button" onClick={confirmarExclusao} className={styles.confirmBtnBlue}>Confirmar Exclusão</button>
                <button type="button" onClick={cancelarExclusao} className={styles.cancelBtnRed}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Seção da Tabela de Usuários */}
        <section className={styles.tableSection}>
          <h2>Lista de Usuários</h2>
          {/* Container para permitir rolagem horizontal em telas pequenas */}
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  {/* Opcional: Adicionar coluna Bloco/Apto aqui se a API /Usuario retornar */}
                  {/* <th>Bloco/Apto</th> */}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapeia a lista de usuários para linhas da tabela */}
                {usuarios.map((user) => (
                  <tr key={user.user_id}>
                    <td data-label="ID">{user.user_id}</td>
                    <td data-label="Nome">{user.user_nome || '-'}</td>
                    <td data-label="Email">{user.user_email || '-'}</td>
                    <td data-label="Telefone">{formatarTelefone(user.user_telefone) || '-'}</td>
                    <td data-label="Tipo">
                      {/* Badge colorido para o tipo de usuário */}
                      <span className={`${styles.status} ${styles[user.user_tipo?.toLowerCase() || 'morador']}`}>
                        {user.user_tipo || 'N/A'}
                      </span>
                    </td>
                     {/* Opcional: Exibir Bloco/Apto */}
                    {/* <td data-label="Bloco/Apto">{user.bloc_nome && user.ap_numero ? `${user.bloc_nome} / ${user.ap_numero}` : '-'}</td> */}
                    <td data-label="Ações">
                      {/* Botões de Editar e Excluir */}
                      <div className={styles.actionButtons}>
                        <IconAction icon={FiEdit2} label="Editar" onClick={() => handleEditClick(user)} variant="edit" />
                        {/* Não permite excluir o tipo ADM */}
                        {user.user_tipo !== 'ADM' && (
                           <IconAction icon={FiTrash2} label="Excluir" onClick={() => handleDeleteUsuario(user)} variant="delete" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Mensagem se a lista de usuários estiver vazia */}
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

