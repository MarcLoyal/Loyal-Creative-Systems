import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./icons";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 font-heading font-semibold whitespace-nowrap transition-colors duration-150 select-none " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  // Angled cut on the top-right corner echoes the "S" in the logo.
  primary:
    "cut-corner-tr bg-navy-900 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:text-muted aria-disabled:bg-slate-300 aria-disabled:text-muted",
  secondary:
    "border-2 border-navy-900 bg-white text-navy-900 hover:border-blue-700 hover:text-blue-700 disabled:border-slate-300 disabled:text-slate-500",
  ghost: "text-blue-700 hover:bg-info-50 disabled:text-slate-500 disabled:hover:bg-transparent",
  inverse: "cut-corner-tr bg-white text-navy-900 hover:bg-blue-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-sm rounded-md",
  md: "min-h-11 px-5 text-[0.9375rem] rounded-md",
  lg: "min-h-13 px-7 text-base rounded-md",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel = "Working…",
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-4" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonClasses(variant, size, className), "no-underline")} {...props} />;
}
