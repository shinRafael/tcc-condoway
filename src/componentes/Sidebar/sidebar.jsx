import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './sidebar.module.css';
import {
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaUserCheck,
  FaBoxOpen,
  FaBell,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { MdDashboard, MdManageAccounts } from 'react-icons/md';

// chaves usadas no badge: dashboard, reservas, usuarios, apartamentos, visitantes, encomendas, notificacoes, ocorrencias
const navItems = [
  { key: 'dashboard',     href: '/dashboard',     label: 'Dashboard',     icon: MdDashboard,              roles: ['Sindico', 'Funcionario'] },
  { key: 'reservas',      href: '/reservas',      label: 'Reservas',      icon: FaCalendarAlt,            roles: ['Sindico', 'Funcionario'] },
  { key: 'usuarios',      href: '/usuarios',      label: 'Usuários',      icon: FaUsers,                  roles: ['Sindico'] },
  { key: 'apartamentos',  href: '/apartamentos',  label: 'Apartamentos',  icon: FaBuilding,               roles: ['Sindico'] },
  { key: 'visitantes',    href: '/visitantes',    label: 'Visitantes',    icon: FaUserCheck,              roles: ['Sindico'] },
  { key: 'encomendas',    href: '/encomendas',    label: 'Encomendas',    icon: FaBoxOpen,                roles: ['Sindico', 'Funcionario'] },
  { key: 'notificacoes',  href: '/notificacoes',  label: 'Notificações',  icon: FaBell,                   roles: ['Sindico'] },
  // { key: 'mensagens',     href: '/mensagens',     label: 'Mensagens',     icon: FaComments }, // LINHA REMOVIDA
  { key: 'ocorrencias',   href: '/ocorrencias',   label: 'Ocorrencias',   icon: FaExclamationTriangle,    roles: ['Sindico', 'Funcionario'] },
  { key: 'gerenciamento', href: '/gerenciamento', label: 'Gerenciamento', icon: MdManageAccounts,         roles: ['Sindico'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [badges, setBadges] = useState({});
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Carregar tipo de usuário do localStorage
    const tipo = localStorage.getItem('userType');
    console.log('🔍 UserType carregado:', tipo);
    setUserType(tipo);
    
    const load = () => {
      try {
        const raw = localStorage.getItem('sidebarBadges');
        setBadges(raw ? JSON.parse(raw) : {});
      } catch {}
    };
    load();
    const onStorage = (e) => { if (e.key === 'sidebarBadges') load(); };
    const onCustom = (e) => { if (e?.detail?.type === 'sidebar-badge-update') setBadges((p) => ({ ...p, [e.detail.key]: e.detail.count })); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('sidebar-badge-event', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sidebar-badge-event', onCustom);
    };
  }, []);

  // Filtrar itens de navegação baseado no tipo de usuário
  const filteredNavItems = navItems.filter(item => {
    // Se não há roles definidas, mostrar para todos
    if (!item.roles || item.roles.length === 0) return true;
    // Se não temos o userType ainda, mostrar tudo temporariamente
    if (!userType) return true;
    // Verificar se o userType está na lista de roles permitidas
    return item.roles.includes(userType);
  });

  console.log('📋 Itens filtrados:', filteredNavItems.length, 'UserType:', userType);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBox}>
        {/* Certifique-se que o caminho da imagem está correto */}
        <img src="/temp/logosemtransparente.png" alt="CondoWay Icon" className={styles.logoImg} />
        <h1 className={styles.logoText}>CondoWay</h1>
      </div>
      <nav className={styles.nav} aria-label="Navegação">
        <ul className={styles.navList}>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={styles.iconWrapper}>{Icon ? <Icon className={styles.icon} aria-hidden /> : null}</div>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}