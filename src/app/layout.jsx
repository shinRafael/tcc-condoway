import '../styles/globals.css';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%)' }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '2.5rem 2rem 2rem 2rem', minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
