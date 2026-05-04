'use client';

import { useEffect, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';

/**
 * Tiny countdown showing hours/minutes until the next local midnight.
 * Updates every minute. Pure ornament — the actual day boundary is
 * computed server-side, this is just the user's read of when "tomorrow"
 * arrives.
 */
export function Countdown({ timezone }: { timezone: string }) {
  const [label, setLabel] = useState(() => formatLabel(new Date(), timezone));

  useEffect(() => {
    const tick = () => setLabel(formatLabel(new Date(), timezone));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <p className="text-stone text-xs tabular tracking-widest uppercase">
      Until midnight · {label}
    </p>
  );
}

function formatLabel(now: Date, tz: string): string {
  const local = toZonedTime(now, tz);
  const minutesIntoDay = local.getHours() * 60 + local.getMinutes();
  const minutesLeft = 24 * 60 - minutesIntoDay;
  const hours = Math.floor(minutesLeft / 60);
  const minutes = minutesLeft % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
