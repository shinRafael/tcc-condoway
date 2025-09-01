
'use client';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUsers, FaBuilding, FaEnvelope, FaBell, FaCommentAlt, FaDoorOpen } from 'react-icons/fa';
import { BsFillCalendarCheckFill } from 'react-icons/bs';



export default function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard',    label: ' Dashboard',    icon: <FaTachometerAlt /> },
    { href: '/reservas',     label: ' Reservas',     icon: <BsFillCalendarCheckFill /> },
    { href: '/usuarios',     label: ' Usuários',     icon: <FaUsers /> },
    { href: '/apartamentos', label: ' Apartamentos', icon: <FaBuilding /> },
    { href: '/visitantes',   label: ' Visitantes',   icon: <FaDoorOpen /> },
    { href: '/encomendas',   label: ' Encomendas',   icon: <FaEnvelope /> },
    { href: '/notificacoes', label: ' Notificações', icon: <FaBell /> },
    { href: '/mensagens',    label: ' Mensagens',    icon: <FaCommentAlt /> },
    { href: '/ocorrencias',    label: ' Ocorrencias',    icon: <FaCommentAlt /> },
    { href: '/gerenciamento',    label: ' Gerenciamento',    icon: <FaCommentAlt /> },
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
