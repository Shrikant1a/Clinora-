import { parseTimeToMinutes, minutesToTime24, formatTime12h } from "./utils";

export interface TimeSlot {
  start: string;     // "10:00"
  end: string;       // "10:30"
  label: string;     // "10:00 AM"
  available: boolean;
  reason?: string;   // "Booked" | "Passed" | "Break"
}

export interface ExistingBooking {
  id?: string;
  startTime: string; // "10:00" or "10:00 AM"
  endTime: string;   // "10:30" or "10:30 AM"
  status: string;    // "Booked" | "Cancelled" | "Completed"
}

/**
 * Calculates free slots for a doctor on a given date.
 * Ensures:
 * 1. Future slots only when requested for today.
 * 2. Doctor working hours respected.
 * 3. 30-min slot boundaries (or doctor's slotMinutes).
 * 4. Existing active bookings (status != 'Cancelled') are blocked.
 */
export function calculateFreeSlots(params: {
  workingStartTime: string; // e.g. "10:00"
  workingEndTime: string;   // e.g. "17:30"
  slotMinutes: number;      // e.g. 30
  existingBookings: ExistingBooking[];
  dateStr: string;          // "YYYY-MM-DD"
  currentTimeMinutes?: number; // Minutes from midnight, for mocking/testing
  isToday?: boolean;
}): { freeSlots: TimeSlot[]; allSlots: TimeSlot[] } {
  const {
    workingStartTime,
    workingEndTime,
    slotMinutes,
    existingBookings,
    dateStr,
    currentTimeMinutes,
    isToday,
  } = params;

  const startMin = parseTimeToMinutes(workingStartTime);
  const endMin = parseTimeToMinutes(workingEndTime);

  // Active bookings filter
  const bookedRanges = existingBookings
    .filter((b) => b.status === "Booked" || b.status === "Completed")
    .map((b) => ({
      start: parseTimeToMinutes(b.startTime),
      end: parseTimeToMinutes(b.endTime),
    }));

  const allSlots: TimeSlot[] = [];
  const freeSlots: TimeSlot[] = [];

  let current = startMin;
  while (current + slotMinutes <= endMin) {
    const slotStartMin = current;
    const slotEndMin = current + slotMinutes;
    const start24 = minutesToTime24(slotStartMin);
    const end24 = minutesToTime24(slotEndMin);
    const label = formatTime12h(start24);

    let isAvailable = true;
    let reason: string | undefined = undefined;

    // 1. Check if past time for today
    if (isToday && currentTimeMinutes !== undefined && slotStartMin <= currentTimeMinutes) {
      isAvailable = false;
      reason = "Passed";
    }

    // 2. Check overlap with booked ranges
    if (isAvailable) {
      const hasOverlap = bookedRanges.some(
        (booked) => Math.max(slotStartMin, booked.start) < Math.min(slotEndMin, booked.end)
      );
      if (hasOverlap) {
        isAvailable = false;
        reason = "Booked";
      }
    }

    const slot: TimeSlot = {
      start: start24,
      end: end24,
      label,
      available: isAvailable,
      reason,
    };

    allSlots.push(slot);
    if (isAvailable) {
      freeSlots.push(slot);
    }

    current += slotMinutes;
  }

  return { freeSlots, allSlots };
}

/**
 * Checks if a specific requested slot has a clash with active bookings.
 */
export function checkSlotClash(params: {
  startTime: string;
  endTime: string;
  existingBookings: ExistingBooking[];
}): boolean {
  const reqStart = parseTimeToMinutes(params.startTime);
  const reqEnd = parseTimeToMinutes(params.endTime);

  return params.existingBookings.some((b) => {
    if (b.status === "Cancelled") return false;
    const bStart = parseTimeToMinutes(b.startTime);
    const bEnd = parseTimeToMinutes(b.endTime);
    return Math.max(reqStart, bStart) < Math.min(reqEnd, bEnd);
  });
}

/**
 * Generates alternative slots when a clash occurs.
 */
export function findAlternativeSlots(params: {
  requestedStartTime: string;
  freeSlots: TimeSlot[];
  maxAlternatives?: number;
}): TimeSlot[] {
  const { requestedStartTime, freeSlots, maxAlternatives = 3 } = params;
  const targetMin = parseTimeToMinutes(requestedStartTime);

  // Sort free slots by closest distance to requested time
  const sorted = [...freeSlots].sort((a, b) => {
    const distA = Math.abs(parseTimeToMinutes(a.start) - targetMin);
    const distB = Math.abs(parseTimeToMinutes(b.start) - targetMin);
    return distA - distB;
  });

  return sorted.slice(0, maxAlternatives);
}
