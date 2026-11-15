import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { marketParam } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description: "Terms for using the Loyal Creative Systems website, demo, chat assistant, and system plans.",
  path: "/terms",
});

export default async function TermsPage({ params }: PageProps<"/[market]/terms">) {
  await marketParam(params);
  return (
    <LegalPage
      title="Terms of use"
      path="/terms"
      updated="15 November 2026"
      intro="The rules for using this website. Client projects are governed by a separate service agreement."
    >
      <h2>About these terms</h2>
      <p>These terms apply to your use of this website, including the intake form, chat assistant, demo, and system plans. By using the site you agree to them. Work we do for clients is covered by the service agreement signed for that project, which takes priority over these terms.</p>

      <h2>What we provide, and what we don’t</h2>
      <p>{SITE.name} designs and builds business systems. We are not an accounting, bookkeeping, tax, audit, or law firm. Nothing on this site, in our emails, chat, or system plans is accounting, tax, legal, or compliance advice, and our systems do not guarantee regulatory compliance. Please consult a qualified professional for that advice.</p>

      <h2>System plans and prices</h2>
      <ul>
        <li>System plans are proposals based on the information you give us. They are valid for 30 days from the date shown.</li>
        <li>Prices and timelines are confirmed in the plan or on a call, and become binding only when a service agreement is signed.</li>
        <li>Plans are prepared with the help of automated tools and checked before sending. If you spot an error, tell us and we will correct it.</li>
      </ul>

      <h2>The chat assistant and demo</h2>
      <p>The chat assistant is an AI. It answers questions about our services and can collect your details if you ask it to; it can make mistakes, and it cannot quote prices, promise results, or give professional advice. The demo uses fictional sample businesses and sample results; nothing in it is a commitment.</p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don’t submit false information, someone else’s details without permission, or content that is unlawful or abusive.</li>
        <li>Don’t try to disrupt the site, bypass its security or rate limits, or extract the assistant’s instructions.</li>
        <li>Don’t use automated tools to submit forms or scrape the site.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>The site, its content, and the {SITE.name} name and logo belong to us. You may share links to the site. Your system plan is for your own business use.</p>

      <h2>Liability</h2>
      <p>The site is provided “as is”. To the extent the law allows, we are not liable for indirect or consequential losses from using it. Nothing in these terms limits rights you have under consumer protection law in your country.</p>

      <h2>Privacy</h2>
      <p>Our <Link href="/privacy">privacy policy</Link> explains how we handle personal data.</p>

      <h2>Governing law</h2>
      <p>{/* Depends on [DECISION] D1 (where the business is registered). */}These terms are governed by the laws of the place where {SITE.name} is registered, to be confirmed before launch.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
    </LegalPage>
  );
}
