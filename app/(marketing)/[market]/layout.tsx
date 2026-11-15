import { notFound } from "next/navigation";
import { MARKETS, isMarket } from "@/lib/market";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

/**
 * Marketing shell. One static copy per market; proxy.ts picks which one a visitor sees
 * while the public URL stays market-free.
 */
export function generateStaticParams() {
  return MARKETS.map((market) => ({ market }));
}

export default async function MarketingLayout({ children, params }: LayoutProps<"/[market]">) {
  const { market } = await params;
  if (!isMarket(market)) notFound();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader market={market} />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter market={market} />
      {/* Chat launcher (SPEC 9) mounts here in phase 3. */}
    </>
  );
}
