"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, ShieldCheck, Stethoscope, Sparkles, Building2, Phone, Mail, User } from "lucide-react";
import Link from "next/link";

const LeadFormSchema = z.object({
  clinicName: z.string().min(2, "Clinic name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  phone: z.string().min(10, "Valid phone number is required (min 10 digits)"),
  email: z.string().email("Valid email address is required"),
  doctorsCount: z.coerce.number().min(1, "At least 1 doctor is required"),
  dailyVolume: z.coerce.number().min(5, "Minimum 5 inquiries/day"),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof LeadFormSchema>;

export default function BookDemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      doctorsCount: 2,
      dailyVolume: 50,
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Submission failed");
      }

      setSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8B1E3F", "#10B981", "#DE4E76"],
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit demo request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8FA] dark:bg-[#0D0B12]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="p-8 sm:p-12 rounded-3xl glass-card border border-emerald-200 dark:border-emerald-800 text-center max-w-xl mx-auto animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1F] dark:text-white">
                Demo Request Received!
              </h2>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Thank you! Our automation engineer will connect with you on WhatsApp within 2 business hours to schedule your live walkthrough.
              </p>

              <div className="mt-8 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-left space-y-2">
                <div className="font-bold text-zinc-800 dark:text-zinc-200">Next Steps:</div>
                <div className="text-zinc-500">1. We will verify your doctors' consultation timings.</div>
                <div className="text-zinc-500">2. We will run a test booking on our WhatsApp sandbox.</div>
                <div className="text-zinc-500">3. Handover ready in 4-7 working days (Rs. 25,000 setup).</div>
              </div>

              <div className="mt-8">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#8B1E3F] hover:bg-[#7A1A37] transition-all shadow-md shadow-[#8B1E3F]/25 text-sm"
                >
                  <span>Explore Interactive Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Value Prop */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-pink-100 dark:bg-pink-950/80 text-[#8B1E3F] dark:text-[#EA96AC] border border-pink-200 dark:border-pink-900">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Turnkey Setup &bull; ₹25,000</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight leading-tight">
                  Book a live demo of Clinora
                </h1>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  See how Clinora frees up 6 hours of daily receptionist stress. We will walk you through the n8n pipeline, Google Calendar sync, and WhatsApp auto-reminders.
                </p>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-pink-100 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero double-booking test passed before payment</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Complete ownership of workflow JSON & Google account</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% DPDP Act 2023 patient privacy compliant</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-card border border-pink-200 dark:border-zinc-800 shadow-xl">
                {errorMessage && (
                  <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-xs text-red-700 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Clinic / Hospital Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        {...register("clinicName")}
                        type="text"
                        placeholder="e.g. Dr. Mehta Family Clinic"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                      />
                    </div>
                    {errors.clinicName && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.clinicName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Doctor / Contact Person *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                        <input
                          {...register("contactPerson")}
                          type="text"
                          placeholder="Dr. Rajesh Mehta"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                        />
                      </div>
                      {errors.contactPerson && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.contactPerson.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+91 98200 12345"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="doctor@mehtaclinic.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Number of Doctors
                      </label>
                      <input
                        {...register("doctorsCount")}
                        type="number"
                        min="1"
                        max="20"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Daily Patient Inquiries
                      </label>
                      <input
                        {...register("dailyVolume")}
                        type="number"
                        min="10"
                        max="500"
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Specific Requirements / Notes
                    </label>
                    <textarea
                      {...register("message")}
                      rows={3}
                      placeholder="e.g. We have 3 doctors with 30-min slots and need Kannada/English support..."
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#8B1E3F] to-[#A82B51] hover:from-[#7A1A37] hover:to-[#8B1E3F] shadow-md shadow-[#8B1E3F]/30 transition-all text-xs sm:text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Scheduling Demo...</span>
                    ) : (
                      <>
                        <span>Submit Demo Request (Rs. 25,000 Setup)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
