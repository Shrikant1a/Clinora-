"use client";

import { motion } from "framer-motion";
import { MessageSquare, Calendar, Table2, ShieldCheck, BellRing, Mail, Stethoscope, Languages } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: MessageSquare,
      title: "WhatsApp AI Assistant",
      description: "Greets patients warmly 24x7, understands natural conversational queries, and handles bookings without human intervention.",
      tag: "GPT-4o NLP",
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: Calendar,
      title: "Live Doctor Availability",
      description: "Direct real-time query against Google Calendar. Never presents booked slots, respecting doctor breaks and operating hours.",
      tag: "Google Calendar API",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Table2,
      title: "Automatic Sheets Logging",
      description: "Instantly logs every confirmed appointment into your Google Sheets Appointments_Register with unique reference IDs.",
      tag: "Google Sheets Sync",
      color: "from-teal-500 to-emerald-600",
    },
    {
      icon: ShieldCheck,
      title: "Double-Booking Protection",
      description: "Zero double-booking guarantee. Atomic race-condition verification immediately prior to booking. Instant alternative suggestions.",
      tag: "Race-Condition Safe",
      color: "from-rose-500 to-[#8B1E3F]",
    },
    {
      icon: BellRing,
      title: "1-Hour Automated Reminders",
      description: "Scheduled background cron triggers WhatsApp reminder templates 60 minutes prior, slashing no-show rates by up to 80%.",
      tag: "Meta Approved Template",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Mail,
      title: "9:00 PM Daily Owner Report",
      description: "Every night at 9:00 PM IST, the clinic owner gets a detailed Gmail executive breakdown of daily bookings, cancellations, and trends.",
      tag: "Executive Digest",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Stethoscope,
      title: "Multi-Doctor & Specialty Routing",
      description: "Manage individual schedules, slot lengths, and calendars for Dr. Mehta, Dr. Sharma, Dr. Rao, Dr. Iyer, or any custom doctor.",
      tag: "Multi-Physician",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Languages,
      title: "Hinglish, Hindi & English",
      description: "Patients can write 'kal subah 11 baje appointment chahiye' or 'dr mehta available tomorrow'. AI naturally responds in kind.",
      tag: "Trilingual Support",
      color: "from-indigo-500 to-cyan-600",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#FCF8FA] dark:bg-[#0D0B12] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-pink-100 dark:bg-pink-950/80 text-[#8B1E3F] dark:text-[#EA96AC] mb-3 border border-pink-200 dark:border-pink-900">
            <span>Built For Modern Medical Clinics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
            Everything your reception needs, automated.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Engineered with medical practice workflows in mind. Rock-solid reliability, doctor privacy, and patient delight.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group p-6 rounded-3xl glass-card glass-card-hover border border-pink-100 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1B1B1F] dark:text-white mb-2 group-hover:text-[#8B1E3F] dark:group-hover:text-[#EA96AC] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs font-semibold text-[#8B1E3F] dark:text-[#EA96AC]">
                  <span>Included in Setup</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
