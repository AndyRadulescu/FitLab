import React from 'react';
import { Activity, Camera, LineChart } from 'lucide-react';

export default function WhatIOfferSection() {
  return (
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
  );
}
