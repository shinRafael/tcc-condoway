// app/layout.js
import '../styles/globals.css';
import SidebarWrapper from '@/componentes/Layout/SidebarWrapper';

export const metadata = {
  title: 'CondoWay',
  description: 'Sistema de gerenciamento de condomínios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}

