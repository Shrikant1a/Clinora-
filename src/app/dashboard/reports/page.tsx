"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, Clock, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function DailyReportPreviewPage() {
  const [recipient, setRecipient] = useState("doctor@mehtaclinic.com");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendTestEmail = async () => {
    setSending(true);
    setSentSuccess(false);

    try {
      const res = await fetch("/api/reports/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: recipient }),
      });

      if (res.ok) {
        setSentSuccess(true);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#8B1E3F", "#10B981"],
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            9:00 PM Daily Executive Report
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Automated nightly email digest sent to clinic owner summarizing today's OPD throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none"
          />
          <button
            onClick={handleSendTestEmail}
            disabled={sending}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#8B1E3F] hover:bg-[#7A1A37] shadow-sm inline-flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {sending ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Send Test Email</span>
          </button>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Test report successfully generated and dispatched to {recipient}!</span>
        </div>
      )}

      {/* Rendered Email Preview Container */}
      <div className="max-w-3xl mx-auto rounded-3xl glass-card border border-pink-200 dark:border-zinc-800 p-6 sm:p-10 shadow-xl">
        <div className="border-b border-pink-100 dark:border-zinc-800 pb-4 mb-6 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#8B1E3F]" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              From: notifications@clinora.com
            </span>
          </div>
          <span className="font-mono text-[11px]">Scheduled Cron: 21:00 IST</span>
        </div>

        {/* The Exact Email Template Visual */}
        <div className="space-y-6">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-pink-100 text-[#8B1E3F] dark:bg-pink-950 dark:text-[#EA96AC]">
              DAILY CLINIC SUMMARY
            </span>
            <h2 className="text-2xl font-extrabold text-[#8B1E3F] dark:text-pink-300 mt-2">
              Dr. Mehta Family Clinic & Diagnostic Centre
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Report for {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} &bull; 9:00 PM IST
            </p>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-900">
              <span className="text-3xl font-extrabold text-[#8B1E3F] dark:text-[#EA96AC] font-mono">
                52
              </span>
              <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-1 uppercase">
                Booked
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900">
              <span className="text-3xl font-extrabold text-red-600 font-mono">
                2
              </span>
              <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-1 uppercase">
                Cancelled
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
              <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                14
              </span>
              <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mt-1 uppercase">
                Tomorrow
              </p>
            </div>
          </div>

          {/* Efficiency Summary Banner */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs space-y-1.5 leading-relaxed text-zinc-700 dark:text-zinc-300">
            <div className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Receptionist Efficiency Metrics:</span>
            </div>
            <div>&bull; <strong>5.5 hours saved today</strong> from manual WhatsApp and telephone booking.</div>
            <div>&bull; <strong>100% WhatsApp responses</strong> delivered in under 5 seconds.</div>
            <div>&bull; <strong>Zero double-bookings</strong> recorded across all 4 doctors.</div>
            <div>&bull; <strong>50 automated 1-hour reminders</strong> delivered without receptionist intervention.</div>
          </div>

          {/* Tomorrow's Schedule Preview */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2">
              Tomorrow's Morning Schedule (Sneak Peek)
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex justify-between">
                <span>10:00 AM &bull; <strong>Rahul Verma</strong> (Fever follow-up)</span>
                <span className="text-zinc-500 font-mono">Dr. Rajesh Mehta</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex justify-between">
                <span>10:30 AM &bull; <strong>Priya Patel</strong> (Hypertension review)</span>
                <span className="text-zinc-500 font-mono">Dr. Anand Rao</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 flex justify-between">
                <span>11:00 AM &bull; <strong>Amit Shah</strong> (Throat consultation)</span>
                <span className="text-zinc-500 font-mono">Dr. Sunita Sharma</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-pink-100 dark:border-zinc-800 text-center text-[10px] text-zinc-400 font-mono">
            Generated automatically by Clinora Automation Pipeline &bull; n8n + Meta Cloud API + Google Workspace
          </div>
        </div>
      </div>
    </div>
  );
}
