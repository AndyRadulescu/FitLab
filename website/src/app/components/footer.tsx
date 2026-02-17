import Link from 'next/link';

export default function Footer() {
  return (
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
  )
}
