const { chromium } = require("playwright");
const fs = require("fs");
const axeSrc = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const SD = process.env.OUT_DIR || ".";
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  for (const [name, opts] of [["desktop", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }], ["mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }]]) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    await p.goto("http://127.0.0.1:8090/", { waitUntil: "networkidle" });
    await p.evaluate(axeSrc);
    const ax = await p.evaluate(() => axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } }));
    const seo = await p.evaluate(() => ({
      lang: document.documentElement.lang, title: document.title, h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
      headings: [...document.querySelectorAll("h1,h2,h3")].map((h) => h.tagName).join(""),
      viewport: !!document.querySelector('meta[name=viewport]'), metaDesc: document.querySelector('meta[name=description]')?.content ?? null,
      imgsNoAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
      overflow: document.documentElement.scrollWidth - innerWidth,
    }));
    // FAQ accordion works
    const pane = p.locator(".kt-blocks-accordion-header").first();
    await pane.scrollIntoViewIfNeeded(); await pane.click(); await p.waitForTimeout(500);
    const faqOpen = await pane.getAttribute("aria-expanded");
    let menu = null;
    if (name === "mobile") { const t = p.locator(".menu-toggle-open").first(); if (await t.count()) { await t.click(); await p.waitForTimeout(600); menu = await p.locator("#mobile-drawer a", { hasText: "Services" }).first().isVisible().catch(() => false); await p.keyboard.press("Escape"); } }
    console.log(name, JSON.stringify({ axe: ax.violations.map((v) => `${v.id}:${v.nodes.length}`), ...seo, faqOpen, mobileMenu: menu, errors: errs.slice(0, 3) }));
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    await p.screenshot({ path: `${SD}/kadence-${name}-full.png`, fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
