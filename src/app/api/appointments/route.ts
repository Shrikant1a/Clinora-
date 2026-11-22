import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { checkSlotClash, calculateFreeSlots, findAlternativeSlots } from "@/lib/slots";
import { getCalendarAdapter } from "@/lib/calendar";
import { getSheetsAdapter } from "@/lib/sheets";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic_mehta_01";
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = { clinicId };
    if (doctorId && doctorId !== "all") where.doctorId = doctorId;
    if (date) where.date = date;
    if (status && status !== "all") where.status = status;
    if (search) {
      where.OR = [
        { patientName: { contains: search } },
        { phone: { contains: search } },
        { id: { contains: search } },
        { problem: { contains: search } },
      ];
    }

    const appointments = await db.appointment.findMany({
      where,
      include: {
        doctor: {
          select: { id: true, name: true, specialty: true },
        },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });

    // Detect clash indicators: check if two active appointments share same doctor, date & start time
    const clashKeys = new Set<string>();
    const seenMap = new Map<string, number>();

    appointments.forEach((apt) => {
      if (apt.status === "Booked") {
        const key = `${apt.doctorId}_${apt.date}_${apt.startTime}`;
        const count = (seenMap.get(key) || 0) + 1;
        seenMap.set(key, count);
        if (count > 1) {
          clashKeys.add(key);
        }
      }
    });

    const enriched = appointments.map((apt) => ({
      ...apt,
      isClash: apt.status === "Booked" && clashKeys.has(`${apt.doctorId}_${apt.date}_${apt.startTime}`),
    }));

    return NextResponse.json({
      appointments: enriched,
      total: appointments.length,
    });
  } catch (error) {
    console.error("Error listing appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clinicId = "clinic_mehta_01",
      doctorId,
      patientName,
      phone,
      problem,
      date,
      startTime,
      endTime,
      source = "WhatsApp",
      notes,
    } = body;

    if (!doctorId || !patientName || !phone || !date || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields: doctorId, patientName, phone, date, startTime" },
        { status: 400 }
      );
    }

    const doctor = await db.doctor.findFirst({
      where: { id: doctorId, clinicId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const computedEndTime =
      endTime ||
      (() => {
        const [h, m] = startTime.split(":").map(Number);
        const total = h * 60 + m + doctor.slotMinutes;
        return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
      })();

    // ATOMIC CLASH CHECK: re-check if overlapping active booking exists right before booking
    const existing = await db.appointment.findMany({
      where: {
        doctorId,
        date,
        status: { in: ["Booked", "Completed"] },
      },
      select: { startTime: true, endTime: true, status: true },
    });

    const hasClash = checkSlotClash({
      startTime,
      endTime: computedEndTime,
      existingBookings: existing,
    });

    if (hasClash) {
      // Find alternative slots to offer patient
      const { freeSlots } = calculateFreeSlots({
        workingStartTime: doctor.startTime,
        workingEndTime: doctor.endTime,
        slotMinutes: doctor.slotMinutes,
        existingBookings: existing,
        dateStr: date,
      });

      const alternatives = findAlternativeSlots({
        requestedStartTime: startTime,
        freeSlots,
        maxAlternatives: 3,
      });

      return NextResponse.json(
        {
          error: "Slot collision: The requested slot was just booked or is unavailable.",
          clash: true,
          requestedSlot: { startTime, endTime: computedEndTime },
          alternativeSlots: alternatives,
        },
        { status: 409 }
      );
    }

    // Generate unique Appointment ID
    const todayStr = format(new Date(), "yyyyMMdd");
    const countToday = await db.appointment.count({
      where: { date },
    });
    const appointmentId = `APT-${todayStr}-${String(countToday + 1).padStart(4, "0")}`;

    // 1. Create Calendar Event via adapter
    const calendarAdapter = getCalendarAdapter();
    const calResult = await calendarAdapter.createEvent(doctor.calendarId, {
      title: `${patientName} - ${problem}`,
      description: `Phone: ${phone}\nSource: ${source}\nBooked via Clinora`,
      date,
      startTime,
      endTime: computedEndTime,
    });

    // 2. Insert into database
    const appointment = await db.appointment.create({
      data: {
        id: appointmentId,
        clinicId,
        doctorId,
        patientName,
        phone,
        problem,
        date,
        startTime,
        endTime: computedEndTime,
        status: "Booked",
        calendarEventId: calResult.eventId,
        source,
        notes,
      },
      include: {
        doctor: true,
      },
    });

    // 3. Append to Google Sheets via adapter
    const sheetsAdapter = getSheetsAdapter();
    await sheetsAdapter.appendAppointment(
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "mock_sheet_id",
      {
        appointmentId,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm"),
        patientName,
        phone,
        problem,
        doctor: doctor.name,
        date,
        startTime,
        endTime: computedEndTime,
        status: "Booked",
        calendarEventId: calResult.eventId,
        reminderSent: "No",
        source,
      }
    );

    return NextResponse.json({
      success: true,
      appointment,
      message: `Appointment confirmed for ${patientName} with ${doctor.name} on ${date} at ${startTime}.`,
    }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}
