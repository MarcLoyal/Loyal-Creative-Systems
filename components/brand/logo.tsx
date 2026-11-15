import Image from "next/image";
import Link from "next/link";
import { BRAND, SITE } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Logo (SPEC 2.1): the supplied artwork, used as-is (transparent crop, or the white
 * version on dark backgrounds). Never redrawn or re-lettered.
 *
 * Clear space: the padding around the image equals the width of the "L" stem
 * (about 21% of the lockup's height) on every side.
 */
export function Logo({
  variant = "color",
  size = "md",
  className,
  loading = "lazy",
}: {
  variant?: "color" | "white";
  size?: "md" | "lg";
  className?: string;
  /** "eager" in the header. Deliberately not preloaded: the logo is never the largest
   *  element, and a high-priority preload would compete with the fonts for bandwidth. */
  loading?: "eager" | "lazy";
}) {
  const { src, white, width, height } = BRAND.logo;
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center no-underline", size === "md" ? "p-2.5" : "p-3.5", className)}
    >
      <Image
        src={variant === "white" ? white : src}
        alt={SITE.name}
        width={width}
        height={height}
        loading={loading}
        sizes={size === "md" ? "170px" : "220px"}
        className={cn("w-auto", size === "md" ? "h-11 sm:h-12" : "h-16")}
      />
      <span className="sr-only">, home</span>
    </Link>
  );
}
