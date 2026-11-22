import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

export function PricingSection() {
  const setupPrice = process.env.NEXT_PUBLIC_SETUP_PRICE || "25,000";

  const coreDeliverables = [
    "Ready-to-import n8n workflow JSON (all 18 nodes configured)",
    "Meta WhatsApp Cloud API setup & verified business number",
    "Pre-approved Meta utility message templates for 1-hr reminders",
    "Google Calendar integration (one calendar per doctor)",
    "Google Sheets Appointments_Register & 4-tab template",
    "OpenAI GPT AI assistant configured for Hinglish, Hindi & English",
    "Emergency safety protocol & immediate staff escalation routing",
    "Double-booking prevention engine & race-condition check",
    "Nightly 9:00 PM Daily Report email sent to clinic owner",
    "Complete 50-booking stress test and reception staff handover",
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#FCF8FA] dark:bg-[#0D0B12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-pink-100 dark:bg-pink-950/80 text-[#8B1E3F] dark:text-[#EA96AC] mb-3 border border-pink-200 dark:border-pink-900">
            <span>Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
            One-time setup. Lifetime automation.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            No expensive monthly software lock-ins. You own the n8n workflow, the Google Calendar, and the Sheets database.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Main Card: Rs. 25,000 Turnkey Setup */}
          <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl glass-card border-2 border-[#8B1E3F] shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-[#8B1E3F] text-white text-xs font-bold font-mono tracking-wide shadow-md">
              MOST POPULAR &bull; COMPLETE TURNKEY
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                    Per-Clinic One-Time Setup
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Deployed and handed over in 4 to 7 working days.
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-[#8B1E3F] dark:text-[#EA96AC] font-mono">
                    ₹{setupPrice}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">/ one-time</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-mono font-bold uppercase text-zinc-400 mb-3">
                  What is included in the Rs. 25,000 package:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {coreDeliverables.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero double-booking test passed before payment</span>
              </div>
              <Link
                href="/book-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#8B1E3F] to-[#A82B51] hover:from-[#7A1A37] hover:to-[#8B1E3F] shadow-md shadow-[#8B1E3F]/25 transition-all text-sm"
              >
                <span>Book Setup Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Optional Add-on Card: Monthly Maintenance */}
          <div className="lg:col-span-4 p-8 rounded-3xl glass-card border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                OPTIONAL ADD-ON
              </span>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mt-4">
                Monthly Care Retainer
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                For clinics that prefer fully managed cloud hosting & updates.
              </p>

              <div className="my-6">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white font-mono">
                  ₹2,999
                </span>
                <span className="text-xs text-zinc-500 font-medium"> / month</span>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8B1E3F] shrink-0 mt-0.5" />
                  <span>Managed 99.9% uptime n8n cloud VPS</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8B1E3F] shrink-0 mt-0.5" />
                  <span>24x7 automated server monitoring & alerts</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8B1E3F] shrink-0 mt-0.5" />
                  <span>Doctor schedule & holiday change updates</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8B1E3F] shrink-0 mt-0.5" />
                  <span>WhatsApp template renewals with Meta</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8B1E3F] shrink-0 mt-0.5" />
                  <span>Priority WhatsApp support for reception staff</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/book-demo"
                className="w-full block text-center py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
              >
                Inquire With Setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
