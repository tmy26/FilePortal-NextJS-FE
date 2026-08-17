"use client";

import { useEffect, useState } from "react";
import {
  WORKING_HOURS_ROWS,
  getWorkingHoursStatus,
  type WorkingHoursStatus,
} from "@/lib/working-hours";

const TICK_MS = 30_000;

export function WorkingHoursPanel() {
  const [status, setStatus] = useState<WorkingHoursStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getWorkingHoursStatus());
    tick();
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const open = status?.open ?? false;

  return (
    <aside className="working-hours-panel" aria-label="Working hours">
      <p className="working-hours-kicker">Working hours</p>
      <p
        className={["working-hours-status", open ? "is-open" : ""].join(" ")}
        aria-live="polite"
      >
        <span className="working-hours-dot" aria-hidden="true" />
        {status ? (open ? "Open now" : "Closed") : "—"}
      </p>
      <ul className="working-hours-schedule">
        {WORKING_HOURS_ROWS.map((row) => (
          <li
            key={row.days}
            className={row.hours === status?.todayHours ? "is-today" : ""}
          >
            <span>{row.days}</span>
            <span>{row.hours}</span>
          </li>
        ))}
      </ul>
      {status?.timeZoneName ? (
        <p className="working-hours-zone">{status.timeZoneName}</p>
      ) : null}
    </aside>
  );
}
