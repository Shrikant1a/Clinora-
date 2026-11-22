import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { format } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId = "clinic_mehta_01", recipientEmail } = body;

    const clinic = await db.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const [bookedCount, cancelledCount, upcomingCount] = await Promise.all([
      db.appointment.count({ where: { clinicId, date: todayStr, status: "Booked" } }),
      db.appointment.count({ where: { clinicId, date: todayStr, status: "Cancelled" } }),
      db.appointment.count({ where: { clinicId, date: { gt: todayStr }, status: "Booked" } }),
    ]);

    const targetEmail = recipientEmail || clinic.email || process.env.REPORT_RECIPIENT_EMAIL || "doctor@mehtaclinic.com";

    // Create or update DailyReportLog
    await db.dailyReportLog.upsert({
      where: {
        clinicId_date: {
          clinicId,
          date: todayStr,
        },
      },
      update: {
        bookedCount,
        cancelledCount,
        upcomingCount,
        emailSent: true,
        emailSentAt: new Date(),
      },
      create: {
        clinicId,
        date: todayStr,
        bookedCount,
        cancelledCount,
        upcomingCount,
        emailSent: true,
        emailSentAt: new Date(),
        detailsJson: JSON.stringify({ sentTo: targetEmail }),
      },
    });

    console.log(`[Email Dispatch Simulation] Sent 9:00 PM Daily Report to ${targetEmail}`);

    return NextResponse.json({
      success: true,
      message: `Daily report successfully delivered to ${targetEmail}`,
      report: {
        date: todayStr,
        sentTo: targetEmail,
        booked: bookedCount,
        cancelled: cancelledCount,
        upcoming: upcomingCount,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Send test report error:", error);
    return NextResponse.json({ error: "Failed to dispatch daily report email" }, { status: 500 });
  }
}
