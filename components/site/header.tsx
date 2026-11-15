import Link from "next/link";
import type { Market } from "@/lib/market";
import { PRIMARY_CTA, PRIMARY_NAV, SERVICES_NAV, solutionsNav, type NavLink } from "@/config/navigation";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { ChevronDownIcon, MenuIcon } from "@/components/ui/icons";
import { Disclosure } from "./disclosure";
import { MarketSwitcher } from "./market-switcher";

const navItem =
  "flex min-h-11 items-center gap-1 rounded-md px-3 font-heading text-[0.9375rem] font-semibold text-navy-900 no-underline hover:bg-surface-alt hover:text-blue-700";

function MenuList({ links }: { links: NavLink[] }) {
  return (
    <ul className="grid gap-1">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="block rounded-md px-3 py-2.5 no-underline hover:bg-surface-alt">
            <span className="block font-heading text-sm font-semibold text-navy-900">{l.label}</span>
            {l.description && <span className="block text-sm text-muted">{l.description}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DropMenu({ label, links }: { label: string; links: NavLink[] }) {
  return (
    <Disclosure
      className="group relative"
      summaryClassName={`${navItem} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
      panelClassName="absolute top-full left-0 z-40 mt-2 w-80 rounded-card border border-line bg-white p-2 shadow-xl shadow-navy-900/10"
      summary={
        <>
          {label}
          <ChevronDownIcon className="size-4 transition-transform group-open:rotate-180" />
        </>
      }
    >
      <MenuList links={links} />
    </Disclosure>
  );
}

export function SiteHeader({ market }: { market: Market }) {
  const solutions = solutionsNav(market);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            <li>
              <DropMenu label="Services" links={SERVICES_NAV} />
            </li>
            <li>
              <DropMenu label="Solutions" links={solutions} />
            </li>
            {PRIMARY_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={navItem}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <MarketSwitcher current={market} />
          <ButtonLink href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</ButtonLink>
        </div>

        {/* Mobile menu */}
        <Disclosure
          className="lg:hidden"
          summaryClassName="flex size-11 cursor-pointer list-none items-center justify-center rounded-md text-navy-900 hover:bg-surface-alt [&::-webkit-details-marker]:hidden"
          panelClassName="fixed inset-x-0 top-18 bottom-0 z-40 overflow-y-auto border-t border-line bg-white px-4 pt-4 pb-10"
          summary={
            <>
              <MenuIcon className="size-6" />
              <span className="sr-only">Menu</span>
            </>
          }
        >
          <nav aria-label="Mobile" className="mx-auto max-w-lg space-y-6">
            <ButtonLink href={PRIMARY_CTA.href} size="lg" className="w-full">
              {PRIMARY_CTA.label}
            </ButtonLink>
            <div>
              <p className="eyebrow mb-2 px-3">Services</p>
              <MenuList links={SERVICES_NAV} />
            </div>
            <div>
              <p className="eyebrow mb-2 px-3">Solutions</p>
              <MenuList links={solutions} />
            </div>
            <ul className="grid gap-1 border-t border-line pt-4">
              {PRIMARY_NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={navItem}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-3 pt-4">
              <MarketSwitcher current={market} />
            </div>
          </nav>
        </Disclosure>
      </div>
    </header>
  );
}
