import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy } from "@/config/content/case-studies";
import { getService } from "@/config/content/services";
import { MARKETS } from "@/lib/market";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@/components/ui/icons";
import { Container, CtaBand, JsonLd, PageHero } from "@/components/site/blocks";

export function generateStaticParams() {
  return MARKETS.flatMap((market) => CASE_STUDIES.map((c) => ({ market, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[market]/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.summary, path: `/case-studies/${c.slug}` });
}

export default async function CaseStudyPage({ params }: PageProps<"/[market]/case-studies/[slug]">) {
  await marketParam(params);
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
    { name: c.title, path: `/case-studies/${c.slug}` },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero breadcrumbs={crumbs} eyebrow="Case study" title={c.title} intro={<p>{c.summary}</p>} />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_18rem]">
        <article className="max-w-3xl space-y-12">
          <section aria-labelledby="problem-h">
            <h2 id="problem-h" className="text-2xl">The problem</h2>
            <div className="mt-4 space-y-3 text-lg text-muted">
              {c.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
          <section aria-labelledby="built-h">
            <h2 id="built-h" className="text-2xl">What was built</h2>
            <ul className="mt-4 space-y-3">
              {c.built.map((b) => (
                <li key={b} className="flex gap-3">
                  <CheckIcon className="mt-1 size-5 shrink-0 text-success-700" />
                  {b}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="result-h">
            <h2 id="result-h" className="text-2xl">The result</h2>
            <div className="mt-4 space-y-3 rounded-card border-l-4 border-blue-500 bg-surface-alt p-5">
              {c.result.map((r) => (
                <p key={r}>{r}</p>
              ))}
            </div>
            {c.segment === null && (
              <p className="mt-4">
                Meanwhile, <Link href="/how-it-works">see every stage of the pipeline</Link> or{" "}
                <Link href="/demo">run it on a sample business</Link>.
              </p>
            )}
          </section>
          {c.quote && (
            <blockquote className="border-l-4 border-navy-900 pl-5 text-xl">
              <p>“{c.quote.text}”</p>
              <footer className="mt-2 text-base text-muted">{c.quote.by}</footer>
            </blockquote>
          )}
        </article>
        <aside className="self-start rounded-card border border-line p-6">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-medium text-ink">Client</dt>
              <dd className="mt-1 text-muted">{c.clientType}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Market</dt>
              <dd className="mt-1 text-muted">{c.market === null ? "Philippines and United States" : c.market === "ph" ? "Philippines" : "United States"}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Systems</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {c.services.map((id) => (
                  <Badge key={id} tone="info">
                    {getService(id)!.shortName}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </Container>
      <CtaBand />
    </>
  );
}
