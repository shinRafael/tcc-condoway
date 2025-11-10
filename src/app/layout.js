// Passo 3 - Parte 2: Importando os novos CSS
import '../styles/style.css';
import '../styles/design-tokens.css';
// ---
import '../styles/globals.css';
import ClientLayout from '@/componentes/Layout/ClientLayout';
import { ModalProvider } from '@/context/ModalContext';

export const metadata = {
  title: 'CondoWay',
  description: 'Sistema de gerenciamento de condomínios',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      {/* Passo 3 - Parte 3: Adicionando o <head> manualmente.
        O Next.js vai juntar isto com o 'metadata' acima.
      */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css" />
      </head>

      <body>
        <ModalProvider>
          <ClientLayout>{children}</ClientLayout>
        </ModalProvider>
      </body>
    </html>
  );
}

