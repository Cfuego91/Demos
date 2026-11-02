/* Vexari Quote Follow-up – interactive demo, v2.
   Pure simulation: no network calls, no emails, no SMS. Everything (including an uploaded logo)
   stays in this browser (localStorage). All people and businesses are fictional. */
(function () {
  "use strict";

  // ================================================================ copy (SV / EN)
  var PH = ["customer_first", "customer_name", "company", "service", "description", "reference", "amount", "quote_date", "expiry_date", "contact_email", "contact_phone", "sender"];
  var T = {
    sv: {
      skip: "Hoppa till innehållet", product: "Offertuppföljning", demoPill: "Demo — inga meddelanden skickas",
      notifications: "Aviseringar", reset: "Återställ demo", resetSm: "Återställ", resetConfirm: "Återställa demon? Alla offerter, inställningar och mallar ersätts med exempeldata.",
      nav: { overview: "Översikt", quotes: "Offerter", new: "Ny offert", analytics: "Analys", settings: "Inställningar" }, menu: "Huvudmeny",
      demoDay: "Demodag", simulated: function (n) { return n ? "+" + n + (n === 1 ? " dag simulerad" : " dagar simulerade") : "Idag"; }, nextDay: "Spola fram 1 dag",
      simNote: "Simulerade siffror – inte verkliga affärsresultat",
      storageOff: "Webbläsaren tillåter inte lokal lagring (t.ex. privat läge). Demon fungerar, men ändringar försvinner när sidan laddas om.",
      storageBroken: "Sparad demodata gick inte att läsa och har ersatts med exempeldata.",
      globalPaused: "All automatisk uppföljning är pausad. Inga påminnelser skickas förrän du slår på den igen.", unpause: "Slå på igen",
      ov: { title: "Översikt", lead: function (d) { return "Offerter som väntar på svar följs upp automatiskt efter " + d + "."; } },
      guide: { title: "Så visar du demon (under 2 minuter)", close: "Stäng guiden",
        steps: ["<b>Öppna en offert</b> och se exakt vilka påminnelser kunden får.", "<b>Spola fram en dag</b> – påminnelser som förfaller \"skickas\" (simulerat).", "<b>Simulera kundens svar</b> – påminnelserna stoppas direkt och du får en avisering.", "<b>Inställningar:</b> byt företagsnamn, logga, schema och mejlmallar."],
        cta: "Öppna en offert" },
      kpi: { pendingValue: "Väntande offertvärde", pendingDef: "Öppna offerter som ännu inte avgjorts", acceptedValue: "Accepterat offertvärde", acceptedDef: "Summan av offerter kunden sagt ja till i demon", responseRate: "Svarsfrekvens", responseDef: function (a, b) { return a + " av " + b + " kunder har svarat"; }, action: "Kräver åtgärd", actionDef: "Kunden vill ha info eller har inte svarat",
        total: "Offerter totalt", open: "Öppna", accepted: "Accepterade", declined: "Avböjda", expired: "Utgångna",
        totalValue: "Totalt offertvärde", totalValueDef: "Alla offerter i demon", completion: "Uppföljning genomförd", completionDef: function (a, b) { return a + " av " + b + " planerade påminnelser skickade"; }, afterReminder: "Svar efter påminnelse", afterDef: function (a, b) { return a + " av " + b + " svar kom efter minst en påminnelse"; }, rate: "Acceptansgrad", rateDef: "Accepterade av avgjorda offerter", sent: "Påminnelser skickade" },
      actionCard: "Kräver åtgärd", noAction: "Inget kräver åtgärd just nu.",
      pipeline: "Offertpipeline", pipelineSub: "Antal och värde per offertstatus",
      upcoming: "Kommande påminnelser", upcomingSub: "Närmaste 7 dagarna", noUpcoming: "Inga påminnelser de närmaste 7 dagarna.",
      recent: "Senaste aktivitet", allActivity: "Visa all aktivitet", noActivity: "Ingen aktivitet ännu.",
      qs: { open: "Öppen", accepted: "Accepterad", declined: "Avböjd", expired: "Utgången" },
      fs: { active: "Uppföljning pågår", paused: "Pausad", info: "Vill ha mer info", done: "Inget svar", cancelled: "Uppföljning avslutad", stopped: "Uppföljning stoppad" },
      filters: { all: "Alla", pending: "Pågår", action: "Kräver åtgärd", accepted: "Accepterade", declined: "Avböjda", expired: "Utgångna" },
      q: { title: "Offerter", lead: "Välj en offert för att se tidslinjen och simulera kundens svar.", none: "Inga offerter i det här filtret.", emptyTitle: "Inga offerter ännu", emptyText: "Lägg in din första offert så schemaläggs uppföljningen automatiskt.", next: "Nästa påminnelse", back: "Alla offerter", amount: "Belopp", service: "Tjänst", sentDate: "Offert skickad", expires: "Giltig till", email: "E-post", phone: "Telefon", reminders: "Påminnelser", quoteStatus: "Offertstatus", fuStatus: "Uppföljning", simulate: "Simulera kundens svar", accept: "Accepterar", decline: "Avböjer", info: "Vill ha mer info", noReply: "Svarar inte", noReplyHelp: "Spolar fram demodagen till nästa påminnelse.", pause: "Pausa", resume: "Återuppta", cancel: "Avsluta uppföljning", cancelConfirm: "Avsluta uppföljningen för den här offerten? Inga fler påminnelser skickas. Offerten förblir öppen.", del: "Ta bort offert", delConfirm: "Ta bort offerten från demon? Det går inte att ångra.", timeline: "Automatisk uppföljning", openMsg: "Förhandsgranska meddelandet", from: "Från", to: "Till", subject: "Ämne", nosend: "Demo: det här meddelandet skickas aldrig.", deleted: "Offerten är borttagen.", notFound: "Offerten finns inte längre. Den kan ha tagits bort." },
      tl: { day: function (d) { return "Dag " + d; }, names: ["Vänlig påminnelse", "Andra uppföljningen", "Sista uppföljningen"], sent: "Skickad (simulerad)", scheduled: "Schemalagd", held: "Pausad", skipped: "Hoppades över", cancelled: "Stoppad", reason: { decision: "Stoppad – kunden svarade", manual: "Stoppad manuellt", expiry: "Efter giltighetstid – skickas inte" } },
      outcome: { accepted: "Kunden accepterade offerten. Återstående påminnelser stoppades och du fick en avisering.", declined: "Kunden tackade nej. Återstående påminnelser stoppades.", expired: "Offertens giltighetstid har gått ut. Inga fler påminnelser skickas.", info: "Kunden vill ha mer information. Uppföljningen är pausad tills du har svarat – du fick en avisering.", done: "Inget svar efter sista påminnelsen. Ring kunden eller avsluta offerten.", paused: "Uppföljningen är pausad. Inga påminnelser skickas förrän du återupptar den.", cancelled: "Uppföljningen är avslutad manuellt. Offerten är fortfarande öppen." },
      nq: { title: "Ny offert", lead: "Lägg in en offert så skapas uppföljningen automatiskt enligt ditt schema. Använd påhittade uppgifter – demon skickar ingenting.", sCustomer: "Kund", sQuote: "Offert", sFollow: "Uppföljning", name: "Kundens namn", email: "Kundens e-post", emailHelp: "Endast påhittade adresser, t.ex. namn@example.com", phone: "Kundens telefon", phoneHelp: "Valfritt. Använd ett påhittat nummer.", service: "Tjänst", choose: "Välj tjänst", desc: "Beskrivning av offerten", descHelp: "Valfritt, högst 300 tecken. Kan visas i mejlen.", ref: "Offertnummer", refHelp: "Skapas automatiskt. Bokstäver, siffror och bindestreck.", amount: "Offertbelopp", amountHelp: function (c) { return "I " + c + ", exklusive moms"; }, date: "Skickad", expires: "Giltig till", expiresHelp: "Påminnelser efter detta datum skickas inte.", statusLabel: "Starta uppföljning", statusActive: "Direkt", statusPaused: "Pausad tills vidare", save: "Spara och starta uppföljning", saved: "Offerten är sparad och uppföljningen schemalagd.", preview: "Uppföljningsschema för offerten", previewEmpty: "Fyll i datum för att se schemat.", afterExpiry: "efter giltighetstid – skickas inte", errTitle: "Kontrollera följande:", opt: "(valfritt)",
        e: { name: "Skriv kundens namn (2–60 tecken).", email: "Skriv en giltig e-postadress.", emailDemo: "I demon får du bara använda påhittade adresser som slutar på example.com, example.org, example.net eller .example.", phone: "Telefonnumret får bara innehålla siffror, mellanslag, +, - och parenteser (6–20 tecken).", service: "Välj en tjänst.", desc: "Beskrivningen får vara högst 300 tecken.", ref: "Offertnumret ska vara 3–20 tecken: bokstäver, siffror och bindestreck.", refDup: "Det offertnumret används redan.", amount: "Skriv ett belopp större än 0 (högst 10 000 000).", date: "Välj ett datum.", future: "Datumet kan inte vara efter demodagen.", old: "Datumet får vara högst 30 dagar bakåt.", expires: "Välj ett giltighetsdatum.", expBefore: "Giltighetsdatumet måste vara samma dag eller senare än skickat-datumet.", expPast: "Offerten har redan gått ut. Välj ett senare giltighetsdatum.", expFar: "Giltighetstiden får vara högst 365 dagar." } },
      an: { title: "Analys", lead: "Hur uppföljningen påverkar offerterna i demon.", value: "Värde per offertstatus", timing: "När svarar kunderna?", timingSub: "Antal kundsvar efter hur många påminnelser som hade skickats", timingLabel: function (n) { return n === 0 ? "Före första påminnelsen" : "Efter påminnelse " + n; }, history: "Aktivitetshistorik", disclaimer: "Alla siffror kommer från påhittade demoofferter och en simulerad klocka. De visar hur systemet fungerar – inte vilka resultat eller intäkter ett företag får.", noData: "Inga svar ännu." },
      act: { created: "Offert registrerad", reminder: function (n) { return "Påminnelse " + n + " skickad (simulerad)"; }, accepted: "Kunden accepterade", declined: "Kunden tackade nej", info: "Kunden vill ha mer information", paused: "Uppföljning pausad", resumed: "Uppföljning återupptagen", done: "Inget svar efter sista påminnelsen", skipped: "Försenade påminnelser hoppades över", cancelled: "Uppföljning avslutad manuellt", expired: "Offerten gick ut" },
      notif: { title: "Aviseringar", close: "Stäng", none: "Inga aviseringar ännu.", accepted: "accepterade offerten – boka in jobbet.", declined: "tackade nej till offerten.", info: "vill ha mer information – ring eller svara på mejlet.", done: "har inte svarat efter sista påminnelsen – ring kunden?", expired: "– offerten har gått ut.", open: "Öppna offerten", note: "I skarp drift kommer aviseringen som mejl eller sms till företaget." },
      toast: { day: function (n) { return n ? n + (n === 1 ? " påminnelse skickades (simulerat)." : " påminnelser skickades (simulerat).") : "Inga påminnelser förföll."; }, reset: "Demon är återställd.", accepted: "Påminnelserna stoppades – offerten är accepterad.", declined: "Påminnelserna stoppades – offerten är avböjd.", info: "Uppföljningen pausades. Du fick en avisering.", paused: "Uppföljningen är pausad.", resumed: "Uppföljningen är återupptagen.", cancelled: "Uppföljningen är avslutad.", saved: "Inställningarna är sparade.", gpOn: "All uppföljning är pausad.", gpOff: "Uppföljningen är påslagen igen." },
      set: { title: "Inställningar", lead: "Anpassa demon efter företaget du visar den för. Allt sparas bara i den här webbläsaren.", tabs: { company: "Företag", schedule: "Uppföljningsschema", templates: "Mejlmallar" },
        company: "Företagsuppgifter", name: "Företagsnamn", logo: "Logotyp", logoHelp: "PNG, JPG, WEBP eller SVG, högst 300 kB. Bilden stannar i din webbläsare och laddas aldrig upp.", upload: "Välj bild", removeLogo: "Ta bort", noLogo: "Ingen logga", email: "Kontakt-e-post", emailHelp: "Påhittad adress, t.ex. offert@foretaget.example", phone: "Telefonnummer", address: "Adress", sender: "Avsändarens namn", senderHelp: "Visas i mejlens signatur.", lang: "Språk", currency: "Valuta", currencyHelp: "Byter bara visningen. Beloppen räknas inte om.", save: "Spara företagsuppgifter",
        sched: "Uppföljningsschema", schedLead: "Gäller nya offerter. Redan skapade offerter behåller sitt schema.", max: "Antal påminnelser", delay: function (n) { return "Påminnelse " + n + " (dagar efter offert)"; }, noResp: "Markera som obesvarad efter (dagar efter sista påminnelsen)", pause: "Pausa all automatisk uppföljning", pauseHelp: "Inga påminnelser skickas medan pausen är på. Kundsvar registreras fortfarande.", saveSched: "Spara schema", resetSched: "Återställ till 2, 5 och 10 dagar", visual: "Så här ser schemat ut", start: "Offert", end: "Obesvarad",
        tpl: "Mejlmallar", tplLead: "Skriv dina egna påminnelser. Klicka på ett fält för att infoga det där markören står. Signatur och avregistreringsrad läggs till automatiskt.", tplFor: function (n) { return "Påminnelse " + n; }, subject: "Ämnesrad", body: "Meddelande", fields: "Fält du kan använda", previewFor: "Förhandsgranska med offerten", preview: "Förhandsgranskning", saveTpl: "Spara mall", resetTpl: "Återställ standardmall", tplSaved: "Mallen är sparad.", tplReset: "Standardmallen är återställd.", unknown: function (x) { return "Okänt fält: " + x + ". Det visas som det står."; }, noQuotes: "Lägg till en offert för att kunna förhandsgranska." ,
        e: { name: "Skriv företagsnamnet (2–80 tecken).", email: "Använd en påhittad adress som slutar på example.com, example.org, example.net eller .example.", phone: "Telefonnumret får bara innehålla siffror, mellanslag, +, - och parenteser (6–20 tecken).", address: "Adressen får vara högst 120 tecken.", sender: "Skriv avsändarens namn (2–40 tecken).", logoType: "Filtypen stöds inte. Använd PNG, JPG, WEBP eller SVG.", logoSize: "Bilden är för stor (högst 300 kB).", logoRead: "Bilden kunde inte läsas.", logoStore: "Bilden kunde inte sparas i webbläsaren.", delayInt: "Ange ett heltal mellan 1 och 60 dagar.", delayOrder: "Varje påminnelse måste komma minst en dag efter den föregående.", noResp: "Ange ett heltal mellan 1 och 30 dagar.", subject: "Ämnesraden ska vara 3–120 tecken.", body: "Meddelandet ska vara 20–2000 tecken." } },
      foot: "Vexari Offertuppföljning är en demonstration. Inga mejl eller sms skickas, ingen data lämnar din webbläsare och alla personer och företag är påhittade.",
      locale: "sv-SE", refPrefix: "OF", and: "och",
      defaults: { company: "Demofirman Bygg & VVS AB", email: "offert@demofirman.example", phone: "08-000 000 00", address: "Exempelgatan 1, 123 45 Exempelstad", sender: "Erik Exempel", currency: "SEK" },
      tpls: [
        { s: "Offert {reference} – har du hunnit titta?", b: "Hej {customer_first},\n\nTack för att du gav oss möjligheten att lämna en offert på {service}. Jag ville bara höra att offerten ({reference}) har kommit fram och om du har några frågor.\n\nOffertbelopp: {amount}\nGiltig till: {expiry_date}\n\nSå här svarar du:\n• Vill du gå vidare? Svara JA på det här mejlet så bokar vi in en tid.\n• Har du frågor? Svara med dem här eller ring {contact_phone}." },
        { s: "Frågor om offerten för {service}?", b: "Hej {customer_first},\n\nJag följer upp offert {reference} som vi skickade {quote_date}. Är något oklart, eller vill du justera omfattningen? Vi går gärna igenom den tillsammans – det tar bara några minuter.\n\nSvara JA för att gå vidare, svara med dina frågor, eller ring {contact_phone}." },
        { s: "Sista påminnelsen: offert {reference}", b: "Hej {customer_first},\n\nDet här är vår sista påminnelse om offerten för {service} ({reference}). Offerten gäller till och med {expiry_date}.\n\nVill du gå vidare? Svara JA så hör vi av oss och bokar in arbetet. Passar det inte just nu är det helt okej – då hör vi inte av oss mer om den här offerten." }
      ],
      sign: "Vänliga hälsningar\n{sender}\n{company}\n{contact_phone} · {contact_email}", optout: "Vill du inte få fler påminnelser om den här offerten? Svara STOPP.",
      phLabels: { customer_first: "Kundens förnamn", customer_name: "Kundens namn", company: "Företagsnamn", service: "Tjänst", description: "Beskrivning", reference: "Offertnummer", amount: "Belopp", quote_date: "Offertdatum", expiry_date: "Giltig till", contact_email: "Kontakt-e-post", contact_phone: "Telefon", sender: "Avsändare" },
      services: ["Badrumsrenovering", "Köksrenovering", "Takbyte", "Fasadmålning", "Altanbygge", "Fönsterbyte", "Byte av varmvattenberedare", "Värmepump", "Byte av elcentral", "Dränering", "Annat"]
    },
    en: {
      skip: "Skip to content", product: "Quote Follow-up", demoPill: "DEMO — No messages are sent",
      notifications: "Notifications", reset: "Reset demo", resetSm: "Reset", resetConfirm: "Reset the demo? All quotes, settings and templates are replaced with sample data.",
      nav: { overview: "Overview", quotes: "Quotes", new: "New quote", analytics: "Analytics", settings: "Settings" }, menu: "Main menu",
      demoDay: "Demo day", simulated: function (n) { return n ? "+" + n + (n === 1 ? " day simulated" : " days simulated") : "Today"; }, nextDay: "Advance 1 day",
      simNote: "Simulated figures – not real business results",
      storageOff: "This browser does not allow local storage (e.g. private mode). The demo works, but changes are lost when the page reloads.",
      storageBroken: "Saved demo data could not be read and was replaced with sample data.",
      globalPaused: "All automatic follow-up is paused. No reminders are sent until you turn it back on.", unpause: "Turn back on",
      ov: { title: "Overview", lead: function (d) { return "Quotes awaiting a reply are followed up automatically after " + d + "."; } },
      guide: { title: "How to present this demo (under 2 minutes)", close: "Close guide",
        steps: ["<b>Open a quote</b> and see exactly which reminders the customer receives.", "<b>Advance one day</b> – reminders that fall due are \"sent\" (simulated).", "<b>Simulate the customer's reply</b> – reminders stop immediately and you are notified.", "<b>Settings:</b> change the company name, logo, schedule and email templates."],
        cta: "Open a quote" },
      kpi: { pendingValue: "Pending quote value", pendingDef: "Open quotes not yet decided", acceptedValue: "Accepted quote value", acceptedDef: "Sum of quotes the customer said yes to in the demo", responseRate: "Response rate", responseDef: function (a, b) { return a + " of " + b + " customers replied"; }, action: "Needs action", actionDef: "Customer wants info or has not replied",
        total: "Total quotes", open: "Open", accepted: "Accepted", declined: "Declined", expired: "Expired",
        totalValue: "Total quote value", totalValueDef: "All quotes in the demo", completion: "Follow-up completed", completionDef: function (a, b) { return a + " of " + b + " planned reminders sent"; }, afterReminder: "Replies after a reminder", afterDef: function (a, b) { return a + " of " + b + " replies came after at least one reminder"; }, rate: "Acceptance rate", rateDef: "Accepted out of decided quotes", sent: "Reminders sent" },
      actionCard: "Needs action", noAction: "Nothing needs action right now.",
      pipeline: "Quote pipeline", pipelineSub: "Count and value by quote status",
      upcoming: "Upcoming reminders", upcomingSub: "Next 7 days", noUpcoming: "No reminders in the next 7 days.",
      recent: "Recent activity", allActivity: "View all activity", noActivity: "No activity yet.",
      qs: { open: "Open", accepted: "Accepted", declined: "Declined", expired: "Expired" },
      fs: { active: "Following up", paused: "Paused", info: "Wants more info", done: "No reply", cancelled: "Follow-up ended", stopped: "Follow-up stopped" },
      filters: { all: "All", pending: "In progress", action: "Needs action", accepted: "Accepted", declined: "Declined", expired: "Expired" },
      q: { title: "Quotes", lead: "Select a quote to see its timeline and simulate the customer's reply.", none: "No quotes in this filter.", emptyTitle: "No quotes yet", emptyText: "Add your first quote and the follow-up is scheduled automatically.", next: "Next reminder", back: "All quotes", amount: "Amount", service: "Service", sentDate: "Quote sent", expires: "Valid until", email: "Email", phone: "Phone", reminders: "Reminders", quoteStatus: "Quote status", fuStatus: "Follow-up", simulate: "Simulate customer reply", accept: "Accepts", decline: "Declines", info: "Wants more info", noReply: "No reply", noReplyHelp: "Advances the demo day to the next reminder.", pause: "Pause", resume: "Resume", cancel: "End follow-up", cancelConfirm: "End follow-up for this quote? No more reminders are sent. The quote stays open.", del: "Delete quote", delConfirm: "Remove this quote from the demo? This cannot be undone.", timeline: "Automatic follow-up", openMsg: "Preview message", from: "From", to: "To", subject: "Subject", nosend: "Demo: this message is never sent.", deleted: "The quote was deleted.", notFound: "This quote no longer exists. It may have been deleted." },
      tl: { day: function (d) { return "Day " + d; }, names: ["Friendly reminder", "Second follow-up", "Final follow-up"], sent: "Sent (simulated)", scheduled: "Scheduled", held: "Paused", skipped: "Skipped", cancelled: "Stopped", reason: { decision: "Stopped – customer replied", manual: "Stopped manually", expiry: "After expiry – not sent" } },
      outcome: { accepted: "The customer accepted the quote. Remaining reminders were stopped and you were notified.", declined: "The customer declined. Remaining reminders were stopped.", expired: "The quote has expired. No more reminders are sent.", info: "The customer wants more information. Follow-up is paused until you reply – you were notified.", done: "No reply after the final reminder. Call the customer or close the quote.", paused: "Follow-up is paused. No reminders are sent until you resume it.", cancelled: "Follow-up was ended manually. The quote is still open." },
      nq: { title: "New quote", lead: "Add a quote and the follow-up is scheduled automatically using your schedule. Use fictional details – the demo sends nothing.", sCustomer: "Customer", sQuote: "Quote", sFollow: "Follow-up", name: "Customer name", email: "Customer email", emailHelp: "Fictional addresses only, e.g. name@example.com", phone: "Customer phone", phoneHelp: "Optional. Use a fictional number.", service: "Service", choose: "Choose a service", desc: "Quote description", descHelp: "Optional, max 300 characters. Can appear in the emails.", ref: "Quote reference", refHelp: "Created automatically. Letters, digits and hyphens.", amount: "Quote amount", amountHelp: function (c) { return "In " + c + ", excluding tax"; }, date: "Sent", expires: "Valid until", expiresHelp: "Reminders after this date are not sent.", statusLabel: "Start follow-up", statusActive: "Now", statusPaused: "Paused for now", save: "Save and start follow-up", saved: "Quote saved and follow-up scheduled.", preview: "Follow-up schedule for this quote", previewEmpty: "Pick a date to see the schedule.", afterExpiry: "after expiry – not sent", errTitle: "Please check the following:", opt: "(optional)",
        e: { name: "Enter the customer's name (2–60 characters).", email: "Enter a valid email address.", emailDemo: "In the demo, only fictional addresses ending in example.com, example.org, example.net or .example are allowed.", phone: "The phone number may only contain digits, spaces, +, - and parentheses (6–20 characters).", service: "Choose a service.", desc: "The description can be at most 300 characters.", ref: "The reference must be 3–20 characters: letters, digits and hyphens.", refDup: "That reference is already in use.", amount: "Enter an amount greater than 0 (max 10,000,000).", date: "Choose a date.", future: "The date cannot be after the demo day.", old: "The date can be at most 30 days back.", expires: "Choose a validity date.", expBefore: "The validity date must be on or after the sent date.", expPast: "The quote has already expired. Choose a later validity date.", expFar: "Validity can be at most 365 days." } },
      an: { title: "Analytics", lead: "How follow-up affects the quotes in this demo.", value: "Value by quote status", timing: "When do customers reply?", timingSub: "Customer replies by how many reminders had been sent", timingLabel: function (n) { return n === 0 ? "Before the first reminder" : "After reminder " + n; }, history: "Activity history", disclaimer: "All figures come from fictional demo quotes and a simulated clock. They show how the system works – not the results or revenue any business will get.", noData: "No replies yet." },
      act: { created: "Quote added", reminder: function (n) { return "Reminder " + n + " sent (simulated)"; }, accepted: "Customer accepted", declined: "Customer declined", info: "Customer wants more information", paused: "Follow-up paused", resumed: "Follow-up resumed", done: "No reply after the final reminder", skipped: "Overdue reminders skipped", cancelled: "Follow-up ended manually", expired: "Quote expired" },
      notif: { title: "Notifications", close: "Close", none: "No notifications yet.", accepted: "accepted the quote – book the job.", declined: "declined the quote.", info: "wants more information – call or reply to the email.", done: "has not replied after the final reminder – give them a call?", expired: "– the quote has expired.", open: "Open quote", note: "In live use, the business receives this notification by email or text." },
      toast: { day: function (n) { return n ? n + (n === 1 ? " reminder was sent (simulated)." : " reminders were sent (simulated).") : "No reminders were due."; }, reset: "The demo has been reset.", accepted: "Reminders stopped – the quote is accepted.", declined: "Reminders stopped – the quote is declined.", info: "Follow-up paused. You were notified.", paused: "Follow-up is paused.", resumed: "Follow-up resumed.", cancelled: "Follow-up ended.", saved: "Settings saved.", gpOn: "All follow-up is paused.", gpOff: "Follow-up is on again." },
      set: { title: "Settings", lead: "Tailor the demo to the business you are showing it to. Everything is stored in this browser only.", tabs: { company: "Company", schedule: "Follow-up schedule", templates: "Email templates" },
        company: "Company details", name: "Company name", logo: "Logo", logoHelp: "PNG, JPG, WEBP or SVG, max 300 kB. The image stays in your browser and is never uploaded.", upload: "Choose image", removeLogo: "Remove", noLogo: "No logo", email: "Contact email", emailHelp: "Fictional address, e.g. quotes@company.example", phone: "Phone number", address: "Address", sender: "Sender name", senderHelp: "Shown in the email signature.", lang: "Language", currency: "Currency", currencyHelp: "Changes the display only. Amounts are not converted.", save: "Save company details",
        sched: "Follow-up schedule", schedLead: "Applies to new quotes. Existing quotes keep their schedule.", max: "Number of reminders", delay: function (n) { return "Reminder " + n + " (days after quote)"; }, noResp: "Mark as unanswered after (days after the last reminder)", pause: "Pause all automatic follow-up", pauseHelp: "No reminders are sent while paused. Customer replies are still recorded.", saveSched: "Save schedule", resetSched: "Reset to 2, 5 and 10 days", visual: "What the schedule looks like", start: "Quote", end: "Unanswered",
        tpl: "Email templates", tplLead: "Write your own reminders. Click a field to insert it at the cursor. The signature and opt-out line are added automatically.", tplFor: function (n) { return "Reminder " + n; }, subject: "Subject line", body: "Message", fields: "Fields you can use", previewFor: "Preview with quote", preview: "Preview", saveTpl: "Save template", resetTpl: "Reset to default", tplSaved: "Template saved.", tplReset: "Default template restored.", unknown: function (x) { return "Unknown field: " + x + ". It will appear as written."; }, noQuotes: "Add a quote to preview.",
        e: { name: "Enter the company name (2–80 characters).", email: "Use a fictional address ending in example.com, example.org, example.net or .example.", phone: "The phone number may only contain digits, spaces, +, - and parentheses (6–20 characters).", address: "The address can be at most 120 characters.", sender: "Enter the sender's name (2–40 characters).", logoType: "File type not supported. Use PNG, JPG, WEBP or SVG.", logoSize: "The image is too large (max 300 kB).", logoRead: "The image could not be read.", logoStore: "The image could not be saved in the browser.", delayInt: "Enter a whole number between 1 and 60 days.", delayOrder: "Each reminder must come at least one day after the previous one.", noResp: "Enter a whole number between 1 and 30 days.", subject: "The subject must be 3–120 characters.", body: "The message must be 20–2000 characters." } },
      foot: "Vexari Quote Follow-up is a demonstration. No emails or texts are sent, no data leaves your browser, and all people and businesses are fictional.",
      locale: "en-US", refPrefix: "Q", and: "and",
      defaults: { company: "Demo Home Services LLC", email: "quotes@demohome.example", phone: "555-0100", address: "100 Example Street, Springfield", sender: "Mike Example", currency: "USD" },
      tpls: [
        { s: "Quote {reference} – did you get a chance to look?", b: "Hi {customer_first},\n\nThank you for giving us the opportunity to quote your {service}. I just wanted to make sure quote {reference} reached you and see if you have any questions.\n\nQuote amount: {amount}\nValid until: {expiry_date}\n\nHow to reply:\n• Ready to go ahead? Reply YES to this email and we'll schedule a time.\n• Questions? Reply here or call {contact_phone}." },
        { s: "Any questions about your {service} quote?", b: "Hi {customer_first},\n\nI'm following up on quote {reference}, sent on {quote_date}. Is anything unclear, or would you like to adjust the scope? We're happy to walk through it with you – it only takes a few minutes.\n\nReply YES to go ahead, reply with your questions, or call {contact_phone}." },
        { s: "Final reminder: quote {reference}", b: "Hi {customer_first},\n\nThis is our final reminder about the quote for your {service} ({reference}). The quote is valid until {expiry_date}.\n\nWould you like to go ahead? Reply YES and we'll get in touch to schedule the work. If the timing isn't right, that's completely fine – we won't follow up on this quote again." }
      ],
      sign: "Best regards,\n{sender}\n{company}\n{contact_phone} · {contact_email}", optout: "Don't want more reminders about this quote? Reply STOP.",
      phLabels: { customer_first: "Customer first name", customer_name: "Customer name", company: "Company name", service: "Service", description: "Description", reference: "Quote reference", amount: "Amount", quote_date: "Quote date", expiry_date: "Valid until", contact_email: "Contact email", contact_phone: "Phone", sender: "Sender" },
      services: ["Bathroom remodel", "Kitchen remodel", "Roof replacement", "Exterior painting", "Deck build", "Window replacement", "Water heater replacement", "Heat pump installation", "Electrical panel upgrade", "Drainage", "Other"]
    }
  };
  var CURRENCIES = ["SEK", "NOK", "DKK", "EUR", "GBP", "USD", "CAD", "AUD", "AED"];

  // fictional sample data: [name, service, amount, daysAgo, outcome, outcomeAfterDays, description, validDays]
  var SEED = {
    sv: [
      ["Lena Ström", "Dränering", 98000, 0, null, 0, "Dränering och omfyllning runt villagrund, cirka 40 löpmeter."],
      ["Anna Lindqvist", "Badrumsrenovering", 148500, 1, null, 0, "Totalrenovering av badrum 6 m² med nytt tätskikt, golvvärme och vägghängd wc."],
      ["Johan Berg", "Byte av varmvattenberedare", 18900, 3, null, 0, "Byte av 200-liters varmvattenberedare inklusive bortforsling av den gamla."],
      ["Sara Nilsson", "Takbyte", 212000, 6, null, 0, "Byte av tak med betongpannor, 140 m², inklusive läkt och underlagspapp."],
      ["Mikael Ek", "Altanbygge", 64000, 8, "info", 6, "Altan i tryckimpregnerat trä, 25 m², med trappa och räcke."],
      ["Ali Hassan", "Köksrenovering", 176000, 9, "accepted", 2, "Rivning och montering av nytt kök med el- och VVS-anslutning."],
      ["Peter Strand", "Fasadmålning", 89000, 12, "declined", 3, "Tvätt, skrapning och målning av träfasad, två strykningar."],
      ["Elin Holm", "Byte av elcentral", 27500, 13, "accepted", 5, "Ny elcentral med jordfelsbrytare och överspänningsskydd."],
      ["Karin Sjöberg", "Värmepump", 124000, 18, null, 0, "Luft/vatten-värmepump 8 kW som ersätter oljepanna."],
      ["Oskar Lund", "Fönsterbyte", 56000, 24, null, 0, "Byte av sex fönster till treglas, inklusive foder och fönsterbleck.", 20]
    ],
    en: [
      ["Laura Stone", "Drainage", 7900, 0, null, 0, "French drain and backfill around the foundation, about 130 feet."],
      ["Emily Carter", "Bathroom remodel", 18500, 1, null, 0, "Full remodel of a 65 sq ft bathroom with new waterproofing and heated floor."],
      ["James Brooks", "Water heater replacement", 2400, 3, null, 0, "Replace 50-gallon water heater, including haul-away of the old unit."],
      ["Sarah Nguyen", "Roof replacement", 26000, 6, null, 0, "Tear-off and new architectural shingles, about 1,500 sq ft."],
      ["Michael Reed", "Deck build", 9800, 8, "info", 6, "Pressure-treated deck, 270 sq ft, with stairs and railing."],
      ["Daniel Ortiz", "Kitchen remodel", 32000, 9, "accepted", 2, "Demolition and installation of a new kitchen incl. electrical and plumbing hookups."],
      ["Peter Walsh", "Exterior painting", 11200, 12, "declined", 3, "Power wash, scrape and two coats on wood siding."],
      ["Olivia Hayes", "Electrical panel upgrade", 3600, 13, "accepted", 5, "Upgrade to a 200 A panel with surge protection."],
      ["Karen Foster", "Heat pump installation", 14500, 18, null, 0, "3-ton heat pump replacing an oil furnace."],
      ["Oliver Grant", "Window replacement", 6800, 24, null, 0, "Replace six windows with triple-pane units incl. trim.", 20]
    ]
  };
  var KEY = "vexari-quote-followup-demo-v2", LOGO_MAX = 300 * 1024;

  // ================================================================ utils
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parse(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function add(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  function diff(a, b) { return Math.round((parse(a) - parse(b)) / 864e5); }
  function isDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || "") && !isNaN(parse(s)); }
  var REAL_TODAY = iso(new Date());
  function today() { return add(REAL_TODAY, state.offset); }
  function L() { return T[state.settings.lang]; }
  function money(n) { try { return new Intl.NumberFormat(L().locale, { style: "currency", currency: state.settings.currency, maximumFractionDigits: 0 }).format(n); } catch (e) { return n + " " + state.settings.currency; } }
  function fdate(s, long) { return new Intl.DateTimeFormat(L().locale, long ? { weekday: "short", day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" }).format(parse(s)); }
  function pct(x) { return new Intl.NumberFormat(L().locale, { style: "percent", maximumFractionDigits: 0 }).format(x); }
  function first(name) { return String(name).trim().split(/\s+/)[0]; }
  function slugEmail(name) { return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "") + "@example.com"; }
  function fictionalEmail(e) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e) && /@(?:[a-z0-9-]+\.)*(example\.(com|org|net)|[a-z0-9-]+\.example)$/i.test(e); }
  var PHONE_RE = /^[0-9+\-() ]{6,20}$/;
  function listDays(d) { var t = L(), a = d.map(function (x) { return x; }); return a.length > 1 ? a.slice(0, -1).join(", ") + " " + t.and + " " + a[a.length - 1] + (state.settings.lang === "sv" ? " dagar" : " days") : a[0] + (state.settings.lang === "sv" ? " dagar" : " days"); }
  var ICON = {
    overview: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    quotes: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    new: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>', analytics: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>', check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>', clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>', play: '<path d="m6 3 14 9-14 9V3z"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    forward: '<path d="m13 17 5-5-5-5M6 17l5-5-5-5"/>', back: '<path d="m15 18-6-6 6-6"/>', trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>', stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>', inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1Z"/>', upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>', expired: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6M12 16h.01"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + "</svg>"; }

  // ================================================================ state
  var state, storageOK = true, storageBroken = false;
  try { var k = "__vx_t"; localStorage.setItem(k, "1"); localStorage.removeItem(k); } catch (e) { storageOK = false; }
  function save() { if (!storageOK) return true; try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; } }
  function load() {
    if (!storageOK) return null;
    var raw; try { raw = localStorage.getItem(KEY); } catch (e) { return null; }
    if (!raw) return null;
    try {
      var s = JSON.parse(raw);
      if (s && s.v === 2 && s.realToday === REAL_TODAY && Array.isArray(s.quotes) && s.settings && T[s.settings.lang] && s.schedule && Array.isArray(s.schedule.delays)) return s;
      if (s && s.v === 2 && s.realToday !== REAL_TODAY) return null; // new day: start fresh so dates stay realistic
    } catch (e) { }
    storageBroken = true; return null;
  }
  function log(type, q, at, extra) { state.activity.push({ id: ++state.seq, at: at || today(), type: type, qid: q ? q.id : null, name: q ? q.customer : "", n: extra }); }
  function notify(type, q, at) { state.notifs.push({ id: ++state.seq, at: at || today(), type: type, qid: q.id, name: q.customer, read: false }); }
  function nextRef() { state.refSeq++; return L().refPrefix + "-" + REAL_TODAY.slice(0, 4) + "-" + String(state.refSeq).padStart(3, "0"); }

  function makeQuote(o) {
    var sch = state.schedule;
    var q = { id: "q" + (++state.seq), ref: o.ref || nextRef(), customer: o.customer, email: o.email, phone: o.phone || "", service: o.service, description: o.description || "", amount: o.amount, sent: o.sent, expires: o.expires,
      status: "open", fu: o.paused ? "paused" : "active", respondedAt: null, remAtResp: null, noResp: sch.noResponseAfter,
      reminders: sch.delays.slice(0, sch.max).map(function (d, i) { var due = add(o.sent, d); return { n: i + 1, day: d, due: due, state: due > o.expires ? "cancelled" : "scheduled", reason: due > o.expires ? "expiry" : null, sentOn: null }; }) };
    state.quotes.push(q);
    return q;
  }
  function sentCount(q) { return q.reminders.filter(function (r) { return r.state === "sent"; }).length; }
  function scheduled(q) { return q.reminders.filter(function (r) { return r.state === "scheduled"; }); }
  function cancelScheduled(q, reason) { q.reminders.forEach(function (r) { if (r.state === "scheduled") { r.state = "cancelled"; r.reason = reason; } }); }
  function lastSent(q) { var s = q.reminders.filter(function (r) { return r.state === "sent"; }); return s.length ? s[s.length - 1].sentOn : null; }

  // Advance one quote to `date`: send due reminders, detect "no reply", detect expiry. Returns reminders sent.
  function processQuote(q, date) {
    if (q.status !== "open") return 0;
    var n = 0, limit = date < q.expires ? date : q.expires;
    if (q.fu === "active" && !state.schedule.paused) {
      q.reminders.forEach(function (r) { if (r.state === "scheduled" && r.due <= limit) { r.state = "sent"; r.sentOn = r.due; n++; log("reminder", q, r.due, r.n); } });
      var ls = lastSent(q);
      if (!scheduled(q).length && ls) {
        var at = add(ls, q.noResp);
        if (at <= limit) { q.fu = "done"; log("done", q, at); notify("done", q, at); }
      }
    }
    if (date > q.expires) {
      var ex = add(q.expires, 1);
      cancelScheduled(q, "expiry"); q.status = "expired"; if (q.fu !== "cancelled") q.fu = "stopped";
      log("expired", q, ex); notify("expired", q, ex);
    }
    return n;
  }
  function processAll() { var n = 0; state.quotes.forEach(function (q) { n += processQuote(q, today()); }); return n; }

  function respond(q, type, at) {
    at = at || today();
    if (!q.respondedAt) { q.respondedAt = at; q.remAtResp = sentCount(q); }
    if (type === "info") { q.fu = "info"; log("info", q, at); notify("info", q, at); return; }
    q.status = type; q.fu = "stopped"; cancelScheduled(q, "decision");
    log(type, q, at); notify(type, q, at);
  }
  function resume(q) {
    var pending = scheduled(q);
    if (pending.length && pending[0].due <= today()) {
      var shift = diff(today(), pending[0].due) + 1;
      pending.forEach(function (r) { r.due = add(r.due, shift); if (r.due > q.expires) { r.state = "cancelled"; r.reason = "expiry"; } });
    }
    q.fu = "active"; log("resumed", q);
    var ls = lastSent(q);
    if (!scheduled(q).length && ls && add(ls, q.noResp) <= today()) q.noResp = diff(today(), ls) + 1; // give the customer at least one more day
  }

  function defaultSettings(lang) { var d = T[lang].defaults; return { company: d.company, logo: null, email: d.email, phone: d.phone, address: d.address, sender: d.sender, lang: lang, currency: d.currency }; }
  function seed(lang) {
    state = { v: 2, realToday: REAL_TODAY, offset: 0, quotes: [], activity: [], notifs: [], seq: 0, refSeq: 0, pristine: true, guide: true, filter: "all",
      settings: defaultSettings(lang), schedule: { delays: [2, 5, 10], max: 3, noResponseAfter: 4, paused: false }, templates: { sv: null, en: null } };
    SEED[lang].forEach(function (s, i) {
      var sent = add(REAL_TODAY, -s[3]);
      var q = makeQuote({ customer: s[0], email: slugEmail(s[0]), phone: lang === "sv" ? "070-000 00 " + String(i + 10) : "555-01" + String(i + 10), service: s[1], amount: s[2], sent: sent, expires: add(sent, s[7] || 30), description: s[6] });
      log("created", q, sent);
      if (s[4]) { processQuote(q, add(sent, s[5])); respond(q, s[4], add(sent, s[5])); }
      processQuote(q, REAL_TODAY);
    });
    state.notifs.forEach(function (n) { n.read = n.at < add(REAL_TODAY, -3); });
    save();
  }

  // ================================================================ numbers (all derived from the demo data)
  function needsAction(q) { return q.status === "open" && (q.fu === "info" || q.fu === "done"); }
  function stats() {
    var s = { total: 0, open: 0, accepted: 0, declined: 0, expired: 0, totalValue: 0, pendingValue: 0, acceptedValue: 0, sent: 0, planned: 0, responded: 0, afterReminder: 0, action: 0, timing: [0, 0, 0, 0], by: {} };
    ["open", "accepted", "declined", "expired"].forEach(function (k) { s.by[k] = { n: 0, v: 0 }; });
    state.quotes.forEach(function (q) {
      s.total++; s.totalValue += q.amount; s.by[q.status].n++; s.by[q.status].v += q.amount; s[q.status]++;
      if (q.status === "open") s.pendingValue += q.amount;
      if (q.status === "accepted") s.acceptedValue += q.amount;
      if (needsAction(q)) s.action++;
      q.reminders.forEach(function (r) { if (r.state === "sent") s.sent++; if (r.state === "sent" || r.state === "scheduled") s.planned++; });
      if (q.respondedAt) { s.responded++; if (q.remAtResp > 0) s.afterReminder++; s.timing[Math.min(3, q.remAtResp)]++; }
    });
    var decided = s.accepted + s.declined + s.expired;
    s.decided = decided; s.rate = decided ? s.accepted / decided : 0;
    s.responseRate = s.total ? s.responded / s.total : 0;
    s.completion = s.planned ? s.sent / s.planned : 0;
    return s;
  }

  // ================================================================ messages
  function vars(q) {
    var st = state.settings;
    return { customer_first: first(q.customer), customer_name: q.customer, company: st.company, service: q.service.toLowerCase(), description: q.description || q.service, reference: q.ref, amount: money(q.amount), quote_date: fdate(q.sent), expiry_date: fdate(q.expires), contact_email: st.email, contact_phone: st.phone, sender: st.sender };
  }
  function fill(s, v) { return String(s).replace(/\{([a-z_]+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(v, k) ? v[k] : m; }); }
  function template(n, lang) { lang = lang || state.settings.lang; var c = state.templates[lang] && state.templates[lang][n - 1]; return c || T[lang].tpls[n - 1]; }
  function message(q, n) { var t = L(), v = vars(q), tp = template(n); return { subject: fill(tp.s, v), body: fill(tp.b, v) + "\n\n" + fill(t.sign, v) + "\n\n" + t.optout }; }
  function unknownPh(s) { var out = []; String(s).replace(/\{([^}]*)\}/g, function (m, k) { if (PH.indexOf(k) < 0 && out.indexOf(m) < 0) out.push(m); }); return out; }
  function mailHtml(q, n, from) {
    var t = L(), m = message(q, n), st = state.settings;
    return '<div class="mail' + (from ? " preview-mail" : "") + '">' + (st.logo ? '<div class="brandline"><img src="' + esc(st.logo) + '" alt="">' + esc(st.company) + "</div>" : "") +
      '<div class="hdr"><span>' + esc(t.q.from) + "</span><b>" + esc(st.company) + " &lt;" + esc(st.email) + "&gt;</b><span>" + esc(t.q.to) + "</span><b>" + esc(q.customer) + " &lt;" + esc(q.email) + "&gt;</b><span>" + esc(t.q.subject) + "</span><b>" + esc(m.subject) + "</b></div><pre>" + esc(m.body) + '</pre><p class="nosend">' + esc(t.q.nosend) + "</p></div>";
  }

  // ================================================================ render helpers
  function qchip(q) { return '<span class="chip s-' + q.status + '">' + esc(L().qs[q.status]) + "</span>"; }
  function fchip(q) { return q.status === "open" ? '<span class="chip f-' + q.fu + '">' + esc(L().fs[q.fu]) + "</span>" : ""; }
  function nextReminder(q) { if (q.status !== "open" || q.fu !== "active" || state.schedule.paused) return null; return scheduled(q)[0] || null; }
  function simbar(compact) {
    var t = L();
    return '<div class="simbar"><div class="day"><small>' + esc(t.demoDay) + "</small>" + esc(fdate(today(), true)) + ' <span class="sim-note">' + esc(t.simulated(state.offset)) + "</span></div>" + (compact ? "" : '<span class="grow"></span>') +
      '<button type="button" class="btn primary sm" data-act="day">' + icon("forward") + esc(t.nextDay) + "</button>" +
      '<button type="button" class="btn ghost sm" data-act="reset">' + esc(t.resetSm) + "</button></div>";
  }
  function feed(items) {
    var t = L();
    if (!items.length) return '<p class="empty">' + esc(t.noActivity) + "</p>";
    return '<ul class="feed">' + items.map(function (a) {
      var ic = { created: "plus", reminder: "mail", accepted: "check", declined: "x", info: "help", paused: "pause", resumed: "play", done: "clock", skipped: "forward", cancelled: "stop", expired: "expired" }[a.type] || "mail";
      var cls = { done: "no_response", expired: "no_response", cancelled: "paused" }[a.type] || a.type;
      var label = typeof t.act[a.type] === "function" ? t.act[a.type](a.n) : t.act[a.type];
      var who = a.qid && find(a.qid) ? '<a href="#/quotes/' + esc(a.qid) + '">' + esc(a.name) + "</a>" : esc(a.name);
      return '<li class="t-' + cls + '"><span class="ico">' + icon(ic) + "</span><span>" + esc(label) + " · " + who + "</span><time>" + esc(fdate(a.at, true)) + "</time></li>";
    }).join("") + "</ul>";
  }
  function sortedActivity() { return state.activity.slice().sort(function (a, b) { return a.at === b.at ? b.id - a.id : (a.at < b.at ? 1 : -1); }); }
  var QORDER = ["open", "accepted", "declined", "expired"];
  function pipeline(s, byValue) {
    var t = L(), total = QORDER.reduce(function (sum, k) { return sum + (byValue ? s.by[k].v : s.by[k].n); }, 0);
    if (!total) return '<p class="empty">' + esc(t.q.emptyTitle) + "</p>";
    var label = QORDER.map(function (k) { return t.qs[k] + " " + s.by[k].n; }).join(", ");
    return '<div class="pipe" role="img" aria-label="' + esc(t.pipeline + ": " + label) + '">' + QORDER.map(function (k) { var x = byValue ? s.by[k].v : s.by[k].n; return x ? '<span class="bg-' + k + '" style="width:' + (100 * x / total).toFixed(2) + '%"></span>' : ""; }).join("") + "</div>" +
      '<ul class="legend">' + QORDER.map(function (k) { return '<li><span class="chip s-' + k + '">' + esc(t.qs[k]) + "</span><b>" + s.by[k].n + " · " + esc(money(s.by[k].v)) + "</b></li>"; }).join("") + "</ul>";
  }
  function kpi(label, value, def, accent) { return '<div class="kpi' + (accent ? " accent" : "") + '"><div class="label">' + esc(label) + '</div><div class="value">' + esc(value) + "</div>" + (def ? '<span class="def">' + esc(def) + "</span>" : "") + "</div>"; }
  function notices() {
    var t = L(), h = "";
    if (!storageOK) h += '<div class="notice" role="status">' + icon("alert") + "<span>" + esc(t.storageOff) + "</span></div>";
    if (storageBroken) h += '<div class="notice err" role="status">' + icon("alert") + "<span>" + esc(t.storageBroken) + "</span></div>";
    if (state.schedule.paused) h += '<div class="notice info" role="status">' + icon("pause") + "<span>" + esc(t.globalPaused) + '</span><button type="button" class="btn sm" data-act="unpause">' + esc(t.unpause) + "</button></div>";
    return h;
  }
  function emptyState(title, text, cta) { return '<div class="empty-state">' + icon("inbox") + "<b>" + esc(title) + "</b><span>" + esc(text) + "</span>" + (cta || "") + "</div>"; }

  // ================================================================ views
  function viewOverview() {
    var t = L(), s = stats(), sch = state.schedule;
    var up = [];
    state.quotes.forEach(function (q) { var r = nextReminder(q); if (r && diff(r.due, today()) <= 7) up.push({ q: q, r: r }); });
    up.sort(function (a, b) { return a.r.due < b.r.due ? -1 : 1; });
    var act = state.quotes.filter(needsAction);
    var guideQ = state.quotes.filter(function (q) { return q.status === "open" && q.fu === "active" && sentCount(q) > 0; })[0] || state.quotes[0];
    return notices() + '<div class="page-head"><div><h1>' + esc(t.ov.title) + "</h1><p>" + esc(t.ov.lead(listDays(sch.delays.slice(0, sch.max)))) + '</p></div><span class="sim-note">' + icon("clock") + esc(t.simNote) + "</span></div>" +
      (state.guide && guideQ ? '<section class="card guide" aria-labelledby="g-t"><h2 id="g-t">' + esc(t.guide.title) + '</h2><button type="button" class="btn icon ghost sm close" data-act="guide-off" aria-label="' + esc(t.guide.close) + '">' + icon("x") + "</button><ol>" + t.guide.steps.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ol><p style="margin:.8rem 0 0"><a class="btn primary sm" href="#/quotes/' + esc(guideQ.id) + '">' + esc(t.guide.cta) + '</a></p></section><div style="height:1rem"></div>' : "") +
      '<div class="mobile-sim">' + simbar(false) + "</div>" +
      '<div class="kpis primary">' + kpi(t.kpi.pendingValue, money(s.pendingValue), t.kpi.pendingDef, true) + kpi(t.kpi.acceptedValue, money(s.acceptedValue), t.kpi.acceptedDef) + kpi(t.kpi.responseRate, pct(s.responseRate), t.kpi.responseDef(s.responded, s.total)) + kpi(t.kpi.action, s.action, t.kpi.actionDef) + "</div>" +
      '<div class="kpis secondary">' + kpi(t.kpi.total, s.total) + kpi(t.kpi.open, s.open) + kpi(t.kpi.accepted, s.accepted) + kpi(t.kpi.declined, s.declined) + kpi(t.kpi.expired, s.expired) + "</div>" +
      '<div class="two"><div class="grid">' +
      '<section class="card"><h2>' + esc(t.actionCard) + "</h2>" + (act.length ? '<ul class="action-list">' + act.map(function (q) { return '<li><a href="#/quotes/' + esc(q.id) + '"><b>' + esc(q.customer) + "</b>" + fchip(q) + '<small class="svc">' + esc(q.service) + " · " + esc(money(q.amount)) + "</small></a></li>"; }).join("") + "</ul>" : '<p class="empty">' + esc(t.noAction) + "</p>") + "</section>" +
      '<section class="card"><h2>' + esc(t.upcoming) + '</h2><p class="sub">' + esc(t.upcomingSub) + " · " + esc(t.kpi.sent) + ": " + s.sent + "</p>" +
      (up.length ? '<ul class="feed">' + up.map(function (x) { return '<li class="t-reminder"><span class="ico">' + icon("mail") + '</span><span><a href="#/quotes/' + esc(x.q.id) + '">' + esc(x.q.customer) + "</a> · " + esc(t.tl.names[Math.min(2, x.r.n - 1)]) + "</span><time>" + esc(fdate(x.r.due, true)) + " · " + esc(t.tl.day(x.r.day)) + "</time></li>"; }).join("") + "</ul>" : '<p class="empty">' + esc(t.noUpcoming) + "</p>") + "</section>" +
      '<section class="card"><h2>' + esc(t.pipeline) + '</h2><p class="sub">' + esc(t.pipelineSub) + "</p>" + pipeline(s) + "</section></div>" +
      '<section class="card"><h2>' + esc(t.recent) + "</h2>" + feed(sortedActivity().slice(0, 8)) + (state.activity.length ? '<p style="margin:.6rem 0 0"><a href="#/analytics">' + esc(t.allActivity) + "</a></p>" : "") + "</section></div>";
  }

  function qMatches(q, f) {
    return f === "all" || (f === "pending" && q.status === "open" && (q.fu === "active" || q.fu === "paused")) || (f === "action" && needsAction(q)) || q.status === f;
  }
  function viewQuotes(id) {
    var t = L(), f = state.filter || "all";
    var list = state.quotes.filter(function (q) { return qMatches(q, f); }).sort(function (a, b) { return a.sent < b.sent ? 1 : (a.sent > b.sent ? -1 : b.id.slice(1) - a.id.slice(1)); });
    var sel = id && find(id);
    var head = '<div class="page-head"><div><h1>' + esc(t.q.title) + "</h1><p>" + esc(t.q.lead) + '</p></div><a class="btn primary" href="#/new">' + icon("plus") + esc(t.nav.new) + "</a></div>";
    if (!state.quotes.length) return head + emptyState(t.q.emptyTitle, t.q.emptyText, '<a class="btn primary" href="#/new">' + icon("plus") + esc(t.nav.new) + "</a>");
    var missing = id && !sel ? '<div class="notice err" role="alert">' + icon("alert") + "<span>" + esc(t.q.notFound) + "</span></div>" : "";
    var listHtml = '<div class="toolbar"><div class="seg" role="group" aria-label="Filter">' + ["all", "pending", "action", "accepted", "declined", "expired"].map(function (k) { return '<button type="button" data-filter="' + k + '" aria-pressed="' + (f === k) + '">' + esc(t.filters[k]) + "</button>"; }).join("") + "</div></div>" +
      (list.length ? '<div class="qlist">' + list.map(function (q) {
        var r = nextReminder(q);
        return '<a class="qrow" href="#/quotes/' + esc(q.id) + '"' + (sel && sel.id === q.id ? ' aria-current="true"' : "") + '><span class="name">' + esc(q.customer) + '</span><span class="amt">' + esc(money(q.amount)) + '</span><span class="meta"><span class="ref">' + esc(q.ref) + '</span><span class="svc">' + esc(q.service) + "</span>" + (q.status === "open" ? fchip(q) : qchip(q)) + "<span>" + esc(t.q.reminders) + ": " + sentCount(q) + "/" + q.reminders.length + "</span>" + (r ? '<span class="next">' + esc(t.q.next) + ": " + esc(fdate(r.due, true)) + "</span>" : "") + "</span></a>";
      }).join("") + "</div>" : '<p class="empty">' + esc(t.q.none) + "</p>");
    if (sel && window.matchMedia("(max-width:1099px)").matches) return '<h1 class="vh">' + esc(t.q.title) + '</h1><a class="back" href="#/quotes">' + icon("back") + esc(t.q.back) + "</a>" + notices() + viewDetail(sel);
    return notices() + head + missing + '<div class="quotes-wrap' + (sel ? " has-detail" : "") + '"><div>' + listHtml + "</div>" + (sel ? viewDetail(sel) : "") + "</div>";
  }

  function viewDetail(q) {
    var t = L(), open = q.status === "open", id = esc(q.id);
    var tl = q.reminders.map(function (r) {
      var st = r.state === "scheduled" && (q.fu !== "active" || state.schedule.paused) ? "held" : r.state;
      var label = st === "cancelled" ? (t.tl.reason[r.reason] || t.tl.cancelled) : { sent: t.tl.sent, scheduled: t.tl.scheduled, held: t.tl.held, skipped: t.tl.skipped }[st];
      return '<li class="tl ' + st + '"><span class="dot"></span><div class="tl-head"><b>' + esc(t.tl.day(r.day)) + " · " + esc(t.tl.names[Math.min(2, r.n - 1)]) + '</b><span class="when">' + esc(fdate(r.sentOn || r.due, true)) + '</span><span class="tl-state">' + esc(label) + "</span></div>" +
        '<details class="msg"><summary>' + esc(t.q.openMsg) + "</summary>" + mailHtml(q, r.n) + "</details></li>";
    }).join("");
    var oc = q.status !== "open" ? q.status : (q.fu === "active" ? null : q.fu);
    var outcome = oc && t.outcome[oc] ? '<div class="outcome s-' + ({ done: "no_response", cancelled: "paused", expired: "no_response" }[oc] || oc) + '" role="status">' + icon({ accepted: "check", declined: "x", info: "help", done: "clock", paused: "pause", cancelled: "stop", expired: "expired" }[oc]) + "<span>" + esc(t.outcome[oc]) + "</span></div>" : "";
    var dis = function (c) { return c ? "" : " disabled"; };
    var canFollow = open && (q.fu === "active" || q.fu === "paused" || q.fu === "info");
    return '<section class="card detail" aria-labelledby="d-t"><div class="detail-head"><div><p class="ref" style="margin:0 0 .2rem">' + esc(q.ref) + '</p><h2 id="d-t">' + esc(q.customer) + '</h2><div class="chips"><span class="vh">' + esc(t.q.quoteStatus) + ": </span>" + qchip(q) + (q.status === "open" ? '<span class="vh">' + esc(t.q.fuStatus) + ": </span>" + fchip(q) : "") + "</div></div>" +
      '<div class="detail-actions">' + (open && q.fu === "active" ? '<button type="button" class="btn sm" data-act="pause" data-id="' + id + '">' + icon("pause") + esc(t.q.pause) + "</button>" : "") +
      (open && (q.fu === "paused" || q.fu === "info" || q.fu === "cancelled") ? '<button type="button" class="btn sm" data-act="resume" data-id="' + id + '">' + icon("play") + esc(t.q.resume) + "</button>" : "") +
      (canFollow ? '<button type="button" class="btn sm" data-act="cancel" data-id="' + id + '">' + icon("stop") + esc(t.q.cancel) + "</button>" : "") +
      '<button type="button" class="btn sm ghost icon" data-act="delete" data-id="' + id + '" aria-label="' + esc(t.q.del + ": " + q.customer) + '" title="' + esc(t.q.del) + '">' + icon("trash") + "</button></div></div>" +
      (q.description ? '<p class="desc">' + esc(q.description) + "</p>" : "") +
      '<dl class="facts"><div><dt>' + esc(t.q.amount) + "</dt><dd>" + esc(money(q.amount)) + "</dd></div><div><dt>" + esc(t.q.sentDate) + "</dt><dd>" + esc(fdate(q.sent)) + "</dd></div><div><dt>" + esc(t.q.expires) + "</dt><dd>" + esc(fdate(q.expires)) + "</dd></div>" + (q.phone ? "<div><dt>" + esc(t.q.phone) + "</dt><dd>" + esc(q.phone) + "</dd></div>" : "") + '<div class="wide"><dt>' + esc(t.q.service) + '</dt><dd class="svc">' + esc(q.service) + '</dd></div><div class="wide"><dt>' + esc(t.q.email) + '</dt><dd class="mail-dd">' + esc(q.email) + "</dd></div>" + "</dl>" +
      outcome +
      '<p class="sim-label">' + icon("play") + esc(t.q.simulate) + "</p>" +
      '<div class="sim-actions"><button type="button" class="btn ok" data-act="accepted" data-id="' + id + '"' + dis(open) + ">" + icon("check") + esc(t.q.accept) + '</button><button type="button" class="btn bad" data-act="declined" data-id="' + id + '"' + dis(open) + ">" + icon("x") + esc(t.q.decline) + '</button><button type="button" class="btn info" data-act="info" data-id="' + id + '"' + dis(open && q.fu !== "info") + ">" + icon("help") + esc(t.q.info) + '</button><button type="button" class="btn" data-act="noreply" data-id="' + id + '" title="' + esc(t.q.noReplyHelp) + '"' + dis(open && q.fu === "active" && !state.schedule.paused) + ">" + icon("forward") + esc(t.q.noReply) + "</button></div>" +
      '<h3 style="font-size:.95rem;margin:0 0 .8rem">' + esc(t.q.timeline) + '</h3><ol class="timeline">' + tl + "</ol></section>";
  }

  function schedulePreview(sent, expires) {
    var t = L(), sch = state.schedule;
    if (!isDate(sent)) return '<p class="empty">' + esc(t.nq.previewEmpty) + "</p>";
    return "<ol>" + sch.delays.slice(0, sch.max).map(function (d, i) { var due = add(sent, d), after = isDate(expires) && due > expires; return "<li" + (after ? ' style="text-decoration:line-through"' : "") + ">" + esc(t.tl.day(d)) + " · " + esc(t.tl.names[Math.min(2, i)]) + " — " + esc(fdate(due, true)) + (after ? " (" + esc(t.nq.afterExpiry) + ")" : "") + "</li>"; }).join("") + "</ol>";
  }
  function field(k, label, input, help, e, optional) { var t = L(); return '<div class="field"><label for="f-' + k + '">' + esc(label) + (optional ? ' <span class="opt">' + esc(t.nq.opt) + "</span>" : "") + "</label>" + input + (help ? '<span class="help" id="h-' + k + '">' + esc(help) + "</span>" : "") + (e[k] ? '<span class="err" id="e-' + k + '">' + esc(e[k]) + "</span>" : "") + "</div>"; }
  function aria(k, help, e) { var ids = [help ? "h-" + k : "", e[k] ? "e-" + k : ""].filter(Boolean).join(" "); return (e[k] ? ' aria-invalid="true"' : "") + (ids ? ' aria-describedby="' + ids + '"' : ""); }
  function errSummary(e, title) { var keys = Object.keys(e); return keys.length ? '<div class="err-summary" role="alert" tabindex="-1" id="errSum"><b>' + esc(title) + "</b><ul>" + keys.map(function (k) { return '<li><a href="#f-' + k + '">' + esc(e[k]) + "</a></li>"; }).join("") + "</ul></div>" : ""; }

  var draftRef = null;
  function viewNew(err, vals) {
    var t = L(), e = err || {};
    if (!vals) draftRef = null;
    if (!draftRef) { draftRef = L().refPrefix + "-" + REAL_TODAY.slice(0, 4) + "-" + String(state.refSeq + 1).padStart(3, "0"); }
    var v = vals || { status: "active", sent: today(), expires: add(today(), 30), ref: draftRef };
    var F = function (k, label, input, help, opt) { return field(k, label, input, help, e, opt); };
    return notices() + '<div class="page-head"><div><h1>' + esc(t.nq.title) + "</h1><p>" + esc(t.nq.lead) + "</p></div></div>" +
      '<div class="two"><form class="form card" id="newForm" novalidate>' + errSummary(e, t.nq.errTitle) +
      '<h2 style="font-size:1rem;margin:0">' + esc(t.nq.sCustomer) + "</h2>" +
      F("customer", t.nq.name, '<input id="f-customer" name="customer" autocomplete="off" maxlength="60" value="' + esc(v.customer || "") + '"' + aria("customer", false, e) + ">") +
      '<div class="row">' + F("email", t.nq.email, '<input id="f-email" name="email" type="email" autocomplete="off" inputmode="email" value="' + esc(v.email || "") + '" placeholder="namn@example.com"' + aria("email", true, e) + ">", t.nq.emailHelp) +
      F("phone", t.nq.phone, '<input id="f-phone" name="phone" type="tel" autocomplete="off" inputmode="tel" value="' + esc(v.phone || "") + '"' + aria("phone", true, e) + ">", t.nq.phoneHelp, true) + "</div>" +
      '<h2 style="font-size:1rem;margin:.4rem 0 0">' + esc(t.nq.sQuote) + "</h2>" +
      '<div class="row">' + F("service", t.nq.service, '<select id="f-service" name="service"' + aria("service", false, e) + '><option value="">' + esc(t.nq.choose) + "</option>" + t.services.map(function (s) { return "<option" + (v.service === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>") +
      F("ref", t.nq.ref, '<input id="f-ref" name="ref" autocomplete="off" maxlength="20" value="' + esc(v.ref || "") + '"' + aria("ref", true, e) + ">", t.nq.refHelp) + "</div>" +
      F("desc", t.nq.desc, '<textarea id="f-desc" name="desc" maxlength="300" rows="3"' + aria("desc", true, e) + ">" + esc(v.desc || "") + "</textarea>", t.nq.descHelp, true) +
      '<div class="row3">' + F("amount", t.nq.amount, '<input id="f-amount" name="amount" inputmode="decimal" autocomplete="off" value="' + esc(v.amount || "") + '"' + aria("amount", true, e) + ">", t.nq.amountHelp(state.settings.currency)) +
      F("sent", t.nq.date, '<input id="f-sent" name="sent" type="date" max="' + today() + '" min="' + add(today(), -30) + '" value="' + esc(v.sent || "") + '"' + aria("sent", false, e) + ">") +
      F("expires", t.nq.expires, '<input id="f-expires" name="expires" type="date" value="' + esc(v.expires || "") + '"' + aria("expires", true, e) + ">", t.nq.expiresHelp) + "</div>" +
      '<fieldset class="field" style="border:0;padding:0;margin:0"><legend style="font-weight:600;font-size:.88rem;margin-bottom:.35rem">' + esc(t.nq.statusLabel) + '</legend><div class="radio-row"><label><input type="radio" name="status" value="active"' + (v.status !== "paused" ? " checked" : "") + ">" + esc(t.nq.statusActive) + '</label><label><input type="radio" name="status" value="paused"' + (v.status === "paused" ? " checked" : "") + ">" + esc(t.nq.statusPaused) + "</label></div></fieldset>" +
      '<div class="form-actions"><button class="btn primary" type="submit">' + icon("check") + esc(t.nq.save) + "</button></div></form>" +
      '<div class="preview" aria-live="polite" id="schedPrev"><h2 style="font-size:1rem">' + esc(t.nq.preview) + '</h2><div id="schedList">' + schedulePreview(v.sent, v.expires) + '</div><p class="foot-note" style="margin-top:.8rem">' + esc(t.q.nosend) + "</p></div></div>";
  }

  function viewAnalytics() {
    var t = L(), s = stats(), maxT = Math.max.apply(null, s.timing) || 1;
    return notices() + '<div class="page-head"><div><h1>' + esc(t.an.title) + "</h1><p>" + esc(t.an.lead) + '</p></div><span class="sim-note">' + icon("clock") + esc(t.simNote) + "</span></div>" +
      '<div class="kpis">' + kpi(t.kpi.totalValue, money(s.totalValue), t.kpi.totalValueDef) + kpi(t.kpi.pendingValue, money(s.pendingValue), t.kpi.pendingDef, true) + kpi(t.kpi.acceptedValue, money(s.acceptedValue), t.kpi.acceptedDef) +
      kpi(t.kpi.responseRate, pct(s.responseRate), t.kpi.responseDef(s.responded, s.total)) + kpi(t.kpi.completion, pct(s.completion), t.kpi.completionDef(s.sent, s.planned)) + kpi(t.kpi.afterReminder, s.responded ? pct(s.afterReminder / s.responded) : "–", t.kpi.afterDef(s.afterReminder, s.responded)) + "</div>" +
      '<div class="two"><div class="grid"><section class="card"><h2>' + esc(t.an.value) + "</h2>" + pipeline(s, true) + '<div class="stat-row" style="margin-top:1rem"><span>' + esc(t.kpi.rate) + " <small style=\"color:var(--faint)\">(" + esc(t.kpi.rateDef) + ")</small></span><b>" + pct(s.rate) + "</b></div></section>" +
      '<section class="card"><h2>' + esc(t.an.timing) + '</h2><p class="sub">' + esc(t.an.timingSub) + "</p>" + (s.responded ? s.timing.map(function (n, i) { return '<div class="stat-row"><span>' + esc(t.an.timingLabel(i)) + "</span><b>" + n + '</b></div><div class="meter" role="img" aria-label="' + esc(t.an.timingLabel(i) + ": " + n) + '"><span style="width:' + (100 * n / maxT).toFixed(1) + '%' + (i ? "" : ";background:var(--idle)") + '"></span></div>'; }).join("") : '<p class="empty">' + esc(t.an.noData) + "</p>") + "</section>" +
      '<section class="card"><h2>' + esc(t.kpi.completion) + '</h2><div class="stat-row"><span>' + esc(t.kpi.sent) + "</span><b>" + s.sent + " / " + s.planned + '</b></div><div class="meter" role="img" aria-label="' + esc(t.kpi.completionDef(s.sent, s.planned)) + '"><span style="width:' + (100 * s.completion).toFixed(1) + '%"></span></div></section>' +
      '<p class="foot-note">' + esc(t.an.disclaimer) + "</p></div>" +
      '<section class="card"><h2>' + esc(t.an.history) + "</h2>" + feed(sortedActivity().slice(0, 30)) + "</section></div>";
  }

  // ---------------- settings
  var tplTab = 1, tplPreviewQ = null;
  function viewSettings(tab, err, vals) {
    var t = L(), S = t.set, e = err || {};
    tab = ["company", "schedule", "templates"].indexOf(tab) >= 0 ? tab : "company";
    var tabs = '<nav class="tabs" aria-label="' + esc(S.title) + '">' + ["company", "schedule", "templates"].map(function (k) { return '<a href="#/settings/' + k + '"' + (tab === k ? ' aria-current="page"' : "") + ">" + esc(S.tabs[k]) + "</a>"; }).join("") + "</nav>";
    var head = notices() + '<div class="page-head"><div><h1>' + esc(S.title) + "</h1><p>" + esc(S.lead) + "</p></div></div>" + tabs;
    var F = function (k, label, input, help) { return field(k, label, input, help, e); };
    if (tab === "company") {
      var st = vals || state.settings;
      return head + '<form class="form card" id="companyForm" novalidate style="max-width:46rem">' + errSummary(e, t.nq.errTitle) + '<h2 style="font-size:1.05rem;margin:0">' + esc(S.company) + "</h2>" +
        F("cname", S.name, '<input id="f-cname" name="cname" maxlength="80" autocomplete="organization" value="' + esc(st.company) + '"' + aria("cname", false, e) + ">") +
        '<div class="field"><span style="font-weight:600;font-size:.88rem" id="logo-l">' + esc(S.logo) + '</span><div class="logo-box"><div class="prev' + (state.settings.logo ? "" : " none") + '">' + (state.settings.logo ? '<img src="' + esc(state.settings.logo) + '" alt="' + esc(S.logo + ": " + state.settings.company) + '">' : esc(S.noLogo)) + '</div><label class="btn sm file-btn">' + icon("upload") + esc(S.upload) + '<input type="file" id="f-logo" accept="image/png,image/jpeg,image/webp,image/svg+xml" aria-describedby="h-logo"></label>' + (state.settings.logo ? '<button type="button" class="btn sm ghost" data-act="logo-remove">' + esc(S.removeLogo) + "</button>" : "") + '</div><span class="help" id="h-logo">' + esc(S.logoHelp) + '</span><span class="err" id="e-logo" role="alert"></span></div>' +
        '<div class="row">' + F("cemail", S.email, '<input id="f-cemail" name="cemail" type="email" maxlength="80" value="' + esc(st.email) + '"' + aria("cemail", true, e) + ">", S.emailHelp) + F("cphone", S.phone, '<input id="f-cphone" name="cphone" type="tel" maxlength="20" value="' + esc(st.phone) + '"' + aria("cphone", false, e) + ">") + "</div>" +
        F("caddress", S.address, '<input id="f-caddress" name="caddress" maxlength="120" autocomplete="off" value="' + esc(st.address) + '"' + aria("caddress", false, e) + ">") +
        F("csender", S.sender, '<input id="f-csender" name="csender" maxlength="40" value="' + esc(st.sender) + '"' + aria("csender", true, e) + ">", S.senderHelp) +
        '<div class="row">' + F("clang", S.lang, '<select id="f-clang" name="clang"><option value="sv"' + (st.lang === "sv" ? " selected" : "") + '>Svenska</option><option value="en"' + (st.lang === "en" ? " selected" : "") + ">English</option></select>") +
        F("ccur", S.currency, '<select id="f-ccur" name="ccur" aria-describedby="h-ccur">' + CURRENCIES.map(function (c) { return "<option" + (st.currency === c ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select>", S.currencyHelp) + "</div>" +
        '<div class="form-actions"><button class="btn primary" type="submit">' + icon("check") + esc(S.save) + "</button></div></form>";
    }
    if (tab === "schedule") {
      var sc = vals || state.schedule;
      var delayInputs = [0, 1, 2].map(function (i) { var on = i < +sc.max; return '<div class="field"><label for="f-d' + i + '">' + esc(S.delay(i + 1)) + '</label><input id="f-d' + i + '" name="d' + i + '" type="number" min="1" max="60" step="1" inputmode="numeric" value="' + esc(sc.delays[i] == null ? "" : sc.delays[i]) + '"' + (on ? "" : " disabled") + aria("d" + i, false, e) + ">" + (e["d" + i] ? '<span class="err" id="e-d' + i + '">' + esc(e["d" + i]) + "</span>" : "") + "</div>"; }).join("");
      var vis = function (sc2) { var d = sc2.delays.slice(0, +sc2.max).map(Number); if (d.some(isNaN)) return ""; var last = d[d.length - 1] + Number(sc2.noResponseAfter); return '<div class="sched-visual" aria-hidden="true"><span class="node start"><i></i>' + esc(S.start) + "</span>" + d.map(function (x) { return '<span class="bar"></span><span class="node"><i></i>' + esc(t.tl.day(x)) + "</span>"; }).join("") + (isNaN(last) ? "" : '<span class="bar"></span><span class="node end"><i></i>' + esc(S.end) + " · " + esc(t.tl.day(last)) + "</span>") + "</div>"; };
      return head + '<div class="two"><form class="form card" id="scheduleForm" novalidate>' + errSummary(e, t.nq.errTitle) + '<h2 style="font-size:1.05rem;margin:0">' + esc(S.sched) + '</h2><p class="help" style="margin:0">' + esc(S.schedLead) + "</p>" +
        F("max", S.max, '<select id="f-max" name="max">' + [1, 2, 3].map(function (n) { return '<option value="' + n + '"' + (+sc.max === n ? " selected" : "") + ">" + n + "</option>"; }).join("") + "</select>") +
        '<div class="delays">' + delayInputs + "</div>" +
        F("noresp", S.noResp, '<input id="f-noresp" name="noresp" type="number" min="1" max="30" step="1" inputmode="numeric" value="' + esc(sc.noResponseAfter) + '"' + aria("noresp", false, e) + ">") +
        '<div class="field"><label class="switch"><input type="checkbox" role="switch" name="paused" id="f-paused"' + (sc.paused ? " checked" : "") + ' aria-describedby="h-paused">' + esc(S.pause) + '</label><span class="help" id="h-paused">' + esc(S.pauseHelp) + "</span></div>" +
        '<div class="form-actions"><button class="btn primary" type="submit">' + icon("check") + esc(S.saveSched) + '</button><button class="btn ghost" type="button" data-act="sched-reset">' + esc(S.resetSched) + "</button></div></form>" +
        '<section class="card"><h2>' + esc(S.visual) + '</h2><div id="schedVis">' + vis(sc) + "</div></section></div>";
    }
    // templates
    var n = tplTab, lang = state.settings.lang, tp = vals || template(n, lang);
    if (!find(tplPreviewQ)) tplPreviewQ = (state.quotes.filter(function (q) { return q.status === "open"; })[0] || state.quotes[0] || {}).id || null;
    var unk = unknownPh(tp.s + " " + tp.b);
    var pq = find(tplPreviewQ);
    var prevHtml = pq ? (function () { var saved = state.templates[lang]; var tmp = (saved || T[lang].tpls).slice(); tmp[n - 1] = { s: tp.s, b: tp.b }; state.templates[lang] = tmp; var h = mailHtml(pq, n, true); state.templates[lang] = saved; return h; })() : '<p class="empty">' + esc(S.noQuotes) + "</p>";
    return head + '<div class="seg tpl" role="group" aria-label="' + esc(S.tpl) + '" style="margin-bottom:1rem">' + [1, 2, 3].map(function (k) { return '<button type="button" data-tpl="' + k + '" aria-pressed="' + (k === n) + '">' + esc(S.tplFor(k)) + "</button>"; }).join("") + "</div>" +
      '<div class="tpl-grid"><form class="form card" id="tplForm" novalidate style="max-width:none">' + errSummary(e, t.nq.errTitle) + '<p class="help" style="margin:0">' + esc(S.tplLead) + "</p>" +
      F("tsub", S.subject, '<input id="f-tsub" name="tsub" maxlength="120" value="' + esc(tp.s) + '"' + aria("tsub", false, e) + ">") +
      F("tbody", S.body, '<textarea id="f-tbody" name="tbody" rows="12" maxlength="2000"' + aria("tbody", false, e) + ">" + esc(tp.b) + "</textarea>") +
      '<div class="field"><span style="font-weight:600;font-size:.88rem">' + esc(S.fields) + '</span><div class="ph">' + PH.map(function (p) { return '<button type="button" data-ph="' + p + '" title="' + esc(t.phLabels[p]) + '" aria-label="' + esc(t.phLabels[p] + " {" + p + "}") + '">{' + p + "}</button>"; }).join("") + "</div></div>" +
      '<p class="unknown-ph" id="unk" aria-live="polite">' + unk.map(function (u) { return esc(S.unknown(u)); }).join("<br>") + "</p>" +
      '<div class="form-actions"><button class="btn primary" type="submit">' + icon("check") + esc(S.saveTpl) + '</button><button class="btn ghost" type="button" data-act="tpl-reset">' + esc(S.resetTpl) + "</button></div></form>" +
      '<section class="card" aria-labelledby="pv-t"><h2 id="pv-t">' + esc(S.preview) + "</h2>" + (state.quotes.length ? '<div class="field" style="margin-bottom:.8rem"><label for="f-pq">' + esc(S.previewFor) + '</label><select id="f-pq">' + state.quotes.map(function (q) { return '<option value="' + esc(q.id) + '"' + (q.id === tplPreviewQ ? " selected" : "") + ">" + esc(q.ref + " · " + q.customer) + "</option>"; }).join("") + "</select></div>" : "") + '<div id="tplPrev">' + prevHtml + "</div></section></div>";
  }

  // ================================================================ shell
  var lastRoute = "";
  function route() { var h = location.hash.replace(/^#\/?/, "").split("/"); return { view: h[0] || "overview", id: h[1] || null }; }
  function renderNav() {
    var t = L(), r = route().view, st = state.settings;
    var html = ["overview", "quotes", "new", "analytics", "settings"].map(function (k) { return '<a href="#/' + k + '"' + (r === k ? ' aria-current="page"' : "") + ">" + icon(k) + "<span>" + esc(t.nav[k]) + "</span></a>"; }).join("");
    $("#sideNav").innerHTML = html; $("#bottomNav").innerHTML = html;
    $("#sideNav").setAttribute("aria-label", t.menu); $("#bottomNav").setAttribute("aria-label", t.menu);
    $("#sideSim").innerHTML = '<a class="co" href="#/settings/company" style="text-decoration:none;color:inherit;margin-bottom:.8rem">' + (st.logo ? '<img src="' + esc(st.logo) + '" alt="">' : '<span class="mono" aria-hidden="true">' + esc(st.company.trim().charAt(0).toUpperCase()) + "</span>") + "<span><b>" + esc(st.company) + "</b><small>" + esc(t.nav.settings) + "</small></span></a>" + simbar(true);
  }
  function renderChrome() {
    var t = L();
    document.documentElement.lang = state.settings.lang;
    document.title = (state.settings.lang === "sv" ? "Vexari Offertuppföljning – demo" : "Vexari Quote Follow-up – demo");
    document.querySelectorAll("[data-i18n]").forEach(function (el) { var k = el.getAttribute("data-i18n"); if (typeof t[k] === "string") el.textContent = t[k]; });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === state.settings.lang)); });
    var unread = state.notifs.filter(function (n) { return !n.read; }).length, dot = $("#bellDot");
    dot.hidden = !unread; dot.textContent = unread;
    $("#bellBtn").setAttribute("aria-label", t.notifications + (unread ? " (" + unread + ")" : ""));
  }
  function render(focus) {
    var r = route(), view = $("#view"), html;
    if (r.view === "quotes") html = viewQuotes(r.id);
    else if (r.view === "new") html = viewNew();
    else if (r.view === "analytics") html = viewAnalytics();
    else if (r.view === "settings") html = viewSettings(r.id);
    else html = viewOverview();
    view.innerHTML = html + '<p class="foot-note">' + esc(L().foot) + "</p>";
    var ms = view.querySelector(".mobile-sim"); if (ms && window.matchMedia("(min-width:1024px)").matches) ms.remove();
    renderNav(); renderChrome();
    var key = r.view + "/" + (r.id || "");
    if (focus !== false && key !== lastRoute && lastRoute) { view.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    lastRoute = key;
  }
  function rerender(html) { $("#view").innerHTML = html + '<p class="foot-note">' + esc(L().foot) + "</p>"; renderChrome(); var s = $("#errSum"); if (s) s.focus(); }
  var toastTimer;
  function toast(msg) {
    var old = document.querySelector(".toast"); if (old) old.remove();
    var el = document.createElement("div"); el.className = "toast"; el.setAttribute("aria-hidden", "true"); el.textContent = msg; document.body.appendChild(el);
    $("#live").textContent = ""; setTimeout(function () { $("#live").textContent = msg; }, 30);
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.remove(); }, 3400);
  }
  function changed() { state.pristine = false; save(); render(false); }
  function find(id) { return id ? state.quotes.filter(function (q) { return q.id === id; })[0] : null; }

  var drawerReturn = null;
  function openDrawer() {
    var t = L(), list = state.notifs.slice().sort(function (a, b) { return b.id - a.id; });
    $("#drawerPanel").innerHTML = '<div class="dh"><h2 id="drawerTitle" style="font-size:1.1rem">' + esc(t.notif.title) + '</h2><button type="button" class="btn icon ghost" data-act="close-drawer" aria-label="' + esc(t.notif.close) + '">' + icon("x") + "</button></div>" +
      '<p class="foot-note" style="margin:0 0 .9rem">' + esc(t.notif.note) + "</p>" +
      (list.length ? list.map(function (n) { return '<div class="notif' + (n.read ? "" : " unread") + '"><time>' + esc(fdate(n.at, true)) + "</time><p><b>" + esc(n.name) + "</b> " + esc(t.notif[n.type]) + "</p>" + (find(n.qid) ? '<a href="#/quotes/' + esc(n.qid) + '" data-act="close-drawer">' + esc(t.notif.open) + "</a>" : "") + "</div>"; }).join("") : emptyState(t.notif.none, ""));
    drawerReturn = document.activeElement;
    $("#drawer").hidden = false;
    state.notifs.forEach(function (n) { n.read = true; }); save(); renderChrome();
    $("#drawerPanel button").focus();
  }
  function closeDrawer() { $("#drawer").hidden = true; (drawerReturn && document.contains(drawerReturn) ? drawerReturn : $("#bellBtn")).focus(); }

  // ================================================================ forms
  function formVals(form) { var v = {}; new FormData(form).forEach(function (val, k) { v[k] = String(val); }); return v; }
  function validateQuote(v) {
    var e = {}, t = L().nq.e, name = (v.customer || "").trim();
    if (name.length < 2 || name.length > 60) e.customer = t.name;
    var em = (v.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)) e.email = t.email; else if (!fictionalEmail(em)) e.email = t.emailDemo;
    if (v.phone && !PHONE_RE.test(v.phone.trim())) e.phone = t.phone;
    if (!v.service) e.service = t.service;
    var ref = (v.ref || "").trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9-]{2,19}$/.test(ref)) e.ref = t.ref; else if (state.quotes.some(function (q) { return q.ref === ref; })) e.ref = t.refDup;
    if ((v.desc || "").length > 300) e.desc = t.desc;
    var amt = Number(String(v.amount || "").replace(/[\s ]/g, "").replace(",", "."));
    if (!isFinite(amt) || amt <= 0 || amt > 1e7) e.amount = t.amount;
    if (!isDate(v.sent)) e.sent = t.date; else if (v.sent > today()) e.sent = t.future; else if (v.sent < add(today(), -30)) e.sent = t.old;
    if (!isDate(v.expires)) e.expires = t.expires;
    else if (isDate(v.sent) && v.expires < v.sent) e.expires = t.expBefore;
    else if (v.expires < today()) e.expires = t.expPast;
    else if (isDate(v.sent) && diff(v.expires, v.sent) > 365) e.expires = t.expFar;
    return { e: e, amount: Math.round(amt), ref: ref };
  }
  function submitNew(form) {
    var v = formVals(form), res = validateQuote(v);
    if (Object.keys(res.e).length) return rerender(viewNew(res.e, v));
    var q = makeQuote({ customer: v.customer.trim(), email: v.email.trim().toLowerCase(), phone: (v.phone || "").trim(), service: v.service, description: (v.desc || "").trim(), ref: res.ref, amount: res.amount, sent: v.sent, expires: v.expires, paused: v.status === "paused" });
    if (res.ref === draftRef) state.refSeq++;
    draftRef = null;
    log("created", q, v.sent);
    // a quote entered late: send only the latest overdue reminder today, skip earlier overdue ones
    var overdue = q.reminders.filter(function (r) { return r.state === "scheduled" && r.due < today(); });
    if (overdue.length) { overdue.slice(0, -1).forEach(function (r) { r.state = "skipped"; }); overdue[overdue.length - 1].due = today(); if (overdue.length > 1) log("skipped", q); }
    if (q.fu === "paused") log("paused", q); else processQuote(q, today());
    state.pristine = false; save();
    location.hash = "#/quotes/" + q.id;
    toast(L().nq.saved);
  }
  function submitCompany(form) {
    var v = formVals(form), S = L().set.e, e = {};
    var vals = { company: (v.cname || "").trim(), email: (v.cemail || "").trim(), phone: (v.cphone || "").trim(), address: (v.caddress || "").trim(), sender: (v.csender || "").trim(), lang: v.clang === "en" ? "en" : "sv", currency: CURRENCIES.indexOf(v.ccur) >= 0 ? v.ccur : "SEK" };
    if (vals.company.length < 2 || vals.company.length > 80) e.cname = S.name;
    if (!fictionalEmail(vals.email)) e.cemail = S.email;
    if (!PHONE_RE.test(vals.phone)) e.cphone = S.phone;
    if (vals.address.length > 120) e.caddress = S.address;
    if (vals.sender.length < 2 || vals.sender.length > 40) e.csender = S.sender;
    if (Object.keys(e).length) return rerender(viewSettings("company", e, vals));
    vals.logo = state.settings.logo;
    var langChanged = vals.lang !== state.settings.lang;
    state.settings = vals; state.pristine = false;
    save(); render(false); if (langChanged) renderNav(); toast(L().toast.saved);
  }
  function validateSchedule(v) {
    var S = L().set.e, e = {}, max = Math.min(3, Math.max(1, parseInt(v.max, 10) || 3)), d = [];
    for (var i = 0; i < 3; i++) {
      var raw = v["d" + i], n = Number(raw);
      d.push(raw === undefined || raw === "" ? (state.schedule.delays[i] || "") : n);
      if (i < max) {
        if (!/^\d+$/.test(String(raw || "")) || n < 1 || n > 60) e["d" + i] = S.delayInt;
        else if (i > 0 && !e["d" + (i - 1)] && n <= d[i - 1]) e["d" + i] = S.delayOrder;
      }
    }
    var nr = Number(v.noresp);
    if (!/^\d+$/.test(String(v.noresp || "")) || nr < 1 || nr > 30) e.noresp = S.noResp;
    return { e: e, sched: { delays: d.map(function (x) { return x === "" ? x : Number(x); }), max: max, noResponseAfter: v.noresp === "" ? "" : nr, paused: v.paused === "on" } };
  }
  function submitSchedule(form) {
    var v = formVals(form), res = validateSchedule(v);
    if (Object.keys(res.e).length) return rerender(viewSettings("schedule", res.e, res.sched));
    var wasPaused = state.schedule.paused;
    state.schedule = { delays: res.sched.delays.map(function (x, i) { return x === "" ? [2, 5, 10][i] : x; }), max: res.sched.max, noResponseAfter: res.sched.noResponseAfter, paused: res.sched.paused };
    if (wasPaused && !state.schedule.paused) unpauseAll();
    changed(); toast(L().toast.saved);
  }
  function unpauseAll() { state.schedule.paused = false; state.quotes.forEach(function (q) { if (q.status === "open" && q.fu === "active") { var p = scheduled(q); if (p.length && p[0].due <= today()) { var sh = diff(today(), p[0].due) + 1; p.forEach(function (r) { r.due = add(r.due, sh); if (r.due > q.expires) { r.state = "cancelled"; r.reason = "expiry"; } }); } } }); }
  function submitTemplate(form) {
    var v = formVals(form), S = L().set.e, e = {}, s = (v.tsub || "").trim(), b = (v.tbody || "").trim();
    if (s.length < 3 || s.length > 120) e.tsub = S.subject;
    if (b.length < 20 || b.length > 2000) e.tbody = S.body;
    if (Object.keys(e).length) return rerender(viewSettings("templates", e, { s: v.tsub || "", b: v.tbody || "" }));
    var lang = state.settings.lang, cur = (state.templates[lang] || T[lang].tpls).map(function (x, i) { x = x || T[lang].tpls[i]; return { s: x.s, b: x.b }; });
    cur[tplTab - 1] = { s: s, b: b }; state.templates[lang] = cur;
    changed(); toast(L().set.tplSaved);
  }
  function readLogo(input) {
    var S = L().set.e, f = input.files && input.files[0], out = $("#e-logo");
    var fail = function (m) { out.textContent = m; input.value = ""; };
    if (!f) return;
    if (["image/png", "image/jpeg", "image/webp", "image/svg+xml"].indexOf(f.type) < 0) return fail(S.logoType);
    if (f.size > LOGO_MAX) return fail(S.logoSize);
    var fr = new FileReader();
    fr.onerror = function () { fail(S.logoRead); };
    fr.onload = function () {
      var prev = state.settings.logo; state.settings.logo = String(fr.result); state.pristine = false;
      if (!save()) { state.settings.logo = prev; return fail(S.logoStore); }
      render(false); toast(L().toast.saved);
    };
    fr.readAsDataURL(f);
  }

  // live updates while typing
  function refreshTplPreview() {
    var form = $("#tplForm"); if (!form) return;
    var s = $("#f-tsub").value, b = $("#f-tbody").value, lang = state.settings.lang, pq = find(tplPreviewQ), S = L().set;
    $("#unk").innerHTML = unknownPh(s + " " + b).map(function (u) { return esc(S.unknown(u)); }).join("<br>");
    if (!pq) return;
    var saved = state.templates[lang], tmp = (saved || T[lang].tpls).slice(); tmp[tplTab - 1] = { s: s, b: b }; state.templates[lang] = tmp;
    $("#tplPrev").innerHTML = mailHtml(pq, tplTab, true); state.templates[lang] = saved;
  }

  // ================================================================ events
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act],[data-lang],[data-filter],[data-tpl],[data-ph],#bellBtn,#resetBtn");
    if (!b) { if (ev.target.id === "drawer") closeDrawer(); return; }
    var t = L();
    if (b.id === "bellBtn") return openDrawer();
    if (b.id === "resetBtn" || b.getAttribute("data-act") === "reset") {
      if (window.confirm(t.resetConfirm)) { var g = state.settings.lang; try { localStorage.removeItem(KEY); } catch (e) { } storageBroken = false; tplTab = 1; tplPreviewQ = null; seed(g); render(); toast(L().toast.reset); }
      return;
    }
    if (b.hasAttribute("data-lang")) {
      var lang = b.getAttribute("data-lang"); if (lang === state.settings.lang) return;
      if (state.pristine) { var g2 = state.guide; seed(lang); state.guide = g2; } else state.settings.lang = lang;
      tplPreviewQ = null; save(); render(false); return;
    }
    if (b.hasAttribute("data-filter")) { state.filter = b.getAttribute("data-filter"); save(); render(false); return; }
    if (b.hasAttribute("data-tpl")) { tplTab = +b.getAttribute("data-tpl"); render(false); var bt = $('[data-tpl="' + tplTab + '"]'); if (bt) bt.focus(); return; }
    if (b.hasAttribute("data-ph")) {
      var ta = document.activeElement && (document.activeElement.id === "f-tsub") ? $("#f-tsub") : (lastTplField || $("#f-tbody"));
      var token = "{" + b.getAttribute("data-ph") + "}", st = ta.selectionStart == null ? ta.value.length : ta.selectionStart, en = ta.selectionEnd == null ? st : ta.selectionEnd;
      ta.value = ta.value.slice(0, st) + token + ta.value.slice(en); ta.focus(); ta.setSelectionRange(st + token.length, st + token.length); refreshTplPreview(); return;
    }
    var act = b.getAttribute("data-act"), q = find(b.getAttribute("data-id"));
    if (act === "close-drawer") { closeDrawer(); return; }
    if (act === "guide-off") { state.guide = false; save(); render(false); return; }
    if (act === "day") { state.offset++; var n = processAll(); changed(); toast(t.toast.day(n)); return; }
    if (act === "unpause") { unpauseAll(); changed(); toast(t.toast.gpOff); return; }
    if (act === "sched-reset") { state.schedule = { delays: [2, 5, 10], max: 3, noResponseAfter: 4, paused: state.schedule.paused }; changed(); toast(t.toast.saved); return; }
    if (act === "tpl-reset") { var lg = state.settings.lang; if (state.templates[lg]) { state.templates[lg][tplTab - 1] = null; if (state.templates[lg].every(function (x) { return !x; })) state.templates[lg] = null; } changed(); toast(t.set.tplReset); return; }
    if (act === "logo-remove") { state.settings.logo = null; changed(); toast(t.toast.saved); return; }
    if (!q) return;
    if (act === "accepted" || act === "declined" || act === "info") { respond(q, act); changed(); toast(t.toast[act]); }
    else if (act === "pause") { q.fu = "paused"; log("paused", q); changed(); toast(t.toast.paused); }
    else if (act === "resume") { resume(q); changed(); toast(t.toast.resumed); }
    else if (act === "cancel") { if (window.confirm(t.q.cancelConfirm)) { q.fu = "cancelled"; cancelScheduled(q, "manual"); log("cancelled", q); changed(); toast(t.toast.cancelled); } }
    else if (act === "noreply") {
      var r = nextReminder(q), target;
      if (r) target = r.due; else { var ls = lastSent(q); target = ls ? add(ls, q.noResp) : add(today(), 1); }
      if (target > q.expires) target = add(q.expires, 1);
      state.offset += Math.max(1, diff(target, today()));
      var sent = processAll(); changed(); toast(t.toast.day(sent));
    }
    else if (act === "delete") {
      if (window.confirm(t.q.delConfirm)) {
        state.quotes = state.quotes.filter(function (x) { return x !== q; });
        state.activity = state.activity.filter(function (a) { return a.qid !== q.id; });
        state.notifs = state.notifs.filter(function (n) { return n.qid !== q.id; });
        state.pristine = false; save();
        if (location.hash === "#/quotes") render(false); else location.hash = "#/quotes";
        toast(t.q.deleted);
      }
    }
  });
  var lastTplField = null;
  document.addEventListener("focusin", function (ev) { if (ev.target.id === "f-tsub" || ev.target.id === "f-tbody") lastTplField = ev.target; });
  document.addEventListener("submit", function (ev) {
    var id = ev.target.id; if (!/^(newForm|companyForm|scheduleForm|tplForm)$/.test(id)) return;
    ev.preventDefault();
    if (id === "newForm") submitNew(ev.target); else if (id === "companyForm") submitCompany(ev.target); else if (id === "scheduleForm") submitSchedule(ev.target); else submitTemplate(ev.target);
  });
  document.addEventListener("input", function (ev) {
    var id = ev.target.id;
    if (id === "f-sent" || id === "f-expires") {
      var s = $("#f-sent").value, x = $("#f-expires");
      if (id === "f-sent" && isDate(s) && x && !x.dataset.touched) x.value = add(s, 30);
      if (id === "f-expires") x.dataset.touched = "1";
      $("#schedList").innerHTML = schedulePreview(s, x ? x.value : "");
    }
    if (id === "f-tsub" || id === "f-tbody") refreshTplPreview();
    if (/^f-(max|d[0-2]|noresp)$/.test(id)) {
      var f = $("#scheduleForm"), mx = +$("#f-max").value;
      [0, 1, 2].forEach(function (i) { $("#f-d" + i).disabled = i >= mx; });
      var res = validateSchedule(formVals(f));
      var vis = $("#schedVis"); if (vis) { var tmp = viewSettings("schedule", null, res.sched); var m = /<div id="schedVis">([\s\S]*?)<\/div><\/section>/.exec(tmp); vis.innerHTML = m && !Object.keys(res.e).length ? m[1] : vis.innerHTML; }
    }
  });
  document.addEventListener("change", function (ev) {
    if (ev.target.id === "f-logo") readLogo(ev.target);
    if (ev.target.id === "f-pq") { tplPreviewQ = ev.target.value; refreshTplPreview(); }
    if (ev.target.id === "f-max") ev.target.dispatchEvent(new Event("input", { bubbles: true }));
  });
  document.addEventListener("keydown", function (ev) {
    var d = $("#drawer");
    if (d.hidden) return;
    if (ev.key === "Escape") { closeDrawer(); return; }
    if (ev.key === "Tab") { var f = d.querySelectorAll("a[href],button"); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (ev.shiftKey && document.activeElement === a) { ev.preventDefault(); z.focus(); } else if (!ev.shiftKey && document.activeElement === z) { ev.preventDefault(); a.focus(); } }
  });
  window.addEventListener("hashchange", function () { render(); });
  var mq = window.matchMedia("(min-width:1100px)"); if (mq.addEventListener) mq.addEventListener("change", function () { render(false); });

  // read-only hook for automated QA (local only; exposes nothing that is not already in this browser)
  window.__vxDemo = { snapshot: function () { return JSON.parse(JSON.stringify(state)); }, stats: function () { return stats(); }, today: function () { return today(); } };

  // ================================================================ start
  state = load();
  if (!state) { var pref = (navigator.language || "sv").toLowerCase().indexOf("sv") === 0 ? "sv" : "en"; var lq = /[?&]lang=(sv|en)/.exec(location.search); seed(lq ? lq[1] : pref); }
  else { var lq2 = /[?&]lang=(sv|en)/.exec(location.search); if (lq2 && lq2[1] !== state.settings.lang && state.pristine) seed(lq2[1]); }
  if (!location.hash) history.replaceState(null, "", "#/overview");
  render(false);
})();
