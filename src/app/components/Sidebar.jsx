'use client';
import styles from './Sidebar.module.css';
import { usePathname } from 'next/navigation';

const menu = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Usuários', path: '/usuarios' },
  { label: 'Apartamentos', path: '/apartamentos' },
  { label: 'Reservas', path: '/reservas' },
  { label: 'Visitantes', path: '/visitantes' },
  { label: 'Encomendas', path: '/encomendas' },
  { label: 'Notificações', path: '/notificacoes' },
  { label: 'Mensagens', path: '/mensagens' },
  { label: "Gerenciamento", path: "/gerenciamento" }
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>CondoWay</h2>
      <nav>
        <ul className={styles.menu}>
          {menu.map((item) => (
            <li key={item.label}>
              <a
                href={item.path}
                className={
                  pathname === item.path
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
