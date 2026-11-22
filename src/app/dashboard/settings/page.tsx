"use client";

import { useEffect, useState } from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Database, KeyRound, Globe } from "lucide-react";

export default function ClinicSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    name: "Dr. Mehta Family Clinic & Diagnostic Centre",
    phone: "+91 98200 12345",
    email: "contact@mehtaclinic.com",
    address: "Shop 12, Sunrise Arcade, MG Road, Mumbai, Maharashtra 400001",
    emergencyPhone: "+91 98200 99999",
    setupPrice: 25000,
    timezone: "Asia/Kolkata",
    reminderLeadMinutes: 60,
    reportHour: 21,
    languages: "English, Hindi, Hinglish",
    n8nWebhookUrl: "http://localhost:5678/webhook/clinic-booking",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.clinic) {
          setSettings({
            name: json.clinic.name,
            phone: json.clinic.phone,
            email: json.clinic.email,
            address: json.clinic.address || "",
            emergencyPhone: json.clinic.emergencyPhone || "+91 98200 99999",
            setupPrice: json.clinic.setupPrice || 25000,
            timezone: json.clinic.timezone || "Asia/Kolkata",
            reminderLeadMinutes: json.clinic.reminderLeadMinutes || 60,
            reportHour: json.clinic.reportHour || 21,
            languages: json.clinic.languages || "English, Hindi, Hinglish",
            n8nWebhookUrl: json.clinic.n8nWebhookUrl || "",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Clinora: Clinic Configuration & Automation Settings
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Manage practice profile, reminder timing, report schedules, and n8n webhooks.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Clinic settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Practice Identity */}
        <div className="p-6 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span>Clinic Identity & Contact</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Clinic Display Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Reception WhatsApp Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Owner Report Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Emergency Helpline (Triggered on Urgent Intent)
              </label>
              <input
                type="text"
                value={settings.emergencyPhone}
                onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Clinic Address (Included in WhatsApp Confirmation)
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Automation Timers & Pricing */}
        <div className="p-6 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span>Automation Schedule & Timers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Reminder Lead Time (Minutes)
              </label>
              <input
                type="number"
                value={settings.reminderLeadMinutes}
                onChange={(e) => setSettings({ ...settings, reminderLeadMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Default: 60 mins</span>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Daily Report Hour (24h)
              </label>
              <input
                type="number"
                value={settings.reportHour}
                onChange={(e) => setSettings({ ...settings, reportHour: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Default: 21 (9:00 PM)</span>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Setup Price (INR)
              </label>
              <input
                type="number"
                value={settings.setupPrice}
                onChange={(e) => setSettings({ ...settings, setupPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Configurable per clinic</span>
            </div>
          </div>
        </div>

        {/* Integration Endpoints */}
        <div className="p-6 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span>External Webhooks & AI Languages</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                n8n Webhook Endpoint
              </label>
              <input
                type="url"
                value={settings.n8nWebhookUrl}
                onChange={(e) => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
                placeholder="https://n8n.yourclinic.com/webhook/clinic-booking"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Supported AI Languages
              </label>
              <input
                type="text"
                value={settings.languages}
                onChange={(e) => setSettings({ ...settings, languages: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#8B1E3F] hover:bg-[#7A1A37] shadow-sm inline-flex items-center gap-2 text-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Clinic Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
