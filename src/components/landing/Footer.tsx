import Link from "next/link";
import { ClinoraLogo } from "@/components/ClinoraLogo";
import { CalendarCheck2, Heart, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-[#0A080F] border-t border-pink-100 dark:border-zinc-800 py-12 text-zinc-600 dark:text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <ClinoraLogo size="md" href="/" />
            <p className="max-w-sm text-xs leading-relaxed text-zinc-500">
              Clinora is the turnkey automation pipeline connecting WhatsApp, n8n, Google Calendar, and Google Sheets. Designed for doctors across India to reclaim front-desk peace of mind.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>DPDP Act 2023 & Meta WhatsApp Cloud API Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-200 mb-3 text-xs uppercase tracking-wider font-mono">
              Product
            </h4>
            <ul className="space-y-2">
              <li><Link href="#how-it-works" className="hover:text-[#8B1E3F] transition-colors">How It Works</Link></li>
              <li><Link href="/demo" className="hover:text-[#8B1E3F] transition-colors">Interactive Simulator</Link></li>
              <li><Link href="#features" className="hover:text-[#8B1E3F] transition-colors">Features & Safety</Link></li>
              <li><Link href="#roi" className="hover:text-[#8B1E3F] transition-colors">ROI Calculator</Link></li>
              <li><Link href="#pricing" className="hover:text-[#8B1E3F] transition-colors">Rs. 25,000 Setup</Link></li>
            </ul>
          </div>

          {/* Admin & Portals */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-200 mb-3 text-xs uppercase tracking-wider font-mono">
              Access
            </h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-[#8B1E3F] transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/book-demo" className="hover:text-[#8B1E3F] transition-colors">Book a Demo</Link></li>
              <li><Link href="/dashboard/reports" className="hover:text-[#8B1E3F] transition-colors">9 PM Daily Report Sample</Link></li>
              <li><Link href="/api/health" className="hover:text-[#8B1E3F] transition-colors font-mono text-[11px]">System Health API</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} Clinic Automation. All rights reserved. Medical emergency calls must be directed to local emergency helplines.
          </p>
          <p className="flex items-center gap-1 font-mono">
            <span>Built with precision for healthcare</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
