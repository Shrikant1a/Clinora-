"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How long does the entire clinic setup take?",
      a: "Setup typically takes 4 to 7 working days per clinic. The primary variable is Meta WhatsApp Business number verification and utility message template approval (which takes 24-48 hours). The n8n workflow, calendar, and sheets configuration are deployed within 48 hours.",
    },
    {
      q: "Do we need an official WhatsApp Business API account?",
      a: "Yes, we set you up with the official Meta WhatsApp Cloud API. This ensures your clinic's registered phone number is fully verified with a official green badge or business profile, preventing any risk of number banning associated with unofficial scrapers or tools.",
    },
    {
      q: "How is patient health data and privacy protected under Indian laws?",
      a: "The system adheres strictly to the Digital Personal Data Protection (DPDP) Act, 2023. We collect only the absolute minimum information required for scheduling (Patient Name, WhatsApp Phone, and general Reason for Visit). We never store prescriptions, clinical notes, or medical history. All data lives in your clinic's own private Google account and database.",
    },
    {
      q: "Can patients chat in natural Hinglish or Hindi?",
      a: "Yes! Our OpenAI GPT assistant is prompt-engineered to understand Romanized Hindi ('Dr. Mehta kal subah 11 baje available hain kya?'), Devanagari Hindi, and formal English. It detects medical intent, extracts the date and time, and responds in the patient's preferred language.",
    },
    {
      q: "What happens if a patient wants to reschedule or cancel?",
      a: "Patients can simply text 'Cancel my appointment' or 'Reschedule'. The workflow identifies their active booking, updates the Google Calendar entry, frees up the slot for others, and updates the status to 'Cancelled' in Google Sheets.",
    },
    {
      q: "Can our clinic support multiple doctors with different schedules?",
      a: "Absolutely. Each doctor in your clinic (e.g. Dr. Mehta, Dr. Sharma, Dr. Rao, Dr. Iyer) gets their own individual Google Calendar ID, distinct working days, consultation hours, and slot lengths (e.g., 30 mins for General Physician, 45 mins for Dental Surgery).",
    },
    {
      q: "Where does n8n run, and what are the ongoing operating costs?",
      a: "n8n is open-source and can be self-hosted on a modest \$5-10/month cloud VPS (e.g., DigitalOcean, Hetzner, or AWS Lightsail) or on n8n Cloud. The only other running cost is Meta's per-conversation WhatsApp messaging charge (a few paise per session) and OpenAI API tokens (a few rupees per month).",
    },
    {
      q: "What training and ongoing support do you provide to our receptionists?",
      a: "We conduct a comprehensive live training session with your clinic staff. They receive our Receptionist Quick-Start Guide showing how to monitor Google Sheets, manually override or pause the bot, handle emergency patient calls, and read the 9:00 PM summary reports.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-white dark:bg-[#0F0D15] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-pink-100 dark:bg-pink-950/80 text-[#8B1E3F] dark:text-[#EA96AC] mb-3 border border-pink-200 dark:border-pink-900">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
            Got questions? We've got answers.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Everything you need to know about setting up automated appointment booking for your clinic.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-pink-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:text-[#8B1E3F] dark:hover:text-[#EA96AC] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#8B1E3F] dark:text-[#EA96AC]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
