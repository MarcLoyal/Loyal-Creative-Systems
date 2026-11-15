import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/config/content/services";
import { segmentsForMarket } from "@/config/content/segments";
import { t } from "@/config/content/types";
import { MARKETS } from "@/lib/market";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";
import { CtaBand, FaqList, JsonLd, PageHero, Section } from "@/components/site/blocks";
import { AutomationFlow } from "@/components/site/cards";

export function generateStaticParams() {
  return MARKETS.flatMap((market) => SERVICES.map((s) => ({ market, service: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[market]/services/[service]">): Promise<Metadata> {
  const { service: slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: `Custom ${s.name.replace(" systems", "")} systems`, description: s.metaDescription, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: PageProps<"/[market]/services/[service]">) {
  const market = await marketParam(params);
  const { service: slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const others = SERVICES.filter((o) => o.id !== s.id);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.name, path: `/services/${s.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          serviceJsonLd({ name: s.name, description: s.summary, path: `/services/${s.slug}` }),
          faqJsonLd(s.faqs, market),
        ]}
      />
      <PageHero breadcrumbs={crumbs} eyebrow={s.name} title={s.summary}>
        <ButtonLink href="/contact" variant="inverse" size="lg">
          Get your system plan
        </ButtonLink>
      </PageHero>

      <Section id="replaces" eyebrow="What it replaces" title="The manual work that goes away">
        <ul className="grid gap-4 sm:grid-cols-2">
          {s.replaces.map((r) => (
            <li key={r} className="flex items-start gap-3 rounded-card bg-surface-alt p-5">
              <CloseIcon className="mt-0.5 size-5 shrink-0 text-danger-700" />
              <span className="sr-only">No more: </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="automations" tone="alt" eyebrow="Example automations" title="What runs on its own">
        <ul className="grid gap-6 md:grid-cols-2">
          {s.automations.map((a) => (
            <li key={a.title}>
              <AutomationFlow automation={a} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="connections" eyebrow="Connected" title="How it works with the other three systems">
        <ul className="grid gap-6 md:grid-cols-3">
          {others.map((o) => (
            <li key={o.id} className="cut-corners bg-surface-alt p-6">
              <h3 className="text-lg">
                <Link href={`/services/${o.slug}`}>{o.name}</Link>
              </h3>
              <p className="mt-2 flex gap-2 text-muted">
                <CheckIcon className="mt-1 size-4 shrink-0 text-success-700" />
                {s.connections[o.id]}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="examples" tone="alt" eyebrow="By business type" title={`${s.shortName} in practice`}>
        <div className="rounded-card border border-line bg-white p-5 sm:p-8">
          <Tabs
            label={`${s.shortName} examples by business type`}
            tabs={segmentsForMarket(market).map((seg) => ({
              id: seg.id,
              label: seg.name,
              content: (
                <div className="max-w-3xl">
                  <p className="text-lg">{t(s.examples[seg.id], market)}</p>
                  <p className="mt-4">
                    <Link href={`/solutions/${seg.slug}`}>More on systems for {seg.name.toLowerCase()}</Link>
                  </p>
                </div>
              ),
            }))}
          />
        </div>
      </Section>

      <Section id="faq" eyebrow="Questions" title="Frequently asked questions">
        <div className="max-w-3xl">
          <FaqList faqs={s.faqs} market={market} />
        </div>
      </Section>

      <CtaBand title={`See what a ${s.shortName.toLowerCase()} system would automate for you`} />
    </>
  );
}
