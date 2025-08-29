
'use client';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import { usePathname } from 'next/navigation';



export default function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/reservas', label: 'Reservas' },
    { href: '/usuarios', label: 'Usuários' },
    { href: '/apartamentos', label: 'Apartamentos' },
    { href: '/visitantes', label: 'Visitantes' },
    { href: '/encomendas', label: 'Encomendas' },
    { href: '/notificacoes', label: 'Notificações' },
    { href: '/mensagens', label: 'Mensagens' },
    { href: '/gerenciamento', label: 'Gerenciamento' }

  ];
  return (
    <aside className={styles.sidebar}>
      <Link href="/dashboard" className={styles.logoLink}>
        <div className={styles.logoContainer}>
          <img src="/temp/logosemtransparente.png" alt="CondoWay Icon" className={styles.logoIcon} />
          <h1 className={styles.logoText}>CondoWay</h1>
        </div>
      </Link>
      <nav>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link href={item.href} className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );


  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>CondoWay</h1>
      <nav>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link href={item.href} className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
