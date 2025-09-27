// app/layout.js
import '../styles/globals.css';
import ClientLayout from '@/componentes/Layout/ClientLayout';

export const metadata = {
  title: 'CondoWay',
  description: 'Sistema de gerenciamento de condomínios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

