import { NextRequest, NextResponse } from "next/server";
import { createToken, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "admin@clinicautomation.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "clinicAdmin2026!secure";

    // Direct check or bcrypt check
    const isValidUser = email === expectedEmail;
    const isValidPass = password === expectedPassword || (await verifyPassword(password, expectedPassword).catch(() => false));

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = createToken({
      email,
      role: "admin",
      clinicId: "clinic_mehta_01",
    });

    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { email, role: "admin", clinicId: "clinic_mehta_01" },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
