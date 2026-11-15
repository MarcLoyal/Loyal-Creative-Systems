import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  /** "cut" uses the angled corners from the logo's "S". */
  shape?: "rounded" | "cut";
  tone?: "default" | "alt" | "navy";
  interactive?: boolean;
};

export function Card({ shape = "rounded", tone = "default", interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "p-6",
        shape === "cut" ? "cut-corners" : "rounded-card",
        tone === "default" && "border border-line bg-white",
        tone === "alt" && "bg-surface-alt",
        tone === "navy" && "bg-navy-900 text-slate-300 [&_h3]:text-white [&_a]:text-blue-300",
        interactive && "transition-shadow hover:shadow-lg hover:shadow-navy-900/10 focus-within:shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ children, as: As = "h3", className }: { children: ReactNode; as?: "h2" | "h3" | "h4"; className?: string }) {
  return <As className={cn("text-lg", className)}>{children}</As>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-2 text-muted", className)}>{children}</div>;
}
