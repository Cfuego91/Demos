#!/usr/bin/env node
// Vexari Demo Kit – quality check for one, several or all demos in this repo.
//
//   node _kit/qa.mjs                 check every demo folder
//   node _kit/qa.mjs 96ab6b9276      check one (folder name or path)
//
// Needs Playwright (and optionally axe-core for accessibility):  cd _kit && npm install
// Writes screenshots and a report to _kit/private/qa/ (git-ignored). Exit code 1 if anything FAILs.
import { createServer } from "node:http";
import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, dirname, extname, relative } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const KIT = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(KIT, "..");
const OUT = join(KIT, "private", "qa");
const require = createRequire(join(KIT, "package.json"));
const { chromium } = require("playwright");
let axeSrc = null;
for (const p of [process.env.AXE_PATH, (() => { try { return require.resolve("axe-core/axe.min.js"); } catch { return null; } })()])
  if (p && existsSync(p)) { axeSrc = readFileSync(p, "utf8"); break; }

const VIEWPORTS = [["mobile", 375, 812], ["tablet", 768, 1024], ["desktop", 1440, 900]];
const SKIP = new Set(["23a633d51e"]); // static preview of the Vexari site, not a client demo
const args = process.argv.slice(2);
const targets = (args.length ? args.map((a) => relative(REPO, resolve(REPO, a)).replace(/\/index\.html$/, "")) :
  readdirSync(REPO).filter((d) => !d.startsWith(".") && !d.startsWith("_") && !SKIP.has(d) && existsSync(join(REPO, d, "index.html"))).concat(existsSync(join(KIT, "example/index.html")) ? ["_kit/example"] : []));

// static file server for the repo (same URLs as GitHub Pages, minus the /Demos prefix)
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".ico": "image/x-icon" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = resolve(REPO, "." + p);
  if (!f.startsWith(REPO)) { res.writeHead(403).end(); return; }
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404).end("not found"); return; }
  res.writeHead(200, { "content-type": TYPES[extname(f)] || "application/octet-stream" }).end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;
mkdirSync(OUT, { recursive: true });

const PRIVATE_MAIL = /\b[\w.+-]+@(gmail|hotmail|outlook|live|yahoo|icloud|me|msn|telia|online)\.[a-z.]+\b/gi;
const PERSONNUMMER = /\b(?:19|20)?\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[-+]\d{4}\b/g;
const MOBILE = /(?:\+46|\b0)\s?7[02369](?:[\s-]?\d){7}\b|(?:\+47\s?)?\b[49]\d{2}\s?\d{2}\s?\d{3}\b/g;

const browser = await chromium.launch();
const results = [];
let failCount = 0;

for (const slug of targets) {
  const file = join(REPO, slug, "index.html");
  const html = readFileSync(file, "utf8");
  const r = { slug, title: (html.match(/<title>([^<]*)/) || [])[1] || "", fail: [], warn: [], info: [] };
  const F = (m) => r.fail.push(m), W = (m) => r.warn.push(m), N = (m) => r.info.push(m);

  // ---- static checks: indexing, forms, privacy, weight ----
  const robots = (html.match(/<meta[^>]+name=["']robots["'][^>]*>/i) || [""])[0];
  if (!/noindex/i.test(robots)) F("Saknar <meta name=\"robots\" content=\"noindex\"> – demon kan indexeras av Google");
  if (/<link[^>]+rel=["']canonical/i.test(html)) W("Har canonical-länk (bör inte finnas i en demo)");
  if (/application\/ld\+json/i.test(html)) W("Har strukturerad data (JSON-LD) – bör bara finnas på kundens riktiga sida");
  const forms = html.match(/<form\b[^>]*>/gi) || [];
  for (const f of forms) {
    if (/mailto:/i.test(f)) F("Formulär öppnar mailto: till en riktig adress");
    const action = (f.match(/\baction=["']([^"']*)["']/i) || [])[1];
    if (action && !/^#/.test(action)) F(`Formulär skickar till ${action}`);
  }
  if (/location(\.href)?\s*=\s*['"]mailto:/i.test(html)) F("Skript skickar formulärdata via mailto:");
  if (/\bfetch\(|XMLHttpRequest|sendBeacon/.test(html)) W("Sidan innehåller nätverksanrop i skript – kontrollera att inget formulär skickas");
  if (forms.length && !/data-demo-form|class="(demo-note|ok)"/.test(html)) W("Formuläret är inte tydligt märkt som demo");
  for (const m of new Set(html.match(PERSONNUMMER) || [])) F(`Möjligt personnummer i sidan: ${m}`);
  const privMails = [...new Set((html.match(PRIVATE_MAIL) || []).map((x) => x.toLowerCase()))];
  if (privMails.length) W(`E-post hos privat e-posttjänst (kontrollera att kunden själv publicerar den): ${privMails.join(", ")}`);
  const mobiles = [...new Set((html.replace(/data:[^"')]+/g, "").match(MOBILE) || []).map((x) => x.trim()))];
  if (mobiles.length) N(`Mobilnummer i sidan (kontrollera att de är publicerade av företaget): ${mobiles.slice(0, 6).join(", ")}`);
  const dataUri = (html.match(/data:image\/[^"')\s]+/g) || []).reduce((s, x) => s + x.length, 0);
  const kb = Math.round(Buffer.byteLength(html) / 1024);
  if (kb > 600) W(`HTML-filen är ${kb} kB${dataUri ? ` (varav ${Math.round(dataUri / 1024)} kB inbäddade bilder)` : ""} – långsamt på mobil`);
  else N(`HTML ${kb} kB`);

  // ---- browser checks ----
  for (const [vp, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: vp === "mobile", hasTouch: vp !== "desktop" });
    const page = await ctx.newPage();
    let bytes = 0, external = new Set();
    page.on("response", async (res) => { try { const b = await res.body(); bytes += b.length; } catch {} const u = new URL(res.url()); if (u.host !== new URL(BASE).host) external.add(u.host); });
    const t0 = Date.now();
    try { await page.goto(`${BASE}/${slug}/`, { waitUntil: "load", timeout: 30000 }); }
    catch (e) { F(`[${vp}] Sidan laddade inte: ${e.message.split("\n")[0]}`); await ctx.close(); continue; }
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(300);

    const m = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = [];
      if (document.documentElement.scrollWidth > vw + 1)
        for (const el of document.querySelectorAll("body *")) {
          const rc = el.getBoundingClientRect(), cs = getComputedStyle(el);
          if (rc.width && rc.right > vw + 1 && cs.position !== "fixed" && !el.closest("[aria-hidden=true]")) {
            let ok = false; for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === "hidden" || o === "auto" || o === "clip" || o === "scroll") { ok = true; break; } }
            if (!ok) over.push(el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : ""));
          }
          if (over.length > 3) break;
        }
      const visible = (el) => { const rc = el.getBoundingClientRect(), cs = getComputedStyle(el); return rc.width > 0 && rc.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
      const imgs = [...document.images];
      const small = [...document.querySelectorAll("p,li,a,span,label,small,td,dd,figcaption")].filter((el) => visible(el) && el.textContent.trim().length > 2 && el.children.length === 0 && parseFloat(getComputedStyle(el).fontSize) < 12).length;
      const tiny = [...document.querySelectorAll("button,a.btn,nav a,input:not([type=hidden]),select,textarea,[role=button]")].filter((el) => { if (!visible(el)) return false; const rc = el.getBoundingClientRect(); return Math.min(rc.width, rc.height) < 24; }).map((el) => (el.textContent || el.name || el.tagName).trim().slice(0, 25));
      const anchors = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")).filter((x) => x.length > 1 && !x.startsWith("#/") && !document.getElementById(decodeURIComponent(x.slice(1)))); // "#/..." = app routes, not anchors
      return { overflow: document.documentElement.scrollWidth - vw, over, h1: document.querySelectorAll("h1").length,
        noAlt: imgs.filter((i) => !i.hasAttribute("alt")).length, broken: imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("loading") !== "lazy").length,
        small, tiny: [...new Set(tiny)], anchors: [...new Set(anchors)],
        menuBtn: !!document.querySelector("button[aria-expanded],#menuBtn,.menu-btn,.burger,.nav-toggle"),
        navVisible: [...document.querySelectorAll("header nav a, nav a")].some(visible), lang: document.documentElement.lang };
    });
    if (m.overflow > 1) F(`[${vp}] Horisontell scroll (${m.overflow}px för bred): ${m.over.join(", ")}`);
    if (vp === "mobile") {
      if (m.h1 !== 1) W(`${m.h1} st <h1> (ska vara exakt 1)`);
      if (m.noAlt) F(`${m.noAlt} bild(er) saknar alt-text`);
      if (m.broken) W(`${m.broken} bild(er) laddar inte`);
      if (m.anchors.length) F(`Trasiga ankarlänkar: ${m.anchors.join(", ")}`);
      if (!m.lang) W("Saknar lang-attribut på <html>");
      if (m.small) W(`${m.small} textelement med teckenstorlek under 12px på mobil`);
      if (m.tiny.length) W(`Små tryckytor (<24px) på mobil: ${m.tiny.slice(0, 5).join(" | ")}`);
      if (!m.navVisible && !m.menuBtn) W("Ingen synlig navigation eller menyknapp på mobil");
      if (m.menuBtn) {
        const btn = page.locator("button[aria-expanded],#menuBtn,.menu-btn,.burger,.nav-toggle").first();
        if (await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(250);
          const opened = await page.evaluate(() => [...document.querySelectorAll("nav a")].filter((a) => { const rc = a.getBoundingClientRect(); return rc.height > 0 && rc.top >= 0 && rc.top < innerHeight; }).length);
          if (!opened) W("Menyknappen på mobil visar inga länkar");
          await btn.click().catch(() => {});
        }
      }
      // form flow: fill required fields, submit, make sure nothing leaves the page
      const n = await page.locator("form").count();
      for (let i = 0; i < n; i++) {
        const form = page.locator("form").nth(i);
        if (!(await form.isVisible().catch(() => false))) { await form.scrollIntoViewIfNeeded().catch(() => {}); }
        const sent = [];
        const onReq = (rq) => { if (rq.method() !== "GET" || (rq.isNavigationRequest() && rq.frame() === page.mainFrame()) || /QA-test|qa%40example/.test(rq.url())) sent.push(`${rq.method()} ${rq.url()}`); };
        page.on("request", onReq);
        const before = page.url();
        await form.evaluate((f) => {
          for (const el of f.querySelectorAll("input,select,textarea")) {
            if (el.type === "hidden" || el.type === "submit" || el.tabIndex === -1) continue;
            if (el.tagName === "SELECT") { const o = [...el.options].find((x) => x.value); if (o) el.value = o.value; }
            else if (el.type === "checkbox" || el.type === "radio") el.checked = true;
            else el.value = el.type === "email" ? "qa@example.com" : el.type === "tel" ? "0000000000" : el.type === "number" ? "1" : el.type === "date" ? "2030-01-01" : "QA-test";
          }
        });
        const submit = form.locator('button[type=submit], button:not([type]), input[type=submit]').first();
        if (await submit.count()) { await submit.scrollIntoViewIfNeeded(); await submit.click({ timeout: 5000 }).catch((e) => W(`Formulär ${i + 1}: kunde inte klicka på skicka (${e.message.split("\n")[0]})`)); }
        await page.waitForTimeout(700);
        page.off("request", onReq);
        if (page.url() !== before) F(`Formulär ${i + 1} lämnade sidan (${page.url()})`);
        if (sent.length) F(`Formulär ${i + 1} skickade en förfrågan: ${sent[0]}`);
        const confirmed = await form.evaluate((f) => [...f.querySelectorAll(".demo-ok,.ok,[role=status]")].some((el) => el.offsetParent !== null || getComputedStyle(el).display !== "none" && !el.hidden));
        if (!confirmed) W(`Formulär ${i + 1}: ingen synlig bekräftelse efter skicka`);
        else N(`Formulär ${i + 1}: skickar inget, visar demobekräftelse`);
      }
      if (axeSrc) {
        await page.goto(`${BASE}/${slug}/`, { waitUntil: "load" });
        await page.addScriptTag({ content: axeSrc });
        const ax = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"], resultTypes: ["violations"] })).violations
          .filter((v) => v.impact === "critical" || v.impact === "serious").map((v) => `${v.id} (${v.nodes.length})`));
        if (ax.length) W(`Tillgänglighet (axe, allvarliga): ${ax.join(", ")}`); else N("Tillgänglighet (axe): inga allvarliga fel");
      } else if (results.length === 0) N("axe-core saknas – kör `cd _kit && npm install` för tillgänglighetstest");
      await page.goto(`${BASE}/${slug}/`, { waitUntil: "load" });
    }
    const mb = (bytes / 1048576).toFixed(2);
    if (vp === "mobile") { (bytes > 2.5 * 1048576 ? W : N)(`Sidvikt ${mb} MB, laddad på ${loadMs} ms lokalt${external.size ? `, externa värdar: ${[...external].join(", ")}` : ""}`); }
    const safe = slug.replace(/[^\w-]+/g, "_");
    await page.screenshot({ path: join(OUT, `${safe}-${vp}.png`), fullPage: vp === "mobile" });
    await ctx.close();
  }
  failCount += r.fail.length;
  results.push(r);
  console.log(`${r.fail.length ? "✗" : r.warn.length ? "!" : "✓"} ${slug}  ${r.title}  (${r.fail.length} fel, ${r.warn.length} varningar)`);
  for (const x of r.fail) console.log("    ✗ " + x);
}
await browser.close();
server.close();

const md = [`# QA-rapport ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`, "",
  `Kontrollerat: ${results.length} demos × ${VIEWPORTS.map((v) => `${v[0]} ${v[1]}px`).join(", ")}. Skärmdumpar i den här mappen.`, "",
  "| Demo | Fel | Varningar |", "|---|---|---|", ...results.map((r) => `| ${r.slug} – ${r.title} | ${r.fail.length} | ${r.warn.length} |`), "",
  ...results.flatMap((r) => [`## ${r.slug} – ${r.title}`, ...r.fail.map((x) => `- ✗ ${x}`), ...r.warn.map((x) => `- ! ${x}`), ...r.info.map((x) => `- · ${x}`), ""])].join("\n");
writeFileSync(join(OUT, "report.md"), md);
console.log(`\nRapport: ${relative(REPO, join(OUT, "report.md"))}`);
process.exit(failCount ? 1 : 0);
