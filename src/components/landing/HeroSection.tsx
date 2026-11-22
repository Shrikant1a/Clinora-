"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Cpu, Calendar, Table2, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

export function HeroSection() {
  const tools = [
    { name: "WhatsApp", icon: "💬", color: "from-emerald-500 to-green-600", delay: 0 },
    { name: "n8n", icon: "⚡", color: "from-rose-500 to-orange-500", delay: 1.2 },
    { name: "Google Calendar", icon: "📅", color: "from-blue-500 to-indigo-600", delay: 2.4 },
    { name: "Google Sheets", icon: "📊", color: "from-emerald-600 to-teal-700", delay: 0.8 },
    { name: "OpenAI GPT", icon: "🧠", color: "from-purple-500 to-pink-600", delay: 1.8 },
    { name: "Make", icon: "🔄", color: "from-violet-600 to-indigo-700", delay: 3.0 },
    { name: "Zapier", icon: "✨", color: "from-amber-500 to-orange-600", delay: 2.1 },
    { name: "Firebase", icon: "🔥", color: "from-yellow-500 to-amber-600", delay: 1.5 },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-[#FFF5F7] via-[#FAF5FF] to-[#FCF8FA] dark:from-[#0F0D15] dark:via-[#161220] dark:to-[#0D0B12]">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#8B1E3F]/15 to-[#DE4E76]/10 rounded-full blur-3xl pointer-events-none dark:from-[#8B1E3F]/25 dark:to-purple-900/20" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Tool Icons with Parallax Drift */}
      <div className="absolute inset-0 max-w-7xl mx-auto overflow-hidden pointer-events-none">
        {tools.map((tool, idx) => {
          const positions = [
            "top-16 left-6 md:left-12",
            "top-28 right-8 md:right-20",
            "bottom-24 left-10 md:left-24",
            "bottom-16 right-10 md:right-28",
            "top-48 left-1/4 hidden lg:block",
            "top-52 right-1/4 hidden lg:block",
            "bottom-36 left-1/3 hidden lg:block",
            "bottom-40 right-1/3 hidden lg:block",
          ];
          return (
            <motion.div
              key={tool.name}
              initial={{ y: 0 }}
              animate={{ y: [-8, 8, -8] }}
              transition={{
                duration: 5 + idx,
                repeat: Infinity,
                ease: "easeInOut",
                delay: tool.delay,
              }}
              className={`absolute ${positions[idx]} flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-pink-100 dark:border-zinc-800 shadow-sm shadow-[#8B1E3F]/5 text-xs font-medium text-zinc-700 dark:text-zinc-300`}
            >
              <span>{tool.icon}</span>
              <span className="font-mono text-[11px]">{tool.name}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900/90 border border-pink-200 dark:border-zinc-800 shadow-sm text-xs md:text-sm font-semibold text-[#8B1E3F] dark:text-[#EA96AC] mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#8B1E3F] dark:text-[#EA96AC]" />
          <span>Turnkey Per-Clinic Automation &bull; Rs. 25,000 One-Time Setup</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1B1B1F] dark:text-white leading-[1.1] max-w-5xl mx-auto"
        >
          <span className="font-black text-[#8B1E3F] dark:text-[#EA96AC]">Clinora:</span>{" "}
          <span className="bg-gradient-to-r from-[#8B1E3F] via-[#DE4E76] to-[#7C3AED] bg-clip-text text-transparent">
            appointments that book themselves
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed"
        >
          A patient messages your clinic on WhatsApp &rarr; AI understands in Hinglish &rarr; Google Calendar offers live slots &rarr; Instant booking & Sheets logging with{" "}
          <strong className="text-zinc-900 dark:text-white font-semibold">zero double bookings</strong> and automated 1-hour reminders.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/book-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#8B1E3F] to-[#A82B51] hover:from-[#7A1A37] hover:to-[#8B1E3F] shadow-lg shadow-[#8B1E3F]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#interactive-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-zinc-800 dark:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-all"
          >
            <span>Watch the Flow</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </a>
        </motion.div>

        {/* Trust Badges Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>87% reception effort saved</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8B1E3F] dark:text-[#EA96AC]" />
            <span>Zero double-booking guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>1-hour auto WhatsApp reminders</span>
          </div>
        </motion.div>

        {/* Animated Connected Flow Pipeline Line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 relative p-6 sm:p-8 rounded-3xl glass-card shadow-glass dark:shadow-glass-dark border border-pink-200/60 dark:border-zinc-800 max-w-4xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 relative z-10">
            {/* Stage 1: WhatsApp */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 w-full sm:w-48">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-2">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold font-mono uppercase text-emerald-800 dark:text-emerald-400">
                1. WhatsApp
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Patient sends text in Hinglish
              </span>
            </div>

            {/* Connecting Pulse 1 */}
            <div className="hidden sm:flex items-center justify-center w-12 text-[#8B1E3F] dark:text-[#EA96AC]">
              <span className="w-2 h-2 rounded-full bg-[#8B1E3F] animate-ping"></span>
              <div className="w-full h-0.5 bg-gradient-to-r from-emerald-400 to-[#8B1E3F]"></div>
            </div>

            {/* Stage 2: n8n + GPT */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60 w-full sm:w-48">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#8B1E3F] to-[#DE4E76] text-white flex items-center justify-center shadow-md shadow-[#8B1E3F]/25 mb-2">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold font-mono uppercase text-[#8B1E3F] dark:text-[#EA96AC]">
                2. n8n + GPT
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Extracts details & safety check
              </span>
            </div>

            {/* Connecting Pulse 2 */}
            <div className="hidden sm:flex items-center justify-center w-12 text-blue-500">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <div className="w-full h-0.5 bg-gradient-to-r from-[#8B1E3F] to-blue-500"></div>
            </div>

            {/* Stage 3: Google Calendar */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 w-full sm:w-48">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-2">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold font-mono uppercase text-blue-800 dark:text-blue-400">
                3. Google Calendar
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Finds free slots & blocks clash
              </span>
            </div>

            {/* Connecting Pulse 3 */}
            <div className="hidden sm:flex items-center justify-center w-12 text-teal-600">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
              <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-teal-500"></div>
            </div>

            {/* Stage 4: Google Sheets */}
            <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 w-full sm:w-48">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 mb-2">
                <Table2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold font-mono uppercase text-teal-800 dark:text-teal-400">
                4. Google Sheets
              </span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Logs to register + 9 PM report
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
