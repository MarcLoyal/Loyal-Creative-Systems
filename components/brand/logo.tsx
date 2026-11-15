import Image from "next/image";
import Link from "next/link";
import { BRAND, SITE } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Logo (SPEC 2.1). Uses the supplied file as-is once it is in public/brand/.
 * Until then a plain-text wordmark stands in. It deliberately does not imitate
 * the logo artwork. Clear space around the logo is provided by the padding here.
 */
export function Logo({ variant = "color", className }: { variant?: "color" | "white"; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center p-1.5 no-underline", className)}
    >
      {BRAND.logoAvailable ? (
        <Image
          src={variant === "white" ? BRAND.logoWhite : BRAND.logo}
          alt={SITE.name}
          width={BRAND.logoWidth}
          height={BRAND.logoHeight}
          priority
        />
      ) : (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-lg font-bold tracking-tight whitespace-nowrap",
              variant === "white" ? "text-white" : "text-navy-900",
            )}
          >
            Loyal Creative Systems
          </span>
          <span
            className={cn(
              "mt-1 font-heading text-[0.625rem] font-semibold tracking-[0.14em] uppercase sm:whitespace-nowrap",
              variant === "white" ? "text-blue-300" : "text-blue-700",
            )}
            aria-hidden="true"
          >
            {SITE.tagline.replace(/\.$/, "")}
          </span>
        </span>
      )}
      <span className="sr-only">, home</span>
    </Link>
  );
}
