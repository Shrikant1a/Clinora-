import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getWhatsAppAdapter } from "@/lib/whatsapp";
import { format } from "date-fns";

/**
 * 60-Minute Automated Reminder Cron Job
 * Checks for appointments starting in the next 60 minutes where reminderSent = false,
 * sends WhatsApp reminder message and marks reminderSent = true.
 */
export async function GET() {
  try {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const windowStart = currentMinutes + 45; // 45 to 75 minutes ahead
    const windowEnd = currentMinutes + 75;

    const upcomingAppointments = await db.appointment.findMany({
      where: {
        date: todayStr,
        status: "Booked",
        reminderSent: false,
      },
      include: { doctor: true, clinic: true },
    });

    const wa = getWhatsAppAdapter();
    const dispatched = [];

    for (const apt of upcomingAppointments) {
      const [h, m] = apt.startTime.split(":").map(Number);
      const aptMinutes = h * 60 + m;

      if (aptMinutes >= windowStart && aptMinutes <= windowEnd) {
        const reminderMsg = `⏰ Reminder: Dr. ${apt.doctor.name} ke saath aapki appointment aaj ${apt.startTime} baje hai. Kripya 10 minute pehle clinic pahunchiye: ${apt.clinic.address || "Main Clinic"}.`;
        await wa.sendTextMessage(apt.phone, reminderMsg);

        await db.appointment.update({
          where: { id: apt.id },
          data: {
            reminderSent: true,
            reminderSentAt: new Date(),
          },
        });

        dispatched.push({
          appointmentId: apt.id,
          patient: apt.patientName,
          phone: apt.phone,
          time: apt.startTime,
        });
      }
    }

    return NextResponse.json({
      success: true,
      remindersSentCount: dispatched.length,
      dispatched,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Reminder cron error:", error);
    return NextResponse.json({ error: "Reminder job failed" }, { status: 500 });
  }
}
