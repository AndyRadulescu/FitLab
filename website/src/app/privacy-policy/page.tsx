import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Amazonia - FitLab',
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
            <p>Your privacy is our priority. Photos uploaded to Amazonia - FitLab are stored securely and used <span className="italic text-white underline decoration-primary underline-offset-4">strictly</span> for:</p>
            <ul className="list-disc ml-6 mt-4 space-y-3 marker:text-primary">
              <li>Displaying your progress within your private dashboard.</li>
              <li>Generating side-by-side comparisons of your fitness journey.</li>
              <li className="text-gray-400 italic">
                Note: Photos are never shared with third-party analytics (like Google Analytics) or used for marketing, AI training, or public display without your explicit, separate consent.
              </li>
            </ul>
          </section>

          {/*GENERAL deletion*/}
          <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl overflow-hidden">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-500 font-bold">3.</span> Data Retention & Deletion
            </h2>
            <p className="mb-4 text-zinc-300 text-sm">You have full control over your data and how long we keep it:</p>

            <div className="flex flex-col gap-4">
              {/* Top Row: Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                  <h3 className="text-white font-medium mb-1 text-sm">Manual Deletion</h3>
                  <p className="text-xs text-zinc-400">Delete individual check-ins or photos at any time within the app.</p>
                </div>

                <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                  <h3 className="text-white font-medium mb-1 text-sm">Account Wipe</h3>
                  <p className="text-xs text-zinc-400">Use the "Danger Zone" in settings to permanently erase your entire history, including all social login associations.</p>
                </div>
              </div>

              {/* Bottom Row: Contact - Fixed for mobile overflow */}
              <div className="p-4 bg-red-900/10 rounded-lg border border-red-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
                <div className="min-w-0">
                  <h3 className="text-white font-medium text-sm">Request Manual Data Deletion</h3>
                  <p className="text-xs text-zinc-400">For a full account purge, contact our support team:</p>
                </div>
                <a
                  href="mailto:radulescu.eduard.andrei@gmail.com"
                  className="text-[13px] md:text-sm font-mono text-red-500 hover:underline bg-black/20 px-3 py-1.5 rounded border border-red-900/20 break-words text-center sm:text-left"
                >
                  radulescu.eduard.andrei@gmail.com
                </a>
              </div>
            </div>
          </section>

          {/*GOOGLE*/}
          <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mt-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400 font-bold">4.</span> Google API Disclosure & Privacy
            </h2>

            <p className="mb-4 text-zinc-300">
              Amazonia - FitLab integrates with Google Services to provide a secure and seamless authentication experience.
              To comply with Google's security standards and ensure your data remains private, we adhere to the following:
            </p>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-2">Google Limited Use Policy</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Amazonia - FitLab's use and transfer of information received from Google APIs to any other app will adhere to the
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:underline ml-1"
                  >
                    Google API Services User Data Policy
                  </a>,
                  including the Limited Use requirements. We do not sell your Google user data to third parties,
                  nor do we use it for serving advertisements or performing credit worthiness checks.
                </p>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-1">Data Accessed & Purpose</h3>
                <p className="text-sm text-zinc-400">
                  We only access your Google <strong>email address</strong> and <strong>profile picture</strong>.
                  This data is used exclusively to create your secure account, facilitate logins, and personalize
                  your fitness dashboard. We do not request access to your contacts, files, or any other sensitive scopes.
                </p>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-1">Data Retention & Deletion</h3>
                <p className="text-sm text-zinc-400">
                  Your Google data is stored only as long as your account is active. You may revoke access at any time
                  via your Google Security Settings. To permanently delete your Amazonia - FitLab account and all
                  associated Google data from our servers, please contact us at
                  <span className="text-red-400 ml-1">radulescu.eduard.andrei@gmail.com</span>,
                  or do it yourself by following the instructions in our <Link href="/data-deletion" className="text-red-400 ml-1 hover:underline">Data Deletion Guide</Link>.
                </p>
              </div>
            </div>
          </section>

          {/*FACEBOOK*/}
          <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mt-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-500 font-bold">5.</span> Facebook API Disclosure
            </h2>

            <p className="mb-4 text-zinc-300">
              Our application provides an option to sign in using your Facebook account. To protect your data and comply with
              Meta's Platform Terms, we disclose the following:
            </p>

            <div className="grid gap-4 md:grid-cols-1">
              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-1">Information Received</h3>
                <p className="text-sm text-zinc-400">
                  When you use "Login with Facebook," we receive your <strong>public profile</strong> (name and profile picture)
                  and <strong>email address</strong>. This information is used solely to authenticate your account and
                  set up your Amazonia - FitLab profile. We do not post to your timeline or access your friends list.
                </p>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-1 text-sm">Data Retention & Deletion</h3>
                <p className="text-sm text-zinc-400">
                  According to Meta's Platform Terms, we provide a way for you to request the deletion of your data.
                  Your Facebook data is stored only as long as your account is active. To permanently delete your
                  Amazonia - FitLab account and all associated Facebook data from our servers, please contact us at
                  <span className="text-blue-400 ml-1 break-all">radulescu.eduard.andrei@gmail.com</span>,
                  or do it yourself by following the instructions in our
                  <Link href="/data-deletion" className="text-blue-400 ml-1 hover:underline">Data Deletion Guide</Link>.
                </p>
              </div>

              <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
                <h3 className="text-white font-medium mb-1">Compliance & Sharing</h3>
                <p className="text-sm text-zinc-400">
                  We do not sell, trade, or otherwise transfer your Facebook user data to outside parties.
                  Our data handling practices comply with the
                  <a
                    href="https://developers.facebook.com/terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline ml-1"
                  >
                    Meta Platform Terms
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-primary">6.</span> Third-Party Service Providers
            </h2>
            <p>We use trusted third-party services to operate our laboratory:</p>
            <ul className="list-disc ml-6 mt-4 space-y-3 marker:text-primary">
              <li><strong className="text-white">Google Firebase:</strong> For authentication, database hosting, and secure photo storage.</li>
              <li><strong className="text-white">Google Analytics:</strong> To understand app performance and improve user experience.</li>
              <li><strong className="text-white">Meta (Facebook):</strong> To facilitate optional social authentication.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-primary">7.</span> Children's Privacy
            </h2>
            <p>
              Amazonia - FitLab is not intended for individuals under the age of 18. We do not knowingly collect personal identifiable
              information from children under 13. If we discover that a child under 13 has provided us with personal information,
              we immediately delete this from our servers.
            </p>
          </section>

          <section className="border-t border-gray-800 pt-8">
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p>
              If you have questions about this policy or encountered an error, please contact our team:
            </p>
            <a
              href="mailto:radulescu.eduard.andrei@gmail.com"
              className="inline-block mt-4 text-primary hover:text-white transition-colors font-medium underline underline-offset-4"
            >
              radulescu.eduard.andrei@gmail.com
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
