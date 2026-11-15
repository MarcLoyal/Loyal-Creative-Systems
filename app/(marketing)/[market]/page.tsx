import { notFound } from "next/navigation";
import { MARKET_CONFIG, isMarket } from "@/lib/market";
import { solutionsNav } from "@/config/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";

/**
 * Phase 1 home: proves the shell, tokens and market routing. The full home page
 * (SPEC 6.1) is built in phase 2.
 */
export default async function HomePage({ params }: PageProps<"/[market]">) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  const cfg = MARKET_CONFIG[market];

  return (
    <>
      <section className="divider-angle brand-gradient pt-20 pb-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-blue-300!">Custom automated systems</p>
          <h1 className="mt-4 max-w-3xl text-4xl text-white sm:text-5xl">
            Your sales, jobs, invoices and books, connected and running on their own.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90">
            We build CRM, operations, accounting, and bookkeeping systems that pass work to each other, so nothing is
            typed twice.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/contact" variant="inverse" size="lg">
              Get your system plan
            </ButtonLink>
            <ButtonLink href="/demo" size="lg" className="border-2 border-white/60 bg-transparent">
              Watch it work
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow">Who we build for</p>
        <h2 className="mt-3 text-3xl">Built for how your business runs</h2>
        <p className="mt-3 text-muted">
          Showing the {cfg.label} market. Prices are in {cfg.currency}; payment options include{" "}
          {cfg.paymentMethods.join(", ")}.
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {solutionsNav(market).map((s) => (
            <li key={s.href}>
              <Card shape="cut" tone="alt" interactive className="h-full">
                <CardTitle>{s.label}</CardTitle>
                <CardBody>{s.description}</CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
