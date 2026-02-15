import React from 'react';
import Link from 'next/link';
import { Beaker, Activity, Camera, LineChart, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="auth-theme-trigger min-h-screen bg-black text-white selection:bg-primary selection:text-white">

      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {/* LOGO: A minimalist "A" with a lab beaker flask integrated */}
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
            <Beaker className="text-black w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">
            Amazonia <span className="text-primary">FitLab</span>
          </span>
        </div>
        <a
          href="https://app.amazonia-fitlab.ro/auth/login"
          className="text-sm font-bold hover:text-primary transition-colors border-b border-white/10 pb-1"
        >Sign In
        </a>
      </nav>

      <main className="relative pt-12 pb-20 px-6 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-500 blur-[120px] rounded-full -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold mb-6">
            Precision Fitness Tracking
          </h2>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Balance is <span className="italic text-primary">everything.</span><br />
            Science is <span className="text-primary">all.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Amazonia FitLab isn't just an app; it's a digital laboratory for your body.
            Quantify your mood, track every centimeter of progress, and master the metrics that matter.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.amazonia-fitlab.ro/auth/register"
              className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-primary transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Your Lab Report <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </main>

      {/* --- FEATURES GRID --- */}
      <section className="px-6 py-24 bg-zinc-950/50 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold">Biometric Precision</h3>
            <p className="text-gray-500">
              Beyond the scale. Track body circumferences, mood fluctuations, and physical energy levels to see the full biological picture.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
              <Camera size={24} />
            </div>
            <h3 className="text-xl font-bold">Visual Evidence</h3>
            <p className="text-gray-500">
              Secure progress photos. Our storage logic ensures your visual transformation is stored with clinical privacy and ready for side-by-side analysis.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
              <LineChart size={24} />
            </div>
            <h3 className="text-xl font-bold">Data-Driven Evolution</h3>
            <p className="text-gray-500">
              Turn your daily check-ins into actionable trends. Observe how your mood correlates with your physical performance.
            </p>
          </div>

        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="px-6 py-32 text-center max-w-4xl mx-auto">
        <blockquote className="text-2xl md:text-4xl font-light italic text-gray-300">
          "The wildest jungle is the human biology. We provide the tools to navigate it with surgical precision."
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 bg-primary"></div>
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Amazonia Philosophy</span>
          <div className="h-[1px] w-8 bg-primary"></div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="px-6 py-12 border-t border-zinc-900 text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm">
            &copy; 2026 AMAZONIA FITLAB. SCIENCE-BACKED FITNESS.
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of use</Link>
            <Link href="/data-deletion" className="hover:text-white">Data Deletion</Link>
            <a href="mailto:andyradulescu@synapselabs.org" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
