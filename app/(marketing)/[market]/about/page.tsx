import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, organizationJsonLd, pageMetadata } from "@/lib/seo";
import { CheckIcon } from "@/components/ui/icons";
import { CtaBand, JsonLd, PageHero, Section } from "@/components/site/blocks";
import { TeamGrid } from "@/components/site/team";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Loyal Creative Systems builds custom automated CRM, operations, accounting, and bookkeeping systems for cooperatives, agencies, and local service businesses in the Philippines and the United States.",
  path: "/about",
});

const PRINCIPLES = [
  { title: "We map your work before we automate it", body: "Every project starts with how your business actually runs today: who does what, where the data lives, and where time is lost." },
  { title: "Connected, not just digital", body: "A spreadsheet in the cloud is still a spreadsheet. We connect your systems so work passes from one to the next by itself." },
  { title: "You can see everything", body: "Every automated step is logged. If something fails, it is retried, and if it still fails, a person is told at once." },
  { title: "We build systems, not books", body: "We are not an accounting, tax, or audit firm. Our systems organize your records; your accountant advises on them." },
];

export default async function AboutPage({ params }: PageProps<"/[market]/about">) {
  await marketParam(params);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), organizationJsonLd()]} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="About us"
        title="We build the systems that run the back office"
        intro={<p>{SITE.name} designs and builds custom automated systems for CRM, operations, accounting, and bookkeeping, connected into one flow.</p>}
      />

      <Section id="who" eyebrow="Who we are" title="Expert strategy, automated solutions">
        <div className="max-w-3xl space-y-4 text-lg text-muted">
          <p>
            Most small and growing businesses don’t need more software. They need the software they have to talk to each
            other, and the repetitive work between them to happen on its own.
          </p>
          <p>
            That is what we build: systems shaped around how a cooperative, an agency, or a local service business already
            works, so the people in it spend their time on members, clients, and customers instead of copying details from
            one place to another.
          </p>
        </div>
      </Section>

      <Section id="how" tone="alt" eyebrow="How we work" title="Four things we hold to">
        <ul className="grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="cut-corners bg-white p-6 ring-1 ring-line">
              <h3 className="flex items-start gap-2 text-lg">
                <CheckIcon className="mt-1 size-5 shrink-0 text-success-700" />
                {p.title}
              </h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* [DECISION] D7: photos supplied; names and roles in config/content/team.ts are placeholders. */}
      <Section
        id="team"
        eyebrow="Our team"
        title="The people who build your system"
        intro={<p>You work with the same small team from the first call to handover.</p>}
      >
        <TeamGrid />
      </Section>

      <Section id="areas" tone="alt" eyebrow="Where we work" title="Serving the Philippines and the United States">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-line p-6">
            <h3 className="text-lg">Philippines</h3>
            <p className="mt-2 text-muted">
              Cooperatives, agencies, and local service businesses nationwide. Prices in pesos; payments by GCash, Maya, bank
              transfer, or card.
            </p>
          </div>
          <div className="rounded-card border border-line p-6">
            <h3 className="text-lg">United States</h3>
            <p className="mt-2 text-muted">
              Agencies and local service businesses across the US. Prices in US dollars; payments by card or ACH. Calls are
              scheduled during your business hours.
            </p>
          </div>
        </div>
        <p className="mt-6 text-muted">We work remotely, with calls by video.</p>
      </Section>

      <CtaBand />
    </>
  );
}
