import type { Metadata } from "next";
import { marketParam } from "@/lib/page";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/progress";
import { CtaBand, JsonLd, PageHero, Section } from "@/components/site/blocks";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Practical ideas for cooperatives, agencies, and local service businesses on automating CRM, operations, accounting, and bookkeeping.",
  path: "/blog",
});

/* Published posts are read from the database in phase 9 (SPEC 19.1). */
export default async function BlogPage({ params }: PageProps<"/[market]/blog">) {
  await marketParam(params);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero breadcrumbs={crumbs} eyebrow="Blog" title="Ideas for running a business that runs itself" />
      <Section id="posts">
        <EmptyState
          title="First posts coming soon"
          body="Practical, specific ideas for cooperatives, agencies, and local service businesses. In the meantime, see how our own pipeline works."
          action={<ButtonLink href="/how-it-works" variant="secondary">How it works</ButtonLink>}
        />
      </Section>
      <CtaBand />
    </>
  );
}
