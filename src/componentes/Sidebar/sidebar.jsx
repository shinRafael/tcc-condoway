import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBuilding, 
  FaEnvelope, 
  FaBell, 
  FaCommentAlt, 
  FaDoorOpen,
  FaCog 
} from 'react-icons/fa';
import { BsFillCalendarCheckFill } from 'react-icons/bs';

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',    icon: <FaTachometerAlt /> },
  { href: '/reservas',     label: 'Reservas',     icon: <BsFillCalendarCheckFill /> },
  { href: '/usuarios',     label: 'Usuários',     icon: <FaUsers /> },
  { href: '/apartamentos', label: 'Apartamentos', icon: <FaBuilding /> },
  { href: '/visitantes',   label: 'Visitantes',   icon: <FaDoorOpen /> },
  { href: '/encomendas',   label: 'Encomendas',   icon: <FaEnvelope /> },
  { href: '/notificacoes', label: 'Notificações', icon: <FaBell /> },
  { href: '/mensagens',    label: 'Mensagens',    icon: <FaCommentAlt /> },
  { href: '/gerenciamento',label: 'Gerenciamento',icon: <FaCog /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBox}>
        <img src="/temp/logosemtransparente.png" alt="CondoWay Icon" className={styles.logoImg} />
        <h1 className={styles.logoText}>CondoWay</h1>
      </div>
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={pathname === item.href ? `${styles.active}` : ''}>
              {item.icon}
              <span style={{ marginLeft: 10 }}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
