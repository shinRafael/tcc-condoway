import styles from './Dashboard.module.css';

export function MensagensNaoLidasCard() {
  const mensagens = [
    { id: 1, remetente: 'Síndico', assunto: 'Reunião Extraordinária' },
    { id: 2, remetente: 'Portaria', assunto: 'Entrega aguardando retirada' },
    { id: 3, remetente: 'Administração', assunto: 'Atualização de cadastro' },
  ];
  return (
    <div className={styles.card}>
      <h3>Mensagens Não Lidas</h3>
      <ul className={styles.list}>
        {mensagens.map(msg => (
          <li key={msg.id} className={styles.listItem}>
            <span>{msg.remetente}</span>
            <span style={{ color: '#6b7280' }}>{msg.assunto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}