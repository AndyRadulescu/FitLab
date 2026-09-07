import React from 'react';
import HeroSection from './components/hero-section';
import WhatIOfferSection from './components/what-i-offer';
import PhilosophySection from './components/philosophy-section';

export default function LandingPage() {
  return (
    <div className="auth-theme-trigger min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <HeroSection />
      <WhatIOfferSection />
      <PhilosophySection />
    </div>
  );
}
