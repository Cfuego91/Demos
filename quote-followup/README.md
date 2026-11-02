# Vexari Quote Follow-up – demo (v2)

Interactive sales demo of automatic quote follow-up for contractors (Day 2, 5 and 10 reminders).
**Simulation only:** no emails, no SMS, no network calls, no database. All people and businesses are fictional
(`example.com` addresses only – the form refuses anything else). State is kept in the visitor's browser
(`localStorage`) and can be cleared with *Reset demo*. The page is `noindex`.

Open: `/quote-followup/` (Swedish by default for Swedish browsers) · `/quote-followup/?lang=en` (English, USD).

## Files
| File | What |
|---|---|
| `index.html` | Shell: header, navigation, notification drawer |
| `app.css` | Vexari dark theme (same tokens as vexari.agency) |
| `app.js` | State, simulated clock, follow-up rules, SV/EN copy, views. No dependencies |

## v2 features
- **Settings → Company:** name, local-only logo (PNG/JPG/WEBP/SVG, max 300 kB, stored as a data URL in the browser), contact email (fictional domains only), phone, address, sender name, language, currency (display only).
- **Settings → Follow-up schedule:** 1–3 reminders, delays 1–60 days (strictly increasing), "no reply" threshold, global pause. Applies to new quotes.
- **Settings → Email templates:** per language and reminder; placeholders `{customer_first} {customer_name} {company} {service} {description} {reference} {amount} {quote_date} {expiry_date} {contact_email} {contact_phone} {sender}`; live preview; unknown fields are flagged; signature and opt-out line are always added.
- **Quotes:** reference number, description, validity date, customer phone; separate quote status (open/accepted/declined/expired) and follow-up status (active/paused/info/no reply/ended/stopped); manual cancellation.
- **Analytics:** total, pending and accepted value, response rate, follow-up completion, replies after a reminder, reply timing. Every figure is labelled as simulated.

## Rules the demo shows
- Reminders on the configured schedule (default 2, 5 and 10 days), each with the exact message (incl. opt-out line). Reminders after the validity date are never sent; the quote expires the day after.
- Accepted or declined → remaining reminders stop, contractor is notified.
- "Wants more info" → follow-up pauses, contractor is notified; resume reschedules from tomorrow.
- No reply N days (default 4) after the last reminder → "No reply", contractor is notified.
- A quote entered late sends only the latest overdue reminder; earlier ones are skipped.

## 2-minute demo script (SV)
1. **Översikt** (15 s): "Här ser ni alla offerter som väntar på svar – och värdet som ligger och väntar."
2. **Öppna en offert** (30 s): visa tidslinjen och öppna *Visa meddelandet*. "Det här mejlet går ut automatiskt dag 2 – från ert namn."
3. **Spola fram 1 dag** (15 s): "En påminnelse förföll och skickades – ni behövde inte göra något."
4. **Simulera svar → Accepterar** (20 s): "Kunden svarade. Påminnelserna stoppas direkt och ni får en avisering." Visa klockikonen.
5. **Ny offert** (30 s): lägg in en offert och visa schemat. "Så enkelt läggs en offert in."
6. **Avslut** (10 s): "Vill ni testa det på era riktiga offerter i 30 dagar?"

Say clearly: figures are simulated and do not show results any business will get.
