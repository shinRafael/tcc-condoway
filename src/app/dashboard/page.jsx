'use client';
import React from 'react';
import Dashboard from '@/componentes/Dashboard/Dashboard';
import PageHeader from '@/componentes/PageHeader';

export default function DashboardPage() {
  return (
    <div className="page-container">
      <PageHeader title="Dashboard" rightContent={(
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
          <span>Síndico</span>
          <img src="https://via.placeholder.com/35" alt="User" style={{ borderRadius: '50%' }} />
        </div>
      )} />
      <div className="page-content">
        <Dashboard />
      </div>
    </div>
  );
}