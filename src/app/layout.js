// app/layout.js
import '../styles/globals.css';

export const metadata = {
  title: 'CondoWay',
  description: 'Sistema de gerenciamento de condomínios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        {/* A Sidebar NÃO deve estar aqui */}
        {children}
      </body>
    </html>
  );
}