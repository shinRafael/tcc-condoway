import React from 'react';

export default function RightHeaderBrand() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
      <span>Síndico</span>
      <img
        src="/temp/logosemtransparente.png"
        alt="CondoWay"
        height={28}
        style={{ height: 28, width: 'auto', display: 'block' }}
      />
    </div>
  );
}
