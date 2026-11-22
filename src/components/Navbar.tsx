"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ClinoraLogo } from "./ClinoraLogo";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Live Demo", href: "/demo" },
    { label: "Features", href: "#features" },
    { label: "ROI & Impact", href: "#roi" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-[#0F0D15]/85 border-b border-pink-100 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <ClinoraLogo size="md" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-[#8B1E3F] dark:hover:text-[#EA96AC] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs font-semibold px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:text-[#8B1E3F] dark:hover:text-white transition-colors"
          >
            Admin Login
          </Link>
          <Link
            href="/book-demo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#8B1E3F] to-[#A82B51] hover:from-[#7A1A37] hover:to-[#8B1E3F] shadow-sm shadow-[#8B1E3F]/30 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-pink-100 dark:border-zinc-800 bg-white dark:bg-[#15101A] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-base font-medium text-zinc-700 dark:text-zinc-200 hover:text-[#8B1E3F] dark:hover:text-[#EA96AC]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300"
            >
              Admin Dashboard Login
            </Link>
            <Link
              href="/book-demo"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#8B1E3F] to-[#A82B51] shadow-sm"
            >
              Book Clinora Demo (Rs. 25,000 Setup)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
