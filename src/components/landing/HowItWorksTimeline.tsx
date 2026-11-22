"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, CalendarSearch, CalendarCheck, BellRing, Mail, Check, ArrowRight } from "lucide-react";

export function HowItWorksTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "whatsapp",
      number: "01",
      title: "Patient Messages on WhatsApp",
      subtitle: "AI greets in Hinglish & collects key information",
      tool: "WhatsApp Cloud API + OpenAI GPT",
      description:
        "The patient texts 'Hi, doctor ki appointment chahiye'. The AI greets them warmly, asks for their Name, Problem, and preferred Date. It supports English, Hindi, and natural Hinglish.",
      visual: (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2.5">
          <div className="flex justify-start">
            <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-emerald-100 dark:border-zinc-700 max-w-[85%] text-zinc-800 dark:text-zinc-200">
              <span className="font-bold text-emerald-600 block text-[10px] mb-0.5">Patient</span>
              "Hi, Dr. Mehta ki appointment chahiye kal subah"
            </div>
          </div>
          <div className="flex justify-end">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white max-w-[85%] shadow-sm">
              <span className="font-bold text-emerald-200 block text-[10px] mb-0.5">AI Clinic Assistant</span>
              "Namaste! Aapka shubh naam aur kya takleef hai bata dijiye?"
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slots",
      number: "02",
      title: "Real-Time Slot Discovery",
      subtitle: "Google Calendar checked & free timings offered",
      tool: "Google Calendar API + n8n Code",
      description:
        "n8n instantly reads the doctor's live calendar, filters out booked slots, and responds within 3 seconds with interactive clickable slot chips.",
      visual: (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
          <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Free Slots for Dr. Mehta (Tomorrow):
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 text-center text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
              10:00 AM
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 text-center text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
              11:30 AM
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 text-center text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
              04:00 PM
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 text-center text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
              05:30 PM
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "booked",
      number: "03",
      title: "Instant Booking & Clash Protection",
      subtitle: "Calendar event locked & logged in Google Sheets",
      tool: "Calendar + Sheets + Clash Engine",
      description:
        "The system double-checks slot availability at the exact moment of booking. Upon confirmation, a Calendar event is created with patient contact details, and a row is logged in Appointments_Register.",
      visual: (
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Google Calendar Event Created</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-teal-200 dark:border-zinc-700 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
            Row #52 appended to Appointments_Register<br />
            ID: <span className="text-teal-600 font-bold">APT-20261123-0052</span><br />
            Status: <span className="text-emerald-600 font-bold">Booked</span>
          </div>
        </div>
      ),
    },
    {
      id: "reminder",
      number: "04",
      title: "1-Hour Automated Reminder",
      subtitle: "Sent on WhatsApp to prevent patient no-shows",
      tool: "n8n Cron Scheduler + WhatsApp",
      description:
        "Every 5 minutes, our automated scheduler checks for appointments starting in 60 minutes. An approved WhatsApp template reminds the patient with doctor name, time, and clinic address.",
      visual: (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs">
          <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold mb-2">
            <BellRing className="w-4 h-4 text-purple-600" />
            <span>60 Min Prior Trigger</span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-purple-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
            "Reminder: Aaj 11:30 AM ki appointment, Dr. Mehta ke saath. Please 10 minute pehle time par aayein."
          </div>
        </div>
      ),
    },
    {
      id: "report",
      number: "05",
      title: "9:00 PM Daily Owner Email",
      subtitle: "Complete day summary delivered to your inbox",
      tool: "Gmail / SMTP + Sheets Aggregator",
      description:
        "At 9:00 PM, the clinic owner receives an executive HTML report showing total Booked, Cancelled, and Upcoming patients, 7-day trend, and estimated hours saved.",
      visual: (
        <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-xs">
          <div className="flex items-center justify-between text-[#8B1E3F] dark:text-[#EA96AC] font-bold mb-2">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>Daily Report (9:00 PM IST)</span>
            </div>
            <span className="font-mono text-[10px]">doctor@mehta.com</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-pink-200">
              <span className="text-base font-bold text-[#8B1E3F]">52</span>
              <p className="text-[10px] text-zinc-500">Booked</p>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-pink-200">
              <span className="text-base font-bold text-red-500">2</span>
              <p className="text-[10px] text-zinc-500">Cancelled</p>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-pink-200">
              <span className="text-base font-bold text-emerald-600">14</span>
              <p className="text-[10px] text-zinc-500">Upcoming</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white dark:bg-[#0F0D15] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-pink-100 dark:bg-pink-950/80 text-[#8B1E3F] dark:text-[#EA96AC] mb-3 border border-pink-200 dark:border-pink-900">
            <span>5-Stage Automation Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
            How Clinora works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            From the initial patient message to the doctor's calendar and the nightly email report—completely touchless.
          </p>
        </div>

        {/* Sticky Progress Pill Bar */}
        <div className="sticky top-20 z-30 mb-12 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-pink-200/80 dark:border-zinc-800 shadow-md">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeStep === idx
                    ? "bg-[#8B1E3F] text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-[#8B1E3F] dark:hover:text-white"
                }`}
              >
                <span className="font-mono">{step.number}</span>
                <span className="hidden sm:inline">{step.title.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Step Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column: Step Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-[#8B1E3F] dark:text-[#EA96AC] text-xs font-mono font-bold">
              Stage {steps[activeStep].number} of 05 &bull; {steps[activeStep].tool}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1F] dark:text-white">
              {steps[activeStep].title}
            </h3>

            <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {steps[activeStep].description}
            </p>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Previous Stage
              </button>
              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#8B1E3F] text-white hover:bg-[#7A1A37] disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Container */}
          <div className="lg:col-span-5 rounded-3xl glass-card p-6 shadow-xl border border-pink-100 dark:border-zinc-800">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="text-xs font-mono font-bold text-zinc-500">Live Simulation Output</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            {steps[activeStep].visual}
          </div>
        </div>
      </div>
    </section>
  );
}
