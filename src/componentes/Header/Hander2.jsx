import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>CondoWey</div>
      <nav className={styles.menu}>
        <ul>
          <li><a href="/login">Início</a></li>
          <li><a href="/download">Download</a></li>
          <li><a href="/sobre">Sobre</a></li>
        </ul>
      </nav>
    </header>
  );
}