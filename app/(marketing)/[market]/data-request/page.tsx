import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { marketParam } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = pageMetadata({
  title: "Your data: access or deletion requests",
  description: "Ask Loyal Creative Systems for a copy of your personal data, or for it to be deleted. Requests are verified by email and completed within 30 days.",
  path: "/data-request",
});

export default async function DataRequestPage({ params }: PageProps<"/[market]/data-request">) {
  await marketParam(params);
  const mail = (type: string) =>
    `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(`Data request: ${type}`)}&body=${encodeURIComponent(
      "Email address you used with us:\n\nAnything that helps us find your records (business name, approximate date):\n",
    )}`;
  return (
    <LegalPage
      title="Your data"
      path="/data-request"
      updated="15 November 2026"
      intro="Ask for a copy of the personal data we hold about you, or ask us to delete it."
    >
      <h2>How to make a request</h2>
      {/* SPEC 23.2: a self-service form with email verification replaces these links in a later phase. */}
      <ul>
        <li><a href={mail("access")}>Request a copy of my data</a></li>
        <li><a href={mail("deletion")}>Request deletion of my data</a></li>
      </ul>
      <p>Send the request from the email address you used with us, or tell us which one it was.</p>

      <h2>What happens next</h2>
      <ul>
        <li>We confirm the request comes from you by sending a verification link to that email address.</li>
        <li>We complete verified requests within 30 days and tell you when it is done.</li>
        <li>Some records, such as invoices and signed agreements, may have to be kept by law. If so, we tell you which and why.</li>
        <li>Every request is logged.</li>
      </ul>
      <p>See the <Link href="/privacy">privacy policy</Link> for your full rights in the Philippines and the United States.</p>
    </LegalPage>
  );
}
