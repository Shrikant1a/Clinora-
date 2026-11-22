"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, TrendingUp, Sparkles, Clock, IndianRupee } from "lucide-react";

export function RoiCalculator() {
  const [dailyPatients, setDailyPatients] = useState(55);

  // 55 patients * 6 minutes/patient = 330 mins (5.5 hrs) manual
  // Automated: ~0.5 hr/day for receptionist exception handling
  const manualHoursPerDay = (dailyPatients * 6) / 60;
  const automatedHoursPerDay = 0.5;
  const hoursSavedPerDay = Math.max(0, manualHoursPerDay - automatedHoursPerDay);
  const hoursSavedPerMonth = Math.round(hoursSavedPerDay * 26);
  // Average receptionist hourly rate in Indian tier-1/2 cities ~ Rs. 150/hr
  const monthlySavingsInr = Math.round(hoursSavedPerMonth * 150);

  return (
    <section id="roi" className="py-20 md:py-28 bg-[#FCF8FA] dark:bg-[#0D0B12] relative overflow-hidden border-t border-zinc-200/60 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 mb-3 border border-emerald-200 dark:border-emerald-800">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Measurable Return On Investment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
            Manual 6 hours &rarr;{" "}
            <span className="text-emerald-600 dark:text-emerald-400">Automated 0.5 hour</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Cut receptionist workload by 87%. Eliminate missed patient calls after 7 PM, and recover your Rs. 25,000 setup cost in under 45 days.
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Manual Workflow Card */}
          <div className="p-8 rounded-3xl glass-card border border-red-200 dark:border-red-900/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                  WITHOUT AUTOMATION
                </span>
                <span className="text-sm font-bold text-red-600">~6.0 hrs/day</span>
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-4">
                Manual Front-Desk Stress
              </h3>

              <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>50-60 WhatsApp chats & calls answered by hand</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Double-bookings occur during busy outpatient rushes</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>No response to evening patient queries after 7:00 PM</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>3 hours daily spent typing manual WhatsApp reminders</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-red-100 dark:border-red-900/40">
              <div className="flex justify-between text-xs font-mono text-zinc-500 mb-1">
                <span>Receptionist Availability</span>
                <span>Limited to 8 hrs</span>
              </div>
              <div className="w-full h-3 bg-red-100 dark:bg-red-950/60 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-[35%]" />
              </div>
            </div>
          </div>

          {/* Automated Pipeline Card */}
          <div className="p-8 rounded-3xl glass-card border border-emerald-300 dark:border-emerald-800 shadow-xl shadow-emerald-600/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                  WITH CLINORA
                </span>
                <span className="text-sm font-bold text-emerald-600 font-mono">0.5 hr/day</span>
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-4">
                Automated 24x7 Pipeline
              </h3>

              <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>24x7 instant replies</strong> under 5 seconds, even at 11 PM</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero double-bookings</strong> via atomic Calendar locks</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Automatic 1-hour reminders</strong> slashes patient no-shows</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>9:00 PM Daily Report</strong> delivered directly to owner's Gmail</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-100 dark:border-emerald-900/40">
              <div className="flex justify-between text-xs font-mono text-emerald-800 dark:text-emerald-400 font-bold mb-1">
                <span>Workload Reduction</span>
                <span>87% Saved</span>
              </div>
              <div className="w-full h-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "87%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#10B981] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive ROI Savings Calculator */}
        <div className="max-w-3xl mx-auto p-8 rounded-3xl glass-card border border-pink-200 dark:border-zinc-800">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Calculate your clinic's monthly savings
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Drag the slider to adjust your daily appointment volume.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-mono font-bold">
              <span>Daily Patient Volume:</span>
              <span className="text-lg text-[#8B1E3F] dark:text-[#EA96AC]">
                {dailyPatients} inquiries/day
              </span>
            </div>

            <input
              type="range"
              min="20"
              max="120"
              value={dailyPatients}
              onChange={(e) => setDailyPatients(Number(e.target.value))}
              className="w-full accent-[#8B1E3F] h-2 bg-pink-100 dark:bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>20 (Small Clinic)</span>
              <span>55 (Average Practice)</span>
              <span>120+ (Large Hospital)</span>
            </div>
          </div>

          {/* Results Counters */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/80 text-center">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase">
                Staff Hours Saved
              </span>
              <div className="text-3xl font-extrabold text-[#8B1E3F] dark:text-[#EA96AC] font-mono mt-1">
                {hoursSavedPerMonth} hrs/mo
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Freed for physical patient care & billing
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 text-center">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase">
                Estimated Value Saved
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1 flex items-center justify-center">
                <span>₹{monthlySavingsInr.toLocaleString()}</span>
                <span className="text-sm font-normal text-zinc-500 ml-1">/mo</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Recovers the Rs. 25,000 setup fee in ~40 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
