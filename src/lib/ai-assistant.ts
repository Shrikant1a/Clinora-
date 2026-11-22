import { z } from "zod";

/**
 * Safety & AI Guardrails Specification:
 * - The AI assistant MUST only collect appointment-related details: Name, Problem, Date, Doctor, Slot.
 * - NEVER diagnose medical conditions or prescribe medicines.
 * - NEVER invent doctor availability.
 * - Ask follow-up questions when information is missing.
 * - Detect medical emergencies (chest pain, heavy bleeding, loss of consciousness, stroke symptoms)
 *   and immediately return intent = "escalate" with emergency helpline.
 * - Support Hindi, English, and Hinglish.
 */

export const ExtractionSchema = z.object({
  intent: z.enum(["book", "choose_slot", "cancel", "reschedule", "info", "escalate"]),
  patient_name: z.string().nullable(),
  problem: z.string().nullable(),
  preferred_date: z.string().nullable(),
  doctor: z.string().nullable(),
  chosen_slot: z.string().nullable(),
  reply: z.string(),
  is_emergency: z.boolean().default(false),
});

export type ExtractedBookingIntent = z.infer<typeof ExtractionSchema>;

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "heavy bleeding",
  "unconscious",
  "stroke",
  "cannot breathe",
  "difficulty breathing",
  "saans nahi aa rahi",
  "seene me dard",
  "khoon beh raha",
  "emergency",
  "behosh",
];

export function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Fast Rule-Based & NLP Parser for Hinglish / English messages.
 * Works even when OpenAI API key is not configured, with structured schema fallback.
 */
export function parseWhatsAppMessage(params: {
  incomingMessage: string;
  currentState: string;
  clinicName: string;
  emergencyNumber: string;
  existingData?: {
    patient_name?: string | null;
    problem?: string | null;
    preferred_date?: string | null;
    doctor?: string | null;
  };
}): ExtractedBookingIntent {
  const { incomingMessage, currentState, clinicName, emergencyNumber, existingData = {} } = params;
  const lower = incomingMessage.trim().toLowerCase();

  // 1. Emergency Safety Filter
  if (detectEmergency(incomingMessage)) {
    return {
      intent: "escalate",
      patient_name: existingData.patient_name || null,
      problem: incomingMessage,
      preferred_date: null,
      doctor: null,
      chosen_slot: null,
      reply: `⚠️ EMERGENCY ALERT: Yadi aapko severe medical emergency hai, kripya bina deri kiye hamare emergency number ${emergencyNumber} par turant call karein ya nazdeeki hospital emergency room jayein. Humne clinic staff ko alert kar diya hai.`,
      is_emergency: true,
    };
  }

  // 2. Cancellation Intent
  if (lower.includes("cancel") || lower.includes("radd") || lower.includes("nahi aana")) {
    return {
      intent: "cancel",
      patient_name: existingData.patient_name || null,
      problem: existingData.problem || null,
      preferred_date: existingData.preferred_date || null,
      doctor: existingData.doctor || null,
      chosen_slot: null,
      reply: "Aapki appointment cancel karne ki request mili hai. Kripya apna registered appointment number ya phone confirm karein.",
      is_emergency: false,
    };
  }

  // 3. Slot Selection Intent (e.g., "11:30 AM", "slot 2", "10:00", "4:00 PM")
  const slotMatch = incomingMessage.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (currentState === "SLOTS_SENT" || (slotMatch && (lower.includes("am") || lower.includes("pm") || lower.includes("baje")))) {
    const rawSlot = slotMatch ? slotMatch[0].trim() : incomingMessage.trim();
    return {
      intent: "choose_slot",
      patient_name: existingData.patient_name || null,
      problem: existingData.problem || null,
      preferred_date: existingData.preferred_date || null,
      doctor: existingData.doctor || null,
      chosen_slot: rawSlot,
      reply: `Checking availability for ${rawSlot}...`,
      is_emergency: false,
    };
  }

  // 4. Initial greeting or missing details extraction
  let extractedName = existingData.patient_name || null;
  let extractedProblem = existingData.problem || null;
  let extractedDate = existingData.preferred_date || null;
  let extractedDoctor = existingData.doctor || null;

  // Name extraction heuristic: "mera naam [Name] hai" or "name is [Name]" or "I am [Name]"
  const nameMatch = incomingMessage.match(/(?:naam|name is|i am|mera naam)\s+([A-Za-z\s]+?)(?:hai|\.|,|$)/i);
  if (nameMatch && nameMatch[1]) {
    extractedName = nameMatch[1].trim();
  }

  // Problem extraction: "fever", "pain", "dard", "cough", "consultation", "diabetic"
  const problemKeywords = ["fever", "bukhar", "pain", "dard", "cough", "cold", "infection", "vaccination", "checkup", "consultation", "teeth", "tooth", "back pain", "knee"];
  for (const kw of problemKeywords) {
    if (lower.includes(kw)) {
      extractedProblem = incomingMessage.replace(/(?:mera naam|hi|hello|dr|appointment chahiye|chahiye)/gi, "").trim();
      break;
    }
  }

  // Date extraction: "aaj", "today", "kal", "tomorrow", or "YYYY-MM-DD" or "DD/MM"
  if (lower.includes("aaj") || lower.includes("today")) {
    extractedDate = new Date().toISOString().split("T")[0];
  } else if (lower.includes("kal") || lower.includes("tomorrow")) {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    extractedDate = tom.toISOString().split("T")[0];
  }

  // Doctor extraction: "mehta", "sharma", "rao", "iyer"
  if (lower.includes("mehta")) extractedDoctor = "Dr. Rajesh Mehta";
  else if (lower.includes("sharma")) extractedDoctor = "Dr. Sunita Sharma";
  else if (lower.includes("rao")) extractedDoctor = "Dr. Anand Rao";
  else if (lower.includes("iyer")) extractedDoctor = "Dr. Priya Iyer";

  // Build appropriate conversational reply
  if (!extractedName && !extractedProblem) {
    return {
      intent: "book",
      patient_name: null,
      problem: null,
      preferred_date: null,
      doctor: null,
      chosen_slot: null,
      reply: `Namaste! ${clinicName} mein swagat hai. Kripya apna Naam, Problem aur kis date par appointment chahiye bata dijiye.`,
      is_emergency: false,
    };
  }

  if (extractedName && !extractedProblem) {
    return {
      intent: "book",
      patient_name: extractedName,
      problem: null,
      preferred_date: extractedDate,
      doctor: extractedDoctor,
      chosen_slot: null,
      reply: `Dhanyawad ${extractedName} ji. Kripya apni takleef ya appointment ka reason bata dijiye.`,
      is_emergency: false,
    };
  }

  if (extractedName && extractedProblem && !extractedDate) {
    return {
      intent: "book",
      patient_name: extractedName,
      problem: extractedProblem,
      preferred_date: null,
      doctor: extractedDoctor,
      chosen_slot: null,
      reply: `Samajh gaya ${extractedName} ji. Aap kis din aana chahenge? (Aaj, Kal ya koi specific date?)`,
      is_emergency: false,
    };
  }

  return {
    intent: "book",
    patient_name: extractedName,
    problem: extractedProblem,
    preferred_date: extractedDate,
    doctor: extractedDoctor,
    chosen_slot: null,
    reply: "Doctor ka calendar check kiya ja raha hai...",
    is_emergency: false,
  };
}
