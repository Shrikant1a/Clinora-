import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime12h(time24: string): string {
  if (!time24) return "";
  const [hoursStr, minutesStr] = time24.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${period}`;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  // Handle 12h format like "11:30 AM" or 24h format like "11:30"
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");
  const timeOnly = clean.replace(/[APM\s]/g, "");
  const [hStr, mStr] = timeOnly.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);

  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;

  return h * 60 + m;
}

export function minutesToTime24(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
