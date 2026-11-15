"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

/** Resolved on the server (market applied) so only these strings reach the browser. */
export type DiagramSegment = {
  id: string;
  label: string;
  record: string;
  steps: { system: string; text: string }[];
};

/**
 * Services overview diagram (SPEC 6.3): four connected systems. Choosing a segment replays
 * one record travelling through all four. The step list is always rendered, so the content
 * does not depend on the animation; with reduced motion nothing auto-advances.
 */
export function ServicesDiagram({ segments }: { segments: DiagramSegment[] }) {
  const [segmentId, setSegment] = useState(segments[0].id);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);
  const flow = segments.find((s) => s.id === segmentId)!;

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    setStep(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
    timer.current = window.setInterval(() => {
      setStep((s) => {
        if (s >= 3) {
          stop();
          return 3;
        }
        return s + 1;
      });
    }, 1800);
  }, [stop]);

  useEffect(() => stop, [stop]);

  return (
    <div className="rounded-card border border-line bg-white p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Show an example for" className="flex flex-wrap gap-2">
          {segments.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={segmentId === id}
              onClick={() => {
                setSegment(id);
                play();
              }}
              className={cn(
                "min-h-10 rounded-full border-2 px-4 font-heading text-sm font-semibold transition-colors",
                segmentId === id
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-line text-navy-900 hover:border-blue-700",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={play}
          className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 font-heading text-sm font-semibold text-blue-700 hover:bg-info-50"
        >
          {playing ? "Playing…" : "Replay"}
          <ArrowRightIcon className="size-4" />
        </button>
      </div>

      <p className="mt-6 text-sm text-muted">
        Example: <span className="font-medium text-ink">{flow.record}</span>
      </p>

      {/* Nodes */}
      <div aria-hidden="true" className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-0">
        {flow.steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.system} className="relative flex items-center">
              <div
                className={cn(
                  "cut-corners w-full p-4 transition-all duration-500 md:mx-2",
                  active ? "brand-gradient text-white shadow-lg" : done ? "bg-success-50" : "bg-surface-alt",
                )}
              >
                <span className={cn("block font-heading text-xs font-semibold tracking-widest uppercase", active ? "text-blue-300" : "text-muted")}>
                  {done ? "Done" : active ? "Now" : `System ${i + 1}`}
                </span>
                <span className={cn("mt-1 flex items-center gap-2 font-heading text-lg font-bold", active ? "text-white" : "text-navy-900")}>
                  {done && <CheckIcon className="size-4 text-success-700" />}
                  {s.system}
                </span>
              </div>
              {i < 3 && (
                <span className="absolute top-1/2 -right-2.5 z-10 hidden -translate-y-1/2 rounded-full bg-white p-0.5 text-blue-700 md:block">
                  <ArrowRightIcon className="size-4" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Steps (the accessible content) */}
      <ol className="mt-6 grid gap-3 md:grid-cols-4">
        {flow.steps.map((st, i) => {
          return (
            <li
              key={st.system}
              aria-current={i === step ? "step" : undefined}
              className={cn(
                "rounded-md border-l-3 p-3 text-sm transition-colors duration-500 md:mx-2",
                i === step ? "border-blue-500 bg-info-50 text-ink" : "border-line text-muted",
              )}
            >
              <span className="block font-heading text-xs font-semibold tracking-wider text-navy-900 uppercase">
                {i + 1}. {st.system}
              </span>
              <span className="mt-1 block">{st.text}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
