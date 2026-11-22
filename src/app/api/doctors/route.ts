import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic_mehta_01";

    const doctors = await db.doctor.findMany({
      where: { clinicId },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { appointments: true },
        },
      },
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clinicId = "clinic_mehta_01",
      name,
      specialty,
      calendarId,
      workingDays = "Mon,Tue,Wed,Thu,Fri,Sat",
      startTime = "10:00",
      endTime = "17:30",
      slotMinutes = 30,
    } = body;

    if (!name || !specialty || !calendarId) {
      return NextResponse.json(
        { error: "Name, specialty, and calendarId are required" },
        { status: 400 }
      );
    }

    const doctor = await db.doctor.create({
      data: {
        clinicId,
        name,
        specialty,
        calendarId,
        workingDays,
        startTime,
        endTime,
        slotMinutes: Number(slotMinutes) || 30,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, doctor }, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, specialty, calendarId, workingDays, startTime, endTime, slotMinutes, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Doctor id is required" }, { status: 400 });
    }

    const doctor = await db.doctor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(specialty && { specialty }),
        ...(calendarId && { calendarId }),
        ...(workingDays && { workingDays }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(slotMinutes !== undefined && { slotMinutes: Number(slotMinutes) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, doctor });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}
