"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getDevUser } from "@/services/api";

export default function useAuthGuard(rolesPermitidos = []) {
  const router = useRouter();

  useEffect(() => {
    const devUser = getDevUser();
    const token = getAuthToken();

    // 🌐 Modo DEV ativo (libera acesso total)
    if (devUser) return;

    // ❌ Sem token → volta pro login
    if (!token) {
      router.push("/login");
      return;
    }

    // 📜 Tipo de usuário (simulação simples)
    const userType = localStorage.getItem("userType");

    if (rolesPermitidos.length && !rolesPermitidos.includes(userType)) {
      router.push("/login");
    }
  }, [router, rolesPermitidos]);
}
