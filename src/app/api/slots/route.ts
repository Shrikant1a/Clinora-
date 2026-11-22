import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { calculateFreeSlots } from "@/lib/slots";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const dateStr = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");
    const clinicId = searchParams.get("clinicId") || "clinic_mehta_01";

    if (!doctorId) {
      return NextResponse.json({ error: "doctorId parameter is required" }, { status: 400 });
    }

    const doctor = await db.doctor.findFirst({
      where: { id: doctorId, clinicId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Fetch existing non-cancelled bookings
    const existingBookings = await db.appointment.findMany({
      where: {
        doctorId,
        date: dateStr,
        status: { in: ["Booked", "Completed"] },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    });

    const isToday = dateStr === format(new Date(), "yyyy-MM-dd");
    const now = new Date();
    const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : undefined;

    const { freeSlots, allSlots } = calculateFreeSlots({
      workingStartTime: doctor.startTime,
      workingEndTime: doctor.endTime,
      slotMinutes: doctor.slotMinutes,
      existingBookings,
      dateStr,
      isToday,
      currentTimeMinutes: currentMinutes,
    });

    return NextResponse.json({
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        workingDays: doctor.workingDays,
        workingHours: `${doctor.startTime} - ${doctor.endTime}`,
        slotMinutes: doctor.slotMinutes,
      },
      date: dateStr,
      freeSlots,
      allSlots,
      totalSlots: allSlots.length,
      availableCount: freeSlots.length,
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json({ error: "Failed to calculate slots" }, { status: 500 });
  }
}
