import type { Metadata } from "next";
import { SERVICES } from "@/config/content/services";
import { SEGMENTS } from "@/config/content/segments";
import { diagramSegments } from "@/config/content/pipeline";
import type { SegmentId, ServiceId } from "@/config/content/types";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { CtaBand, JsonLd, PageHero, Section } from "@/components/site/blocks";
import { ServiceCard } from "@/components/site/cards";
import { ServicesDiagram } from "@/components/diagrams/services-diagram";

export const metadata: Metadata = pageMetadata({
  title: "Services: CRM, operations, accounting and bookkeeping systems",
  description:
    "Four custom systems that pass work to each other: a sale in the CRM creates the job, the job creates the invoice, and the invoice posts to the books.",
  path: "/services",
});

export default async function ServicesPage({ params }: PageProps<"/[market]/services">) {
  const market = await marketParam(params);
  const order: SegmentId[] = market === "ph" ? ["cooperative", "agency", "local_service"] : ["local_service", "agency", "cooperative"];
  const labels = Object.fromEntries(SEGMENTS.map((s) => [s.id, s.label])) as Record<SegmentId, string>;
  const names = Object.fromEntries(SERVICES.map((s) => [s.id, s.shortName])) as Record<ServiceId, string>;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          ...SERVICES.map((s) => serviceJsonLd({ name: s.name, description: s.summary, path: `/services/${s.slug}` })),
        ]}
      />
      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        eyebrow="Services"
        title="Four systems that pass work to each other"
        intro="A sale in the CRM creates the job in operations, which creates the invoice in accounting, which posts to the books. Nothing is typed twice."
      />

      <Section
        id="diagram"
        eyebrow="See it connect"
        title="Follow one record through all four systems"
        intro="Pick the kind of business closest to yours and watch a single record move from first contact to the books."
      >
        <ServicesDiagram segments={diagramSegments(market, order, labels, names)} />
      </Section>

      <Section id="services" tone="alt" eyebrow="The four systems" title="Start with one, or connect all four">
        <ul className="grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <ServiceCard service={s} />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title="Not sure which system you need first?" body="Tell us what slows your business down. Your plan will recommend where to start." />
    </>
  );
}
