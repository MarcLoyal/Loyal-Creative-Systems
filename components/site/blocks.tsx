import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Faq } from "@/config/content/types";
import { t } from "@/config/content/types";
import type { Market } from "@/lib/market";
import { ButtonLink } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icons";

/* Page-level building blocks shared by the marketing pages. */

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the payload can never close the script tag (Next.js JSON-LD guide).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-blue-300">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-white/80">
                {it.name}
              </span>
            ) : (
              <Link href={it.path} className="text-blue-300 no-underline hover:underline">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Navy-to-blue page header with the angled bottom edge. */
export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  children,
  aside,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="divider-angle brand-gradient pt-12 pb-24 text-white sm:pt-16 sm:pb-28">
      <Container className={cn(aside && "grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]")}>
        <div>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          {eyebrow && <p className={cn("eyebrow text-blue-300!", breadcrumbs && "mt-6")}>{eyebrow}</p>}
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">{title}</h1>
          {intro && <div className="mt-5 max-w-2xl text-lg text-white/90">{intro}</div>}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
        {aside}
      </Container>
    </section>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  tone = "default",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: ReactNode;
  children?: ReactNode;
  tone?: "default" | "alt";
  className?: string;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn("py-16 sm:py-20", tone === "alt" && "bg-surface-alt", className)}
    >
      <Container>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && (
          <h2 id={headingId} className="mt-3 max-w-3xl text-3xl sm:text-4xl">
            {title}
          </h2>
        )}
        {intro && <div className="mt-4 max-w-2xl text-lg text-muted">{intro}</div>}
        <div className={cn((title || intro) && "mt-10")}>{children}</div>
      </Container>
    </section>
  );
}

export function FaqList({ faqs, market }: { faqs: Faq[]; market: Market }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group px-5 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-heading font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDownIcon className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <p className="pb-5 text-muted">{t(f.a, market)}</p>
        </details>
      ))}
    </div>
  );
}

/** Closing call to action used at the bottom of most pages. */
export function CtaBand({
  title = "Tell us about your business.",
  body = "You’ll have a tailored system plan in your inbox in under a minute.",
  href = "/contact",
  label = "Get your system plan",
}: {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="cut-corners brand-gradient flex flex-col items-start gap-6 px-6 py-12 text-white sm:px-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl text-white">{title}</h2>
            <p className="mt-3 max-w-xl text-lg text-white/90">{body}</p>
          </div>
          <ButtonLink href={href} variant="inverse" size="lg">
            {label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
