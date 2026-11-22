import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCalendarAdapter } from "@/lib/calendar";
import { getSheetsAdapter } from "@/lib/sheets";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, date, startTime, endTime, notes } = body;

    const existing = await db.appointment.findUnique({
      where: { id },
      include: { doctor: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const updated = await db.appointment.update({
      where: { id },
      data: {
        status: status || existing.status,
        date: date || existing.date,
        startTime: startTime || existing.startTime,
        endTime: endTime || existing.endTime,
        notes: notes !== undefined ? notes : existing.notes,
      },
      include: { doctor: true },
    });

    // Sync with Google Calendar
    if (existing.calendarEventId) {
      const calAdapter = getCalendarAdapter();
      if (status === "Cancelled") {
        await calAdapter.deleteEvent(existing.doctor.calendarId, existing.calendarEventId);
      } else if (date || startTime || endTime) {
        await calAdapter.updateEvent(existing.doctor.calendarId, existing.calendarEventId, {
          date: date || existing.date,
          startTime: startTime || existing.startTime,
          endTime: endTime || existing.endTime,
        });
      }
    }

    // Sync with Google Sheets
    if (status) {
      const sheets = getSheetsAdapter();
      await sheets.updateStatus(process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "mock_sheet", id, status);
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const existing = await db.appointment.findUnique({
      where: { id },
      include: { doctor: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    await db.appointment.update({
      where: { id },
      data: { status: "Cancelled" },
    });

    if (existing.calendarEventId) {
      const cal = getCalendarAdapter();
      await cal.deleteEvent(existing.doctor.calendarId, existing.calendarEventId);
    }

    return NextResponse.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}
