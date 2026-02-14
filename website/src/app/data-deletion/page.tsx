import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion Instructions - Amazonia FitLab',
};

export default function DataDeletionPage() {
  return (
    <div className="auth-theme-trigger min-h-screen bg-black text-gray-300 selection:bg-primary">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">

        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Data Deletion <span className="text-primary">Guide</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Instructions on how to manage, export, and permanently remove your fitness data and photos from our servers.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          <main className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
                How to Delete Your Account
              </h2>
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold">1</span>
                  <p>Open the <strong className="text-white">Amazonia FitLab</strong> app and log in to your account.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold">2</span>
                  <p>Navigate to your <strong className="text-white">Profile Settings</strong> by tapping the user icon.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold">3</span>
                  <p>Scroll to the <strong className="text-red-500">"Danger Zone"</strong> at the bottom of the page.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center font-bold">4</span>
                  <p>Select <strong className="text-white">"Delete Account"</strong> and confirm your password when prompted.</p>
                </li>
              </ol>
            </section>

            <section className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-3">What happens next?</h3>
              <p className="text-sm leading-relaxed">
                Our automated cleanup strategy will immediately trigger. This process wipes your
                <strong> Authentication Record</strong>, all <strong>Firestore Documents</strong> (check-ins,
                body metrics, and start data), and permanently removes all <strong>Cloud Storage Photos</strong>.
              </p>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="relative aspect-[9/16] w-full max-w-[300px] mx-auto rounded-3xl border-[8px] border-zinc-800 overflow-hidden bg-zinc-900 shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-center p-8 italic">
                  <Image src="/data-deletion.jpg" alt="Delete account screenshot" fill className="object-cover" />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 italic">
              Visual guide: Locating the delete button in your profile settings.
            </p>
          </aside>
        </div>

        <section className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8">Data Erasure Scope</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-4 font-semibold text-primary">Data Category</th>
                <th className="py-4 font-semibold text-primary">Storage Type</th>
                <th className="py-4 font-semibold text-primary">Outcome</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
              <tr>
                <td className="py-4 text-white">Identity (Email/UID)</td>
                <td className="py-4">Firebase Auth</td>
                <td className="py-4">Immediate Termination</td>
              </tr>
              <tr>
                <td className="py-4 text-white">Progress Photos</td>
                <td className="py-4">Cloud Storage</td>
                <td className="py-4">Permanent Deletion</td>
              </tr>
              <tr>
                <td className="py-4 text-white">Check-in Logs</td>
                <td className="py-4">Firestore</td>
                <td className="py-4">Permanent Deletion</td>
              </tr>
              <tr>
                <td className="py-4 text-white">Analytics Profile</td>
                <td className="py-4">Google Analytics</td>
                <td className="py-4">Anonymized / Deleted</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-zinc-900 text-center">
          <p className="text-gray-600 mb-4">Cannot access your account? We can help.</p>
          <a href="mailto:support@amazonia-fitlab.com" className="bg-white text-black px-8 py-3 rounded-full font-bold">
            Contact Support for Manual Deletion
          </a>
        </footer>
      </div>
    </div>
  );
}
