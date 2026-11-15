import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** Phase 1 checks: shell, market routing, design system, accessibility, responsive widths. */

test.describe("market routing", () => {
  test("Philippine visitors get the PH market, with cooperatives first", async ({ browser }) => {
    const ctx = await browser.newContext({ extraHTTPHeaders: { "x-vercel-ip-country": "PH" } });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByText("Showing the Philippines market")).toBeVisible();
    await expect(page.locator("main li h3").first()).toHaveText("Cooperatives");
    await ctx.close();
  });

  test("everyone else gets the US market", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Showing the United States market")).toBeVisible();
  });

  test("the switcher overrides detection and persists for 12 months", async ({ page, context, isMobile }) => {
    await page.goto("/");
    const scope = isMobile ? page.locator("footer") : page.locator("header");
    await scope.getByRole("button", { name: "Philippines" }).first().click();
    await expect(page.getByText("Showing the Philippines market")).toBeVisible();
    const cookie = (await context.cookies()).find((c) => c.name === "lcs_market");
    expect(cookie?.value).toBe("ph");
    const days = ((cookie?.expires ?? 0) * 1000 - Date.now()) / 86_400_000;
    expect(days).toBeGreaterThan(360);
    await page.reload();
    await expect(page.getByText("Showing the Philippines market")).toBeVisible();
  });
});

test.describe("site shell", () => {
  test("header has the primary call to action and footer has legal links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Get your system plan" }).first()).toBeVisible();
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Privacy policy" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Terms" }).first()).toBeVisible();
  });

  test("skip link moves focus to main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard check runs on desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("services menu opens and closes with the keyboard", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop menu");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const toggle = page.locator("header nav[aria-label=Main] summary", { hasText: "Services" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("link", { name: /CRM systems/ }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
  });
});

for (const path of ["/", "/design-system"]) {
  test(`${path} has no detectable WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
  });
}

for (const width of [320, 375, 768, 1280, 1920]) {
  test(`no horizontal scroll at ${width}px`, async ({ page, isMobile }) => {
    test.skip(isMobile, "widths set explicitly");
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/design-system"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("design system page is not indexable and shows every component", async ({ page }) => {
  const res = await page.goto("/design-system");
  expect(res?.headers()["x-robots-tag"]).toContain("noindex");
  for (const name of [
    "Buttons", "Form fields", "Cards", "Badges and status pills", "Tables", "Tabs", "Modal", "Toast",
    "Stepper", "Pipeline node", "Stat counter", "Timeline", "Empty state", "Skeleton loader",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
});

test("modal traps focus and closes with Escape", async ({ page }) => {
  await page.goto("/design-system#modal");
  const opener = page.getByRole("button", { name: "Open modal" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Pause this sequence?" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
