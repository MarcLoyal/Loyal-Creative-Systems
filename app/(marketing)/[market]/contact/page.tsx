import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Container, JsonLd, PageHero } from "@/components/site/blocks";

export const metadata: Metadata = pageMetadata({
  title: "Get your system plan",
  description: "Tell us about your business and receive a tailored system plan in your inbox in under a minute.",
  path: "/contact",
});

const NEXT_STEPS = [
  { title: "Tell us about your business", body: "A few questions about your team, your tools, and what slows you down. About five minutes." },
  { title: "Get your plan in under a minute", body: "A tailored system plan arrives by email: what we would build, what it automates, and how we work." },
  { title: "Book a call if it fits", body: "Pick a 30-minute slot from your plan. No obligation." },
];

export default async function ContactPage({ params }: PageProps<"/[market]/contact">) {
  await marketParam(params);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="Get your system plan"
        title="Tell us about your business"
        intro="You’ll have a tailored plan in your inbox in under a minute."
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        {/* SPEC 8: the multi-step smart intake form is the main content here. It is built in phase 3. */}
        <section aria-labelledby="form-h" className="rounded-card border-2 border-dashed border-line p-6 sm:p-8">
          <h2 id="form-h" className="text-2xl">
            The intake form opens soon
          </h2>
          <p className="mt-3 text-muted">
            Until it does, email us a few lines about your business, your team size, and what you would like to stop
            doing by hand. A person will reply.
          </p>
          <p className="mt-6">
            <a
              href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent("System plan request")}`}
              className="font-heading text-lg font-semibold"
            >
              {SITE.contactEmail}
            </a>
          </p>
        </section>
        <section aria-labelledby="next-h">
          <h2 id="next-h" className="text-2xl">
            What happens next
          </h2>
          <ol className="mt-6 space-y-6">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span aria-hidden="true" className="brand-gradient flex size-9 shrink-0 items-center justify-center rounded-full font-heading font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg">{s.title}</h3>
                  <p className="mt-1 text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </>
  );
}
