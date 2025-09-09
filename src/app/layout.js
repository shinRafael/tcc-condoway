import { Geist, Geist_Mono } from "next/font/google";
import "../styles/reset.css";
import "../styles/globals.css";
import Sidebar from "@/componentes/Sidebar/sidebar";
import styles from "./Layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CondoWay",
  description: "O melhor app de condominio para condominos ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.appContainer}>
          <Sidebar />
          <main className={styles.mainContent}>{children}</main>
        </div>
      </body>
    </html>
  );
}
