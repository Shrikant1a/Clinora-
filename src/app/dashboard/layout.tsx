"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck2,
  Stethoscope,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  BellRing,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClinoraLogo } from "@/components/ClinoraLogo";

const CLINICS = [
  { id: "clinic_mehta_01", name: "Dr. Mehta Family Clinic", role: "Primary Clinic" },
  { id: "clinic_apollo_02", name: "Apollo Dental & Wellness", role: "Branch Clinic" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(CLINICS[0]);
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments Register", href: "/dashboard/appointments", icon: CalendarCheck2 },
    { name: "Doctors & Schedules", href: "/dashboard/doctors", icon: Stethoscope },
    { name: "WhatsApp Chats", href: "/dashboard/conversations", icon: MessageSquare },
    { name: "9 PM Daily Report", href: "/dashboard/reports", icon: Mail },
    { name: "Clinic Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#FAF6F8] dark:bg-[#0B0910] text-[#1B1B1F] dark:text-[#F4F4F5]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#14101C] border-r border-pink-100 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-pink-100 dark:border-zinc-800 flex items-center justify-between">
            <ClinoraLogo size="sm" showTagline={false} href="/dashboard" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Multi-Clinic Switcher Dropdown */}
          <div className="p-3 border-b border-pink-100 dark:border-zinc-800 relative">
            <button
              onClick={() => setClinicMenuOpen(!clinicMenuOpen)}
              className="w-full p-2 rounded-xl bg-pink-50/60 dark:bg-zinc-900 border border-pink-200/60 dark:border-zinc-700/60 flex items-center justify-between text-left hover:bg-pink-100/60 transition-colors"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Building2 className="w-4 h-4 text-[#8B1E3F] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                    {selectedClinic.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">{selectedClinic.role}</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>

            {clinicMenuOpen && (
              <div className="absolute top-16 left-3 right-3 z-50 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl space-y-1">
                {CLINICS.map((clinic) => (
                  <button
                    key={clinic.id}
                    onClick={() => {
                      setSelectedClinic(clinic);
                      setClinicMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left text-xs transition-colors ${
                      selectedClinic.id === clinic.id
                        ? "bg-pink-50 dark:bg-pink-950/60 text-[#8B1E3F] font-bold"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div>{clinic.name}</div>
                    <div className="text-[10px] text-zinc-400">{clinic.role}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#8B1E3F] text-white shadow-sm shadow-[#8B1E3F]/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-pink-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-pink-100 dark:border-zinc-800 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-zinc-500">Theme</span>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-pink-100 dark:border-zinc-800 bg-white/80 dark:bg-[#14101C]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-900 dark:text-white">
                {selectedClinic.name}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                ● Live 24x7 Sync
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8B1E3F] dark:text-[#EA96AC] bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 transition-colors"
            >
              <span>Test Simulator</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-zinc-800 text-[#8B1E3F] dark:text-pink-300 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
