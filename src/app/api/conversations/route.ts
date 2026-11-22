import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId") || "clinic_mehta_01";
    const state = searchParams.get("state");
    const escalatedOnly = searchParams.get("escalated") === "true";

    const where: any = { clinicId };
    if (state && state !== "all") where.state = state;
    if (escalatedOnly) where.isEscalated = true;

    const conversations = await db.conversation.findMany({
      where,
      orderBy: { lastMessageAt: "desc" },
    });

    const parsed = conversations.map((c) => ({
      ...c,
      collectedData: JSON.parse(c.collectedJson || "{}"),
      messagesList: JSON.parse(c.transcript || "[]"),
    }));

    return NextResponse.json({ conversations: parsed });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isEscalated, state } = body;

    if (!id) {
      return NextResponse.json({ error: "Conversation id is required" }, { status: 400 });
    }

    const updated = await db.conversation.update({
      where: { id },
      data: {
        ...(isEscalated !== undefined && { isEscalated }),
        ...(state && { state }),
      },
    });

    return NextResponse.json({ success: true, conversation: updated });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json({ error: "Failed to update conversation" }, { status: 500 });
  }
}
