"use client";
import React from "react";
import Dashboard from "@/componentes/Dashboard/Dashboard";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";

export default function DashboardPage() {
  return (
    <div className="page-container">
      <PageHeader title="Dashboard" rightContent={<RightHeaderBrand />} />
      <div className="page-content">
        <Dashboard />
      </div>
    </div>
  );
}