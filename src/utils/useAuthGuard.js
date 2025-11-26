"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthGuard(rolesPermitidos = []) {
  const router = useRouter();

  useEffect(() => {
    // Verifica se está em modo DEV
    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";
    
    // 🌐 Modo DEV ativo (libera acesso total)
    if (isDevMode) return;

    // ❌ Sem token → volta pro login
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    // 📜 Tipo de usuário
    const userType = localStorage.getItem("userType");

    if (rolesPermitidos.length && !rolesPermitidos.includes(userType)) {
      router.push("/login");
    }
  }, [router, rolesPermitidos]);
}
