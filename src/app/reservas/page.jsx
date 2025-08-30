"use client";
import ReservasList from "./ReservasList";

// Dados de exemplo para os cards de reservas
const initialReservas = [
	{
		id: 1,
		nome: "Salão de Festas",
		status: "disponível",
		detalhes: "Espaço amplo para eventos e festas.",
		proximaReserva: "2025-08-28 18:00",
		pedidos: [
			{
				id: 101,
				usuario: "João Silva",
				data: "2025-08-28 18:00",
				status: "pendente",
			},
		],
		historico: [{ usuario: "Maria Souza", data: "2025-07-10" }],
		icone: "🎉",
	},
	{
		id: 2,
		nome: "Churrasqueira",
		status: "ocupado",
		detalhes: "Ideal para confraternizações.",
		proximaReserva: "2025-09-05 12:00",
		pedidos: [],
		historico: [{ usuario: "Carlos Lima", data: "2025-06-15" }],
		icone: "🍖",
	},
];

export default function Page() {
	return (
		<div>
			<h1>Controle de Reservas</h1>
			<p style={{ marginBottom: "24px" }}>
				Administração de reservas dos ambientes do condomínio.
			</p>
			<ReservasList initialReservas={initialReservas} />
		</div>
	);
}
