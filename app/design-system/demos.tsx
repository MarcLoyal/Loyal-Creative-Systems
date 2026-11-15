"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Stepper } from "@/components/ui/progress";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Pause this sequence?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Pause sequence</Button>
          </>
        }
      >
        <p className="text-muted">
          Reminder emails for this lead stop until you resume them. Nothing already sent is affected.
        </p>
      </Modal>
    </>
  );
}

function ToastButtons() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast("Proposal approved and sent.", "success")}>
        Success toast
      </Button>
      <Button variant="secondary" onClick={() => toast("Settings saved. Changes apply to new leads.", "info")}>
        Info toast
      </Button>
      <Button variant="secondary" onClick={() => toast("Retry failed. The run is still marked failed.", "error")}>
        Error toast
      </Button>
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  );
}

export function StepperDemo() {
  const steps = ["About you", "Your business", "What you need", "Timing and budget", "Consent"];
  const [current, setCurrent] = useState(2);
  return (
    <div className="space-y-4">
      <Stepper steps={steps} current={current} />
      <div className="flex gap-3">
        <Button variant="ghost" size="sm" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === steps.length - 1} onClick={() => setCurrent((c) => c + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      loadingLabel="Sending…"
      onClick={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 1800);
      }}
    >
      Click to load
    </Button>
  );
}
