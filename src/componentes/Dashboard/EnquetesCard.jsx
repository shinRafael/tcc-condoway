import styles from './Dashboard.module.css';

export function EnquetesCard() {
  const enquetes = [
    { id: 1, titulo: 'Abrir novas vagas na garagem?', votosSim: 120, votosNao: 30 },
    { id: 2, titulo: 'Trocar a iluminação por LED?', votosSim: 200, votosNao: 15 },
  ];

  return (
    <div className={styles.card}>
      <h3>Enquetes</h3>
      <div className={styles.enqueteContent}>
        {enquetes.map((enquete) => {
          const total = enquete.votosSim + enquete.votosNao;
          const percent = total ? Math.round((enquete.votosSim / total) * 100) : 0;
          return (
            <div key={enquete.id}>
              <div className={styles.enqueteTitle}>{enquete.titulo}</div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${percent}%` }} />
              </div>
              <div className={styles.enqueteFooter}>
                <span>{percent}% Sim</span>
                <span>{total} votos</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}