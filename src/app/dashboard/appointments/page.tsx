"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Download,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Phone,
  Filter,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  problem: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  source: string;
  isClash?: boolean;
  doctor: { id: string; name: string; specialty: string };
}

export default function AppointmentsRegisterPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newTime, setNewTime] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (selectedDoctor !== "all") query.set("doctorId", selectedDoctor);
      if (selectedStatus !== "all") query.set("status", selectedStatus);
      if (selectedDate) query.set("date", selectedDate);

      const res = await fetch(`/api/appointments?${query.toString()}`);
      const json = await res.json();
      if (json.appointments) {
        setAppointments(json.appointments);
      }
    } catch (e) {
      console.error("Error fetching appointments:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDoctor, selectedStatus, selectedDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleApt || !newTime) return;
    try {
      const res = await fetch(`/api/appointments/${rescheduleApt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime: newTime }),
      });
      if (res.ok) {
        setRescheduleApt(null);
        setNewTime("");
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const hasClashes = appointments.some((a) => a.isClash);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Appointments Register
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Direct sync with Google Sheets &bull; 100% auditable record of all bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/appointments/export"
            download
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Clash Alert Banner (If Any Collision Is Found) */}
      {hasClashes && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="font-bold text-xs uppercase font-mono">
                Collision Detected in Manual Bookings
              </span>
              <p className="text-xs text-red-700 dark:text-red-300">
                Multiple active bookings were manually created for the same doctor and slot. Automated WhatsApp pipeline prevents this.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-600 text-white">
            CLASH
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-card border border-pink-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, phone, or problem..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Doctor Filter */}
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">All Doctors</option>
            <option value="doc_mehta_01">Dr. Rajesh Mehta</option>
            <option value="doc_sharma_02">Dr. Sunita Sharma</option>
            <option value="doc_rao_03">Dr. Anand Rao</option>
            <option value="doc_iyer_04">Dr. Priya Iyer</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>
        </div>
      </div>

      {/* Appointments Register Table */}
      <div className="rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 text-zinc-500 font-mono">
                <th className="py-3 px-4 font-semibold">APT ID</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Patient</th>
                <th className="py-3 px-4 font-semibold">Doctor</th>
                <th className="py-3 px-4 font-semibold">Problem</th>
                <th className="py-3 px-4 font-semibold">Source</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Loading appointments register...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    No appointments match the selected filter.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className={`transition-colors ${
                      apt.isClash
                        ? "bg-red-50/80 dark:bg-red-950/40 border-l-4 border-l-red-600 font-bold"
                        : "hover:bg-pink-50/30 dark:hover:bg-zinc-900/40"
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                      {apt.id}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div>{apt.date}</div>
                      <div className="text-[11px] text-zinc-500 font-semibold">
                        {apt.startTime} - {apt.endTime}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">
                        {apt.patientName}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">{apt.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-zinc-800 dark:text-zinc-200 font-semibold">
                        {apt.doctor?.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">{apt.doctor?.specialty}</div>
                    </td>

                    <td className="py-3 px-4 max-w-[200px] truncate text-zinc-600 dark:text-zinc-400">
                      {apt.problem}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {apt.source}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {apt.isClash ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-red-600 text-white animate-pulse">
                          CLASH
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            apt.status === "Booked"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                              : apt.status === "Completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
                              : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {apt.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {apt.status === "Booked" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setRescheduleApt(apt);
                              setNewTime(apt.startTime);
                            }}
                            className="px-2 py-1 rounded-lg text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="px-2 py-1 rounded-lg text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 rounded-3xl glass-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Patient: <strong>{rescheduleApt.patientName}</strong> with {rescheduleApt.doctor?.name}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  New Start Time (HH:mm)
                </label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="14:00"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  onClick={() => setRescheduleApt(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleSubmit}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#8B1E3F] hover:bg-[#7A1A37]"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
