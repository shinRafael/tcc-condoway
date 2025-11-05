"use client";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import SidebarWrapper from "@/componentes/Layout/SidebarWrapper";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Rotas públicas (sem sidebar)
  const paginasSemSidebar = ["/login", "/register", "/404"];
  const semSidebar = paginasSemSidebar.some((p) => pathname.startsWith(p));

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