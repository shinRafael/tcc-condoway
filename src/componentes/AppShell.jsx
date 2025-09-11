'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/componentes/Sidebar/sidebar';

// Rotas onde a sidebar NÃO deve aparecer
const HIDE_SIDEBAR_ROUTES = ['/', '/login'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const hideSidebar = HIDE_SIDEBAR_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

  if (hideSidebar) {
    return children;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        {children}
      </div>
    </div>
  );
}
