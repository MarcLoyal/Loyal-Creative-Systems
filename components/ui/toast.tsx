"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AlertIcon, CheckIcon, CloseIcon } from "./icons";

type ToastTone = "success" | "error" | "info";
type ToastItem = { id: number; tone: ToastTone; message: string };

const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/**
 * Toasts are announced through polite live regions (assertive for errors).
 * They stay 6 s, longer than the WCAG minimum for reading, and can be dismissed.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (message: string, tone: ToastTone = "info") => {
      const id = nextId.current++;
      setItems((all) => [...all.slice(-2), { id, tone, message }]);
      window.setTimeout(() => dismiss(id), 6000);
    },
    [dismiss],
  );

  const value = useMemo(() => push, [push]);

  const render = (list: ToastItem[]) =>
    list.map((t) => (
      <div
        key={t.id}
        className={cn(
          "pointer-events-auto flex w-full items-start gap-3 rounded-md border-l-4 bg-white p-4 shadow-lg ring-1 ring-line",
          t.tone === "success" && "border-success-700",
          t.tone === "error" && "border-danger",
          t.tone === "info" && "border-blue-500",
        )}
      >
        {t.tone === "success" && <CheckIcon className="mt-0.5 size-5 shrink-0 text-success-700" />}
        {t.tone === "error" && <AlertIcon className="mt-0.5 size-5 shrink-0 text-danger-700" />}
        {t.tone === "info" && <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />}
        <p className="flex-1 text-sm text-ink">{t.message}</p>
        <button
          type="button"
          onClick={() => dismiss(t.id)}
          aria-label="Dismiss notification"
          className="-m-1 rounded p-1 text-muted hover:text-ink"
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
    ));

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:w-96">
        <div role="status" aria-live="polite" className="flex w-full flex-col gap-2">
          {render(items.filter((t) => t.tone !== "error"))}
        </div>
        <div role="alert" aria-live="assertive" className="flex w-full flex-col gap-2">
          {render(items.filter((t) => t.tone === "error"))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
