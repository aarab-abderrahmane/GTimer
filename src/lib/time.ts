export function getCountdownTarget(timezone?: string): number {
  if (!timezone) {
    return new Date("2026-11-19T00:00:00").getTime();
  }

  try {
    const noonUtc = new Date(Date.UTC(2026, 10, 19, 12, 0, 0));
    const dateStr = noonUtc.toLocaleDateString("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = noonUtc.toLocaleTimeString("en-CA", {
      timeZone: timezone,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, min, sec] = timeStr.split(":").map(Number);

    const localMs = Date.UTC(year, month - 1, day, hour, min, sec || 0);
    const offsetMs = localMs - noonUtc.getTime();

    return Date.UTC(2026, 10, 19, 0, 0, 0) - offsetMs;
  } catch {
    return new Date("2026-11-19T00:00:00").getTime();
  }
}
