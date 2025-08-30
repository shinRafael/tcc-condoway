// src/app/layout.js
import "../styles/globals.css";

export const metadata = {
  title: "CondoWay",
  description: "Sistema de Gestão de Condomínios",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}