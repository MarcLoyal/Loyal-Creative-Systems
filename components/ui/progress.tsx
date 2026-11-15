import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AlertIcon, CheckIcon, InboxIcon } from "./icons";

/* ---------- Stepper (intake form progress, SPEC 8.1) ---------- */

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <nav aria-label="Progress">
      <p className="mb-3 text-sm text-muted sm:hidden">
        Step {current + 1} of {steps.length}: <span className="font-medium text-ink">{steps[current]}</span>
      </p>
      <ol className="flex items-center gap-2">
        {steps.map((label, i) => {
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          return (
            <li key={label} className="flex flex-1 items-center gap-2" aria-current={state === "current" ? "step" : undefined}>
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold",
                  state === "done" && "bg-success-700 text-white",
                  state === "current" && "bg-navy-900 text-white ring-4 ring-blue-500/25",
                  state === "upcoming" && "border-2 border-slate-300 bg-white text-muted",
                )}
              >
                {state === "done" ? <CheckIcon className="size-4 animate-tick" /> : i + 1}
                <span className="sr-only">
                  {state === "done" ? " completed" : state === "current" ? " current" : " not started"}
                </span>
              </span>
              <span className={cn("hidden text-sm lg:inline", state === "current" ? "font-medium text-ink" : "text-muted")}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className={cn("h-0.5 flex-1 rounded", i < current ? "bg-success-700" : "bg-line")} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Pipeline node (SPEC 6.2) ---------- */

export type NodeState = "idle" | "active" | "done" | "failed";

export function PipelineNode({
  index,
  label,
  state = "idle",
  description,
  onClick,
  expanded,
}: {
  index: number;
  label: string;
  state?: NodeState;
  description?: string;
  onClick?: () => void;
  /** Set when the node toggles a details panel. */
  expanded?: boolean;
}) {
  const stateText = { idle: "not started", active: "in progress", done: "completed", failed: "failed" }[state];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={cn(
        "cut-corners group flex w-full min-w-36 flex-col items-start gap-1 border-0 p-4 text-left transition-colors",
        state === "idle" && "bg-surface-alt text-ink hover:bg-info-50",
        state === "active" && "brand-gradient text-white",
        state === "done" && "bg-success-50 text-ink",
        state === "failed" && "bg-danger-50 text-ink",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-2 font-heading text-xs font-semibold tracking-widest uppercase",
          state === "active" ? "text-blue-300" : "text-muted",
        )}
      >
        {state === "done" && <CheckIcon className="size-3.5 text-success-700" />}
        {state === "failed" && <AlertIcon className="size-3.5 text-danger-700" />}
        {state === "active" && (
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-white" />
          </span>
        )}
        Stage {index}
      </span>
      <span className="font-heading font-semibold">
        {label}
        <span className="sr-only">, {stateText}</span>
      </span>
      {description && (
        <span className={cn("text-sm", state === "active" ? "text-white/90" : "text-muted")}>{description}</span>
      )}
    </button>
  );
}

/* ---------- Timeline ---------- */

export type TimelineItem = {
  id: string;
  title: string;
  time: string;
  dateTime: string;
  body?: ReactNode;
  status: "done" | "current" | "upcoming" | "failed";
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-line pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1 -left-[2.0625rem] flex size-4 items-center justify-center rounded-full ring-4 ring-white",
              item.status === "done" && "bg-success-700",
              item.status === "current" && "bg-blue-500",
              item.status === "upcoming" && "border-2 border-slate-300 bg-white",
              item.status === "failed" && "bg-danger",
            )}
          />
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h4 className="text-base">{item.title}</h4>
            <time dateTime={item.dateTime} className="text-sm text-muted">
              {item.time}
            </time>
            <span className="sr-only">
              {item.status === "done" ? "Completed" : item.status === "current" ? "In progress" : item.status === "failed" ? "Failed" : "Upcoming"}
            </span>
          </div>
          {item.body && <div className="mt-1 text-sm text-muted">{item.body}</div>}
        </li>
      ))}
    </ol>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border-2 border-dashed border-line px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-surface-alt text-muted">
        {icon ?? <InboxIcon className="size-6" />}
      </div>
      <h3 className="text-lg">{title}</h3>
      <p className="mt-1 max-w-sm text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Skeleton loader ---------- */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded bg-[linear-gradient(90deg,var(--color-surface-alt)_25%,var(--color-line)_50%,var(--color-surface-alt)_75%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-card border border-line p-6" role="status" aria-label="Loading">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-11/12" />
      <Skeleton className="mt-2 h-4 w-3/5" />
    </div>
  );
}
