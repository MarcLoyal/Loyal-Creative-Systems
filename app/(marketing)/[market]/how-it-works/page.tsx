import type { Metadata } from "next";
import { PIPELINE } from "@/config/content/pipeline";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { marketParam } from "@/lib/page";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { Container, CtaBand, JsonLd, PageHero, Section } from "@/components/site/blocks";
import { PipelineDiagram } from "@/components/diagrams/pipeline-diagram";

export const metadata: Metadata = pageMetadata({
  title: "How it works: from inquiry to onboarded client, automated",
  description:
    "Every step from your first inquiry to your weekly progress report runs automatically. See what you experience and what the system does behind the scenes.",
  path: "/how-it-works",
});

export default async function HowItWorksPage({ params }: PageProps<"/[market]/how-it-works">) {
  await marketParam(params);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        breadcrumbs={crumbs}
        eyebrow="How it works"
        title="From your first message to your first weekly report, without waiting on anyone"
        intro="Our own sales and onboarding run on the kind of system we build for clients. Here is every step, what you see, and what happens behind the scenes."
      />

      <Section id="overview" eyebrow="The pipeline" title="Seven stages, no manual steps" intro="Select a stage for a summary, or read the full walkthrough below.">
        <PipelineDiagram />
      </Section>

      <div className="bg-surface-alt py-16 sm:py-20">
        <Container>
          <ol className="space-y-8">
            {PIPELINE.map((st) => (
              <li key={st.id} id={st.id} className="scroll-mt-24">
                <article aria-labelledby={`${st.id}-h`} className="grid gap-6 rounded-card bg-white p-6 ring-1 ring-line sm:p-8 lg:grid-cols-[14rem_1fr_1fr]">
                  <div>
                    <span aria-hidden="true" className="brand-gradient flex size-12 items-center justify-center rounded-full font-heading text-lg font-bold text-white">
                      {st.index}
                    </span>
                    <h2 id={`${st.id}-h`} className="mt-4 text-2xl">
                      <span className="sr-only">Stage {st.index}: </span>
                      {st.name}
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      <span className="font-medium text-ink">Target:</span> {st.target}
                    </p>
                  </div>
                  <div>
                    <h3 className="eyebrow">What you experience</h3>
                    <p className="mt-3">{st.visitor}</p>
                    <p className="mt-4 text-sm text-muted">
                      <span className="font-medium text-ink">You receive:</span> {st.clientReceives}
                    </p>
                  </div>
                  <div>
                    <h3 className="eyebrow">Behind the scenes</h3>
                    <ul className="mt-3 space-y-2">
                      {st.behindTheScenes.map((b) => (
                        <li key={b} className="flex gap-2 text-muted">
                          <CheckIcon className="mt-1 size-4 shrink-0 text-success-700" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-muted">
            Real, anonymized examples from our own pipeline are added to each stage once it has handled enough inquiries.
          </p>
        </Container>
      </div>

      <Section id="try" eyebrow="Try it" title="Run the pipeline on a sample business">
        <p className="max-w-2xl text-lg text-muted">
          See the score, a short sample plan, and the emails your business would receive. It is a demonstration: nothing is
          sent and no record is created.
        </p>
        <ButtonLink href="/demo" size="lg" className="mt-6">
          Try the demo
        </ButtonLink>
      </Section>

      <CtaBand />
    </>
  );
}
