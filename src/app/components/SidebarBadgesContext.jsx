'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SidebarBadgesContext = createContext({ badges: {}, setBadge: () => {} });

function readFromStorage() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem('sidebarBadges');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeToStorage(next) {
  try {
    window.localStorage.setItem('sidebarBadges', JSON.stringify(next));
  } catch {}
}

// OBSOLETO: badges foram integrados diretamente no Sidebar em src/componentes/Sidebar/sidebar.jsx
export function SidebarBadgesProvider({ children }) {
  const [badges, setBadges] = useState(() => readFromStorage());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'sidebarBadges') {
        try { setBadges(JSON.parse(e.newValue || '{}') || {}); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);

    const onCustom = (e) => {
      if (e.detail && e.detail.type === 'sidebar-badge-update') {
        setBadges((prev) => ({ ...prev, [e.detail.key]: e.detail.count }));
      }
    };
    window.addEventListener('sidebar-badge-event', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('sidebar-badge-event', onCustom);
    };
  }, []);

  useEffect(() => {
    writeToStorage(badges);
  }, [badges]);

  const api = useMemo(() => ({
    badges,
    setBadge: (key, count) => {
      setBadges((prev) => ({ ...prev, [key]: Number(count) || 0 }));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sidebar-badge-event', {
          detail: { type: 'sidebar-badge-update', key, count: Number(count) || 0 },
        }));
      }
    },
  }), [badges]);

  return (
    <SidebarBadgesContext.Provider value={api}>
      {children}
    </SidebarBadgesContext.Provider>
  );
}

export function useSidebarBadges() {
  return useContext(SidebarBadgesContext).badges || {};
}

export function useSetSidebarBadge() {
  return useContext(SidebarBadgesContext).setBadge;
}

// Optional helper for non-React usage
export function setSidebarBadge(key, count) {
  if (typeof window === 'undefined') return;
  try {
    const current = readFromStorage();
    current[key] = Number(count) || 0;
    writeToStorage(current);
    window.dispatchEvent(new CustomEvent('sidebar-badge-event', {
      detail: { type: 'sidebar-badge-update', key, count: Number(count) || 0 },
    }));
  } catch {}
}
