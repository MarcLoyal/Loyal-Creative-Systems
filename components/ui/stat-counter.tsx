"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Stat counter (SPEC 18.2). Counts up once when scrolled into view; with reduced motion
 * it shows the final value immediately. `method` is required: no number is shown on the
 * site without the method behind it.
 */
export function StatCounter({
  value,
  label,
  method,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  suffix,
}: {
  value: number;
  label: string;
  method: string;
  format?: (n: number) => string;
  suffix?: string;
}) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const duration = 1200;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setShown(value * (1 - Math.pow(1 - t, 3)));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      setShown(0);
      raf = requestAnimationFrame(step);
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={ref} className="cut-corners bg-surface-alt p-5">
      {/* Screen readers get the final value, not every animation frame. */}
      <p className="sr-only">
        {format(value)}
        {suffix} {label}
      </p>
      <p aria-hidden="true" className="font-heading text-3xl font-bold text-navy-900 tabular-nums">
        {format(shown)}
        {suffix}
      </p>
      <p aria-hidden="true" className="mt-1 text-sm font-medium text-ink">
        {label}
      </p>
      <details className="mt-2 text-xs text-muted">
        <summary className="cursor-pointer text-blue-700 underline-offset-2 hover:underline">How this is counted</summary>
        <p className="mt-1">{method}</p>
      </details>
    </div>
  );
}
