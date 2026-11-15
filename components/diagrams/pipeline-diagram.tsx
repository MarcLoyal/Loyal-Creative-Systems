"use client";

import { useEffect, useId, useState } from "react";
import { PIPELINE, type PipelineStage } from "@/config/content/pipeline";
import { cn } from "@/lib/cn";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * Pipeline diagram (SPEC 6.2). Seven stages, left to right on desktop and top to bottom on
 * mobile. A pulse travels along the line continuously. Each stage is a button that opens a
 * details panel. In phase 8 real pipeline events will light up the matching stage; for now
 * `activeStage` can be passed in, and averages show the target until real data exists.
 */
export function PipelineDiagram({ activeStage }: { activeStage?: PipelineStage["id"] }) {
  const [open, setOpen] = useState<PipelineStage["id"] | null>(null);
  const base = useId();
  const selected = PIPELINE.find((s) => s.id === open);

  return (
    <div>
      <div className="relative">
        {/* Connecting line + travelling pulse (decorative). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-6 left-6 w-0.5 bg-line lg:inset-x-[7%] lg:inset-y-auto lg:top-6 lg:h-0.5 lg:w-auto">
          <span className="absolute -left-[5px] size-3 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgb(0_133_252/0.2)] animate-travel-y lg:hidden" />
          <span className="absolute -top-[5px] hidden size-3 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgb(0_133_252/0.2)] animate-travel-x lg:block" />
        </div>

        <ol className="relative grid gap-3 lg:grid-cols-7 lg:gap-2">
          {PIPELINE.map((stage) => {
            const isOpen = open === stage.id;
            const isActive = activeStage === stage.id;
            return (
              <li key={stage.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${base}-panel`}
                  onClick={() => setOpen(isOpen ? null : stage.id)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-card p-1 text-left transition-colors lg:flex-col lg:gap-3 lg:text-center",
                    "hover:bg-info-50",
                    isOpen && "bg-info-50",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 font-heading text-sm font-bold transition-colors",
                      isActive || isOpen
                        ? "brand-gradient border-transparent text-white"
                        : "border-blue-700 bg-white text-navy-900 group-hover:border-blue-500",
                    )}
                  >
                    {stage.index}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-[0.9375rem] leading-tight font-semibold text-navy-900">
                      {stage.name}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted">{stage.short}</span>
                    <span className="sr-only">. {isOpen ? "Hide details" : "Show details"}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div id={`${base}-panel`} aria-live="polite" className="mt-6">
        {selected && (
          <div className="cut-corners relative border-l-4 border-blue-500 bg-white p-6 shadow-lg shadow-navy-900/5 ring-1 ring-line sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute top-3 right-3 rounded p-2 text-muted hover:bg-surface-alt hover:text-ink"
              aria-label="Close stage details"
            >
              <CloseIcon className="size-5" />
            </button>
            <p className="eyebrow">Stage {selected.index}</p>
            <h3 className="mt-2 text-2xl">{selected.name}</h3>
            <p className="mt-2 max-w-2xl text-muted">{selected.whatHappens}</p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-ink">What triggers it</dt>
                <dd className="mt-1 text-muted">{selected.trigger}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink">How long it takes</dt>
                <dd className="mt-1 text-muted">
                  Target: {selected.target}.
                  <span className="mt-1 block text-sm">The measured average appears here once the pipeline is live.</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink">What you receive</dt>
                <dd className="mt-1 flex gap-2 text-muted">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-success-700" />
                  {selected.clientReceives}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact pipeline for the hero: a lead moving down the seven stages, each ticking
 * complete in turn. Under reduced motion it shows the stages as a static list.
 */
export function PipelineCompact() {
  const [step, setStep] = useState(0);
  const animate = !usePrefersReducedMotion();

  useEffect(() => {
    if (!animate) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % (PIPELINE.length + 2)), 1100);
    return () => window.clearInterval(id);
  }, [animate]);

  return (
    <div className="cut-corners bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-sm sm:p-6">
      <p className="font-heading text-xs font-semibold tracking-[0.18em] text-blue-300 uppercase">
        From inquiry to onboarded client
      </p>
      <ol className="mt-4 space-y-1.5">
        {PIPELINE.map((stage, i) => {
          const done = animate && i < step;
          const current = animate && i === step;
          return (
            <li
              key={stage.id}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-300",
                current ? "bg-white text-navy-900" : "text-white",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold transition-colors duration-300",
                  done ? "bg-success text-white" : current ? "bg-blue-500 text-white" : "bg-white/15 text-white",
                )}
              >
                {done ? <CheckIcon className="size-3.5 animate-tick" /> : stage.index}
              </span>
              <span className="text-[0.9375rem] font-medium">{stage.name}</span>
              <span className={cn("ml-auto text-xs", current ? "text-muted" : "text-white/75")}>{stage.target}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs text-white/75">Target times. Live averages appear once the pipeline is running.</p>
    </div>
  );
}
