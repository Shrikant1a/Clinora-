"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { AlertTriangle, Clock, MessageSquareX, PhoneMissed, Users } from "lucide-react";

export function ProblemSection() {
  const [inboxCount, setInboxCount] = useState(0);

  useEffect(() => {
    // Animate counter 0 -> 58
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= 58) {
        setInboxCount(58);
        clearInterval(interval);
      } else {
        setInboxCount(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#FCF8FA] dark:bg-[#0D0B12] relative overflow-hidden border-t border-b border-pink-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 mb-3 border border-red-200 dark:border-red-900">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Daily Clinic Nightmare</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
            50-60 requests a day.{" "}
            <span className="text-red-600 dark:text-red-400 underline decoration-red-300 dark:decoration-red-800">
              6 hours of receptionist chaos.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            When receptionists book manually between phone calls and physical patients, human errors are inevitable: missed messages, scheduling clashes, and patients leaving for other clinics.
          </p>
        </div>

        {/* Visual Comparison: The Chaotic Clinic Inbox & Register Mock */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left: Animated WhatsApp Clinic Inbox Mock with 58 Pending */}
          <div className="lg:col-span-5 rounded-3xl glass-card p-6 shadow-xl border border-red-200 dark:border-red-900/50 relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-sm text-[#1B1B1F] dark:text-white">
                  Clinic Reception WhatsApp
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                {inboxCount} PENDING
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Message 1 */}
              <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/60 shadow-sm relative">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">+91 98201 11223</span>
                  <span>10:12 AM</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                  "Hi doctor ki appointment chahiye urgent fever hai"
                </p>
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[9px] font-bold font-mono bg-amber-500 text-white rounded-full">
                  UNANSWERED
                </span>
              </div>

              {/* Message 2 */}
              <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/60 shadow-sm relative">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">+91 98203 33445</span>
                  <span>09:45 AM</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300">
                  "Dr. Mehta kal subah 10 baje free hain kya?"
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-600 font-semibold">
                  <Clock className="w-3 h-3" />
                  <span>Waiting for 45 mins &bull; Left on read</span>
                </div>
              </div>

              {/* Message 3 - Missed Call */}
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                    <PhoneMissed className="w-4 h-4" />
                    <span>Missed Call (3 calls)</span>
                  </div>
                  <span className="font-mono text-[10px] text-red-500 font-bold">MISSED</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                  Patient tried calling while receptionist was billing at desk.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-xs font-mono text-red-600 dark:text-red-400 font-semibold">
                &uarr; 55 more patients waiting in queue
              </span>
            </div>
          </div>

          {/* Right: The Chaotic Appointments Register with Red CLASH */}
          <div className="lg:col-span-7 rounded-3xl glass-card p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1B1B1F] dark:text-white font-mono">
                  Appointments_Register (Manual Sheet)
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-red-100 text-red-700 border border-red-200">
                2 DOUBLE-BOOKINGS DETECTED
              </span>
            </div>

            {/* Table Simulation */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700 text-zinc-500">
                    <th className="py-2 font-mono">Time</th>
                    <th className="py-2">Patient</th>
                    <th className="py-2">Doctor</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
                  {/* Normal row */}
                  <tr>
                    <td className="py-2.5 font-mono">09:00 AM</td>
                    <td className="py-2.5">Sunita Deshmukh</td>
                    <td className="py-2.5">Dr. Mehta</td>
                    <td className="py-2.5 text-emerald-600">Completed</td>
                  </tr>

                  {/* Clash Row 1 */}
                  <tr className="bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 font-bold border-l-4 border-l-red-600">
                    <td className="py-2.5 pl-2 font-mono">09:30 AM</td>
                    <td className="py-2.5">Rahul Verma</td>
                    <td className="py-2.5">Dr. Mehta</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px]">
                        CLASH
                      </span>
                    </td>
                  </tr>

                  {/* Clash Row 2 */}
                  <tr className="bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 font-bold border-l-4 border-l-red-600">
                    <td className="py-2.5 pl-2 font-mono">09:30 AM</td>
                    <td className="py-2.5">Priya Patel</td>
                    <td className="py-2.5">Dr. Mehta</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px]">
                        CLASH
                      </span>
                    </td>
                  </tr>

                  {/* Normal row */}
                  <tr>
                    <td className="py-2.5 font-mono">10:00 AM</td>
                    <td className="py-2.5">Amit Shah</td>
                    <td className="py-2.5">Dr. Sharma</td>
                    <td className="py-2.5 text-zinc-500">No-show (No reminder sent)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pain Points Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-center">
                <span className="text-xl font-extrabold text-red-600 font-mono">6 Hrs/Day</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Receptionist manual scheduling</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-center">
                <span className="text-xl font-extrabold text-amber-600 font-mono">3 Hrs/Day</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Wasted sending manual reminders</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-center">
                <span className="text-xl font-extrabold text-red-600 font-mono">15-20%</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Patient no-shows due to no reminder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
