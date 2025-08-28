import Head from 'next/head';
import styles from './encomendas.module.css';
import '../../styles/globals.css';

const Encomendas = () => {
  // Dados simulados da sua API para teste, sem status de "problema"
  const encomendas = [
    { enc_id: 1, enc_userap_id: 1, enc_nome_loja: 'Magazine Online', enc_status: 'aguardando_retirada', enc_data_chegada: '2025-08-18', enc_data_retirada: null },
    { enc_id: 2, enc_userap_id: 4, enc_nome_loja: 'Loja do Lar', enc_status: 'entregue', enc_data_chegada: '2025-08-20', enc_data_retirada: '2025-08-23' },
    { enc_id: 3, enc_userap_id: 4, enc_nome_loja: 'Tech Store', enc_status: 'aguardando_retirada', enc_data_chegada: '2025-08-20', enc_data_retirada: null },
    { enc_id: 4, enc_userap_id: 5, enc_nome_loja: 'Moda Express', enc_status: 'aguardando_retirada', enc_data_chegada: '2025-08-20', enc_data_retirada: null },
    { enc_id: 5, enc_userap_id: 6, enc_nome_loja: 'Livraria Central', enc_status: 'aguardando_retirada', enc_data_chegada: '2025-08-20', enc_data_retirada: null },
  ];

  // Função para contar os status
  const totalEncomendas = encomendas.length;
  const encomendasPendentes = encomendas.filter(enc => enc.enc_status === 'aguardando_retirada').length;
  const encomendasRetiradas = encomendas.filter(enc => enc.enc_status === 'entregue').length;

  return (
    <>
      <Head>
        <title>Encomendas</title>
      </Head>
      <div className={styles.mainContentReserva}>
        <header className={styles.header}>
          <h1>Encomendas</h1>
          <div className={styles.userInfo}>
            <span>Síndico</span>
            <img src="/user-icon.png" alt="User" />
          </div>
        </header>

        <section className={styles.dashboardCards}>
          <div className={styles.card}>
            <h3>Total de Encomendas</h3>
            <p>{totalEncomendas}</p>
          </div>
          <div className={styles.card}>
            <h3>Pendentes</h3>
            <p>{encomendasPendentes}</p>
          </div>
          <div className={styles.card}>
            <h3>Retiradas</h3>
            <p>{encomendasRetiradas}</p>
          </div>
        </section>

        <section className={styles.tableSection}>
          <h2>Encomendas Recentes</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Morador</th>
                  <th>Data de Recebimento</th>
                  <th>Data de Retirada</th>
                  <th>Loja / Transportadora</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {encomendas.map((enc) => (
                  <tr key={enc.enc_id}>
                    <td>Morador ID {enc.enc_userap_id}</td>
                    <td>{enc.enc_data_chegada}</td>
                    <td>{enc.enc_data_retirada ? enc.enc_data_retirada : 'Não retirada'}</td>
                    <td>{enc.enc_nome_loja}</td>
                    <td>
                      {enc.enc_status === 'entregue' && (
                        <span className={styles.statusEntregue}>Entregue</span>
                      )}
                      {enc.enc_status === 'aguardando_retirada' && (
                        <span className={styles.statusPendente}>Aguardando Retirada</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default Encomendas;