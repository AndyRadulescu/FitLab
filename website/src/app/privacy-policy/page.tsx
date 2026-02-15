import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Amazonia FitLab',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300 selection:bg-primary selection:text-white">

      <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20">
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-gray-500 font-medium">
            Amazonia - FitLab • Effective Date: February 14, 2026
          </p>
        </header>

        <main className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-primary">1.</span> Information We Collect
            </h2>
            <p>To provide a personalized fitness tracking experience, we collect the following:</p>
            <ul className="list-disc ml-6 mt-4 space-y-3 marker:text-primary">
              <li><strong className="text-white">Account Data:</strong> Email address and name provided during sign-up via Firebase Authentication.</li>
              <li><strong className="text-white">Progress Photos:</strong> Photos you upload to track your physical transformation.</li>
              <li><strong className="text-white">Fitness Data:</strong> Check-in logs, measurements, and "start" data stored in our database.</li>
              <li><strong className="text-white">Usage Data:</strong> Basic analytics regarding how you interact with the app.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-primary">2.</span> How We Use Your Photos
            </h2>
            <p>Your privacy is our priority. Photos uploaded to Amazonia - FitLab are used <span className="italic text-white underline decoration-primary underline-offset-4">strictly</span> for:</p>
            <ul className="list-disc ml-6 mt-4 space-y-3 marker:text-primary">
              <li>Displaying your progress within your private dashboard.</li>
              <li>Generating side-by-side comparisons of your fitness journey.</li>
              <li className="text-gray-400 italic">
                Note: We do not use your photos for marketing, AI training, or public display without your explicit, separate consent.
              </li>
            </ul>
          </section>

          <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-500 font-bold">4.</span> Data Retention & Deletion
            </h2>
            <p className="mb-4">You have full control over your data:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-1">Manual Deletion</h3>
                <p className="text-sm">Delete individual check-ins or photos at any time within the app.</p>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-1">Account Wipe</h3>
                <p className="text-sm">Use the "Danger Zone" in settings to permanently erase your entire history.</p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-800 pt-8">
            <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p>
              If you have questions about this policy or encountered an error, please contact our team:
            </p>
            <a
              href="mailto:andyradulescu@synapselabs.org"
              className="inline-block mt-4 text-primary hover:text-white transition-colors font-medium underline underline-offset-4"
            >
              support@amazonia-fitlab.com
            </a>
          </section>
        </main>

        <footer className="mt-20 text-center text-gray-600 text-xs tracking-widest uppercase">
          &copy; 2026 Amazonia - FitLab
        </footer>
      </div>
    </div>
  );
}
