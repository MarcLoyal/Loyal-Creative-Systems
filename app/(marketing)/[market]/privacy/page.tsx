import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/config/site";
import { marketParam } from "@/lib/page";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description: "How Loyal Creative Systems collects, uses, shares, and protects personal data, and your rights in the Philippines and the United States.",
  path: "/privacy",
});

const PROCESSORS = [
  ["Supabase", "Database, authentication, and file storage"],
  ["Vercel", "Website hosting"],
  ["Anthropic", "AI processing for replies, scoring, plans, and the chat assistant"],
  ["Resend", "Sending email"],
  ["Cal.com", "Call scheduling"],
  ["Inngest", "Running background workflows"],
  ["Cloudflare", "Spam protection (Turnstile)"],
  ["Upstash", "Rate limiting"],
  ["Sentry", "Error monitoring"],
  ["Payment providers", "Processing payments (named here once selected)"],
  ["Analytics provider", "Privacy-friendly analytics, only with your consent where required"],
];

export default async function PrivacyPage({ params }: PageProps<"/[market]/privacy">) {
  await marketParam(params);
  return (
    <LegalPage
      title="Privacy policy"
      path="/privacy"
      updated="15 November 2026"
      intro="What we collect, why, who processes it, how long we keep it, and your rights."
    >
      <h2>Who we are</h2>
      <p>
        {SITE.name} (“LCS”, “we”) builds custom automated business systems. We are the controller of personal data collected
        through this website. Contact us about privacy at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
        {/* [DECISION] D7: registered business address and, for the Philippines, the Data Protection Officer’s details. */}
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Inquiry details</strong> you give us in the intake form or chat: name, work email, phone, business name, country, business details, and your answers about your needs, timing, and budget.</li>
        <li><strong>Chat conversations</strong> with our AI assistant.</li>
        <li><strong>Booking details</strong>: the time you choose and your time zone.</li>
        <li><strong>Agreement and payment records</strong>: your typed signature, the time, IP address, and browser of signing; payment status and receipts. Card details go directly to our payment provider and are never stored by us.</li>
        <li><strong>Client portal data</strong>, if you become a client: project information, messages, and files you share.</li>
        <li><strong>Technical data</strong>: IP address, browser, pages visited, and, with consent where required, analytics.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To respond to your inquiry and prepare your system plan (based on your consent and on steps you ask us to take before a contract).</li>
        <li>To deliver our services if you become a client (performance of a contract).</li>
        <li>To send marketing emails, only if you opt in. You can unsubscribe at any time with one click.</li>
        <li>To keep the site secure, prevent spam and abuse, and fix errors (legitimate interests).</li>
        <li>To meet legal obligations such as keeping financial records.</li>
      </ul>

      <h2>Automated processing and AI</h2>
      <p>
        We use automated tools, including AI, to read your inquiry, prioritize it, and draft replies and plans. Scoring uses only
        the answers you give about your business, never your name or any sensitive characteristic. Our team can review or
        override any automated result, and you can ask for a person to review a decision that affects you.
      </p>

      <h2>Who processes it</h2>
      <p>We share personal data only with service providers that process it for us, under contract:</p>
      <ul>
        {PROCESSORS.map(([name, use]) => (
          <li key={name}><strong>{name}</strong>: {use}</li>
        ))}
      </ul>
      <p>Some of these providers process data outside your country, including in the United States. We rely on contractual safeguards for these transfers. We do not sell personal data or share it for cross-context behavioral advertising.</p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Inquiries that do not become clients, and spam: deleted or anonymized after 24 months.</li>
        <li>Chat conversations not linked to an inquiry: deleted after 90 days.</li>
        <li>Client and financial records: for as long as the law requires us to keep them.</li>
      </ul>

      <h2>Your rights</h2>
      <h3>Philippines (Data Privacy Act of 2012)</h3>
      <p>
        You have the right to be informed, to access, to object, to erasure or blocking, to rectification, to data portability,
        and to damages, and you may file a complaint with the National Privacy Commission.
      </p>
      <h3>United States (including California)</h3>
      <p>
        Depending on your state, you may have the right to know what personal information we hold, to access, correct, and
        delete it, and to opt out of its sale or sharing (we do neither). We will not discriminate against you for using these rights.
      </p>
      <p>
        To use any of these rights, go to <Link href="/data-request">your data requests</Link>. We verify requests by email and
        complete them within 30 days.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a cookie to remember your chosen market (Philippines or United States) for 12 months, and cookies needed for
        sign-in and security. Analytics and other non-essential scripts load only after you consent.
      </p>

      <h2>Security</h2>
      <p>Data is encrypted in transit and at rest, access is limited by role, and changes are logged. No system is perfectly secure; if a breach affects you, we will tell you and the authorities as the law requires.</p>

      <h2>Changes</h2>
      <p>We will post any changes here and update the date below.</p>
    </LegalPage>
  );
}
