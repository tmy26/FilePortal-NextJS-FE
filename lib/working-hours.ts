/** Support / file-desk hours in the operator timezone (Plovdiv). */
export const WORKING_HOURS_TIMEZONE = "Europe/Sofia";

export const WORKING_HOURS_ROWS = [
  { days: "Mon–Fri", hours: "8am – 8pm" },
  { days: "Sat–Sun", hours: "10am – 8pm" },
] as const;

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const zonedPartsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: WORKING_HOURS_TIMEZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "short",
});

function partValue(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export type WorkingHoursStatus = {
  open: boolean;
  timeZoneName: string;
  todayHours: string;
};

export function getWorkingHoursStatus(
  now: Date = new Date(),
): WorkingHoursStatus {
  const parts = zonedPartsFormatter.formatToParts(now);
  const weekday = WEEKDAY_INDEX[partValue(parts, "weekday")] ?? 0;
  const hour = Number.parseInt(partValue(parts, "hour"), 10);
  const minute = Number.parseInt(partValue(parts, "minute"), 10);
  const timeZoneName = partValue(parts, "timeZoneName") || "EET";
  const minutes = hour * 60 + minute;
  const weekend = weekday === 0 || weekday === 6;
  const start = weekend ? 10 * 60 : 8 * 60;
  const end = 20 * 60;

  return {
    open: minutes >= start && minutes < end,
    timeZoneName,
    todayHours: weekend ? "10am – 8pm" : "8am – 8pm",
  };
}
