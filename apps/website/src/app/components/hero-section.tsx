import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <main className="hero-section min-h-svh md:min-h-[90vh] flex items-center px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto w-full flex items-center">
        <div className="max-w-2xl lg:max-w-3xl flex flex-col">
          {/* Eyebrow / Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 mb-6 w-fit backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Personalized Fitness & Nutrition
          </div>

          {/* H1 Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.12]">
            Fitness & nutrition customized for you, based on{' '}
            <span className="primary-text-gradient">current science.</span>
          </h1>

          {/* Sub-headline / Punchline */}
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-200 mb-6 leading-snug">
            Find the right balance for you—
            <span className="italic text-white">
              without restrictions and absurd diets.
            </span>
          </p>

          {/* Lead Description */}
          <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Premium workout and nutrition plans, built on the highest quality
            science, tailored to your unique needs, lifestyle, and
            individuality.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <a
              href="#what-i-offer"
              className="px-8 py-4 text-black font-bold rounded-full text-lg primary-gradient transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Learn More <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
