"use client";

import { useEffect, useState } from "react";
import { MessageSquare, AlertCircle, Phone, Clock, User, ShieldAlert, CheckCheck, X } from "lucide-react";

interface Conversation {
  id: string;
  phone: string;
  state: string;
  isEscalated: boolean;
  collectedData: any;
  messagesList: Array<{ sender: "bot" | "patient"; text: string; time: string }>;
  lastMessageAt: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [filterState, setFilterState] = useState("all");

  const loadConversations = async () => {
    setLoading(true);
    try {
      const url = filterState === "all" ? "/api/conversations" : `/api/conversations?state=${filterState}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.conversations) {
        setConversations(json.conversations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [filterState]);

  const handleToggleEscalate = async (id: string, current: boolean) => {
    try {
      await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isEscalated: !current }),
      });
      loadConversations();
      if (selectedConv && selectedConv.id === id) {
        setSelectedConv({ ...selectedConv, isEscalated: !current });
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
            WhatsApp Conversations
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor patient booking chats, AI extraction state, and human receptionist escalations.
          </p>
        </div>

        {/* Filter State Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs">
          {["all", "CONFIRMED", "SLOTS_SENT", "COLLECTING_DETAILS", "ESCALATED", "CANCELLED"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterState(st)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                  filterState === st
                    ? "bg-white dark:bg-zinc-900 text-[#8B1E3F] dark:text-[#EA96AC] shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Conversations Table */}
      <div className="rounded-3xl glass-card border border-pink-100 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 text-zinc-500 font-mono">
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">State</th>
                <th className="py-3 px-4 font-semibold">Extracted Patient Details</th>
                <th className="py-3 px-4 font-semibold">Latest Message</th>
                <th className="py-3 px-4 font-semibold">Escalation</th>
                <th className="py-3 px-4 font-semibold text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    Loading WhatsApp conversations...
                  </td>
                </tr>
              ) : conversations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No conversations found in this state.
                  </td>
                </tr>
              ) : (
                conversations.map((conv) => {
                  const lastMsg = conv.messagesList[conv.messagesList.length - 1];
                  return (
                    <tr
                      key={conv.id}
                      className={`hover:bg-pink-50/30 dark:hover:bg-zinc-900/40 transition-colors ${
                        conv.isEscalated ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {conv.phone}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            conv.state === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                              : conv.state === "ESCALATED"
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
                              : conv.state === "SLOTS_SENT"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
                              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {conv.state}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">
                        {conv.collectedData.patient_name ? (
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              {conv.collectedData.patient_name}
                            </span>
                            <span className="text-[10px] text-zinc-400 block truncate max-w-[200px]">
                              {conv.collectedData.problem || "Checkup"} &bull; {conv.collectedData.chosen_slot || "Slot pending"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">Collecting fields...</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-[240px] truncate text-zinc-700 dark:text-zinc-300">
                        {lastMsg ? `"${lastMsg.text}"` : "No messages"}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleEscalate(conv.id, conv.isEscalated)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                            conv.isEscalated
                              ? "bg-red-600 text-white animate-pulse"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          {conv.isEscalated ? "⚠️ Escalated" : "Escalate to Human"}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedConv(conv)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#8B1E3F] dark:text-[#EA96AC] hover:bg-pink-50 dark:hover:bg-zinc-800"
                        >
                          View Transcript
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Viewer Modal */}
      {selectedConv && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl glass-card bg-white dark:bg-[#15101A] border border-pink-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>Chat: {selectedConv.phone}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800">
                    {selectedConv.state}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  AI Intent: book_appointment &bull; Hinglish NLP
                </div>
              </div>
              <button
                onClick={() => setSelectedConv(null)}
                className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2] dark:bg-[#121B22] text-xs">
              {selectedConv.messagesList.map((msg, i) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] shadow-sm ${
                        isBot
                          ? "bg-white dark:bg-[#202C33] text-zinc-900 dark:text-zinc-100 rounded-tl-sm"
                          : "bg-[#D9FDD3] dark:bg-[#005C4B] text-zinc-900 dark:text-zinc-100 rounded-tr-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                        <span>{msg.time}</span>
                        {!isBot && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60 text-xs">
              <button
                onClick={() => handleToggleEscalate(selectedConv.id, selectedConv.isEscalated)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  selectedConv.isEscalated
                    ? "bg-zinc-200 text-zinc-700"
                    : "bg-red-600 text-white"
                }`}
              >
                {selectedConv.isEscalated ? "Resolve Escalation" : "Escalate to Human Receptionist"}
              </button>

              <button
                onClick={() => setSelectedConv(null)}
                className="px-4 py-1.5 rounded-xl font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
