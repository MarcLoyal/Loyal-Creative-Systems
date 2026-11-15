import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Phase 2: every public page, in both markets (SPEC 26 "done when"). */

const PAGES = [
  "/", "/services", "/services/crm", "/services/operations", "/services/accounting", "/services/bookkeeping",
  "/solutions/cooperatives", "/solutions/agencies", "/solutions/local-service", "/how-it-works",
  "/case-studies", "/case-studies/this-website", "/blog", "/about", "/contact", "/demo",
  "/privacy", "/terms", "/data-request",
];

for (const market of ["ph", "us"] as const) {
  test.describe(`${market.toUpperCase()} market`, () => {
    test.use({ extraHTTPHeaders: { "x-vercel-ip-country": market.toUpperCase() } });

    for (const path of PAGES) {
      test(`${path} renders, is accessible, and has SEO basics`, async ({ page, isMobile }) => {
        const res = await page.goto(path);
        expect(res?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);

        // No horizontal page scroll.
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);

        // Canonical is the public, market-free URL.
        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        expect(new URL(canonical!).pathname).toBe(path);
        expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();

        // Structured data parses.
        for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
          expect(() => JSON.parse(raw)).not.toThrow();
        }

        if (!isMobile || path === "/") {
          const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
          expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
        }
      });
    }
  });
}

test("every page has a unique title", async ({ page, isMobile }) => {
  test.skip(isMobile, "once is enough");
  const titles = new Map<string, string>();
  for (const path of PAGES) {
    await page.goto(path);
    const title = await page.title();
    expect(titles.get(title), `${path} duplicates ${titles.get(title)}`).toBeUndefined();
    titles.set(title, path);
  }
});

test("sitemap lists every public page and no private ones", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(locs.sort()).toEqual([...PAGES].sort());
});

test("pipeline stage opens a details panel from the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop layout");
  await page.goto("/how-it-works");
  const stage = page.locator("#overview").getByRole("button", { name: /AI qualifies/ });
  await stage.focus();
  await page.keyboard.press("Enter");
  await expect(stage).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#overview").getByRole("heading", { name: "AI qualifies" })).toBeVisible();
  await expect(page.locator("#overview").getByText(/Target: Under 60 seconds/)).toBeVisible();
});

test("services diagram switches the example by segment", async ({ page }) => {
  await page.goto("/services");
  await page.getByRole("button", { name: "Agency", exact: true }).click();
  await expect(page.getByText("A new retainer client")).toBeVisible();
  await page.getByRole("button", { name: "Cooperative", exact: true }).click();
  await expect(page.getByText("A loan application")).toBeVisible();
});

test("demo plays through to the call to action", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo");
  await page.getByRole("button", { name: /Sample Creative Agency/ }).click();
  await expect(page.getByRole("heading", { name: "2. Score" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Run this for real with your business" })).toHaveAttribute("href", "/contact?segment=agency");
});

test("no page claims to provide accounting, tax, or audit services", async ({ page, isMobile }) => {
  test.skip(isMobile, "content check once");
  for (const path of PAGES) {
    await page.goto(path);
    const text = (await page.locator("main").innerText()).toLowerCase();
    for (const banned of ["we do your accounting", "guarantee compliance", "guaranteed compliance", "licensed accountants", "we file your"]) {
      expect(text, `${path}: "${banned}"`).not.toContain(banned);
    }
  }
});
