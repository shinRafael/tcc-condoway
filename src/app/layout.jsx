"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  const hideSidebarRoutes = ["/", "/login"];
  const showSidebar = !hideSidebarRoutes.includes(pathname);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex">
          {showSidebar && <Sidebar />}
          <main className="flex-1 flex items-center justify-center min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}