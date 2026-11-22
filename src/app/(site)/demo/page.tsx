import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppSimulator } from "@/components/demo/WhatsAppSimulator";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8FA] dark:bg-[#0D0B12]">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#8B1E3F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Pipeline Active
            </div>
          </div>

          <div className="mt-6 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
              Clinora: WhatsApp AI Appointment Simulator
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Test real conversation states, doctor schedule lookups, 1-hour prior reminders, and collision prevention.
            </p>
          </div>
        </div>

        <WhatsAppSimulator isStandalone={true} />
      </main>

      <Footer />
    </div>
  );
}
