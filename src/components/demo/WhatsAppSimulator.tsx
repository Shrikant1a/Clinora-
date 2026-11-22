"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Play,
  Pause,
  RotateCcw,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  User,
  Stethoscope,
  Smile,
  Paperclip,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ChatMessage {
  id: string;
  sender: "bot" | "patient" | "system";
  text: string;
  time: string;
  chips?: string[];
  isSlots?: boolean;
  isConfirmation?: boolean;
  isReminder?: boolean;
}

const DOCTORS = [
  { id: "dr_mehta", name: "Dr. Rajesh Mehta", role: "General Physician", status: "Available", statusColor: "text-emerald-500", hours: "10:00 - 17:30" },
  { id: "dr_sharma", name: "Dr. Sunita Sharma", role: "Pediatrician", status: "Busy until 2 PM", statusColor: "text-amber-500", hours: "10:00 - 16:00" },
  { id: "dr_rao", name: "Dr. Anand Rao", role: "Cardiologist", status: "Available", statusColor: "text-emerald-500", hours: "11:00 - 18:00" },
  { id: "dr_iyer", name: "Dr. Priya Iyer", role: "Orthopedic", status: "In Surgery", statusColor: "text-red-500", hours: "09:30 - 15:30" },
];

export function WhatsAppSimulator({ isStandalone = false }: { isStandalone?: boolean }) {
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);
  const [mode, setMode] = useState<"auto" | "interactive">("auto");
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [showCalendarGrid, setShowCalendarGrid] = useState(false);
  const [showReminderRing, setShowReminderRing] = useState(false);
  const [clashSimulated, setClashSimulated] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, showCalendarGrid, showReminderRing]);

  // Initial Auto-play sequence
  useEffect(() => {
    if (mode !== "auto" || !isPlaying) return;

    let timeoutId: NodeJS.Timeout;

    if (currentStep === 0) {
      // Step 0: Bot greets
      setIsTyping(true);
      timeoutId = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: "msg_1",
            sender: "bot",
            text: "Namaste! Dr. Mehta Family Clinic mein swagat hai. Main aapka AI booking assistant hoon.",
            time: "10:14 AM",
          },
        ]);
        setCurrentStep(1);
      }, 1000);
    } else if (currentStep === 1) {
      // Step 1: Patient asks for appointment
      timeoutId = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "msg_2",
            sender: "patient",
            text: "Hi, doctor ki appointment chahiye",
            time: "10:14 AM",
          },
        ]);
        setCurrentStep(2);
      }, 1400);
    } else if (currentStep === 2) {
      // Step 2: Bot asks Name, Problem, Date
      setIsTyping(true);
      timeoutId = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "msg_3",
            sender: "bot",
            text: "Kripya appointment confirm karne ke liye ye details share karein:",
            chips: ["Rahul Verma (Name)", "Viral Fever (Problem)", "Today / Aaj (Date)"],
            time: "10:15 AM",
          },
        ]);
        setCurrentStep(3);
      }, 1500);
    } else if (currentStep === 3) {
      // Step 3: Patient provides details
      timeoutId = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "msg_4",
            sender: "patient",
            text: "Mera naam Rahul Verma hai, fever hai 2 din se, aaj dekh sakte hain?",
            time: "10:15 AM",
          },
        ]);
        setCurrentStep(4);
      }, 1600);
    } else if (currentStep === 4) {
      // Step 4: Bot queries calendar and shows weekly grid & free slots
      setIsTyping(true);
      timeoutId = setTimeout(() => {
        setIsTyping(false);
        setShowCalendarGrid(true);
        setMessages((prev) => [
          ...prev,
          {
            id: "msg_5",
            sender: "bot",
            text: "Maine Dr. Mehta ka live calendar check kiya hai. Aaj ke khali timings ye hain:",
            chips: ["10:00 AM", "11:30 AM", "04:00 PM", "05:30 PM"],
            isSlots: true,
            time: "10:16 AM",
          },
        ]);
        setCurrentStep(5);
      }, 1800);
    }

    return () => clearTimeout(timeoutId);
  }, [currentStep, mode, isPlaying]);

  // Handle Slot Selection
  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setConfirming(true);

    // Patient picks slot
    setMessages((prev) => [
      ...prev,
      {
        id: `slot_pick_${Date.now()}`,
        sender: "patient",
        text: `${slot} confirm kar dijiye please`,
        time: "10:16 AM",
      },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setConfirming(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#8B1E3F", "#10B981", "#DE4E76"],
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `confirm_${Date.now()}`,
          sender: "bot",
          text: `✅ Appointment Confirmed!\n\nDoctor: ${selectedDoctor.name}\nTime: Today at ${slot}\nCalendar Event ID: gcal_mehta_202611\nRegister Logged: Appointments_Register (Row #52)\n\nAppointment se 1 ghante pehle reminder bhej diya jayega.`,
          isConfirmation: true,
          time: "10:17 AM",
        },
      ]);

      // Trigger 1-hr reminder ring
      setTimeout(() => {
        setShowReminderRing(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `reminder_${Date.now()}`,
            sender: "system",
            text: `⏰ Reminder (Automated 1-Hour Prior):\n"Aaj ${slot} ki appointment, ${selectedDoctor.name} ke saath. Please time par clinic aayein."`,
            isReminder: true,
            time: "10:30 AM",
          },
        ]);
      }, 1500);
    }, 1200);
  };

  // Clash Simulation Handler
  const handleSimulateClash = () => {
    setClashSimulated(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `clash_sys_${Date.now()}`,
        sender: "system",
        text: "⚡ SIMULATION: Two patients (Patient A & Patient B) click '11:30 AM' at the exact same millisecond.",
        time: "10:18 AM",
      },
      {
        id: `clash_a_${Date.now()}`,
        sender: "bot",
        text: "✅ Patient A: 11:30 AM locked and confirmed! Event created in Google Calendar.",
        time: "10:18 AM",
      },
      {
        id: `clash_b_${Date.now()}`,
        sender: "bot",
        text: "⚠️ Patient B: Slot collision caught by atomic clash-prevention engine! '11:30 AM' was just locked. Proposing closest alternative slots: 12:00 PM or 04:00 PM.",
        chips: ["12:00 PM (Alternative)", "04:00 PM (Alternative)"],
        time: "10:18 AM",
      },
    ]);
  };

  // Restart Sequence
  const handleRestart = () => {
    setCurrentStep(0);
    setMessages([]);
    setShowCalendarGrid(false);
    setShowReminderRing(false);
    setSelectedSlot(null);
    setConfirming(false);
    setClashSimulated(false);
    setIsPlaying(true);
  };

  // Interactive user text send
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userText = inputText;
    setInputText("");

    setMessages((prev) => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: "patient",
        text: userText,
        time: "Just now",
      },
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();

      if (lower.includes("chest") || lower.includes("heart") || lower.includes("pain") && lower.includes("severe")) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: "bot",
            text: "⚠️ EMERGENCY ALERT: Severe chest pain requires immediate medical care. Please call our emergency helpline (+91 98200 99999) or visit the nearest ER immediately. We have notified our reception desk.",
            time: "Just now",
          },
        ]);
      } else if (lower.includes("10:00") || lower.includes("11:30") || lower.includes("4:00") || lower.includes("5:30") || lower.includes("am") || lower.includes("pm")) {
        handleSelectSlot(userText);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: "bot",
            text: `Aapki request receive ho gayi hai. ${selectedDoctor.name} ke calendar me availability check kar rahe hain. Available slots: 10:00 AM, 11:30 AM, 04:00 PM. Kaunsa slot book karein?`,
            chips: ["10:00 AM", "11:30 AM", "04:00 PM"],
            isSlots: true,
            time: "Just now",
          },
        ]);
      }
    }, 1100);
  };

  return (
    <div id="interactive-demo" className={`w-full ${isStandalone ? "py-8" : "py-16 md:py-24"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isStandalone && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 mb-3 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1B1B1F] dark:text-white tracking-tight">
              Test the WhatsApp flow live
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              Experience what your patients see. Watch autoplay or click "Try it yourself" to type in Hinglish or simulate booking collisions.
            </p>
          </div>
        )}

        {/* Top Control Bar */}
        <div className="p-4 mb-6 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-4 border border-pink-200 dark:border-zinc-800">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode("auto");
                setIsPlaying(true);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === "auto"
                  ? "bg-[#8B1E3F] text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Autoplay Walkthrough
            </button>
            <button
              onClick={() => {
                setMode("interactive");
                setIsPlaying(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === "interactive"
                  ? "bg-[#8B1E3F] text-white shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Try It Yourself (Manual)
            </button>
          </div>

          {/* Autoplay Controls */}
          {mode === "auto" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Clash Simulation Trigger */}
          <button
            onClick={handleSimulateClash}
            disabled={clashSimulated}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 hover:bg-amber-200 transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate two patients at the same time</span>
          </button>
        </div>

        {/* Main Grid: Doctor Selector + WhatsApp Phone Frame + Side Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Doctor Picker (4 Doctors with Free/Busy status) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-5 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-4 h-4 text-[#8B1E3F] dark:text-[#EA96AC]" />
                <h3 className="text-sm font-bold text-[#1B1B1F] dark:text-white">
                  Clinic Doctors
                </h3>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                Pick a doctor to view their availability and schedule.
              </p>

              <div className="space-y-2.5">
                {DOCTORS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      handleRestart();
                    }}
                    className={`w-full p-3 rounded-2xl text-left border transition-all ${
                      selectedDoctor.id === doc.id
                        ? "bg-pink-50 dark:bg-pink-950/40 border-[#8B1E3F] shadow-sm"
                        : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {doc.name}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold ${doc.statusColor}`}>
                        &bull; {doc.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{doc.role}</div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-1">
                      Hours: {doc.hours}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Weekly Calendar Grid for Dr. Mehta (Mon-Fri 10:00-17:00) */}
            <div className="p-5 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Weekly Calendar
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Mon-Fri</span>
              </div>

              {/* Grid with Free (Green) and Booked (Grey) cells */}
              <div className="space-y-2 text-[10px] font-mono">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, dIdx) => (
                  <div key={day} className="flex items-center gap-1.5">
                    <span className="w-6 text-zinc-400">{day}</span>
                    <div className="flex-1 grid grid-cols-6 gap-1">
                      {[1, 2, 3, 4, 5, 6].map((slotNum) => {
                        const isBooked = (dIdx * 3 + slotNum) % 3 === 0;
                        return (
                          <div
                            key={slotNum}
                            className={`h-4 rounded-sm transition-all ${
                              isBooked
                                ? "bg-zinc-300 dark:bg-zinc-700"
                                : "bg-emerald-500 hover:scale-110"
                            }`}
                            title={isBooked ? "Booked" : "Free Slot"}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Free
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-400"></span> Booked
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: WhatsApp Mobile Phone Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[390px] rounded-[44px] border-[10px] border-zinc-800 dark:border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col h-[670px] relative">
              {/* Phone Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-800 rounded-b-xl z-30 flex items-center justify-center">
                <div className="w-10 h-1 bg-zinc-600 rounded-full" />
              </div>

              {/* WhatsApp Header */}
              <div className="pt-7 pb-3 px-4 bg-[#075E54] dark:bg-[#075E54] text-white flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {selectedDoctor.name.charAt(4)}
                  </div>
                  <div>
                    <div className="font-semibold text-xs leading-none">
                      {selectedDoctor.name}
                    </div>
                    <span className="text-[10px] text-emerald-200">
                      online &bull; 24x7 Assistant
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-emerald-100">
                  <Video className="w-4 h-4 cursor-pointer hover:text-white" />
                  <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
                  <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Chat Body Wallpaper */}
              <div
                ref={chatScrollRef}
                className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#EFEAE2] dark:bg-[#121B22] text-xs relative"
                style={{
                  backgroundImage: "radial-gradient(#00000008 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                {/* Security Encryption Notice */}
                <div className="text-center my-1">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#FFEECD] dark:bg-[#182229] text-[10px] text-[#54656F] dark:text-[#8696A0] shadow-sm">
                    🔒 Messages are end-to-end encrypted & HIPAA / DPDP compliant.
                  </span>
                </div>

                {/* Render Messages */}
                {messages.map((msg) => {
                  if (msg.sender === "system") {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="inline-block p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-200 text-[11px] leading-relaxed max-w-[90%] font-medium">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isBot = msg.sender === "bot";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] shadow-sm relative ${
                          isBot
                            ? "bg-white dark:bg-[#202C33] text-zinc-900 dark:text-zinc-100 rounded-tl-sm"
                            : "bg-[#D9FDD3] dark:bg-[#005C4B] text-zinc-900 dark:text-zinc-100 rounded-tr-sm"
                        }`}
                      >
                        <p className="whitespace-pre-line leading-relaxed text-xs">
                          {msg.text}
                        </p>

                        {/* Interactive Chips (if any) */}
                        {msg.chips && (
                          <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-700/60 flex flex-wrap gap-1.5">
                            {msg.chips.map((chip) => (
                              <button
                                key={chip}
                                onClick={() => msg.isSlots && handleSelectSlot(chip)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                  msg.isSlots
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95 cursor-pointer font-mono"
                                    : "bg-pink-50 dark:bg-pink-950/50 text-[#8B1E3F] dark:text-[#EA96AC] border border-pink-200 cursor-default"
                                }`}
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                          <span>{msg.time}</span>
                          {!isBot && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#202C33] w-16 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
                  </motion.div>
                )}

                {/* Confirming State Spinner */}
                {confirming && (
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-blue-900 dark:text-blue-300 text-center animate-pulse">
                    <span className="font-semibold text-xs">
                      Locking slot in Google Calendar & Sheets...
                    </span>
                  </div>
                )}
              </div>

              {/* WhatsApp Message Input Bar */}
              <div className="p-2.5 bg-[#F0F2F5] dark:bg-[#202C33] flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-700">
                <Smile className="w-5 h-5 text-zinc-500 cursor-pointer" />
                <Paperclip className="w-5 h-5 text-zinc-500 cursor-pointer" />
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={
                    mode === "interactive"
                      ? "Type in Hinglish (e.g. 11:30 AM chahiye)..."
                      : "Click 'Try It Yourself' to type..."
                  }
                  disabled={mode === "auto"}
                  className="flex-1 py-2 px-3 text-xs rounded-full bg-white dark:bg-[#2A3942] border-none text-zinc-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={mode === "auto" || !inputText.trim()}
                  className="p-2 rounded-full bg-[#00A884] text-white hover:bg-[#008f6f] disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Backend Inspector & 1-HR Reminder Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* 1-Hour Reminder Circular Ring Visual */}
            <div className="p-5 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 text-center">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                <span>Reminder Scheduler</span>
                <span className="font-mono text-[10px] text-purple-600 font-semibold">Active</span>
              </div>

              <div className="relative w-24 h-24 mx-auto my-3 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-zinc-200 dark:text-zinc-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#8B1E3F] transition-all duration-1000"
                    strokeDasharray="80, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-base font-extrabold text-[#8B1E3F] font-mono">1 HR</span>
                  <span className="text-[9px] text-zinc-400 uppercase font-bold">Prior</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Patient receives reminder 60 minutes before with clinic address & doctor notes.
              </p>
            </div>

            {/* Pipeline State Inspector */}
            <div className="p-5 rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 space-y-3">
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                <span>Pipeline State</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>

              <div className="text-[11px] font-mono space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="font-bold text-[#8B1E3F] dark:text-[#EA96AC]">
                    {selectedSlot ? "CONFIRMED" : currentStep >= 4 ? "SLOTS_SENT" : "COLLECTING"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Intent:</span>
                  <span className="text-emerald-600 font-bold">book_appointment</span>
                </div>
                <div className="flex justify-between">
                  <span>Doctor:</span>
                  <span className="truncate max-w-[120px]">{selectedDoctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calendar Sync:</span>
                  <span className="text-blue-500 font-bold">Synced</span>
                </div>
                <div className="flex justify-between">
                  <span>Sheets Sync:</span>
                  <span className="text-teal-600 font-bold">Appended</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={handleRestart}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
                >
                  Restart Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
