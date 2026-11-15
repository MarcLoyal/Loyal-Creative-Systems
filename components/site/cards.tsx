import Link from "next/link";
import type { Automation, Service } from "@/config/content/services";
import type { Segment } from "@/config/content/segments";
import type { CaseStudy } from "@/config/content/case-studies";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const SYSTEM_NUMERAL: Record<string, string> = { crm: "01", operations: "02", accounting: "03", bookkeeping: "04" };

/** Whole card is one link; the heading is the link text (one tab stop per card). */
export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <div className={cn("group cut-corners relative flex h-full flex-col bg-white p-6 ring-1 ring-line transition-shadow hover:shadow-xl hover:shadow-navy-900/10", className)}>
      <span aria-hidden="true" className="font-heading text-sm font-bold text-blue-700">
        {SYSTEM_NUMERAL[service.id]}
      </span>
      <h3 className="mt-2 text-xl">
        <Link href={`/services/${service.slug}`} className="text-navy-900 no-underline after:absolute after:inset-0 group-hover:text-blue-700">
          {service.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-muted">{service.summary}</p>
      <span aria-hidden="true" className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-blue-700">
        See what it automates <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );
}

export function SegmentCard({ segment, description }: { segment: Segment; description: string }) {
  return (
    <div className="group cut-corners relative flex h-full flex-col bg-surface-alt p-6 transition-colors hover:bg-info-50">
      <h3 className="text-xl">
        <Link href={`/solutions/${segment.slug}`} className="text-navy-900 no-underline after:absolute after:inset-0">
          {segment.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-muted">{description}</p>
      <span aria-hidden="true" className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-blue-700">
        See systems for {segment.name.toLowerCase()} <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );
}

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className="group relative flex h-full flex-col rounded-card border border-line bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-navy-900/10">
      <div className="flex flex-wrap gap-2">
        <Badge tone="info">Case study</Badge>
        {study.segment === null && <Badge>Our own pipeline</Badge>}
      </div>
      <h3 className="mt-4 text-xl">
        <Link href={`/case-studies/${study.slug}`} className="text-navy-900 no-underline after:absolute after:inset-0 group-hover:text-blue-700">
          {study.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-muted">{study.summary}</p>
      <span aria-hidden="true" className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-blue-700">
        Read the case study <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );
}

/** Small trigger → action → result diagram for one automation (SPEC 6.4). */
export function AutomationFlow({ automation }: { automation: Automation }) {
  const steps = [
    { label: "When", text: automation.trigger },
    { label: "The system", text: automation.action },
    { label: "Result", text: automation.result },
  ];
  return (
    <div className="h-full rounded-card border border-line bg-white p-5">
      <h3 className="text-lg">{automation.title}</h3>
      <ol className="mt-4 space-y-0">
        {steps.map((s, i) => (
          <li key={s.label} className="relative flex gap-3 pb-4 last:pb-0">
            {i < steps.length - 1 && <span aria-hidden="true" className="absolute top-6 bottom-0 left-[11px] w-0.5 bg-line" />}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 mt-0.5 size-6 shrink-0 rounded-full border-2",
                i === 0 && "border-blue-700 bg-white",
                i === 1 && "brand-gradient border-transparent",
                i === 2 && "border-success-700 bg-success-50",
              )}
            />
            <p className="text-sm">
              <span className="block font-heading text-xs font-semibold tracking-wider text-blue-700 uppercase">{s.label}</span>
              <span className="text-ink">{s.text}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
