'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/componentes/Sidebar/sidebar';

// Rotas que NÃO devem mostrar sidebar (ex: login, cadastro)
const HIDE_SIDEBAR = [
  '/',
  '/usuario/login',
  '/usuario/cadastro'
];

// Rotas que DEVEM manter layout atual sem interferir (ex: ocorrencias) -> não modificaremos diretamente
const KEEP_UNTOUCHED = [
  
];

export default function SidebarWrapper({ children }) {
  const pathname = usePathname();

  const hide = HIDE_SIDEBAR.includes(pathname);
  const untouched = KEEP_UNTOUCHED.some(p => pathname === p || pathname.startsWith(p + '/'));

  if (hide || untouched) {
    return <>{children}</>;
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
