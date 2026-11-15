import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AlertIcon, CheckIcon, ClockIcon, Spinner } from "./icons";

type BadgeTone = "neutral" | "info" | "navy" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-alt text-muted ring-line",
  info: "bg-info-50 text-blue-700 ring-blue-500/30",
  navy: "bg-navy-900 text-white ring-navy-900",
  success: "bg-success-50 text-success-700 ring-success/30",
  warning: "bg-warning-50 text-warning-700 ring-warning/30",
  danger: "bg-danger-50 text-danger-700 ring-danger/30",
};

export function Badge({ tone = "neutral", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 font-heading text-xs font-semibold tracking-wide uppercase ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Status pill for pipeline and automation states. Status is conveyed by text and icon,
 * never colour alone.
 */
export type PillStatus = "done" | "running" | "waiting" | "failed" | "idle";

const pill: Record<PillStatus, { tone: string; icon: ReactNode; label: string }> = {
  done: { tone: "bg-success-50 text-success-700", icon: <CheckIcon className="size-3.5" />, label: "Completed" },
  running: { tone: "bg-info-50 text-blue-700", icon: <Spinner className="size-3.5" />, label: "Running" },
  waiting: { tone: "bg-warning-50 text-warning-700", icon: <ClockIcon className="size-3.5" />, label: "Waiting" },
  failed: { tone: "bg-danger-50 text-danger-700", icon: <AlertIcon className="size-3.5" />, label: "Failed" },
  idle: { tone: "bg-surface-alt text-muted", icon: <span className="size-1.5 rounded-full bg-slate-500" />, label: "Not started" },
};

export function StatusPill({ status, children }: { status: PillStatus; children?: ReactNode }) {
  const p = pill[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", p.tone)}>
      {p.icon}
      {children ?? p.label}
    </span>
  );
}
