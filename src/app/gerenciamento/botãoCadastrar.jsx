'use client';

import styles from './index.module.css';

/**
 * Componente de botão para acionar o cadastro.
 * @param {object} props
 * @param {Function} props.onClick - A função a ser executada quando o botão é clicado.
 */
export default function BotaoCadastrar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className={styles.addButton}
    >
      + Adicionar
    </button>
  );
}