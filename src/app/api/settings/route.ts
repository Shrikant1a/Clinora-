import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic_mehta_01";

    const clinic = await db.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    return NextResponse.json({ clinic });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to load clinic settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clinicId = "clinic_mehta_01",
      name,
      phone,
      email,
      address,
      emergencyPhone,
      setupPrice,
      timezone,
      reminderLeadMinutes,
      reportHour,
      languages,
      n8nWebhookUrl,
    } = body;

    const updated = await db.clinic.update({
      where: { id: clinicId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(address !== undefined && { address }),
        ...(emergencyPhone && { emergencyPhone }),
        ...(setupPrice !== undefined && { setupPrice: Number(setupPrice) }),
        ...(timezone && { timezone }),
        ...(reminderLeadMinutes !== undefined && { reminderLeadMinutes: Number(reminderLeadMinutes) }),
        ...(reportHour !== undefined && { reportHour: Number(reportHour) }),
        ...(languages && { languages }),
        ...(n8nWebhookUrl !== undefined && { n8nWebhookUrl }),
      },
    });

    return NextResponse.json({ success: true, clinic: updated });
  } catch (error) {
    console.error("Settings PATCH error:", error);
    return NextResponse.json({ error: "Failed to update clinic settings" }, { status: 500 });
  }
}
