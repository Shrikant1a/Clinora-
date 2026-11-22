# Clinora: Appointments That Book Themselves

> Complete, turnkey per-clinic appointment automation pipeline (priced at **Rs. 25,000 one-time setup**).
> Pipeline: **WhatsApp &rarr; OpenAI GPT &rarr; Google Calendar &rarr; Google Sheets** with 1-hour prior reminders and 9:00 PM owner reports.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested with Node.js v22)
- npm 9+

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Push Prisma database schema (SQLite for local dev)
npx prisma db push

# 3. Seed realistic clinic, doctors, and 50+ appointments
npm run seed

# 4. Run automated test suite
npm run test

# 5. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the landing page and interactive simulator.

---

## 2. Default Credentials & Test Endpoints

| Portal | URL | Credentials |
|---|---|---|
| **Landing Page** | `http://localhost:3000` | Public |
| **Interactive Simulator** | `http://localhost:3000/demo` | Public |
| **Book a Demo Form** | `http://localhost:3000/book-demo` | Public |
| **Admin Login** | `http://localhost:3000/login` | `admin@clinicautomation.com` / `clinicAdmin2026!secure` |
| **Admin Dashboard** | `http://localhost:3000/dashboard` | Session Cookie Protected |
| **Health API** | `http://localhost:3000/api/health` | Public |

---

## 3. Product Architecture & 5 Stages

```
PATIENT (WhatsApp)
       │
       ▼
[1] WhatsApp Webhook (n8n / Next.js) ──► Session / State Lookup
       │
       ▼
[2] AI Agent (OpenAI GPT-4o) ◄──► Extract: Name, Problem, Date, Doctor, Slot
       │
       ├──► Need slots? ──► Google Calendar: List events ──► Compute FREE slots ──► Reply on WhatsApp
       │
       └──► Slot chosen? ──► Re-check availability (Race-condition protection)
                                │
                      ┌─────────┴─────────┐
                   Free?                 Taken / Clash?
                      │                         │
                      ▼                         ▼
         Create Calendar Event        Propose closest alternative slots
                      │
                      ▼
         Append row to Google Sheets (Appointments_Register)
                      │
                      ▼
         Send WhatsApp Confirmation
```

### Scheduled Automations
1. **1-Hour Automated Reminder (Runs every 5 mins)**:
   - Queries bookings starting in 60 minutes where `reminder_sent = false`.
   - Dispatches Meta-approved WhatsApp template to patient.
   - Updates `reminder_sent = true`.
2. **9:00 PM Daily Report Email (Runs at 21:00 IST)**:
   - Aggregates day's Booked, Cancelled, and Upcoming patients.
   - Calculates estimated hours saved (87% reduction).
   - Delivers executive HTML summary email to clinic owner via Gmail / SMTP.

---

## 4. Production Ready n8n Workflow JSON

The complete 18-node ready-to-import n8n workflow JSON is located at:
`n8n/clinic-automation-workflow.json`

Detailed node-by-node setup instructions, credential mappings, and test payloads are documented in:
[n8n/README.md](file:///s:/Clinic%20website/n8n/README.md)

---

## 5. Connecting Real Third-Party APIs

### A. Meta WhatsApp Cloud API
1. Create an app on [developers.facebook.com](https://developers.facebook.com).
2. Add WhatsApp product, generate a permanent System User Token with `whatsapp_business_messaging`.
3. Set in `.env`:
   ```env
   WHATSAPP_API_TOKEN=EAAG...
   WHATSAPP_PHONE_NUMBER_ID=109823487192837
   WHATSAPP_VERIFY_TOKEN=clinic_verify_token_2026
   WHATSAPP_WEBHOOK_SECRET=meta_app_secret
   ```
4. Set Webhook Callback URL: `https://your-domain.com/api/whatsapp/webhook`
5. The adapter in `src/lib/whatsapp.ts` automatically switches from Mock mode to Meta Cloud API mode when credentials are provided.

### B. Google Calendar & Google Sheets
1. Create a Google Cloud Project and enable **Google Calendar API** and **Google Sheets API**.
2. Create a Service Account and download its JSON key.
3. Share each doctor's Google Calendar with the Service Account email (`editor` permission).
4. Share the Google Sheet spreadsheet with the Service Account email.
5. Set in `.env`:
   ```env
   GOOGLE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   GOOGLE_SHEETS_SPREADSHEET_ID=1A2B3C4D5E6F...
   ```
6. The adapters in `src/lib/calendar.ts` and `src/lib/sheets.ts` automatically connect.

---

## 6. Directory Structure

```
clinic-automation/
├── prisma/
│   ├── schema.prisma                  # Clinic, Doctor, Appointment, Conversation, Lead, DailyReportLog
│   └── seed.ts                        # 50+ realistic appointments & 4 doctors seed
├── n8n/
│   ├── clinic-automation-workflow.json# Complete 18-node production-ready workflow
│   └── README.md                      # Node setup & sample payloads
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx               # Main high-converting landing page
│   │   │   ├── demo/page.tsx          # Full-screen WhatsApp simulator
│   │   │   ├── book-demo/page.tsx     # Zod validated demo booking form
│   │   │   └── login/page.tsx         # Admin authentication
│   │   ├── dashboard/
│   │   │   ├── layout.tsx             # Collapsible sidebar & clinic switcher
│   │   │   ├── page.tsx               # Analytics overview & Recharts trend
│   │   │   ├── appointments/page.tsx  # Appointments Register with CLASH alerts & CSV export
│   │   │   ├── doctors/page.tsx       # Doctors management & calendar IDs
│   │   │   ├── conversations/page.tsx # WhatsApp conversation state & transcripts
│   │   │   ├── reports/page.tsx       # 9:00 PM Daily Email preview & test sender
│   │   │   └── settings/page.tsx      # Clinic settings, webhook, pricing
│   │   └── api/                       # Next.js App Router route handlers
│   ├── components/
│   │   ├── landing/                   # Hero, Problem, Timeline, Features, ROI, Pricing, FAQ
│   │   ├── demo/                      # WhatsApp phone frame, calendar grid, clash simulation
│   │   └── Navbar.tsx, ThemeToggle.tsx
│   ├── lib/
│   │   ├── db.ts                      # Prisma client singleton
│   │   ├── auth.ts                    # JWT session & bcrypt helpers
│   │   ├── slots.ts                   # Slot calculation & clash resolution algorithm
│   │   ├── ai-assistant.ts            # Hinglish extraction & medical emergency guardrails
│   │   ├── calendar.ts                # Google Calendar adapter
│   │   ├── sheets.ts                  # Google Sheets adapter
│   │   └── whatsapp.ts                # WhatsApp Cloud API adapter & signature validation
├── tests/                             # Vitest automated unit tests
│   ├── slots.test.ts
│   ├── ai-assistant.test.ts
│   └── whatsapp.test.ts
├── Dockerfile & docker-compose.yml
└── README.md
```

---

## 7. Compliance & Safety Guardrails
- **No Medical Diagnosis**: The AI assistant only collects scheduling parameters (Name, Problem, Date, Doctor, Slot). It strictly never diagnoses conditions or prescribes medications.
- **Emergency Escalation**: When critical keywords like "chest pain", "heart attack", or "heavy bleeding" are detected, intent is immediately set to `escalate`, giving the patient the clinic emergency number and alerting the front desk.
- **DPDP Act 2023**: Minimal data retention (name, phone, general reason). No clinical histories are stored.
