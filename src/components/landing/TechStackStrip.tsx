export function TechStackStrip() {
  const stack = [
    { name: "Meta WhatsApp Cloud API", role: "Inbound & Outbound Messaging", icon: "💬" },
    { name: "n8n Workflow Engine", role: "Self-Hosted or Cloud Orchestration", icon: "⚡" },
    { name: "Google Calendar API", role: "Doctor Availability & Event Locking", icon: "📅" },
    { name: "Google Sheets API", role: "Appointments_Register & Logging", icon: "📊" },
    { name: "OpenAI GPT-4o", role: "Hinglish NLP & Missing Info Collection", icon: "🧠" },
    { name: "Next.js 14 App Router", role: "Modern Admin Portal & Webhooks", icon: "▲" },
    { name: "Prisma ORM & SQLite", role: "Multi-Clinic Isolated Storage", icon: "💎" },
  ];

  return (
    <section className="py-12 bg-white dark:bg-[#0F0D15] border-t border-b border-pink-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-8">
          Enterprise Medical Stack &bull; Tested on Production Infrastructure
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 items-center">
          {stack.map((item) => (
            <div
              key={item.name}
              className="p-3.5 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-center hover:border-pink-200 dark:hover:border-zinc-700 transition-colors"
            >
              <span className="text-2xl mb-1.5 block">{item.icon}</span>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {item.name}
              </div>
              <div className="text-[10px] text-zinc-500 truncate mt-0.5">{item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
