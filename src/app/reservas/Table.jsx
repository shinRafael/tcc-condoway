"use client";
import styles from "./page.module.css";

export default function Table({ reservas, onAction }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.reservasTable}>
        <thead>
          <tr>
            <th>Morador</th>
            <th>Ambiente</th>
            <th>Data da Reserva</th>
            <th>Data do Pedido</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.morador}</td>
              <td>{reserva.ambiente}</td>
              <td>{reserva.dataReserva}</td>
              <td>{reserva.dataPedido}</td>
              <td>
                <span className={`${styles.statusBadge} ${styles[reserva.status.toLowerCase()]}`}>
                  {reserva.status}
                </span>
              </td>
              <td>
                {/* Botão de ações, pode ser customizado conforme necessidade */}
                <button onClick={() => onAction(reserva.id)} className={styles.actionButton}>
                  Ações
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
