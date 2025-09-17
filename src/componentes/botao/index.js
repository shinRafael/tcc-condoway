import styles from './index.module.css';

export default function Botao({ label, acao, disabled = false }) {
  const handleClick = () => {
    if (disabled) return;
    if (typeof acao === 'function') acao();
  };

  return (
    <button
      type="button"
      className={styles.containerBotao}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className={styles.txtBotao}>{label}</span>
    </button>
  );
}
