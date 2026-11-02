# Vexari Demo Kit

Gör en kundanpassad hemsidedemo på 1–2 timmar. En JSON-fil per kund → en snabb, mobilanpassad sida med `noindex`, demobanner och ett formulär som aldrig skickar något.

Kräver bara Node 18+. Ingen databas, inget ramverk, inga betaltjänster.

```bash
cd _kit && npm install          # en gång: Playwright + axe-core för kvalitetskontrollen
```

## Ny demo – steg för steg

| Tid | Steg | Kommando / var |
|---|---|---|
| 15 min | **1. Granska kunden.** Kopiera `templates/audit.md` till `_kit/private/<kund>/audit.md` och fyll i. Notera källa för varje fakta. | `private/` committas aldrig |
| 2 min | **2. Skapa config.** Ger en slumpad mapp (slug) så adressen inte går att gissa. | `node _kit/build.mjs new <kund>` |
| 30–45 min | **3. Fyll i `_kit/clients/<kund>.json`.** Texter, tjänster, FAQ, färger och typsnitt. Lägg bilder i `_kit/clients/<kund>/` och skriv `"src": "<kund>/bild.jpg"`. | se *Konfiguration* nedan |
| 1 min | **4. Bygg.** Bygget stoppas om källa, alt-text, kontrast eller annat saknas. | `node _kit/build.mjs _kit/clients/<kund>.json` |
| 10 min | **5. Kontrollera.** Mobil, surfplatta och dator, formulär, noindex, tillgänglighet och privata uppgifter. Titta på skärmdumparna. | `node _kit/qa.mjs <slug>` → `_kit/private/qa/` |
| 15 min | **6. Justera** texter och färger tills rapporten är ren och sidan känns som kundens. | |
| – | **7. Granska och publicera.** Christian godkänner, sedan commit + push. Länken blir `…/Demos/<slug>/`. | |

> Bara för den publika demon: kundens namn, tjänster och kontaktuppgifter som kunden **själv har publicerat**. Leads, anteckningar, analyser, priser och samtalsnoteringar sparas i `_kit/private/`, som git ignorerar. Repot är publikt.

## Konfiguration (`clients/<kund>.json`)

Utgå från [`examples/example.json`](examples/example.json) (påhittat företag, bygger till [`example/`](example/)).

| Fält | Vad |
|---|---|
| `lang` | `sv`, `nb`, `nn` eller `en`. Styr knappar, formulär, banner och meny. |
| `company` | `name`, `shortName`, `phone`, `email`, `address`, `area`, `hours`, valfritt `logo` (`{src, alt}`), `orgNr`, `tagline` |
| `seo` | `title` (≤ 60 tecken: *Företag – tjänst i ort*) och `description` (≤ 155 tecken, med ort och CTA) |
| `theme.primary` / `accent` | Kundens färger i HEX. Accent används för CTA-knappar. Textfärger på knappar väljs automatiskt för läsbar kontrast. |
| `theme.ink` / `bg` / `dark` | Valfria: textfärg, bakgrund och mörka partier |
| `theme.fonts` | `sturdy` (bygg, VVS), `workshop` (versaler, industri/svets), `modern`, `classic` (äldre familjeföretag), `system` (snabbast) |
| `theme.radius` | `sharp`, `soft`, `round` |
| `theme.hero` | `solid` (utan bild), `split` (text + bild), `photo` (helbild med text). Det här är största skillnaden mellan sidor. |
| `hero` | `eyebrow`, `title`, `lead`, `cta`, `image`, `badges[]` (`text` + `source`) |
| `services.items[]` | `icon`, `title`, `text`. Ikoner: `wrench drop flame bolt roof hammer shield ruler spark leaf thermo truck check clock phone` |
| `benefits.items[]` | Kundens fördelar (2 eller 4 st) |
| `process.steps[]` | Exakt 3 steg |
| `about` | `title`, `text[]`, `image`, `facts[]` (`value`, `label`, `source`) |
| `references` | `items[]`: omdömen (`quote`, `name`, `context`, `source`, `sourceLabel`). `projects[]`: `title`, `text`, `image`, `source`. Sektionen visas bara om något finns. |
| `faq.items[]` | 4–6 riktiga kundfrågor (`q`, `a`) |
| `contact` | `title`, `lead`, `formTitle`, `serviceOptions[]` (annars används tjänsterna) |

`**fetstil**` fungerar i brödtexter. All text escapas, så HTML i configen visas som text.

**Så blir varje sida unik:** kundens egna färger och bilder, en hero-variant och ett typsnitt som passar branschen, och copy som utgår från kundens faktiska problem i analysen. Skriv aldrig generiska texter som skulle passa vilken firma som helst.

## Skyddsregler (inbyggda)

- **Demoläge är standard:** `noindex, nofollow, noarchive`, synlig demobanner, ingen canonical och ingen strukturerad data. Formuläret använder `method="dialog"` och skickar därför ingenting, inte ens utan JavaScript. Det är märkt "Demoformulär".
- **Inga påhittade bevis:** varje badge, fakta, referens och projekt kräver en `source`-URL där uppgiften kan kontrolleras. Annars stoppas bygget.
- **Tillgänglighet:** alt-text krävs, och färger som inte ger läsbar kontrast stoppar bygget. Sidan har skip-länk, synlig fokusmarkering, etiketter på alla fält och stöd för reducerad rörelse.
- **Produktionsläge** (`"mode": "production"`) stängs av tills `approval` (`by`, `date`, `evidence`), `site.url` och ett testat `contact.formAction` finns. **Publicera aldrig en kundsida utan skriftligt godkännande.**

## Snabbhet

En HTML-fil med inbäddad CSS och ca 1 kB JavaScript. Bilder läggs i `<slug>/img/` och laddas lazy, utom hero-bilden. Lägg inte in bilder som base64. Skala bilder till max 1600 px bredd och spara som WebP/JPEG (ca 75 %). Bygget varnar över 350 kB per bild.

## Kvalitetskontroll (`qa.mjs`)

Kör på en, flera eller alla demos (`node _kit/qa.mjs`). Kontrollerar i 375, 768 och 1440 px:

- **Indexering:** noindex finns, ingen canonical och ingen JSON-LD i demon
- **Formulär:** ingen mailto eller action till riktiga adresser; fyller i och skickar på riktigt i webbläsaren och felar om något lämnar sidan; demobekräftelse visas
- **Layout:** horisontell scroll, exakt en `<h1>`, alt-texter, trasiga ankarlänkar, menyknappen på mobil, små tryckytor, text under 12 px
- **Tillgänglighet:** axe-core (WCAG 2.1 AA, allvarliga fel)
- **Privata uppgifter:** personnummer (fel), e-post hos privata tjänster och mobilnummer (listas för manuell kontroll)
- **Vikt:** HTML-storlek, inbäddade bilder, total sidvikt

Rapport och skärmdumpar hamnar i `_kit/private/qa/`. Rapporten listar `✗` för fel, `!` för varningar och `·` för info. Exit-koden är 1 om något är fel.

## Checklista innan en demo skickas

- [ ] Alla fakta finns i analysen med källa. Inga påhittade certifikat, årtal, omdömen eller resultat.
- [ ] `qa.mjs` utan ✗. Varningarna är genomlästa.
- [ ] Skärmdumpar på mobil är granskade: rubrik, ring-knapp och offertknapp syns direkt.
- [ ] Språk och ton passar landet (sv / nb / nn / en-US).
- [ ] Demobannern nämner rätt företag.
- [ ] Länken är testad på en riktig telefon.
- [ ] Christian har godkänt innan push.

## Leveranschecklista (när kunden säger ja)

1. **Godkännande:** kundens skriftliga ja till innehåll och pris sparas i `private/<kund>/`. Fyll i `approval`.
2. **Domän och hosting:** kundens egen domän och hosting (kunden äger kontona). DNS-ändringar görs bara med kundens godkännande.
3. **Formulär:** sätt `contact.formAction` till en mottagare som kunden har godkänt. Skicka ett testmeddelande och bekräfta att det kommer fram. Kontrollera spamskydd och integritetstext.
4. **SEO:** `site.url`, unik title och description, en h1, alt-texter, LocalBusiness-data (läggs till automatiskt i produktion), sitemap och robots på kundens domän. Ta bort `noindex` (görs automatiskt i produktionsläge) och skicka in sitemap i Google Search Console.
5. **Test:** `qa.mjs` + manuellt på iPhone och Android, ring-länken, formuläret och laddtiden.
6. **Överlämning:** inloggningar, hur texter ändras, vem som underhåller sidan, och kundens kvitto på att allt är mottaget.
7. **Efteråt:** ta bort eller arkivera demon och stryk kunden från leadlistan.
