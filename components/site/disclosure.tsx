"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * <details>-based disclosure for nav menus. Works without JavaScript; with JavaScript it
 * also closes on Escape (returning focus to the toggle), on outside click, and on navigation.
 */
export function Disclosure({
  summary,
  children,
  className,
  summaryClassName,
  panelClassName,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
  panelClassName?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.removeAttribute("open");
  }, [pathname]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDoc = (e: MouseEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.removeAttribute("open");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.removeAttribute("open");
        el.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", onDoc);
    el.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      el.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details ref={ref} className={className}>
      <summary className={summaryClassName}>{summary}</summary>
      <div className={panelClassName}>{children}</div>
    </details>
  );
}
