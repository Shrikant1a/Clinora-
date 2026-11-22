import { describe, it, expect } from "vitest";
import { parseWhatsAppMessage, detectEmergency } from "../src/lib/ai-assistant";

describe("AI Assistant NLP & Safety Guardrails", () => {
  const clinicInfo = {
    clinicName: "Dr. Mehta Family Clinic",
    emergencyNumber: "+91 98200 99999",
  };

  it("detects life-threatening emergencies and triggers immediate escalation", () => {
    expect(detectEmergency("I have severe chest pain and cannot breathe")).toBe(true);
    expect(detectEmergency("bohot tez seene me dard ho raha hai")).toBe(true);
    expect(detectEmergency("patient is unconscious and bleeding")).toBe(true);
    expect(detectEmergency("routine fever checkup")).toBe(false);

    const result = parseWhatsAppMessage({
      incomingMessage: "Doctor emergency hai, patient ko severe chest pain ho raha hai",
      currentState: "NEW",
      ...clinicInfo,
    });

    expect(result.intent).toBe("escalate");
    expect(result.is_emergency).toBe(true);
    expect(result.reply).toContain("+91 98200 99999");
  });

  it("correctly extracts Hinglish booking details and asks for missing info", () => {
    // 1. Initial greeting with incomplete details
    const res1 = parseWhatsAppMessage({
      incomingMessage: "Hi doctor ki appointment chahiye",
      currentState: "NEW",
      ...clinicInfo,
    });

    expect(res1.intent).toBe("book");
    expect(res1.reply).toContain("Naam, Problem aur kis date");

    // 2. Patient provides name
    const res2 = parseWhatsAppMessage({
      incomingMessage: "Mera naam Rahul Verma hai",
      currentState: "COLLECTING_DETAILS",
      existingData: { patient_name: "Rahul Verma" },
      ...clinicInfo,
    });

    expect(res2.patient_name).toBe("Rahul Verma");
    expect(res2.reply).toContain("Rahul Verma ji");

    // 3. Patient selects a slot
    const res3 = parseWhatsAppMessage({
      incomingMessage: "11:30 AM ka time theek rahega",
      currentState: "SLOTS_SENT",
      existingData: {
        patient_name: "Rahul Verma",
        problem: "Viral fever",
        preferred_date: "2026-11-23",
      },
      ...clinicInfo,
    });

    expect(res3.intent).toBe("choose_slot");
    expect(res3.chosen_slot).toContain("11:30 AM");
  });

  it("handles appointment cancellation requests politely", () => {
    const res = parseWhatsAppMessage({
      incomingMessage: "Mujhe aaj ki appointment cancel karni hai",
      currentState: "CONFIRMED",
      ...clinicInfo,
    });

    expect(res.intent).toBe("cancel");
    expect(res.reply).toContain("cancel karne ki request");
  });
});
