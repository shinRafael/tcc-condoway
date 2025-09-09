import React from 'react';

// Global styled page header. Styles are defined in src/styles/globals.css
// Usage:
// <PageHeader title="Controle de Visitantes" rightContent={<YourRightSide />} />
export default function PageHeader({ title, rightContent }) {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-header__title">{title}</h1>
        {rightContent ? <div className="page-header__right">{rightContent}</div> : null}
      </div>
    </div>
  );
}
