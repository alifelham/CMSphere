import React from 'react';

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        background: 'transparent',
      }}
    >
      {/* Optimizely logo at top left */}
      <a href="/">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ height: '40px', marginRight: '1rem' }}
        />
      </a>
      {/* Add more navigation or branding if desired */}
    </header>
  );
}
