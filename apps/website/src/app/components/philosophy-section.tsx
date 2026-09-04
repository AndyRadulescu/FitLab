import React from 'react';

export default function PhilosophySection() {
  return (
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
  );
}
