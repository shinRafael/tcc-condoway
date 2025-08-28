import Sidebar from './components/Sidebar';
import styles from './Layout.module.css';
import '../styles/globals.css';

export const metadata = { title: 'CondoWay' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <div className={styles.appContainer}>
          <Sidebar />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
