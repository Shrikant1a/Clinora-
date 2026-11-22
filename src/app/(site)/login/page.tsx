"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@clinicautomation.com");
  const [password, setPassword] = useState("clinicAdmin2026!secure");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Authentication failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillDemo = () => {
    setEmail("admin@clinicautomation.com");
    setPassword("clinicAdmin2026!secure");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8FA] dark:bg-[#0D0B12]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card border border-pink-200 dark:border-zinc-800 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B1E3F] to-[#DE4E76] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1B1B1F] dark:text-white">
              Clinora Admin Portal Login
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Sign in to manage appointments, doctors, and reports.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-xs text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@clinicautomation.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#8B1E3F] to-[#A82B51] hover:from-[#7A1A37] hover:to-[#8B1E3F] shadow-md shadow-[#8B1E3F]/30 transition-all text-xs disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? <span>Signing In...</span> : <span>Sign In to Dashboard</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-[11px] text-zinc-400 mb-2">Evaluating Clinora?</p>
            <button
              type="button"
              onClick={handlePrefillDemo}
              className="w-full py-2 px-3 rounded-xl border border-pink-200 dark:border-zinc-700 bg-pink-50/50 dark:bg-pink-950/20 text-[#8B1E3F] dark:text-[#EA96AC] text-xs font-semibold hover:bg-pink-100 transition-colors"
            >
              Fill Demo Admin Credentials
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
