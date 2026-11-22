import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic_mehta_01";
    const doctorId = searchParams.get("doctorId");
    const status = searchParams.get("status");

    const where: any = { clinicId };
    if (doctorId && doctorId !== "all") where.doctorId = doctorId;
    if (status && status !== "all") where.status = status;

    const appointments = await db.appointment.findMany({
      where,
      include: {
        doctor: { select: { name: true, specialty: true } },
      },
      orderBy: [{ date: "desc" }, { startTime: "asc" }],
    });

    const csvRows = [
      ["Appointment ID", "Date", "Start Time", "End Time", "Doctor", "Specialty", "Patient Name", "Phone", "Problem", "Status", "Source", "Created At"],
      ...appointments.map((apt) => [
        apt.id,
        apt.date,
        apt.startTime,
        apt.endTime,
        `"${apt.doctor.name}"`,
        `"${apt.doctor.specialty}"`,
        `"${apt.patientName}"`,
        apt.phone,
        `"${apt.problem.replace(/"/g, '""')}"`,
        apt.status,
        apt.source,
        apt.createdAt.toISOString(),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Appointments_Register_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export appointments" }, { status: 500 });
  }
}
