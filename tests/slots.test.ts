import { describe, it, expect } from "vitest";
import { calculateFreeSlots, checkSlotClash, findAlternativeSlots } from "../src/lib/slots";

describe("Appointment Slot Engine", () => {
  const defaultWorkingHours = {
    workingStartTime: "10:00",
    workingEndTime: "17:30",
    slotMinutes: 30,
    dateStr: "2026-11-23",
  };

  it("calculates correct number of 30-min slots for a standard day without bookings", () => {
    // 10:00 to 17:30 is 7.5 hours = 15 slots of 30 mins
    const { freeSlots, allSlots } = calculateFreeSlots({
      ...defaultWorkingHours,
      existingBookings: [],
    });

    expect(allSlots.length).toBe(15);
    expect(freeSlots.length).toBe(15);
    expect(allSlots[0].start).toBe("10:00");
    expect(allSlots[0].end).toBe("10:30");
    expect(allSlots[0].label).toBe("10:00 AM");
    expect(allSlots[14].start).toBe("17:00");
    expect(allSlots[14].end).toBe("17:30");
  });

  it("marks existing booked slots as unavailable and blocks them from freeSlots", () => {
    const existingBookings = [
      { startTime: "10:00", endTime: "10:30", status: "Booked" },
      { startTime: "11:30", endTime: "12:00", status: "Booked" },
      { startTime: "14:00", endTime: "14:30", status: "Cancelled" }, // cancelled should remain free!
    ];

    const { freeSlots, allSlots } = calculateFreeSlots({
      ...defaultWorkingHours,
      existingBookings,
    });

    // 15 total, 2 booked = 13 free
    expect(freeSlots.length).toBe(13);

    const slot1000 = allSlots.find((s) => s.start === "10:00");
    expect(slot1000?.available).toBe(false);
    expect(slot1000?.reason).toBe("Booked");

    const slot1130 = allSlots.find((s) => s.start === "11:30");
    expect(slot1130?.available).toBe(false);

    // Cancelled slot 14:00 must be available
    const slot1400 = allSlots.find((s) => s.start === "14:00");
    expect(slot1400?.available).toBe(true);
  });

  it("filters out past slots when requested for today", () => {
    // Current time is 11:15 AM (675 minutes)
    const { freeSlots } = calculateFreeSlots({
      ...defaultWorkingHours,
      existingBookings: [],
      isToday: true,
      currentTimeMinutes: 675, // 11:15 AM
    });

    // Slots at 10:00, 10:30, 11:00 should not be offered
    const freeStarts = freeSlots.map((s) => s.start);
    expect(freeStarts).not.toContain("10:00");
    expect(freeStarts).not.toContain("10:30");
    expect(freeStarts).not.toContain("11:00");
    // 11:30 onwards should be available
    expect(freeStarts).toContain("11:30");
  });

  it("detects clashes accurately and prevents double booking", () => {
    const existingBookings = [
      { startTime: "11:30", endTime: "12:00", status: "Booked" },
    ];

    const isClash1 = checkSlotClash({
      startTime: "11:30",
      endTime: "12:00",
      existingBookings,
    });
    expect(isClash1).toBe(true);

    const isClash2 = checkSlotClash({
      startTime: "12:00",
      endTime: "12:30",
      existingBookings,
    });
    expect(isClash2).toBe(false);
  });

  it("finds alternative closest slots when a clash occurs", () => {
    const { freeSlots } = calculateFreeSlots({
      ...defaultWorkingHours,
      existingBookings: [
        { startTime: "11:30", endTime: "12:00", status: "Booked" },
      ],
    });

    const alternatives = findAlternativeSlots({
      requestedStartTime: "11:30",
      freeSlots,
      maxAlternatives: 3,
    });

    expect(alternatives.length).toBe(3);
    // Closest alternatives around 11:30 are 11:00 and 12:00
    const altStarts = alternatives.map((a) => a.start);
    expect(altStarts).toContain("11:00");
    expect(altStarts).toContain("12:00");
    expect(altStarts).not.toContain("11:30");
  });
});
