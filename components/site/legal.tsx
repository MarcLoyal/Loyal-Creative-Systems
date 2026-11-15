import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Container, PageHero } from "./blocks";

/** Legal page shell. Drafts carry a visible banner until reviewed (SPEC 6.11). */
export function LegalPage({
  title,
  intro,
  updated,
  children,
  path,
}: {
  title: string;
  intro: string;
  updated: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: title, path },
        ]}
        eyebrow="Legal"
        title={title}
        intro={<p>{intro}</p>}
      />
      <Container className="py-12 sm:py-16">
        <div className="mb-10 flex max-w-3xl flex-wrap items-start gap-3 rounded-card border border-warning/40 bg-warning-50 p-4 text-sm">
          <Badge tone="warning">Draft</Badge>
          <p className="flex-1 text-ink">
            This is a draft prepared from standard templates and is pending legal review before launch. It is not legal advice.
          </p>
        </div>
        <div className="legal max-w-3xl">{children}</div>
        <p className="mt-12 max-w-3xl text-sm text-muted">Last updated: {updated}</p>
      </Container>
    </>
  );
}
