# Kadence concept demo: "Harbourline Advisory"

> **Concept demo. Harbourline Advisory is a fictional company. This is not client work.**
> Built by VEXARI Agency to practise and show work with WordPress, Gutenberg, Kadence Theme and Kadence Blocks.

Showcase page: `index.html` (GitHub Pages: `/Demos/kadence-concept/`). The page is `noindex`.

## What was built
A one-page website for a fictional management consulting firm. The page has:
- a hero section with a headline and two buttons;
- three service cards with icons;
- a four-step approach as an icon list;
- an FAQ accordion and a call-to-action section;
- a header menu that becomes a drawer on mobile.

It was built and tested locally. There is no live WordPress site.

## Stack (all free)
- WordPress 7.1.5 (official download, SHA-1 verified), PHP 8.3, MariaDB, served locally with `php -S`
- Kadence Theme 1.6.0 and Kadence Blocks 3.9.1.1 (free versions from wordpress.org)
- No Pro licences, no paid services, no client data

## Kadence features actually used
| Feature | Where |
|---|---|
| Row Layout (`kadence/rowlayout`): 1, 2 and 3 columns, full width, background colours, responsive padding, max width 1180 px | All 7 sections |
| Section (`kadence/column`) | 10 columns |
| Advanced Text (`kadence/advancedheading`): H1–H2, responsive size presets (xxl/xl/lg), colours, anchors for the in-page menu | Hero and section titles |
| Advanced Buttons (`kadence/advancedbtn` + `kadence/singlebtn`) | Hero and call to action |
| Info Box (`kadence/infobox`): Feather icons, titles as H3, colours | 3 service cards |
| Icon List (`kadence/iconlist` + `kadence/listitem`) | "Our approach" |
| Accordion (`kadence/accordion` + `kadence/pane`), starts collapsed | FAQ |
| Kadence Theme page settings: hidden title, full width, unboxed, no vertical padding | Home page |
| Kadence Theme header with primary and mobile menus | Header |

Not used: Kadence Pro (Theme Kit / Blocks Pro), Kadence forms, the design library, Google Fonts.

## Checks
| Check | Result |
|---|---|
| Gutenberg block validation after reload | 48/48 blocks valid |
| axe-core WCAG 2.0/2.1/2.2 A+AA, desktop 1440 px and mobile 390 px | 0 violations |
| Headings | one H1, then H2 → H3 in order |
| Horizontal scroll on mobile | none |
| Mobile menu drawer and FAQ accordion | work |
| JavaScript console errors | none |
| Meta description | missing: WordPress core has none. In a client project, add a free SEO plugin. |
| Rebuild from this folder | a fresh install gives the same 7 Kadence rows with the same block IDs, and passes the same checks |

## Files
- `images/`: labelled concept-demo screenshots (desktop hero, desktop full page, mobile full page, the editor)
- `rebuild/home-page-blocks.html`: the saved Gutenberg/Kadence block markup of the home page
- `rebuild/install.php`: installs WordPress, activates Kadence Theme and Kadence Blocks
- `rebuild/create-home.php`: creates the Home page from the block markup, with the Kadence page settings and menu
- `rebuild/router.php`: router for the PHP built-in server
- `rebuild/build-home-in-editor.cjs`: how the page was first built inside the Gutenberg editor (Playwright)
- `rebuild/check.cjs`, `rebuild/screenshots.cjs`: accessibility, SEO and mobile checks, and the labelled screenshots

No database dump, passwords, keys or personal data are stored here.

## Rebuild locally
1. Download WordPress, Kadence Theme and Kadence Blocks from wordpress.org.
2. Unzip WordPress to `site/`, the theme to `site/wp-content/themes/` and the plugin to `site/wp-content/plugins/`.
3. Create a MariaDB/MySQL database and `site/wp-config.php` with your own local credentials.
4. From the folder that contains `site/`, run:
   ```
   WP_ADMIN_PASS='choose-a-local-password' php rebuild/install.php
   php rebuild/create-home.php
   php -S 127.0.0.1:8090 -t site rebuild/router.php
   ```
5. Optionally run the checks and screenshots. They need Playwright and axe-core (`npm i playwright axe-core`):
   ```
   node rebuild/check.cjs
   WP_ADMIN_PASS='...' OUT_DIR=. node rebuild/screenshots.cjs
   ```
