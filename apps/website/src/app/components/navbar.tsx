import React from 'react';

export default function Navbar() {
  return (
    <nav className="relative z-30 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <span className="text-xl font-black tracking-tighter uppercase italic">
          Amazonia <span className="primary-text-gradient">FitLab</span>
        </span>
      </div>
      <a
        href="https://app.amazonia-fitlab.ro/auth/login"
        className="text-sm font-bold hover:text-primary transition-colors border-b border-white/10 pb-1"
      >
        Sign In
      </a>
    </nav>
  );
}
