"use client";

import { Clock } from "lucide-react";
import { useSyncExternalStore } from "react";
import { contactSection } from "@/data/content";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: contactSection.timeZone,
  hour: "numeric",
  minute: "2-digit",
});

/** Ticks on every minute boundary. */
function subscribe(onChange: () => void) {
  let interval: ReturnType<typeof setInterval> | undefined;
  const timeout = setTimeout(() => {
    onChange();
    interval = setInterval(onChange, 60_000);
  }, 60_000 - (Date.now() % 60_000));
  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
}

const getSnapshot = () => formatter.format(Date.now());
// Unknown on the server; the line renders once the client knows the time.
const getServerSnapshot = () => "";

export function LocalTime({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    // Fixed min-height so the line doesn't shift content when it appears after hydration.
    <p className={className}>
      {time && (
        <>
          <Clock className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{contactSection.localTime(time)}</span>
        </>
      )}
    </p>
  );
}
