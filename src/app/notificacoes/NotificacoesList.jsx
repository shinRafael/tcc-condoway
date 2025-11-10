"use client";
import { useState, useEffect } from "react";
import styles from "./notificacoes.module.css";
import api from "@/services/api";
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import IconAction from '@/componentes/IconAction/IconAction';

export default function NotificacoesList({ initialNotificacoes, adicionarNotificacao, salvarEdicao, excluirNotificacao }) {
  const [notificacoes, setNotificacoes] = useState(initialNotificacoes);
  const [editandoId, setEditandoId] = useState(null);
  const [dadosEditados, setDadosEditados] = useState({});
  
  // States para o modal
  const [showModal, setShowModal] = useState(false);
  const [nova, setNova] = useState({ titulo: "", mensagem: "", prioridade: "baixa" });
  
  // States para o público-alvo
  const [tipoAlvo, setTipoAlvo] = useState("todos"); // 'todos', 'bloco', ou 'apartamento'
  const [blocoSelecionado, setBlocoSelecionado] = useState("");
  const [apartamentoSelecionado, setApartamentoSelecionado] = useState("");

  // States para carregar os dados dos selects
  const [todosBlocos, setTodosBlocos] = useState([]);
  const [todosApartamentos, setTodosApartamentos] = useState([]);
  const [apartamentosFiltrados, setApartamentosFiltrados] = useState([]);

  useEffect(() => {
    setNotificacoes(initialNotificacoes);
  }, [initialNotificacoes]);
  
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const resBlocos = await api.get('/blocos');
        setTodosBlocos(resBlocos.data.dados);
        const resAps = await api.get('/apartamentos');
        setTodosApartamentos(resAps.data.dados);
      } catch (error) {
        console.error('Falha ao carregar opções', error);
      }
    };
    carregarOpcoes();
  }, []);

  // Filtra os apartamentos quando um bloco é selecionado
  useEffect(() => {
    if (blocoSelecionado) {
      const filtrados = todosApartamentos.filter(ap => ap.bloco_id == blocoSelecionado);
      setApartamentosFiltrados(filtrados);
      setApartamentoSelecionado(""); // Reseta a seleção do apartamento
    } else {
      setApartamentosFiltrados([]);
    }
  }, [blocoSelecionado, todosApartamentos]);


  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!nova.titulo || !nova.mensagem) return;

    let alvoFinal = "todos";
    if (tipoAlvo === "bloco" && blocoSelecionado) {
        alvoFinal = `bloco-${blocoSelecionado}`;
    } else if (tipoAlvo === "apartamento" && apartamentoSelecionado) {
        alvoFinal = `ap-${apartamentoSelecionado}`;
    }

    adicionarNotificacao({ ...nova, alvo: alvoFinal });
    
    // Reseta o modal
    setNova({ titulo: "", mensagem: "", prioridade: "baixa" });
    setShowModal(false);
    setTipoAlvo("todos");
    setBlocoSelecionado("");
    setApartamentoSelecionado("");
  };

  const handleExcluir = (notificacao) => {
    excluirNotificacao({ titulo: notificacao.titulo, mensagem: notificacao.mensagem, prioridade: notificacao.prioridade, tipo: notificacao.tipo });
  };

  const handleAbrirEdicao = (notificacao) => {
    setEditandoId(notificacao.id);
    setDadosEditados({
        titulo: notificacao.titulo,
        mensagem: notificacao.mensagem,
        prioridade: notificacao.prioridade.toLowerCase(),
    });
  };

  const handleSalvarEdicao = (original) => {
    salvarEdicao(original, dadosEditados);
    setEditandoId(null);
  };
  
  const getPrioridadeClass = (prioridade) => {
    switch (prioridade?.toLowerCase()) {
      case 'baixa': return styles.prioridadeBaixa;
      case 'media': return styles.prioridadeMedia;
      case 'alta': return styles.prioridadeAlta;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.leftActions}>
          <button className={styles.addButton} onClick={() => setShowModal(true)}>
            Adicionar Notificação
          </button>
        </div>

        <div className={styles.rightActions}>
          {/* filtros e controles existentes */}
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Nova Notificação</h3>
            <form onSubmit={handleAdicionar}>
              {/* Campos Título e Mensagem (sem alteração) */}
              <div className={styles.formGroup}><label>Título</label><input type="text" value={nova.titulo} onChange={(e) => setNova({ ...nova, titulo: e.target.value })} required /></div>
              <div className={styles.formGroup}><label>Mensagem</label><textarea style={{ resize: 'none' }} value={nova.mensagem} onChange={(e) => setNova({ ...nova, mensagem: e.target.value })} required /></div>

              {/* NOVA LÓGICA DE SELEÇÃO DE PÚBLICO-ALVO */}
              <div className={styles.formGroup}>
                <label>Público-alvo</label>
                <select value={tipoAlvo} onChange={(e) => setTipoAlvo(e.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="bloco">Por Bloco</option>
                    <option value="apartamento">Por Apartamento</option>
                </select>
              </div>

              {tipoAlvo === 'bloco' && (
                <div className={styles.formGroup}>
                    <label>Selecione o Bloco</label>
                    <select value={blocoSelecionado} onChange={(e) => setBlocoSelecionado(e.target.value)} required>
                        <option value="">-- Selecione --</option>
                        {todosBlocos.map(b => <option key={b.bloc_id} value={b.bloc_id}>{b.bloc_nome}</option>)}
                    </select>
                </div>
              )}

              {tipoAlvo === 'apartamento' && (
                <>
                    <div className={styles.formGroup}>
                        <label>Primeiro, selecione o Bloco</label>
                        <select value={blocoSelecionado} onChange={(e) => setBlocoSelecionado(e.target.value)} required>
                            <option value="">-- Selecione o Bloco --</option>
                            {todosBlocos.map(b => <option key={b.bloc_id} value={b.bloc_id}>{b.bloc_nome}</option>)}
                        </select>
                    </div>
                    {blocoSelecionado && (
                        <div className={styles.formGroup}>
                            <label>Agora, selecione o Apartamento</label>
                            <select value={apartamentoSelecionado} onChange={(e) => setApartamentoSelecionado(e.target.value)} required>
                                <option value="">-- Selecione o Apartamento --</option>
                                {apartamentosFiltrados.map(ap => <option key={ap.ap_id} value={ap.ap_id}>{ap.ap_numero}</option>)}
                            </select>
                        </div>
                    )}
                </>
              )}

              {/* Campo Prioridade (sem alteração) */}
              <div className={styles.formGroup}><label>Prioridade</label><select value={nova.prioridade} onChange={(e) => setNova({ ...nova, prioridade: e.target.value })}><option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option></select></div>
              <div className={styles.modalActions}><button type="submit" className={styles.saveButton}>Salvar</button><button type="button" className={styles.cancelButton} onClick={() => setShowModal(false)}>Cancelar</button></div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {notificacoes.map((n) => (
          editandoId === n.id ? (
            // FORMULÁRIO DE EDIÇÃO
            <div key={n.id} className={styles.card}>
                <div className={styles.formGroup}><label>Título</label><input type="text" value={dadosEditados.titulo} onChange={(e) => setDadosEditados({...dadosEditados, titulo: e.target.value})} /></div>
                <div className={styles.formGroup}><label>Mensagem</label><textarea style={{ resize: 'none' }} value={dadosEditados.mensagem} onChange={(e) => setDadosEditados({...dadosEditados, mensagem: e.target.value})} /></div>
                <div className={styles.formGroup}><label>Prioridade</label><select value={dadosEditados.prioridade} onChange={(e) => setDadosEditados({...dadosEditados, prioridade: e.target.value})}><option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option></select></div>
                <div className={styles.actions}>
                    <button className={styles.saveButton} onClick={() => handleSalvarEdicao(n)}>Salvar</button>
                    <button className={styles.cancelButton} onClick={() => setEditandoId(null)}>Cancelar</button>
                </div>
            </div>
          ) : (
            // CARD DE EXIBIÇÃO
            <div key={n.id} className={`${styles.card} ${getPrioridadeClass(n.prioridade)}`}>
              <div className={styles.cardHeader}><h3>{n.titulo}</h3><span className={styles.data}>{new Date(n.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</span></div>
              <p className={styles.mensagem}>{n.mensagem}</p>
              <p className={styles.infoItem}><strong>Prioridade:</strong> <span className={getPrioridadeClass(n.prioridade)}>{n.prioridade?.toUpperCase()}</span></p>
              <p className={styles.infoItem}><strong>Enviado para:</strong> {n.destinatarios} destinatário(s)</p>
              <div className={styles.actions}>
                <IconAction icon={FiEdit2} label="Editar" onClick={() => handleAbrirEdicao(n)} variant="edit" />
                <IconAction
                  icon={FiTrash2}
                  label="Excluir"
                  onClick={() => handleExcluir({ titulo: n.titulo, mensagem: n.mensagem, prioridade: n.prioridade, tipo: n.tipo })}
                  variant="delete"
                />
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}