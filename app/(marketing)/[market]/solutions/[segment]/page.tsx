import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SEGMENTS, getSegment } from "@/config/content/segments";
import { getService } from "@/config/content/services";
import { t } from "@/config/content/types";
import { MARKETS } from "@/lib/market";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon, ClockIcon } from "@/components/ui/icons";
import { Container, FaqList, JsonLd, PageHero, Section } from "@/components/site/blocks";

export function generateStaticParams() {
  return MARKETS.flatMap((market) => SEGMENTS.map((s) => ({ market, segment: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[market]/solutions/[segment]">): Promise<Metadata> {
  const { segment } = await params;
  const s = getSegment(segment);
  if (!s) return {};
  return pageMetadata({ title: `Automated systems for ${s.name.toLowerCase()}`, description: s.metaDescription, path: `/solutions/${s.slug}` });
}

export default async function SegmentPage({ params }: PageProps<"/[market]/solutions/[segment]">) {
  const market = await marketParam(params);
  const { segment } = await params;
  const s = getSegment(segment);
  if (!s) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Solutions", path: `/solutions/${s.slug}` },
    { name: s.name, path: `/solutions/${s.slug}` },
  ].filter((c, i) => i !== 1);
  const contactHref = `/contact?segment=${s.id}`;

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(s.faqs, market)]} />
      <PageHero breadcrumbs={crumbs} eyebrow={`For ${s.name.toLowerCase()}`} title={s.headline} intro={<p>{t(s.intro, market)}</p>}>
        <ButtonLink href={contactHref} variant="inverse" size="lg">
          Get your system plan
        </ButtonLink>
      </PageHero>

      <Section id="pains" eyebrow="Sound familiar?" title="Where the time goes today">
        <ul className="grid gap-6 md:grid-cols-3">
          {s.pains.map((p) => (
            <li key={p.title} className="cut-corners bg-surface-alt p-6">
              <h3 className="text-xl">{p.title}</h3>
              <p className="mt-2 text-muted">{t(p.body, market)}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="day" tone="alt" eyebrow="Day before / day after" title="The same day, with the system running">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-card border border-line bg-white p-6">
            <h3 className="flex items-center gap-2 text-lg">
              <ClockIcon className="size-5 text-warning-700" /> Before
            </h3>
            <ol className="mt-4 space-y-3">
              {s.before.map((b) => (
                <li key={b} className="border-l-3 border-warning pl-4 text-muted">
                  {b}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-card border-2 border-blue-700 bg-white p-6">
            <h3 className="flex items-center gap-2 text-lg">
              <CheckIcon className="size-5 text-success-700" /> After
            </h3>
            <ol className="mt-4 space-y-3">
              {s.after.map((a) => (
                <li key={a} className="border-l-3 border-success-700 pl-4">
                  {a}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section id="systems" eyebrow="What we would build" title={`The systems that matter most for ${s.name.toLowerCase()}`}>
        <ul className="grid gap-6 sm:grid-cols-2">
          {s.systems.map((id) => {
            const svc = getService(id)!;
            return (
              <li key={id} className="cut-corners bg-surface-alt p-6">
                <h3 className="text-lg">
                  <Link href={`/services/${svc.slug}`}>{svc.name}</Link>
                </h3>
                <p className="mt-2 text-muted">{s.systemNotes[id]}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="faq" tone="alt" eyebrow="Questions" title="Frequently asked questions">
        <div className="max-w-3xl">
          <FaqList faqs={s.faqs} market={market} />
        </div>
      </Section>

      {/* SPEC 6.5: the intake form, with this segment pre-selected, is embedded here in phase 3. */}
      <section aria-labelledby="start-heading" className="py-16 sm:py-20">
        <Container>
          <div className="cut-corners brand-gradient px-6 py-12 text-white sm:px-12">
            <h2 id="start-heading" className="text-3xl text-white">
              Get a system plan for your {s.id === "local_service" ? "local service business" : s.label.toLowerCase()}
            </h2>
            <p className="mt-3 max-w-xl text-lg text-white/90">
              Answer a few questions about how you work today. Your tailored plan arrives in your inbox in under a minute.
            </p>
            <ButtonLink href={contactHref} variant="inverse" size="lg" className="mt-8">
              Start your plan
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
