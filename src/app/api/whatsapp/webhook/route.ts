import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyWebhookSignature, getWhatsAppAdapter } from "@/lib/whatsapp";
import { parseWhatsAppMessage } from "@/lib/ai-assistant";
import { calculateFreeSlots, checkSlotClash } from "@/lib/slots";
import { format } from "date-fns";

/**
 * Meta WhatsApp Cloud API Webhook Handler
 */
export async function GET(req: NextRequest) {
  // Webhook verification challenge from Meta Developer Portal
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || "clinic_verify_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    console.log("✅ Meta WhatsApp Webhook verified successfully");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256") || undefined;

    // Verify HMAC signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn("⚠️ Invalid WhatsApp webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Filter out status delivery callbacks (sent, delivered, read)
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const messages = change?.value?.messages;

    if (!messages || messages.length === 0) {
      // It's a delivery status update; acknowledge 200
      return NextResponse.json({ status: "status_update_received" }, { status: 200 });
    }

    const messageObj = messages[0];
    const fromPhone = messageObj.from;
    const incomingText = messageObj.text?.body || messageObj.interactive?.button_reply?.title || "";

    if (!incomingText) {
      return NextResponse.json({ status: "ignored_non_text" }, { status: 200 });
    }

    const clinicId = "clinic_mehta_01";
    const clinic = await db.clinic.findUnique({
      where: { id: clinicId },
      include: { doctors: true },
    });

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    // Retrieve or create conversation record
    let conversation = await db.conversation.findUnique({
      where: {
        clinicId_phone: { clinicId, phone: fromPhone },
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          clinicId,
          phone: fromPhone,
          state: "NEW",
          collectedJson: "{}",
          transcript: "[]",
        },
      });
    }

    const existingData = JSON.parse(conversation.collectedJson || "{}");
    const currentTranscript = JSON.parse(conversation.transcript || "[]");

    // Add user message to transcript
    currentTranscript.push({
      sender: "patient",
      text: incomingText,
      time: format(new Date(), "hh:mm a"),
    });

    // Run AI safety and extraction logic
    const parsed = parseWhatsAppMessage({
      incomingMessage: incomingText,
      currentState: conversation.state,
      clinicName: clinic.name,
      emergencyNumber: clinic.emergencyPhone || "+91 98200 99999",
      existingData,
    });

    const waAdapter = getWhatsAppAdapter();

    // Handle intents
    let botReply = parsed.reply;
    let nextState = conversation.state;

    if (parsed.intent === "escalate") {
      nextState = "ESCALATED";
      await waAdapter.sendTextMessage(fromPhone, botReply);
    } else if (parsed.intent === "choose_slot") {
      // Patient chose a slot
      const chosenSlot = parsed.chosen_slot || incomingText;
      const targetDate = existingData.preferred_date || format(new Date(), "yyyy-MM-dd");
      const defaultDoc = clinic.doctors[0];

      // Recheck availability
      const existing = await db.appointment.findMany({
        where: {
          doctorId: defaultDoc.id,
          date: targetDate,
          status: { in: ["Booked", "Completed"] },
        },
        select: { startTime: true, endTime: true, status: true },
      });

      const clash = checkSlotClash({
        startTime: chosenSlot,
        endTime: "12:00", // approximate
        existingBookings: existing,
      });

      if (clash) {
        botReply = `Maaf kijiye, ${chosenSlot} slot abhi abhi kisi aur patient dwara book ho gaya hai. Dr. Mehta ke doosre available slots: 02:00 PM, 04:30 PM. Kripya naya slot chuniye.`;
        nextState = "SLOTS_SENT";
      } else {
        const aptId = `APT-${targetDate.replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
        await db.appointment.create({
          data: {
            id: aptId,
            clinicId,
            doctorId: defaultDoc.id,
            patientName: existingData.patient_name || "Patient",
            phone: fromPhone,
            problem: existingData.problem || "Consultation",
            date: targetDate,
            startTime: chosenSlot,
            endTime: "12:00",
            status: "Booked",
            source: "WhatsApp",
          },
        });

        botReply = `Aapki appointment Dr. ${defaultDoc.name} ke saath ${targetDate} ko ${chosenSlot} par confirm ho gayi hai! Appointment se 1 ghante pehle reminder aayega.`;
        nextState = "CONFIRMED";
      }

      await waAdapter.sendTextMessage(fromPhone, botReply);
    } else if (parsed.intent === "book") {
      if (parsed.patient_name && parsed.problem && parsed.preferred_date) {
        // We have all details! Fetch and propose free slots
        const defaultDoc = clinic.doctors[0];
        const existing = await db.appointment.findMany({
          where: {
            doctorId: defaultDoc.id,
            date: parsed.preferred_date,
            status: { in: ["Booked", "Completed"] },
          },
          select: { startTime: true, endTime: true, status: true },
        });

        const { freeSlots } = calculateFreeSlots({
          workingStartTime: defaultDoc.startTime,
          workingEndTime: defaultDoc.endTime,
          slotMinutes: defaultDoc.slotMinutes,
          existingBookings: existing,
          dateStr: parsed.preferred_date,
        });

        const slotListStr = freeSlots.slice(0, 4).map((s) => s.label).join(", ");
        botReply = `Dr. ${defaultDoc.name} ke khali timings (${parsed.preferred_date}):\n${slotListStr}\n\nKaunsa time comfortable rahega?`;
        nextState = "SLOTS_SENT";
      } else {
        nextState = "COLLECTING_DETAILS";
      }
      await waAdapter.sendTextMessage(fromPhone, botReply);
    } else {
      await waAdapter.sendTextMessage(fromPhone, botReply);
    }

    // Add bot reply to transcript
    currentTranscript.push({
      sender: "bot",
      text: botReply,
      time: format(new Date(), "hh:mm a"),
    });

    // Update conversation state in DB
    await db.conversation.update({
      where: { id: conversation.id },
      data: {
        state: nextState,
        isEscalated: nextState === "ESCALATED",
        collectedJson: JSON.stringify({
          patient_name: parsed.patient_name || existingData.patient_name,
          problem: parsed.problem || existingData.problem,
          preferred_date: parsed.preferred_date || existingData.preferred_date,
          doctor: parsed.doctor || existingData.doctor,
        }),
        transcript: JSON.stringify(currentTranscript),
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, intent: parsed.intent, nextState });
  } catch (err: any) {
    console.error("WhatsApp webhook error:", err);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
