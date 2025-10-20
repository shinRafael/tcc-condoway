import '../styles/globals.css';
import ClientLayout from '@/componentes/Layout/ClientLayout';
import { ModalProvider } from '@/context/ModalContext'; // Importe o provider

export const metadata = {
  title: 'CondoWay',
  description: 'Sistema de gerenciamento de condomínios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ModalProvider> {/* Envolva com o provider */}
          <ClientLayout>{children}</ClientLayout>
        </ModalProvider>
      </body>
    </html>
  );
}

