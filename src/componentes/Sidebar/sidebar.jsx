'use client';
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
  FaComments,
  FaHome,
  FaEnvelope,
} from 'react-icons/fa';
import { MdDashboard, MdManageAccounts } from 'react-icons/md';

// chaves usadas no badge: dashboard, reservas, usuarios, apartamentos, visitantes, encomendas, notificacoes, mensagens
const navItems = [
  { key: 'dashboard',     href: '/dashboard',     label: 'Dashboard',     icon: MdDashboard },
  { key: 'reservas',      href: '/reservas',      label: 'Reservas',      icon: FaCalendarAlt },
  { key: 'usuarios',      href: '/usuarios',      label: 'Usuários',      icon: FaUsers },
  { key: 'apartamentos',  href: '/apartamentos',  label: 'Apartamentos',  icon: FaBuilding },
  { key: 'visitantes',    href: '/visitantes',    label: 'Visitantes',    icon: FaUserCheck },
  { key: 'encomendas',    href: '/encomendas',    label: 'Encomendas',    icon: FaBoxOpen },
  { key: 'notificacoes',  href: '/notificacoes',  label: 'Notificações',  icon: FaBell },
  { key: 'mensagens',     href: '/mensagens',     label: 'Mensagens',     icon: FaComments },
  { key: 'contato',       href: '/contato',       label: 'Contato',       icon: FaEnvelope },
  { key: 'gerenciamento', href: '/gerenciamento', label: 'Gerenciamento', icon: MdManageAccounts },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [badges, setBadges] = useState({});

  // lê/escuta badges do localStorage e eventos customizados
  useEffect(() => {
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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBox}>
        <img src="/temp/logosemtransparente.png" alt="CondoWay Icon" className={styles.logoImg} />
        <h1 className={styles.logoText}>CondoWay</h1>
      </div>
      <nav className={styles.nav} aria-label="Navegação">
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const count = Number(badges?.[item.key] || 0);
            return (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={styles.iconWrapper}>{Icon ? <Icon className={styles.icon} aria-hidden /> : null}</div>
                  <span className={styles.label}>{item.label}</span>
                  {count > 0 && <span className={styles.badgeDot} title={`${count} pendentes`} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
