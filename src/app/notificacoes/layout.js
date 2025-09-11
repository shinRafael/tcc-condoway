import Sidebar from '@/componentes/Sidebar/sidebar';
import '../../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: 'flex' }}>
          {/* Sidebar sempre fixa */}
          <Sidebar />

          {/* Conteúdo da página */}
          <main style={{ flex: 1, padding: '20px' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}