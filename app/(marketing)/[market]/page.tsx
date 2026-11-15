import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { SERVICES } from "@/config/content/services";
import { segmentsForMarket } from "@/config/content/segments";
import { CASE_STUDIES } from "@/config/content/case-studies";
import { t } from "@/config/content/types";
import { marketParam } from "@/lib/page";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Container, CtaBand, JsonLd, Section } from "@/components/site/blocks";
import { CaseStudyCard, SegmentCard, ServiceCard } from "@/components/site/cards";
import { PipelineCompact, PipelineDiagram } from "@/components/diagrams/pipeline-diagram";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${SITE.name} | Custom CRM, operations, accounting and bookkeeping systems`,
    description: SITE.description,
    path: "/",
  }),
  title: { absolute: `${SITE.name} | Custom CRM, operations, accounting and bookkeeping systems` },
};

const PROBLEMS = [
  {
    title: "The same details, typed three times",
    body: "A sale is written in a notebook, copied to a job sheet, then typed into an invoice. Every copy is a chance for a mistake.",
  },
  {
    title: "Work waits on whoever remembers",
    body: "Follow-ups, reminders, and month-end reports happen when someone has time. When they are busy, money and customers slip away.",
  },
  {
    title: "Nobody sees the whole picture",
    body: "Sales, jobs, and money live in different places, so simple questions like “who still owes us?” take an afternoon to answer.",
  },
];

export default async function HomePage({ params }: PageProps<"/[market]">) {
  const market = await marketParam(params);
  const segments = segmentsForMarket(market);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* 1. Hero */}
      <section className="divider-angle brand-gradient pt-14 pb-28 text-white sm:pt-20 sm:pb-32">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="eyebrow text-blue-300!">Custom automated systems</p>
            <h1 className="mt-4 text-4xl text-white sm:text-5xl lg:text-[3.4rem]">
              Your sales, jobs, invoices and books, connected and running on their own.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/90">
              We build CRM, operations, accounting, and bookkeeping systems that pass work to each other, so a sale
              becomes a job, an invoice, and a line in your books without anyone re-typing it.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/contact" variant="inverse" size="lg">
                Get your system plan
              </ButtonLink>
              <ButtonLink href="/demo" size="lg" className="border-2 border-white/60 bg-transparent hover:bg-white/10">
                Watch it work
              </ButtonLink>
            </div>
          </div>
          <PipelineCompact />
        </Container>
      </section>

      {/* 2. Proof strip: live counters (SPEC 18.2) appear here in phase 8, once each passes its threshold. */}

      {/* 3. The problem */}
      <Section
        id="problem"
        eyebrow="The problem"
        title="Disconnected, manual back-office work costs more than it looks"
      >
        <ul className="grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <li key={p.title} className="cut-corners bg-surface-alt p-6">
              <span aria-hidden="true" className="font-heading text-sm font-bold tracking-widest text-blue-700">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-xl">{p.title}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. The four systems */}
      <Section
        id="systems"
        tone="alt"
        eyebrow="What we build"
        title="Four systems, connected into one flow"
        intro="Each system works on its own. Connected, a sale in the CRM creates the job, the job creates the invoice, and the invoice posts to the books."
      >
        <div className="relative">
          <div aria-hidden="true" className="absolute top-1/2 right-[6%] left-[6%] hidden h-0.5 -translate-y-1/2 bg-blue-500/30 lg:block">
            <span className="absolute -top-[5px] size-3 rounded-full bg-blue-500 animate-travel-x" />
          </div>
          <ul className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <ServiceCard service={s} />
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8">
          <Link href="/services" className="inline-flex items-center gap-1.5 font-heading font-semibold">
            See how the four systems connect <ArrowRightIcon className="size-4" />
          </Link>
        </p>
      </Section>

      {/* 5. Who we build for (order follows market) */}
      <Section id="segments" eyebrow="Who we build for" title="Built for how your business actually runs">
        <ul className="grid gap-6 md:grid-cols-3">
          {segments.map((s) => (
            <li key={s.id}>
              <SegmentCard segment={s} description={t(s.intro, market).split(". ")[0] + "."} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 6. This site runs itself */}
      <Section
        id="pipeline"
        tone="alt"
        eyebrow="This site runs itself"
        title="Our own sales run on the systems we sell"
        intro="From the moment you send your details to your first weekly report, every step below runs without anyone touching it. Select a stage to see what happens."
      >
        <div className="grid gap-8 xl:grid-cols-[1fr_18rem]">
          <PipelineDiagram />
          {/* Live activity feed (SPEC 18.1) replaces this card in phase 8, once there are 5+ events in 30 days. */}
          <aside className="cut-corners self-start bg-navy-900 p-6 text-slate-300">
            <h3 className="text-lg text-white">See it run on a sample business</h3>
            <p className="mt-2 text-sm">
              Enter a sample business and watch the score, the plan, and the emails it would produce. Nothing is sent.
            </p>
            <ButtonLink href="/demo" variant="inverse" size="sm" className="mt-5">
              Try the demo
            </ButtonLink>
          </aside>
        </div>
      </Section>

      {/* 7. Case studies */}
      <Section id="case-studies" eyebrow="Case studies" title="Proof, not promises">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.slice(0, 3).map((c) => (
            <li key={c.slug}>
              <CaseStudyCard study={c} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 8. Final call to action */}
      <CtaBand />
    </>
  );
}
