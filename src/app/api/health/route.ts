import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCalendarAdapter } from "@/lib/calendar";
import { getSheetsAdapter } from "@/lib/sheets";
import { getWhatsAppAdapter } from "@/lib/whatsapp";

export async function GET() {
  try {
    // 1. Verify DB
    await db.clinic.findFirst();

    const cal = getCalendarAdapter();
    const sheets = getSheetsAdapter();
    const wa = getWhatsAppAdapter();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        calendar: cal.isMock() ? "mock" : "live_connected",
        sheets: sheets.isMock() ? "mock" : "live_connected",
        whatsapp: wa.isMock() ? "mock" : "live_connected",
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "unhealthy", error: err.message },
      { status: 500 }
    );
  }
}
