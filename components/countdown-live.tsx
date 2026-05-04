'use client';

import { useEffect, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';

/**
 * Live HH:MM:SS countdown to next local 00:01.
 *
 * Why 00:01 and not 00:00: on the strike of midnight a quick page reload
 * is racey with the reconcile that flips the day. One minute past gives
 * the reconcile a stable window to advance.
 *
 * Re-renders every second. That's acceptable here because the countdown
 * is only mounted while the user is on the completion-acknowledgment view,
 * which is a small slice of their session.
 */
export function CountdownLive({ timezone }: { timezone: string }) {
  const [label, setLabel] = useState(() => format(new Date(), timezone));

  useEffect(() => {
    const tick = () => setLabel(format(new Date(), timezone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <span className="font-serif text-paper text-4xl tabular tracking-wider">{label}</span>
  );
}

function format(now: Date, tz: string): string {
  const local = toZonedTime(now, tz);
  // Seconds elapsed since the start of the user's local day.
  const secondsIntoDay = local.getHours() * 3600 + local.getMinutes() * 60 + local.getSeconds();
  // We countdown to 00:01 of the next local day = 24h + 60s after start of today.
  const target = 24 * 3600 + 60;
  let secondsLeft = target - secondsIntoDay;
  // After local midnight, secondsIntoDay drops to ~0 and secondsLeft jumps to ~24h.
  // Clamp to the remaining minute: until reconcile fires we just show 0s.
  if (secondsLeft > target - 1) secondsLeft = secondsLeft - 24 * 3600;
  if (secondsLeft < 0) secondsLeft = 0;
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
