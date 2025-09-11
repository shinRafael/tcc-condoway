'use client';
import Sidebar from '@/componentes/Sidebar/sidebar';
import '../../styles/globals.css';
export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo da página */}
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}