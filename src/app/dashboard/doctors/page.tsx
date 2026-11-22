"use client";

import { useEffect, useState } from "react";
import { Stethoscope, Calendar, Clock, Plus, Check, Edit2, ShieldCheck } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  calendarId: string;
  workingDays: string;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  isActive: boolean;
  _count?: { appointments: number };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: "",
    specialty: "",
    calendarId: "",
    workingDays: "Mon,Tue,Wed,Thu,Fri,Sat",
    startTime: "10:00",
    endTime: "17:30",
    slotMinutes: 30,
  });

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/doctors");
      const json = await res.json();
      if (json.doctors) {
        setDoctors(json.doctors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await fetch("/api/doctors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !current }),
      });
      loadDoctors();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoc),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewDoc({
          name: "",
          specialty: "",
          calendarId: "",
          workingDays: "Mon,Tue,Wed,Thu,Fri,Sat",
          startTime: "10:00",
          endTime: "17:30",
          slotMinutes: 30,
        });
        loadDoctors();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Doctors & Operating Schedules
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure consultation timings, slot durations, and linked Google Calendar IDs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#8B1E3F] hover:bg-[#7A1A37] shadow-sm inline-flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="p-6 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B1E3F] to-[#DE4E76] text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {doc.name.charAt(4)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{doc.specialty}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(doc.id, doc.isActive)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-colors ${
                    doc.isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {doc.isActive ? "● Active" : "Paused"}
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Working Days:
                  </span>
                  <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                    {doc.workingDays}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" /> Daily Hours:
                  </span>
                  <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                    {doc.startTime} - {doc.endTime} ({doc.slotMinutes} min slots)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Google Calendar:
                  </span>
                  <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 truncate max-w-[180px]">
                    {doc.calendarId}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>{doc._count?.appointments || 0} total bookings</span>
              <span className="text-[#8B1E3F] font-semibold cursor-pointer hover:underline">
                Edit Schedule
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
              Add New Doctor
            </h3>

            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Mehta"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Specialty / Department
                </label>
                <input
                  type="text"
                  required
                  placeholder="General Physician & Diabetologist"
                  value={newDoc.specialty}
                  onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Google Calendar ID
                </label>
                <input
                  type="email"
                  required
                  placeholder="dr.mehta.clinic@gmail.com"
                  value={newDoc.calendarId}
                  onChange={(e) => setNewDoc({ ...newDoc, calendarId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={newDoc.startTime}
                    onChange={(e) => setNewDoc({ ...newDoc, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={newDoc.endTime}
                    onChange={(e) => setNewDoc({ ...newDoc, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono text-zinc-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#8B1E3F] hover:bg-[#7A1A37]"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
