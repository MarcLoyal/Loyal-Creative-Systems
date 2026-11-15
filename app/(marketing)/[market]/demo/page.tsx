import type { Metadata } from "next";
import { DEMO_RUNS } from "@/config/content/demo";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { CtaBand, JsonLd, PageHero, Section } from "@/components/site/blocks";
import { DemoPlayback } from "@/components/demo/demo-playback";

export const metadata: Metadata = pageMetadata({
  title: "Demo: watch the pipeline run",
  description: "Watch our pipeline score a sample business, write a short plan, and line up the emails and project it would create. Nothing is sent.",
  path: "/demo",
});

export default async function DemoPage({ params }: PageProps<"/[market]/demo">) {
  await marketParam(params);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Demo", path: "/demo" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Demonstration"
        title="Watch it work"
        intro="Pick a sample business and watch the pipeline score it, draft a plan, and line up the emails and project it would create."
      />
      <Section id="demo">
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-card border border-warning/40 bg-warning-50 p-4 text-sm">
          <Badge tone="warning">Demonstration</Badge>
          <span className="text-ink">
            These are fictional sample businesses with sample results. Nothing is emailed and no record is created. A version
            that runs on your own business details is coming.
          </span>
        </div>
        <DemoPlayback runs={DEMO_RUNS} />
      </Section>
      <CtaBand />
    </>
  );
}
