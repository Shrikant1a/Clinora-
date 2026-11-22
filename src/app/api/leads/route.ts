import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const LeadSchema = z.object({
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
  doctorsCount: z.coerce.number().min(1).default(1),
  dailyVolume: z.coerce.number().min(10).default(50),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const result = LeadSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { clinicName, contactPerson, phone, email, doctorsCount, dailyVolume, message } = result.data;

    // 1. Save Lead to database
    const lead = await db.lead.create({
      data: {
        clinicName,
        contactPerson,
        phone,
        email,
        doctorsCount,
        dailyVolume,
        message,
        status: "NEW",
      },
    });

    // 2. Forward to n8n Webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET || "",
          },
          body: JSON.stringify({
            event: "lead_created",
            lead,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.warn("n8n webhook forward warning (webhook might be offline):", webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: "Thank you! Our automation engineer will connect within 2 business hours.",
    }, { status: 201 });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json({ error: "Failed to submit demo request" }, { status: 500 });
  }
}
