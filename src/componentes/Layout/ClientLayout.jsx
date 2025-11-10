"use client";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SidebarWrapper from "@/componentes/Layout/SidebarWrapper";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Rotas públicas (sem sidebar)
  // 1. Adicionamos a rota "/" aqui
  const paginasSemSidebar = ["/", "/login", "/register", "/404"];
  
  // 2. Trocamos startsWith(p) por === p (exatamente igual)
  const semSidebar = paginasSemSidebar.some((p) => pathname === p);

  return (
    <AnimatePresence mode="wait">
      {semSidebar ? (
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : (
        <SidebarWrapper>{children}</SidebarWrapper>
      )}
    </AnimatePresence>
  );
}