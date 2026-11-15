"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DemoRun } from "@/config/content/demo";
import { Badge, StatusPill } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const STEPS = ["Lead in", "Score", "System plan", "Emails", "Project"] as const;

/**
 * Scripted playback of the pipeline for a sample business. Steps reveal one by one;
 * with reduced motion, everything shows at once. Results are announced politely.
 */
export function DemoPlayback({ runs }: { runs: DemoRun[] }) {
  const [runIdx, setRunIdx] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const timer = useRef<number | null>(null);
  const run = runIdx === null ? null : runs[runIdx];

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  function start(i: number) {
    if (timer.current) window.clearInterval(timer.current);
    setRunIdx(i);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(STEPS.length);
      return;
    }
    setShown(1);
    timer.current = window.setInterval(() => {
      setShown((s) => {
        if (s >= STEPS.length) {
          if (timer.current) window.clearInterval(timer.current);
          return s;
        }
        return s + 1;
      });
    }, 1400);
  }

  return (
    <div>
      <fieldset>
        <legend className="font-heading font-semibold text-navy-900">Pick a sample business</legend>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {runs.map((r, i) => (
            <button
              key={r.segment}
              type="button"
              aria-pressed={runIdx === i}
              onClick={() => start(i)}
              className={cn(
                "cut-corners p-5 text-left transition-colors",
                runIdx === i ? "brand-gradient text-white" : "bg-surface-alt hover:bg-info-50",
              )}
            >
              <span className={cn("block font-heading text-xs font-semibold tracking-widest uppercase", runIdx === i ? "text-blue-300" : "text-blue-700")}>
                {r.label}
              </span>
              <span className={cn("mt-1 block font-heading font-semibold", runIdx === i ? "text-white" : "text-navy-900")}>{r.business}</span>
              <span className={cn("mt-1 block text-sm", runIdx === i ? "text-white/90" : "text-muted")}>{r.type}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {run && (
        <div className="mt-10">
          <ol className="flex flex-wrap gap-2" aria-label="Demo progress">
            {STEPS.map((s, i) => (
              <li key={s}>
                <StatusPill status={i < shown - 1 || shown === STEPS.length ? "done" : i === shown - 1 ? "running" : "idle"}>{s}</StatusPill>
              </li>
            ))}
          </ol>

          <div aria-live="polite" className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            {shown >= 1 && (
              <Panel title="1. Lead in" note="Saved and checked for spam in under 2 seconds">
                <dl className="space-y-2 text-sm">
                  <div><dt className="inline font-medium">Business: </dt><dd className="inline text-muted">{run.business}</dd></div>
                  <div><dt className="inline font-medium">Type: </dt><dd className="inline text-muted">{run.type}</dd></div>
                  <div><dt className="inline font-medium">Problem: </dt><dd className="inline text-muted">“{run.problem}”</dd></div>
                </dl>
              </Panel>
            )}
            {shown >= 2 && (
              <Panel title="2. Score" note="From the intake answers only, never from a name">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-4xl font-bold text-navy-900">{run.score}</span>
                  <span className="text-muted">/ 100</span>
                  <Badge tone={run.tier === "Hot" ? "navy" : run.tier === "Warm" ? "info" : "neutral"}>{run.tier}</Badge>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {run.breakdown.map((b) => (
                    <li key={b.factor}>
                      <div className="flex justify-between font-medium">
                        <span>{b.factor}</span>
                        <span className="tabular-nums">{b.points} / {b.max}</span>
                      </div>
                      <div aria-hidden="true" className="mt-1 h-1.5 rounded-full bg-line">
                        <div className="h-1.5 rounded-full bg-blue-700" style={{ width: `${(b.points / b.max) * 100}%` }} />
                      </div>
                      <p className="mt-1 text-muted">{b.why}</p>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
            {shown >= 3 && (
              <Panel title="3. Sample system plan" note="Prices are inserted from settings, never written by AI">
                <p className="text-sm text-muted">{run.summary}</p>
                <h4 className="mt-4 text-sm font-semibold">Recommended systems</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  {run.systems.map((s) => (
                    <li key={s} className="flex gap-2"><CheckIcon className="mt-0.5 size-4 shrink-0 text-success-700" />{s}</li>
                  ))}
                </ul>
                <h4 className="mt-4 text-sm font-semibold">What gets automated</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                  {run.automations.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </Panel>
            )}
            {shown >= 4 && (
              <Panel title="4. Emails that would be sent" note="Nothing is actually sent in the demo">
                <ul className="divide-y divide-line text-sm">
                  {run.emails.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-4 py-2.5">
                      <span><span className="font-mono text-xs text-muted">{e.id}</span> <span className="font-medium">{e.subject}</span></span>
                      <span className="shrink-0 text-muted">{e.when}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
            {shown >= 5 && (
              <Panel title="5. Project that would be created" note="After agreement and payment">
                <ol className="space-y-2 text-sm">
                  {run.milestones.map((m, i) => (
                    <li key={m} className="flex gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-alt font-heading text-xs font-bold">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ol>
              </Panel>
            )}
          </div>

          {shown >= STEPS.length && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={`/contact?segment=${run.segment}`} className={buttonClasses("primary", "lg", "no-underline")}>
                Run this for real with your business
              </Link>
              <Button variant="ghost" onClick={() => start(runIdx!)}>Replay</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="animate-tick rounded-card border border-line bg-white p-5 sm:p-6">
      <h3 className="text-lg">{title}</h3>
      <p className="mt-0.5 text-xs text-muted">{note}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
