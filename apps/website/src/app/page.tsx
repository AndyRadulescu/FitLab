import React from 'react';
import Image from 'next/image';
import { Activity, Camera, LineChart, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="auth-theme-trigger min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      {/* --- NAVIGATION --- */}
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

      {/* --- HERO SECTION (ZERO ABSOLUTE CLASSES) --- */}
      <main className="hero-section min-h-[85vh] md:min-h-[90vh] flex items-center px-6 py-16 md:py-24">
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

      {/* --- WHAT I OFFER / FEATURES GRID --- */}
      <section
        id="what-i-offer"
        className="px-6 py-24 bg-zinc-950/50 border-y border-zinc-900 scroll-mt-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">
              What I Offer
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              A Sustainable, Science-Driven Program
            </h3>
            <p className="text-gray-400 text-base md:text-lg">
              No generic templates. Every plan is built around your individual
              biology, lifestyle, and progressive goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
                <Activity size={24} />
              </div>
              <h4 className="text-xl font-bold">Custom Nutrition & Workouts</h4>
              <p className="text-gray-400">
                Tailored programming that adapts to your metabolism and routine.
                Enjoy sustainable progress without rigid food bans.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
                <Camera size={24} />
              </div>
              <h4 className="text-xl font-bold">Objective Progress Tracking</h4>
              <p className="text-gray-400">
                Track circumferences, visual changes, and performance markers to
                ensure continuous adaptation and real results.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
                <LineChart size={24} />
              </div>
              <h4 className="text-xl font-bold">1-on-1 Continuous Guidance</h4>
              <p className="text-gray-400">
                Direct coaching adjustments based on your feedback, mood, and
                recovery metrics to keep you moving forward safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="px-6 py-32 text-center max-w-4xl mx-auto">
        <blockquote className="text-2xl md:text-4xl font-light italic text-gray-300">
          "The wildest jungle is the human biology. We provide the tools to
          navigate it with surgical precision."
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 primary-gradient"></div>
          <span className="primary-text-gradient font-bold tracking-widest uppercase text-sm">
            Amazonia Philosophy
          </span>
          <div className="h-[1px] w-8 primary-gradient"></div>
        </div>
      </section>
    </div>
  );
}
