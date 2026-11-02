#!/usr/bin/env node
// Vexari Demo Kit – builds one client demo from a JSON config. No dependencies (Node 18+).
//
//   node _kit/build.mjs new <name>            create _kit/clients/<name>.json from the example
//   node _kit/build.mjs _kit/clients/<name>.json   build  ->  /<slug>/index.html (+ /<slug>/img/)
//
// Rules enforced here (the build stops with an error):
//   - demo mode (default): noindex, demo ribbon, form that never sends, no canonical / JSON-LD
//   - every fact, badge and reference needs a "source" (we never invent proof)
//   - every image needs alt text
//   - text colours must reach WCAG AA contrast
//   - production mode needs written client approval, a site URL and a form endpoint
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve, basename, extname, relative } from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

const KIT = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(KIT, "..");
const read = (p) => readFileSync(join(KIT, p), "utf8");

// ---------- CLI ----------
const [cmd, arg] = process.argv.slice(2);
if (!cmd) {
  console.log("Usage:\n  node _kit/build.mjs new <name>\n  node _kit/build.mjs _kit/clients/<name>.json");
  process.exit(1);
}
if (cmd === "new") {
  const name = (arg || "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  if (!name) fail("Give a name: node _kit/build.mjs new eovss");
  const target = join(KIT, "clients", `${name}.json`);
  if (existsSync(target)) fail(`${relative(REPO, target)} already exists. Nothing overwritten.`);
  const cfg = JSON.parse(read("examples/example.json"));
  cfg.slug = newSlug();
  delete cfg.out;
  cfg.$comment = "Fill in only verified facts. Every fact, badge and reference needs a source URL.";
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(cfg, null, 2) + "\n");
  console.log(`Created ${relative(REPO, target)} (slug ${cfg.slug}). Put images in _kit/clients/${name}/ and edit the file.`);
  process.exit(0);
}

const cfgPath = resolve(cmd);
const cfgDir = dirname(cfgPath);
const c = JSON.parse(readFileSync(cfgPath, "utf8"));
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);

// ---------- i18n ----------
const I18N = {
  sv: { skip: "Hoppa till innehållet", menu: "Meny", call: "Ring", quote: "Begär offert", nav: { services: "Tjänster", process: "Så går det till", about: "Om oss", references: "Referenser", faq: "Frågor", contact: "Kontakt" },
    kicker: { services: "Tjänster", benefits: "Därför oss", process: "Så går det till", about: "Om oss", references: "Referenser", faq: "Vanliga frågor", contact: "Kontakt" },
    ribbon: (n, v) => `<strong>Demoversion</strong> framtagen av ${v} åt ${n}. Inte den officiella webbplatsen.`,
    f: { name: "Namn", phone: "Telefon", email: "E-post", place: "Ort / adress", type: "Vad gäller det?", msg: "Beskriv kort vad du behöver hjälp med", opt: "(valfritt)", send: "Skicka förfrågan", choose: "Välj" },
    demoNote: "Demoformulär: inga uppgifter skickas och inget meddelande når företaget.",
    demoOk: (n) => `Tack! Det här är en demo, så inget skickades. På den färdiga webbplatsen går förfrågan direkt till ${n}.`,
    phone: "Telefon", email: "E-post", address: "Adress", hours: "Öppettider", area: "Vi jobbar i", source: "Källa", orgnr: "Org.nr", prepared: (v) => `Demo framtagen av ${v}.`, locale: "sv_SE" },
  nb: { skip: "Hopp til innholdet", menu: "Meny", call: "Ring", quote: "Be om tilbud", nav: { services: "Tjenester", process: "Slik jobber vi", about: "Om oss", references: "Referanser", faq: "Spørsmål", contact: "Kontakt" },
    kicker: { services: "Tjenester", benefits: "Derfor oss", process: "Slik jobber vi", about: "Om oss", references: "Referanser", faq: "Vanlige spørsmål", contact: "Kontakt" },
    ribbon: (n, v) => `<strong>Demoversjon</strong> laget av ${v} for ${n}. Ikke den offisielle nettsiden.`,
    f: { name: "Navn", phone: "Telefon", email: "E-post", place: "Sted / adresse", type: "Hva gjelder det?", msg: "Beskriv kort hva du trenger hjelp med", opt: "(valgfritt)", send: "Send forespørsel", choose: "Velg" },
    demoNote: "Demoskjema: ingen opplysninger sendes, og ingen melding når bedriften.",
    demoOk: (n) => `Takk! Dette er en demo, så ingenting ble sendt. På den ferdige nettsiden går henvendelsen rett til ${n}.`,
    phone: "Telefon", email: "E-post", address: "Adresse", hours: "Åpningstider", area: "Vi jobber i", source: "Kilde", orgnr: "Org.nr.", prepared: (v) => `Demo laget av ${v}.`, locale: "nb_NO" },
  nn: { skip: "Hopp til innhaldet", menu: "Meny", call: "Ring", quote: "Be om tilbod", nav: { services: "Tenester", process: "Slik jobbar vi", about: "Om oss", references: "Referansar", faq: "Spørsmål", contact: "Kontakt" },
    kicker: { services: "Tenester", benefits: "Difor oss", process: "Slik jobbar vi", about: "Om oss", references: "Referansar", faq: "Vanlege spørsmål", contact: "Kontakt" },
    ribbon: (n, v) => `<strong>Demoversjon</strong> laga av ${v} for ${n}. Ikkje den offisielle nettsida.`,
    f: { name: "Namn", phone: "Telefon", email: "E-post", place: "Stad / adresse", type: "Kva gjeld det?", msg: "Skriv kort kva du treng hjelp med", opt: "(valfritt)", send: "Send førespurnad", choose: "Vel" },
    demoNote: "Demoskjema: ingen opplysningar vert sende, og inga melding når bedrifta.",
    demoOk: (n) => `Takk! Dette er ein demo, så ingenting vart sendt. På den ferdige nettsida går meldinga rett til ${n}.`,
    phone: "Telefon", email: "E-post", address: "Adresse", hours: "Opningstider", area: "Vi jobbar i", source: "Kjelde", orgnr: "Org.nr.", prepared: (v) => `Demo laga av ${v}.`, locale: "nn_NO" },
  en: { skip: "Skip to content", menu: "Menu", call: "Call", quote: "Get a quote", nav: { services: "Services", process: "How it works", about: "About", references: "Reviews", faq: "FAQ", contact: "Contact" },
    kicker: { services: "Services", benefits: "Why us", process: "How it works", about: "About us", references: "Reviews", faq: "Common questions", contact: "Contact" },
    ribbon: (n, v) => `<strong>Demo version</strong> prepared by ${v} for ${n}. Not the official website.`,
    f: { name: "Name", phone: "Phone", email: "Email", place: "Town / address", type: "What do you need?", msg: "Briefly describe the job", opt: "(optional)", send: "Send request", choose: "Choose" },
    demoNote: "Demo form: nothing is sent and no message reaches the business.",
    demoOk: (n) => `Thanks! This is a demo, so nothing was sent. On the finished website, this request goes straight to ${n}.`,
    phone: "Phone", email: "Email", address: "Address", hours: "Hours", area: "Service area", source: "Source", orgnr: "Company no.", prepared: (v) => `Demo prepared by ${v}.`, locale: "en_US" },
};
const lang = c.lang || "sv";
const t = I18N[lang] || (err(`Unsupported lang "${lang}" (use sv, nb, nn or en)`), I18N.sv);

// ---------- helpers ----------
const esc = (s = "") => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const has = (a) => Array.isArray(a) && a.length > 0;
const mode = c.mode === "production" ? "production" : "demo";
const company = c.company || {};
const name = company.name || (err("company.name is required"), "Företaget");
const agency = c.preparedBy || "Vexari";
const telHref = (p) => "tel:" + String(p).replace(/[^\d+]/g, "");
const isUrl = (s) => /^https?:\/\/\S+$/.test(s || "");
function needSource(item, where) { if (!isUrl(item?.source)) err(`${where} needs "source": a URL where this can be verified`); }
function newSlug() { return randomBytes(5).toString("hex"); }

// ---------- colour + contrast ----------
const hex = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ""); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const mix = (a, b, w) => toHex(hex(a).map((v, i) => v * (1 - w) + hex(b)[i] * w)); // w = share of b
const lum = (h) => { const [r, g, b] = hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const onColor = (bg) => (contrast(bg, "#ffffff") >= contrast(bg, "#111111") ? "#ffffff" : "#111111");
function ensure(fg, bg, min, toward) { let col = fg; for (let w = 0.1; contrast(col, bg) < min && w <= 1; w += 0.1) col = mix(fg, toward, w); return col; }

const th = c.theme || {};
for (const k of ["primary", "accent"]) if (!hex(th[k])) err(`theme.${k} must be a 6-digit hex colour, e.g. "#1f6fb5"`);
const P = hex(th.primary) ? th.primary : "#1f4e79", A = hex(th.accent) ? th.accent : "#f26a21";
const INK = hex(th.ink) ? th.ink : "#18212b", BG = hex(th.bg) ? th.bg : "#ffffff", DARK = hex(th.dark) ? th.dark : mix(P, "#000000", 0.72);
const SURFACE = hex(th.surface) ? th.surface : mix(BG, P, 0.05);
const onDark = onColor(DARK);
const tokens = {
  "--primary": P, "--on-primary": onColor(P), "--primary-text": ensure(P, SURFACE, 4.5, INK), "--primary-soft": mix(BG, P, 0.1),
  "--accent": A, "--on-accent": onColor(A), "--accent-hover": mix(A, onColor(A) === "#ffffff" ? "#000000" : "#ffffff", 0.12),
  "--accent-text-on-bg": ensure(A, BG, 3, INK), "--accent-on-dark": ensure(A, DARK, 4.5, onDark),
  "--ink": INK, "--muted": ensure(mix(INK, BG, 0.3), SURFACE, 4.5, INK), "--bg": BG, "--surface": SURFACE,
  "--line": mix(BG, INK, 0.12), "--line-strong": ensure(mix(BG, INK, 0.3), BG, 3, INK),
  "--dark": DARK, "--on-dark": onDark, "--on-dark-muted": ensure(mix(onDark, DARK, 0.25), DARK, 4.5, onDark),
  "--r": { sharp: "3px", soft: "12px", round: "20px" }[th.radius || "soft"] || "12px",
};
if (contrast(INK, BG) < 7) warn(`Body text contrast is ${contrast(INK, BG).toFixed(1)}:1 (aim for 7:1 or more)`);
if (contrast(A, tokens["--on-accent"]) < 4.5) err(`Accent ${A} cannot carry readable button text (${contrast(A, tokens["--on-accent"]).toFixed(1)}:1). Pick a darker or lighter accent.`);
if (contrast(P, tokens["--on-primary"]) < 4.5) err(`Primary ${P} cannot carry readable text (${contrast(P, tokens["--on-primary"]).toFixed(1)}:1). Pick a darker primary.`);

// ---------- fonts ----------
const FONTS = {
  sturdy: { head: "Archivo", body: "Inter", q: "family=Archivo:wght@800&family=Inter:wght@400;600;700", weight: 800, tracking: "-0.015em", case: "none" },
  modern: { head: "Manrope", body: "Manrope", q: "family=Manrope:wght@400;600;700;800", weight: 800, tracking: "-0.02em", case: "none" },
  classic: { head: "Source Serif 4", body: "Source Sans 3", q: "family=Source+Serif+4:opsz,wght@8..60,700&family=Source+Sans+3:wght@400;600;700", weight: 700, tracking: "-0.01em", case: "none" },
  workshop: { head: "Oswald", body: "Source Sans 3", q: "family=Oswald:wght@600&family=Source+Sans+3:wght@400;600;700", weight: 600, tracking: "0.01em", case: "uppercase" },
  system: { head: "system-ui", body: "system-ui", q: null, weight: 800, tracking: "-0.01em", case: "none" },
};
const font = FONTS[th.fonts || "sturdy"] || (err(`theme.fonts must be one of ${Object.keys(FONTS).join(", ")}`), FONTS.system);
const stack = (f) => (f === "system-ui" ? "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" : `'${f}',system-ui,sans-serif`);
Object.assign(tokens, { "--font-head": stack(font.head), "--font-body": stack(font.body), "--head-weight": font.weight, "--head-tracking": font.tracking, "--head-case": font.case });
const fontsHtml = font.q
  ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${font.q}&display=swap">`
  : "";

// ---------- images ----------
if (!c.out && !/^[a-z0-9-]{4,40}$/.test(c.slug || "")) err(`"slug" must be 4-40 lowercase letters, digits or dashes. Suggestion: "${newSlug()}"`);
// "out" (optional) overrides the folder, e.g. the kit example builds into _kit/example
const outDir = resolve(REPO, c.out || c.slug || "_invalid");
if (!outDir.startsWith(REPO + "/") || outDir === KIT) err(`"out" must be a folder inside the Demos repo`);
const images = [];
function img(spec, where, { eager = false, cls = "" } = {}) {
  if (!spec?.src) return "";
  if (!spec.alt?.trim()) err(`${where}.alt is required (describe what the picture shows)`);
  const src = resolve(cfgDir, spec.src);
  if (!existsSync(src)) { err(`${where}.src not found: ${spec.src}`); return ""; }
  const kb = statSync(src).size / 1024;
  if (kb > 350) warn(`${spec.src} is ${Math.round(kb)} kB. Resize to max 1600 px wide and save as WebP/JPEG around 70-80% quality.`);
  const file = basename(src).toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  images.push([src, file]);
  return `<img${cls ? ` class="${cls}"` : ""} src="img/${esc(file)}" alt="${esc(spec.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${spec.width ? ` width="${+spec.width}" height="${+spec.height}"` : ""}>`;
}

// ---------- icons (24px stroke) ----------
const I = {
  check: '<path d="M20 6 9 17l-5-5"/>', phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>', pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L2 10l8-8Z"/>', drop: '<path d="M12 2.7s7 7.3 7 12.3a7 7 0 0 1-14 0c0-5 7-12.3 7-12.3Z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.4 1.4 1.3 2.8 2.5 2.8Z"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>', roof: '<path d="M3 11 12 3l9 8"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  hammer: '<path d="m15 12-8.4 8.4a2.1 2.1 0 0 1-3-3L12 9"/><path d="m17.6 15 4.4-4.4-6-6L11.6 9"/><path d="m9 6 3-3 3 3"/>', shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  ruler: '<path d="M21.3 15.3 8.7 2.7a1 1 0 0 0-1.4 0L2.7 7.3a1 1 0 0 0 0 1.4l12.6 12.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4Z"/><path d="m7.5 10.5 2-2M10.5 13.5l2-2M13.5 16.5l2-2"/>',
  spark: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>', leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
  thermo: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0Z"/>', truck: '<path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l4 4v4h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || I.check}</svg>`;
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); // **bold** only

// ---------- validation of content ----------
const seo = c.seo || {};
if (!seo.title) err("seo.title is required"); else if (seo.title.length > 62) warn(`seo.title is ${seo.title.length} chars (aim for ≤ 60)`);
if (!seo.description) err("seo.description is required"); else if (seo.description.length > 160) warn(`seo.description is ${seo.description.length} chars (aim for ≤ 155)`);
if (!c.hero?.title) err("hero.title is required");
if (!company.phone && !company.email) err("company.phone or company.email is required");
(c.hero?.badges || []).forEach((b, i) => needSource(b, `hero.badges[${i}]`));
(c.about?.facts || []).forEach((f, i) => needSource(f, `about.facts[${i}]`));
(c.references?.items || []).forEach((r, i) => needSource(r, `references.items[${i}]`));
(c.references?.projects || []).forEach((r, i) => needSource(r, `references.projects[${i}]`));
if (c.process && (c.process.steps || []).length !== 3) warn("process.steps: use exactly 3 steps");
if (!has(c.services?.items)) err("services.items needs at least one service");
if (!has(c.faq?.items)) warn("faq.items is empty: 4-6 real customer questions help conversion");

// production gate
if (mode === "production") {
  const ap = c.approval || {};
  if (!ap.by || !/^\d{4}-\d{2}-\d{2}$/.test(ap.date || "") || !ap.evidence) err('production mode needs "approval": {"by": "<client contact>", "date": "YYYY-MM-DD", "evidence": "<where the written approval is stored>"}');
  if (!isUrl(c.site?.url)) err("production mode needs site.url (the client's real domain)");
  if (!isUrl(c.contact?.formAction)) err("production mode needs contact.formAction (a tested form endpoint)");
}

// ---------- sections ----------
const sec = { services: !!c.services, benefits: has(c.benefits?.items), process: has(c.process?.steps), about: !!c.about,
  references: has(c.references?.items) || has(c.references?.projects), faq: has(c.faq?.items), contact: true };
const navKeys = ["services", "process", "about", "references", "faq", "contact"].filter((k) => sec[k]);
const head = (k, h, p) => { const kick = c[k]?.kicker || t.kicker[k]; return `<div class="section-head">${kick.toLowerCase() === String(h || "").toLowerCase() ? "" : `<p class="kicker">${esc(kick)}</p>`}<h2 id="${k}-title">${esc(h)}</h2>${p ? `<p>${esc(p)}</p>` : ""}</div>`; };
const phoneBtn = (cls = "btn btn-ghost", short = false) => company.phone ? `<a class="${cls}" href="${telHref(company.phone)}"${short ? ` aria-label="${esc(t.call)} ${esc(company.phone)}"` : ""}>${icon("phone")}${esc(t.call)}${short ? "" : " " + esc(company.phone)}</a>` : "";
const quoteBtn = (cls = "btn btn-accent") => `<a class="${cls}" href="#contact">${esc(c.hero?.cta || t.quote)}${icon("arrow")}</a>`;

const heroLayout = ["split", "photo", "solid"].includes(th.hero) ? th.hero : c.hero?.image ? "split" : "solid";
if (heroLayout !== "solid" && !c.hero?.image) err(`theme.hero "${heroLayout}" needs hero.image`);
const heroText = `<div>${c.hero?.eyebrow ? `<p class="eyebrow">${esc(c.hero.eyebrow)}</p>` : ""}<h1>${esc(c.hero?.title)}</h1>${c.hero?.lead ? `<p class="lead">${esc(c.hero.lead)}</p>` : ""}
<div class="btn-row">${quoteBtn()}${phoneBtn()}</div>
${has(c.hero?.badges) ? `<ul class="badges">${c.hero.badges.map((b) => `<li>${icon("check")}${esc(b.text)}</li>`).join("")}</ul>` : ""}</div>`;
const heroImg = heroLayout === "solid" ? "" : img(c.hero.image, "hero.image", { eager: true, cls: heroLayout === "photo" ? "hero-img" : "" });
const hero = heroLayout === "split"
  ? `<section class="hero hero-split" aria-label="${esc(name)}"><div class="wrap">${heroText}<div class="media">${heroImg}</div></div></section>`
  : `<section class="hero hero-${heroLayout}" aria-label="${esc(name)}">${heroImg}<div class="wrap">${heroText}</div></section>`;

const parts = [hero];
if (sec.services) { const s = c.services; parts.push(`<section class="section" id="services" aria-labelledby="services-title"><div class="wrap">${head("services", s.title, s.intro)}
<div class="services${s.items.length % 3 === 0 ? " cols-3" : ""}">${s.items.map((x) => `<article class="service"><span class="ico">${icon(x.icon)}</span><h3>${esc(x.title)}</h3><p>${md(x.text)}</p></article>`).join("")}</div></div></section>`); }
if (sec.benefits) { const s = c.benefits; parts.push(`<section class="section dark" id="benefits" aria-labelledby="benefits-title"><div class="wrap">${head("benefits", s.title, s.intro)}
<ul class="benefits">${s.items.map((x) => `<li class="benefit">${icon(x.icon || "check")}<div><h3>${esc(x.title)}</h3><p>${md(x.text)}</p></div></li>`).join("")}</ul></div></section>`); }
if (sec.process) { const s = c.process; parts.push(`<section class="section alt" id="process" aria-labelledby="process-title"><div class="wrap">${head("process", s.title, s.intro)}
<ol class="steps">${s.steps.map((x) => `<li class="step"><h3>${esc(x.title)}</h3><p>${md(x.text)}</p></li>`).join("")}</ol></div></section>`); }
if (sec.about) { const s = c.about; const m = s.image ? img(s.image, "about.image") : ""; parts.push(`<section class="section" id="about" aria-labelledby="about-title"><div class="wrap about${m ? " has-media" : ""}"><div>${head("about", s.title)}
${(s.text || []).map((p) => `<p>${md(p)}</p>`).join("")}${has(s.facts) ? `<div class="facts">${s.facts.map((f) => `<div class="fact"><b>${esc(f.value)}</b><span>${esc(f.label)}</span></div>`).join("")}</div>` : ""}</div>${m ? `<div class="media">${m}</div>` : ""}</div></section>`); }
if (sec.references) { const s = c.references; parts.push(`<section class="section alt" id="references" aria-labelledby="references-title"><div class="wrap">${head("references", s.title || t.kicker.references, s.intro)}
${has(s.items) ? `<div class="refs">${s.items.map((r) => `<figure class="ref"><blockquote><p>${esc(r.quote)}</p></blockquote><figcaption>${esc(r.name)}${r.context ? `<span>${esc(r.context)}</span>` : ""}<a href="${esc(r.source)}" rel="nofollow noopener" target="_blank">${esc(t.source)}: ${esc(r.sourceLabel || new URL(r.source).hostname)}</a></figcaption></figure>`).join("")}</div>` : ""}
${has(s.projects) ? `<div class="projects">${s.projects.map((p, i) => `<article class="project">${img(p.image, `references.projects[${i}].image`)}<div><h3>${esc(p.title)}</h3><p>${md(p.text)}</p></div></article>`).join("")}</div>` : ""}</div></section>`); }
if (sec.faq) { const s = c.faq; parts.push(`<section class="section" id="faq" aria-labelledby="faq-title"><div class="wrap">${head("faq", s.title || t.kicker.faq)}
<div class="faq">${s.items.map((x) => `<details><summary>${esc(x.q)}</summary><p>${md(x.a)}</p></details>`).join("")}</div></div></section>`); }

// contact + form
const k = c.contact || {};
const opts = has(k.serviceOptions) ? k.serviceOptions : (c.services?.items || []).map((x) => x.title);
const formAttrs = mode === "production"
  ? `action="${esc(k.formAction)}" method="post"`
  : `method="dialog" data-demo-form`;
const form = `<form class="form" ${formAttrs} aria-labelledby="form-title">
<h3 id="form-title">${esc(k.formTitle || t.quote)}</h3>
<div class="row"><label>${t.f.name}<input name="name" autocomplete="name" required></label><label>${t.f.phone}<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label></div>
<div class="row"><label><span>${t.f.email} <span class="opt">${t.f.opt}</span></span><input name="email" type="email" autocomplete="email"></label><label><span>${t.f.place} <span class="opt">${t.f.opt}</span></span><input name="place" autocomplete="address-level2"></label></div>
${opts.length ? `<label>${t.f.type}<select name="type" required><option value="">${t.f.choose}</option>${opts.map((o) => `<option>${esc(o)}</option>`).join("")}</select></label>` : ""}
<label>${t.f.msg}<textarea name="message" required></textarea></label>
${mode === "production" ? `<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="vh" aria-hidden="true">` : ""}
<div class="btn-row"><button class="btn btn-accent" type="submit">${t.f.send}${icon("arrow")}</button></div>
${mode === "demo" ? `<p class="demo-note" role="note">${t.demoNote}</p><p class="demo-ok" role="status" tabindex="-1" hidden>${esc(t.demoOk(name))}</p>` : ""}
${k.privacyNote ? `<p class="demo-note">${esc(k.privacyNote)}</p>` : ""}
</form>`;
const info = [
  company.phone && `<li>${icon("phone")}<div><small>${t.phone}</small><a href="${telHref(company.phone)}">${esc(company.phone)}</a></div></li>`,
  company.email && `<li>${icon("mail")}<div><small>${t.email}</small><a href="mailto:${esc(company.email)}">${esc(company.email)}</a></div></li>`,
  company.address && `<li>${icon("pin")}<div><small>${t.address}</small>${esc(company.address)}</div></li>`,
  company.area && `<li>${icon("truck")}<div><small>${t.area}</small>${esc(company.area)}</div></li>`,
  company.hours && `<li>${icon("clock")}<div><small>${t.hours}</small>${esc(company.hours)}</div></li>`,
].filter(Boolean).join("");
parts.push(`<section class="section alt" id="contact" aria-labelledby="contact-title"><div class="wrap contact"><div class="contact-info"><p class="kicker" style="color:inherit">${esc(t.kicker.contact)}</p><h2 id="contact-title">${esc(k.title || t.quote)}</h2>${k.lead ? `<p>${esc(k.lead)}</p>` : ""}<ul>${info}</ul></div>${form}</div></section>`);

// header, footer, ribbon, callbar
const brand = company.logo ? img(company.logo, "company.logo", { eager: true }) : `<span class="brand-mark" aria-hidden="true">${esc((company.shortName || name).trim().charAt(0))}</span>`;
const navList = navKeys.map((k2) => `<li><a href="#${k2}">${esc(t.nav[k2])}</a></li>`).join("");
const header = `<header class="site-head"><div class="wrap head-row"><a class="brand" href="#main">${brand}<span>${esc(company.shortName || name)}</span></a>
<nav class="nav" aria-label="${esc(t.menu)}"><ul>${navList}</ul></nav>
<div class="head-cta">${company.phone ? phoneBtn("btn btn-accent") : quoteBtn()}</div>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav">${icon("menu")}${esc(t.menu)}</button></div>
<nav id="mobile-nav" class="mobile-nav" aria-label="${esc(t.menu)}" hidden><div class="wrap"><ul>${navList}</ul></div></nav></header>`;
const footer = `<footer class="site-foot"><div class="wrap"><div><strong>${esc(name)}</strong>${company.tagline ? `<p>${esc(company.tagline)}</p>` : ""}</div>
<div>${company.phone ? `<p><a href="${telHref(company.phone)}">${esc(company.phone)}</a></p>` : ""}${company.email ? `<p><a href="mailto:${esc(company.email)}">${esc(company.email)}</a></p>` : ""}</div>
<div>${company.address ? `<p>${esc(company.address)}</p>` : ""}${company.orgNr ? `<p>${t.orgnr} ${esc(company.orgNr)}</p>` : ""}</div>
<p class="fine">© ${new Date().getFullYear()} ${esc(name)}${mode === "demo" ? ` · ${esc(t.prepared(agency))}` : ""}</p></div></footer>`;
const callbar = `<div class="callbar">${company.phone ? phoneBtn("btn btn-ghost", true) : ""}${quoteBtn("btn btn-accent")}</div>`.replace('class="callbar"><a class="btn btn-accent"', 'class="callbar" style="grid-template-columns:1fr"><a class="btn btn-accent"');

// JSON-LD only for the approved real site
const jsonld = mode === "production" ? `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org", "@type": c.schemaType || "LocalBusiness", name, url: c.site?.url, telephone: company.phone, email: company.email,
  address: company.address, areaServed: company.area, description: seo.description,
}).replace(/</g, "\\u003c")}</script>` : "";

// ---------- render ----------
if (errors.length) { console.error("\nBuild stopped:\n" + errors.map((e) => "  ✗ " + e).join("\n")); warnings.forEach((w) => console.error("  ! " + w)); process.exit(1); }
const vars = {
  lang, title: esc(seo.title), description: esc(seo.description), themeColor: DARK, ogLocale: t.locale,
  robots: mode === "demo" ? '<meta name="robots" content="noindex, nofollow, noarchive">' : "",
  canonical: mode === "production" ? `<link rel="canonical" href="${esc(c.site.url)}">` : "",
  fonts: fontsHtml, tokens: Object.entries(tokens).map(([a, b]) => `${a}:${b}`).join(";"), css: read("template/styles.css"), jsonld,
  "t.skip": esc(t.skip), ribbon: mode === "demo" ? `<div class="demo-ribbon" role="note">${t.ribbon(esc(name), esc(agency))}</div>` : "",
  header, sections: parts.join("\n"), footer, callbar, js: read("template/script.js"),
};
const html = read("template/page.html").replace(/\{\{([\w.]+)\}\}/g, (_, key) => (key in vars ? vars[key] : ""));
mkdirSync(outDir, { recursive: true });
if (images.length) mkdirSync(join(outDir, "img"), { recursive: true });
for (const [src, file] of images) copyFileSync(src, join(outDir, "img", file));
writeFileSync(join(outDir, "index.html"), html);
warnings.forEach((w) => console.warn("  ! " + w));
console.log(`✓ ${mode} build: ${relative(REPO, join(outDir, "index.html"))} (${Math.round(Buffer.byteLength(html) / 1024)} kB HTML, ${images.length} images)`);
if (mode === "demo") console.log("  noindex + demo ribbon + non-sending form are on. Run: node _kit/qa.mjs " + relative(REPO, outDir));

function fail(m) { console.error(m); process.exit(1); }
