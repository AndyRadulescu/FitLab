import React from 'react';

export const metadata = {
  title: 'Terms of Use | Amazonia Fitlab',
  description: 'The rules and guidelines for using the Amazonia Fitlab platform.',
};

export default function TermsOfUse() {
  const lastUpdated = "February 15, 2026";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20 text-whie">
      <header className="border-b border-slate-200 pb-8 mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
          Terms of Use
        </h1>
        <p className="text-sm text-slate-500">
          Last Updated: {lastUpdated}
        </p>
      </header>

      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <p className="leading-relaxed">
            Welcome to <strong>Amazonia Fitlab</strong>. By accessing or using our website and services,
            you agree to be bound by these Terms of Use. If you do not agree to these terms,
            please do not use our platform.
          </p>
        </section>

        <section className="bg-slate-700 border-l-4 border-red-400 p-6 rounded-r-md">
          <h2 className="text-xl font-semibold mt-0"><span className="text-red-600">1.</span> Medical Disclaimer</h2>
          <p className="mb-0">
            Amazonia Fitlab provides fitness and wellness information for educational purposes only.
            This is <strong>not medical advice</strong>. Always consult your physician before starting
            any new exercise program. You voluntarily assume all risks associated with physical activity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">2. Eligibility</h2>
          <p>
            You must be at least 18 years of age to use this service. By using our platform,
            you represent that you have the legal capacity to enter into this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
          <p>
            All content, including workout plans, videos, and logos, is the property of Amazonia Fitlab.
            We grant you a personal, non-commercial license to view our content.
            Redistribution or "scraping" of our data is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
          <p>
            Amazonia Fitlab shall not be liable for any injuries or damages resulting from your
            use of the service. Our liability is limited to the maximum extent permitted by law
            in your jurisdiction.
          </p>
        </section>

        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
          <p>
            Questions regarding these terms should be sent to:
            <br />
            <span className="font-semibold">andyradulescu@synapselabs.org</span>
          </p>
        </section>
      </div>
    </div>
  );
}
