import React from 'react';
import { ChevronRight } from 'lucide-react';

export function StartButton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <a
        href="#what-i-offer"
        className="px-8 py-3 w-full max-w-96 text-black font-bold rounded-full text-lg primary-gradient transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        Learn More <ChevronRight size={20} />
      </a>
    </div>
  );
}

export default function HeroSection() {
  return (
    <main className="hero-section min-h-svh md:min-h-[90vh] flex items-center px-6 md:py-24">
      <div className="max-w-7xl mx-auto w-full min-h-[80dvh] md:min-h-0 flex flex-col md:flex-row items-center">
        <div className="max-w-2xl lg:max-w-3xl flex flex-col flex-1 md:flex-none w-full pb-8 md:pb-0 items-center md:items-start">
          {/* Eyebrow / Kicker */}
          <div className="mt-48 md:mt-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-transparent border border-zinc-800 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 mb-6 w-fit backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Personalized Fitness & Nutrition
          </div>

          {/* H1 Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-left md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.12]">
            Fitness & nutrition customized for you, based on
            <span className="primary-text-gradient"> current science </span>
          </h1>

          {/* Lead Description */}
          <p className="text-zinc-400 text-sm md:text-xl max-w-2xl mb-10 leading-relaxed">
            Premium workout and nutrition plans, built on the highest quality
            science, tailored to your unique needs, lifestyle, without
            restrictions and absurd diets.
          </p>

          {/* CTA Button: Bottom on mobile, normal flow on desktop */}
          <div className="mt-auto md:mt-0 w-full">
            <StartButton />
          </div>
        </div>
      </div>
    </main>
  );
}
