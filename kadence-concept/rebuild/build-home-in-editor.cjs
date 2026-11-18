// How the page was first built: inside the Gutenberg editor with wp.blocks.createBlock, so Kadence writes the markup.
// Later edits (anchors, H3 card titles, icons, H1 size) are already included in home-page-blocks.html.
// Usage: WP_ADMIN_PASS=... node build-home-in-editor.cjs
// Builds the demo home page inside the real Gutenberg editor with Kadence blocks (wp.blocks.createBlock),
// so the saved markup is produced by Kadence's own save functions.
const { chromium } = require("playwright");
const BASE = "http://127.0.0.1:8090";
(async () => {
  const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  p.setDefaultTimeout(120000);
  await p.goto(BASE + "/wp-login.php");
  await p.fill("#user_login", "demo-admin"); await p.fill("#user_pass", process.env.WP_ADMIN_PASS);
  await Promise.all([p.waitForNavigation(), p.click("#wp-submit")]);
  await p.goto(BASE + "/wp-admin/post-new.php?post_type=page");
  await p.waitForFunction(() => window.wp?.blocks?.getBlockType?.("kadence/rowlayout") && wp.data.select("core/editor").getCurrentPostId());
  const id = await p.evaluate(async () => {
    const { createBlock } = wp.blocks;
    try { wp.data.dispatch("core/preferences").set("core/edit-post", "welcomeGuide", false); } catch {}
    const NAVY = "#0f2742", INK = "#1f2933", GOLD = "#b07a1e", LIGHT = "#f4f6f9";
    const H = (level, content, extra = {}) => createBlock("kadence/advancedheading", { level, content, ...extra });
    const P = (content, extra = {}) => createBlock("core/paragraph", { content, ...extra });
    const btns = (list) => createBlock("kadence/advancedbtn", {}, list.map(([text, link]) => createBlock("kadence/singlebtn", { text, link })));
    const row = (attrs, cols) => createBlock("kadence/rowlayout", { columns: cols.length, colLayout: cols.length === 1 ? "equal" : cols.length === 2 ? "left-golden" : "equal", maxWidth: 1180, ...attrs },
      cols.map((inner) => createBlock("kadence/column", {}, inner)));

    const hero = row({ bgColor: NAVY, topPadding: 110, bottomPadding: 110, topPaddingM: 64, bottomPaddingM: 64, align: "full", verticalAlignment: "middle" }, [[
      P("<strong>Concept demo · fictional company</strong>", { textColor: undefined, style: { color: { text: "#f3d9a4" } } }),
      H(1, "Clear strategy. Practical change. Measurable progress.", { color: "#ffffff" }),
      P("Harbourline Advisory helps growing companies sharpen their strategy, simplify operations and lead change with confidence.", { style: { color: { text: "#dbe4ee" }, typography: { fontSize: "1.2rem" } } }),
      btns([["Book a consultation", "#contact"], ["Our services", "#services"]]),
    ]]);

    const services = row({ topPadding: 90, bottomPadding: 40, align: "full", htmlTag: "section" }, [[
      H(2, "How we help", { color: NAVY, anchor: "services" }),
      P("Three focused services, each delivered with a clear scope and a written plan.", { style: { color: { text: INK } } }),
    ]]);
    const cards = row({ bottomPadding: 90, align: "full", columnGutter: "wide" }, [
      [createBlock("kadence/infobox", { title: "Strategy & growth", contentText: "Market focus, priorities and a 12-month roadmap your team can act on.", titleColor: NAVY, textColor: INK, displayLearnMore: false })],
      [createBlock("kadence/infobox", { title: "Operations & process", contentText: "Map how work really flows, remove bottlenecks and set simple measures.", titleColor: NAVY, textColor: INK, displayLearnMore: false })],
      [createBlock("kadence/infobox", { title: "Change & leadership", contentText: "Plan and communicate change so people understand it and adopt it.", titleColor: NAVY, textColor: INK, displayLearnMore: false })],
    ]);

    const approach = row({ bgColor: LIGHT, topPadding: 90, bottomPadding: 90, align: "full", verticalAlignment: "top" }, [
      [H(2, "Our approach", { color: NAVY }), P("A short, structured engagement instead of a thick report.", { style: { color: { text: INK } } })],
      [createBlock("kadence/iconlist", { listGap: 14 }, [
        createBlock("kadence/listitem", { text: "<strong>Discover</strong> – interviews, data and a clear problem statement" }),
        createBlock("kadence/listitem", { text: "<strong>Decide</strong> – options, trade-offs and a recommended plan" }),
        createBlock("kadence/listitem", { text: "<strong>Deliver</strong> – workshops, owners and milestones" }),
        createBlock("kadence/listitem", { text: "<strong>Review</strong> – a follow-up to check progress after 90 days" }),
      ])],
    ]);

    const faqPane = (title, text) => createBlock("kadence/pane", { title }, [P(text)]);
    const faq = row({ topPadding: 90, bottomPadding: 90, align: "full" }, [[
      H(2, "Frequently asked questions", { color: NAVY }),
      createBlock("kadence/accordion", { paneCount: 3, startCollapsed: true, faqSchema: false }, [
        faqPane("Who do you work with?", "Owner-led and growing companies with roughly 10 to 250 employees."),
        faqPane("How long is a typical engagement?", "Most engagements run four to twelve weeks, agreed in a written scope."),
        faqPane("Do you work remotely?", "Yes. Workshops can be held online or on site."),
      ]),
    ]]);

    const cta = row({ bgColor: NAVY, topPadding: 80, bottomPadding: 80, align: "full" }, [[
      H(2, "Ready to talk about your next step?", { color: "#ffffff", anchor: "contact", align: "center" }),
      P("Tell us about your situation and we will suggest a practical starting point.", { align: "center", style: { color: { text: "#dbe4ee" } } }),
      createBlock("kadence/advancedbtn", { hAlign: "center" }, [createBlock("kadence/singlebtn", { text: "Book a consultation", link: "#contact" })]),
    ]]);

    const note = row({ topPadding: 24, bottomPadding: 24, align: "full" }, [[
      P("Concept demo built by VEXARI Agency with WordPress, Gutenberg, Kadence Theme and Kadence Blocks. Harbourline Advisory is a fictional company.", { align: "center", style: { typography: { fontSize: "0.85rem" }, color: { text: "#4b5563" } } }),
    ]]);

    wp.data.dispatch("core/editor").editPost({ title: "Home", status: "publish" });
    wp.data.dispatch("core/block-editor").resetBlocks([hero, services, cards, approach, faq, cta, note]);
    await new Promise((r) => setTimeout(r, 4000)); // let Kadence assign uniqueIDs
    await wp.data.dispatch("core/editor").savePost();
    await new Promise((r) => setTimeout(r, 1500));
    const invalid = wp.data.select("core/block-editor").getBlocks().flatMap(function walk(bl) { return [bl, ...bl.innerBlocks.flatMap(walk)]; }).filter((bl) => !bl.isValid).map((bl) => bl.name);
    return { id: wp.data.select("core/editor").getCurrentPostId(), invalid, saved: !wp.data.select("core/editor").isEditedPostDirty() };
  });
  console.log(JSON.stringify(id));
  await b.close();
})();
