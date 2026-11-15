import Link from "next/link";
import { FOOTER_COLUMNS } from "@/config/navigation";
import { SITE } from "@/config/site";
import type { Market } from "@/lib/market";
import { Logo } from "@/components/brand/logo";
import { MarketSwitcher } from "./market-switcher";

export function SiteFooter({ market }: { market: Market }) {
  return (
    <footer className="mt-auto bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo variant="white" size="lg" className="-ml-3.5" />
            <p className="mt-4 max-w-xs">{SITE.tagline}</p>
            <p className="mt-4">
              <a href={`mailto:${SITE.contactEmail}`} className="text-blue-300 underline-offset-4 hover:underline">
                {SITE.contactEmail}
              </a>
            </p>
            <div className="mt-6">
              <MarketSwitcher current={market} tone="dark" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_COLUMNS(market).map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-heading text-xs font-semibold tracking-[0.18em] text-white uppercase">{col.title}</h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-slate-300 no-underline hover:text-white hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm sm:flex-row sm:justify-between">
          <p>
            © <CopyrightYear /> {SITE.name}. LCS builds systems; it is not an accounting, tax, or audit firm.
          </p>
          <p>
            <Link href="/privacy" className="text-slate-300 hover:text-white">
              Privacy
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/terms" className="text-slate-300 hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Build-time year; the static pages are rebuilt on every deploy. */
function CopyrightYear() {
  return <>{BUILD_YEAR}</>;
}
const BUILD_YEAR = new Date().getUTCFullYear();
