"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "./icons";

/**
 * Modal built on the native <dialog> element: focus is trapped, Escape closes,
 * focus returns to the opener, and the rest of the page is inert.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes.
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-card p-0 text-ink shadow-2xl backdrop:bg-navy-950/60"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
        <h2 id={titleId} className="text-xl">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 rounded p-2 text-muted hover:bg-surface-alt hover:text-ink"
          aria-label="Close dialog"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
      {footer && <div className="flex justify-end gap-3 border-t border-line bg-surface-alt px-6 py-4">{footer}</div>}
    </dialog>
  );
}
