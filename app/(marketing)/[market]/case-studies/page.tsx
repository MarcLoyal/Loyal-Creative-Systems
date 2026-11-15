import type { Metadata } from "next";
import { CASE_STUDIES } from "@/config/content/case-studies";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { CtaBand, JsonLd, PageHero, Section } from "@/components/site/blocks";
import { CaseStudyCard } from "@/components/site/cards";

export const metadata: Metadata = pageMetadata({
  title: "Case studies",
  description: "Real results from systems we have built. Only client-approved case studies with real numbers are published.",
  path: "/case-studies",
});

export default async function CaseStudiesPage({ params }: PageProps<"/[market]/case-studies">) {
  await marketParam(params);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Case studies"
        title="Real systems, real numbers"
        intro="We publish only real projects, with the client’s approval and real results. Filters by business type, system, and market appear as more case studies are published."
      />
      <Section id="list">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASE_STUDIES.map((c) => (
            <li key={c.slug}>
              <CaseStudyCard study={c} />
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
