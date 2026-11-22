import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorksTimeline } from "@/components/landing/HowItWorksTimeline";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { WhatsAppSimulator } from "@/components/demo/WhatsAppSimulator";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { TechStackStrip } from "@/components/landing/TechStackStrip";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section with animated flow line and floating icons */}
        <HeroSection />

        {/* 2. Problem Section with 58 pending inbox & red CLASH register */}
        <ProblemSection />

        {/* 3. How It Works: 5-step scroll-driven timeline with sticky pills */}
        <HowItWorksTimeline />

        {/* 4. Features Grid: 8 cards with hover lift */}
        <FeaturesGrid />

        {/* 5. Interactive WhatsApp Demo */}
        <WhatsAppSimulator />

        {/* 6. ROI Calculator: Manual 6 hrs vs Automated 0.5 hr (87% reduction) */}
        <RoiCalculator />

        {/* 7. Tech Stack Strip */}
        <TechStackStrip />

        {/* 8. Pricing: Rs. 25,000 setup + optional maintenance */}
        <PricingSection />

        {/* 9. FAQ Accordion */}
        <FaqAccordion />

        {/* 10. Final Call To Action */}
        <section className="py-20 md:py-28 bg-gradient-to-tr from-[#8B1E3F] via-[#A82B51] to-[#7A1A37] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-mono font-bold mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>Ready in 4-7 working days</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Reclaim 6 hours of daily front-desk peace.
            </h2>

            <p className="mt-5 text-base sm:text-lg text-pink-100 max-w-2xl mx-auto leading-relaxed">
              Book a live walk-through with our automation architect. We will review your clinic's consultation timings and demonstrate zero double-booking on your real WhatsApp number.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-[#8B1E3F] bg-white hover:bg-pink-50 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>Book Clinora Demo</span>
                <ArrowRight className="w-5 h-5 text-[#8B1E3F]" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
              >
                <span>View Admin Portal</span>
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-pink-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> Rs. 25,000 Flat One-Time
              </span>
              <span>&bull;</span>
              <span>Zero Double-Booking Guarantee</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
