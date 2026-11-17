import { useState, useEffect, useCallback } from 'react';

const TIMEZONE = 'Asia/Kolkata';

/** Format a Date into the full desktop format: "Tuesday, 17 November 2026" */
function formatFull(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** Format a Date into the compact mobile format: "17 Nov 2026" */
function formatCompact(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Calculate milliseconds from now until the next midnight in Asia/Kolkata.
 * Adding 100 ms buffer ensures the timer fires safely after the rollover.
 */
function msUntilKolkataMidnight(): number {
  const now = new Date();
  // Parse the current Kolkata time components
  const kolkataStr = now.toLocaleString('en-US', { timeZone: TIMEZONE });
  const kolkataNow = new Date(kolkataStr);
  const kolkataTomorrow = new Date(kolkataNow);
  kolkataTomorrow.setDate(kolkataTomorrow.getDate() + 1);
  kolkataTomorrow.setHours(0, 0, 0, 0);
  return Math.max(1_000, kolkataTomorrow.getTime() - kolkataNow.getTime() + 100);
}

interface KolkataDate {
  /** "Tuesday, 17 November 2026" — use on md+ screens */
  full: string;
  /** "17 Nov 2026" — use on mobile */
  compact: string;
}

/**
 * Returns today's date in Asia/Kolkata timezone, formatted for desktop and
 * mobile.  Automatically refreshes:
 *   • At the next Kolkata midnight (chains one-shot timers, never drifts).
 *   • Whenever the user returns to a hidden browser tab (visibilitychange).
 */
export function useKolkataDate(): KolkataDate {
  const getDate = useCallback((): KolkataDate => {
    const now = new Date();
    return { full: formatFull(now), compact: formatCompact(now) };
  }, []);

  const [date, setDate] = useState<KolkataDate>(getDate);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    /** Schedule the next midnight refresh and chain further ones. */
    function scheduleMidnight() {
      const delay = msUntilKolkataMidnight();
      timerId = setTimeout(() => {
        setDate(getDate());
        scheduleMidnight(); // chain for the following midnight
      }, delay);
    }

    /** Refresh date when the user switches back to this tab. */
    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        setDate(getDate());
      }
    }

    scheduleMidnight();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [getDate]);

  return date;
}
