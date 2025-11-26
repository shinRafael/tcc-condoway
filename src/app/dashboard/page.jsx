"use client";
import React from "react";
import Dashboard from "@/componentes/Dashboard/Dashboard";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import useAuthGuard from "@/utils/useAuthGuard";

export default function DashboardPage() {
  useAuthGuard(["Sindico", "Funcionario"]); // Síndico e Porteiro podem acessar
  
  return (
    <div className="page-container">
      <PageHeader title="Dashboard" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        <Dashboard />
      </div>
    </div>
  );
}