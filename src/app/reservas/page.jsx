"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

// Dados de exemplo para os cards de reservas
const initialData = [
  {
	id: 1,
	nome: "Salão de Festas",
	icone: "🎉",
	status: "disponível",
	detalhes: "Capacidade para 50 pessoas.",
	proximaReserva: "2025-08-28 18:00",
	pedidos: [
	  { id: 'pedido-joao-1', usuario: "João Silva", data: "2025-08-28 18:00", status: "pendente" },
	  { id: 'pedido-maria-1', usuario: "Maria Souza", data: "2025-08-29 20:00", status: "confirmado" }
	],
	historico: [
	  { data: "25/08/2025", usuario: "João Silva" },
	  { data: "20/08/2025", usuario: "Maria Souza" },
	],
  },
  {
	id: 2,
	nome: "Churrasqueira",
	icone: "🍖",
	status: "ocupado",
	detalhes: "Área externa coberta.",
	proximaReserva: "2025-08-26 20:00",
	pedidos: [
	  { id: 'pedido-carlos-1', usuario: "Carlos Lima", data: "2025-08-26 20:00", status: "pendente" }
	],
	historico: [
	  { data: "22/08/2025", usuario: "Carlos Lima" },
	  { data: "18/08/2025", usuario: "Ana Paula" },
	],
  },
  {
	id: 3,
	nome: "Piscina",
	icone: "🏊",
	status: "manutenção",
	detalhes: "Manutenção até 30/08.",
	proximaReserva: null,
	pedidos: [],
	historico: [
	  { data: "15/08/2025", usuario: "Pedro Santos" },
	],
  },
  {
	id: 4,
	nome: "Quadra Poliesportiva",
	icone: "⚽",
	status: "disponível",
	detalhes: "Iluminação noturna.",
	proximaReserva: null,
	pedidos: [
	  { id: 'pedido-lucas-1', usuario: "Lucas Godoi", data: "2025-08-30 19:00", status: "negado" }
	],
	historico: [
	  { data: "10/08/2025", usuario: "Lucas Godoi" },
	],
  },
];

const statusStyle = {
  "disponível": styles.statusDisponivel,
  "ocupado": styles.statusOcupado,
  "manutenção": styles.statusManutencao,
};

const menu = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Usuários", path: "/usuarios" },
  { label: "Apartamentos", path: "/apartamentos" },
  { label: "Reservas", path: "/reservas" },
  { label: "Visitantes", path: "/visitantes" },
  { label: "Encomendas", path: "/encomendas" },
  { label: "Notificações", path: "/notificacoes" },
  { label: "Mensagens", path: "/mensagens" },
  { label: "Gerenciamento", path: "/gerenciamento" }
];

const moradores = [
  "João Silva",
  "Maria Souza",
  "Carlos Lima",
  "Ana Paula",
  "Pedro Santos",
  "Lucas Godoi"
];

export default function Page() {
	const [busca, setBusca] = useState("");
	const [filtroStatus, setFiltroStatus] = useState("todos");
	const [filtroMorador, setFiltroMorador] = useState("");
	const [filtroAmbiente, setFiltroAmbiente] = useState("");
	const [filtroData, setFiltroData] = useState("");
const [ambientesState, setAmbientesState] = useState(initialData);
	const [lastAction, setLastAction] = useState("");
	const [modalPedido, setModalPedido] = useState(null);
	const [hoverUsuario, setHoverUsuario] = useState(null);

	// Função para abrir modal de decisão
	const handleOpenModal = (ambienteId, pedidoId) => {
		setModalPedido({ ambienteId, pedidoId });
	};

	// Funções de ação do síndico
	const handleDecisao = (tipo) => {
		if (!modalPedido) return;
		const { ambienteId, pedidoId } = modalPedido;
		if (tipo === "confirmar") {
			setAmbientesState((prev) =>
				prev.map((amb) =>
					amb.id === ambienteId
						? {
								...amb,
								pedidos: amb.pedidos.map((p) =>
									p.id === pedidoId ? { ...p, status: "confirmado" } : p
								),
						  }
						: amb
				)
			);
			setLastAction(`Pedido ${pedidoId} confirmado!`);
		} else if (tipo === "negar") {
			setAmbientesState((prev) =>
				prev.map((amb) =>
					amb.id === ambienteId
						? {
								...amb,
								pedidos: amb.pedidos.map((p) =>
									p.id === pedidoId ? { ...p, status: "negado" } : p
								),
						  }
						: amb
				)
			);
			setLastAction(`Pedido ${pedidoId} negado!`);
		} else if (tipo === "editar") {
			const novoHorario = prompt("Novo horário para reserva:");
			if (novoHorario) {
				setAmbientesState((prev) =>
					prev.map((amb) =>
						amb.id === ambienteId
							? {
									...amb,
									pedidos: amb.pedidos.map((p) =>
										p.id === pedidoId ? { ...p, data: novoHorario } : p
									),
							  }
							: amb
					)
				);
				setLastAction(`Pedido ${pedidoId} editado para ${novoHorario}`);
			}
		}
		setModalPedido(null);
	};

	// Busca global e filtros avançados
	const ambientesFiltrados = ambientesState.filter((a) => {
		// Filtro por ambiente
		if (filtroAmbiente && a.nome !== filtroAmbiente) return false;
		// Filtro por status
		if (filtroStatus !== "todos" && a.status !== filtroStatus) return false;
		// Filtro por morador
		if (filtroMorador && !a.pedidos.some(p => p.usuario === filtroMorador)) return false;
		// Filtro por data
		if (filtroData && !a.pedidos.some(p => p.data === filtroData)) return false;
		// Busca global
		if (busca) {
			const buscaLower = busca.toLowerCase();
			if (
				!a.nome.toLowerCase().includes(buscaLower) &&
				!a.pedidos.some(p => p.usuario.toLowerCase().includes(buscaLower) || p.data.includes(buscaLower)) &&
				!a.historico.some(h => h.usuario.toLowerCase().includes(buscaLower) || h.data.includes(buscaLower))
			) return false;
		}
		return true;
	});

	function formatarData(dataStr) {
  if (!dataStr) return "";
  // Aceita formatos tipo "2025-08-28 18:00" ou "25/08/2025"
  if (dataStr.includes("-")) {
	const [date, hora] = dataStr.split(" ");
	const [ano, mes, dia] = date.split("-");
	return `${dia}/${mes}/${ano}${hora ? " às " + hora : ""}`;
  }
  if (dataStr.includes("/")) {
	return dataStr;
  }
  return dataStr;
}

function getPrimeiroNome(nome) {
  return nome.split(' ')[0];
}

function getPerfilUsuario(nome) {
  // Exemplo de perfil, pode ser expandido
  const perfis = {
	"João Silva": { apartamento: "101", telefone: "(11) 99999-1111" },
	"Maria Souza": { apartamento: "202", telefone: "(11) 99999-2222" },
	"Carlos Lima": { apartamento: "303", telefone: "(11) 99999-3333" },
	"Ana Paula": { apartamento: "404", telefone: "(11) 99999-4444" },
	"Pedro Santos": { apartamento: "505", telefone: "(11) 99999-5555" },
	"Lucas Godoi": { apartamento: "606", telefone: "(11) 99999-6666" },
  };
  return perfis[nome] || { apartamento: "N/A", telefone: "N/A" };
}

	return (
		<div className={styles.container}>
  {/* Sidebar removida, agora global via layout */}

			{/* Área principal */}
			<div className={styles.main}>
				<header className={styles.header}>
					<h1 className={styles.titulo}>Controle de Reservas</h1>
					<span className={styles.brand}>CondoWay</span>
				</header>
				<main className={styles.content}>
					<p className={styles.subtitulo}>
						Administração de reservas dos ambientes do condomínio. Confirme, edite ou negue pedidos feitos pelos moradores.
					</p>
					<div className={styles.filtros}>
						<input
							type="text"
							placeholder="Busca global..."
							className={styles.inputBusca}
							value={busca}
							onChange={(e) => setBusca(e.target.value)}
						/>
						<select
							className={styles.selectFiltro}
							value={filtroStatus}
							onChange={(e) => setFiltroStatus(e.target.value)}
						>
							<option value="todos">Status</option>
							<option value="disponível">Disponível</option>
							<option value="ocupado">Ocupado</option>
							<option value="manutenção">Manutenção</option>
						</select>
						<select
							className={styles.selectFiltro}
							value={filtroMorador}
							onChange={(e) => setFiltroMorador(e.target.value)}
						>
							<option value="">Morador</option>
							{moradores.map((m) => (
								<option key={m} value={m}>{m}</option>
							))}
						</select>
						<select
							className={styles.selectFiltro}
							value={filtroAmbiente}
							onChange={(e) => setFiltroAmbiente(e.target.value)}
						>
							<option value="">Ambiente</option>
 {ambientesState.map((a) => (
   <option key={a.id} value={a.nome}>{a.nome}</option>
 ))}
						</select>
						<input
							type="date"
							className={styles.inputBusca}
							value={filtroData}
							onChange={(e) => setFiltroData(e.target.value)}
						/>
					</div>

					<div className={styles.cardsGridCompact}>
						{ambientesFiltrados.map((ambiente) => (
							<div key={ambiente.id} className={styles.cardSmall}>
								<div className={styles.cardHeader}>
									<span className={styles.icone}>{ambiente.icone}</span>
									<h2 className={styles.cardTitulo}>{ambiente.nome}</h2>
								</div>
								<span className={statusStyle[ambiente.status]}>{ambiente.status}</span>
								<p className={styles.cardDetalhes}>{ambiente.detalhes}</p>
								<div className={styles.cardReservaInfo}>
									<span>Próxima reserva:</span>
									{ambiente.proximaReserva ? (
										<span className={styles.cardReservaData}>{formatarData(ambiente.proximaReserva)}</span>
									) : (
										<span className={styles.cardReservaVazia}>Nenhuma reserva futura</span>
									)}
								</div>
{ambiente.pedidos.length > 0 && (
  <div className={styles.cardPedidos}>
	<span>Pedidos pendentes:</span>
	{ambiente.pedidos.map((pedido) => (
	  <div key={pedido.id} className={`${styles.requestItem} ${pedido.status === 'pendente' ? styles.pending : pedido.status === 'confirmado' ? styles.confirmed : styles.denied}`}> 
		<div className={styles.requestInfo}>
		  <strong>{getPrimeiroNome(pedido.usuario)}</strong>
		  <span>solicita para {formatarData(pedido.data)}</span>
		</div>
		<span className={styles.requestStatus}>{pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}</span>
							<div className={styles.actionsContainer}>
							  {modalPedido && modalPedido.ambienteId === ambiente.id && modalPedido.pedidoId === pedido.id ? (
								<div className={styles.inlineDecisaoBox}>
								  <button className={styles.btnConfirmar} onClick={() => handleDecisao("confirmar")} aria-label="Confirmar" title="Confirmar">✔</button>
								  <button className={styles.btnNegar} onClick={() => handleDecisao("negar")} aria-label="Negar" title="Negar">✖</button>
								  <button className={styles.btnEditar} onClick={() => handleDecisao("editar")} aria-label="Editar" title="Editar">✎</button>
								  <button className={styles.btnFechar} onClick={() => setModalPedido(null)} aria-label="Fechar" title="Fechar">⨉</button>
								</div>
							  ) : (
								<button className={styles.actionButton} onClick={() => handleOpenModal(ambiente.id, pedido.id)}>
								  Ações
								</button>
							  )}
							</div>
	  </div>
	))}
  </div>
								)}
								<div className={styles.cardHistorico}>
									<span>Histórico:</span>
									<ul>
										{ambiente.historico.map((h, idx) => (
											<li key={idx}>{formatarData(h.data)} - {h.usuario}</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				</main>
			</div>

			{lastAction && (
				<div className={styles.toastAction}>{lastAction}</div>
			)}
		</div>
	);
}
// ...existing code...
