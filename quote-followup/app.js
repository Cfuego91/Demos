/* Vexari Quote Follow-up – interactive demo.
   Pure simulation: no network calls, no emails, no SMS. State lives in this browser only (localStorage). */
(function () {
  "use strict";

  // ---------------------------------------------------------------- i18n
  var T = {
    sv: {
      skip: "Hoppa till innehållet", product: "Offertuppföljning", demoPill: "Demo — inga meddelanden skickas",
      notifications: "Aviseringar", reset: "Återställ demo", resetConfirm: "Återställa demon? Alla ändringar ersätts med exempeldata.",
      nav: { overview: "Översikt", quotes: "Offerter", new: "Ny offert", analytics: "Analys" }, menu: "Huvudmeny",
      demoDay: "Demodag", simulated: function (n) { return n ? "+" + n + (n === 1 ? " dag simulerad" : " dagar simulerade") : "Idag"; },
      nextDay: "Spola fram 1 dag", resetSm: "Återställ",
      simNote: "Simulerade siffror – inte verkliga affärsresultat",
      ov: { title: "Översikt", lead: "Alla offerter som väntar på svar följs upp automatiskt efter 2, 5 och 10 dagar." },
      guide: { title: "Så visar du demon (under 2 minuter)", close: "Stäng guiden",
        steps: ["<b>Öppna en offert</b> och se exakt vilka påminnelser kunden får.", "<b>Spola fram en dag</b> – påminnelser som förfaller \"skickas\" (simulerat).", "<b>Simulera kundens svar</b> – accepterar, avböjer eller vill ha mer info. Påminnelserna stoppas direkt.", "<b>Lägg till en egen offert</b> och se schemat skapas automatiskt."],
        cta: "Öppna en offert" },
      kpi: { total: "Offerter totalt", pending: "Väntar på svar", accepted: "Accepterade", declined: "Avböjda", pendingValue: "Väntande offertvärde", rate: "Acceptansgrad", rateHint: "av avgjorda offerter", wonValue: "Vunnet offertvärde", completion: "Uppföljning genomförd", afterReminder: "Svar efter påminnelse", sent: "Påminnelser skickade" },
      pipeline: "Offertpipeline", pipelineSub: "Antal och värde per status",
      upcoming: "Kommande påminnelser", upcomingSub: "Närmaste 7 dagarna", noUpcoming: "Inga påminnelser de närmaste 7 dagarna.",
      recent: "Senaste aktivitet", allActivity: "Visa all aktivitet",
      status: { active: "Uppföljning pågår", paused: "Pausad", info: "Vill ha mer info", accepted: "Accepterad", declined: "Avböjd", no_response: "Inget svar" },
      filters: { all: "Alla", pending: "Väntar", action: "Kräver åtgärd", accepted: "Accepterade", declined: "Avböjda" },
      q: { title: "Offerter", lead: "Klicka på en offert för att se tidslinjen och simulera kundens svar.", none: "Inga offerter i det här filtret.", next: "Nästa påminnelse", sentOn: "Skickad", back: "Alla offerter", amount: "Belopp", service: "Tjänst", sentDate: "Offert skickad", email: "E-post", reminders: "Påminnelser", simulate: "Simulera kundens svar", accept: "Accepterar", decline: "Avböjer", info: "Vill ha mer info", noReply: "Svarar inte", pause: "Pausa uppföljning", resume: "Återuppta uppföljning", del: "Ta bort", delConfirm: "Ta bort offerten från demon?", timeline: "Automatisk uppföljning", openMsg: "Visa meddelandet", from: "Från", to: "Till", subject: "Ämne", nosend: "Demo: det här meddelandet skickas aldrig.", select: "Välj en offert i listan för att se detaljer.", noReplyHelp: "Spolar fram demodagen till nästa påminnelse." },
      tl: { day: function (d) { return "Dag " + d; }, names: ["Vänlig påminnelse", "Andra uppföljningen", "Sista uppföljningen"], sent: "Skickad (simulerad)", scheduled: "Schemalagd", cancelled: "Stoppad", held: "Pausad", skipped: "Hoppades över" },
      outcome: { accepted: "Kunden accepterade offerten. Återstående påminnelser stoppades och du fick en avisering.", declined: "Kunden tackade nej. Återstående påminnelser stoppades.", info: "Kunden vill ha mer information. Uppföljningen är pausad tills du har svarat – du fick en avisering.", no_response: "Inget svar efter tre påminnelser. Ring kunden eller avsluta offerten.", paused: "Uppföljningen är pausad. Inga påminnelser skickas förrän du återupptar den." },
      nq: { title: "Ny offert", lead: "Lägg in en offert så skapas uppföljningen automatiskt. Använd påhittade uppgifter – demon skickar ingenting.", name: "Kundens namn", email: "Kundens e-post", emailHelp: "Endast påhittade adresser, t.ex. namn@example.com", service: "Tjänst", choose: "Välj tjänst", amount: "Offertbelopp", amountHelp: function (c) { return "I " + c + ", exklusive moms"; }, date: "Datum när offerten skickades", statusLabel: "Uppföljning", statusActive: "Starta direkt", statusPaused: "Pausad", save: "Spara och starta uppföljning", saved: "Offerten är sparad och uppföljningen schemalagd.", preview: "Uppföljningsschema", previewEmpty: "Fyll i datum för att se schemat.", errTitle: "Kontrollera följande:",
        e: { name: "Skriv kundens namn (2–60 tecken).", email: "Skriv en giltig e-postadress.", emailDemo: "I demon får du bara använda påhittade adresser som slutar på example.com, example.org eller example.net.", service: "Välj en tjänst.", amount: "Skriv ett belopp större än 0 (högst 10 000 000).", date: "Välj ett datum.", future: "Datumet kan inte vara efter demodagen.", old: "Datumet får vara högst 30 dagar bakåt." } },
      an: { title: "Analys", lead: "Hur uppföljningen påverkar offerterna i demon.", value: "Värde per status", history: "Aktivitetshistorik", completionSub: "Skickade av alla planerade påminnelser", afterSub: function (a, b) { return a + " av " + b + " avgjorda offerter fick svar efter minst en påminnelse"; }, potential: "Potentiell intäkt", potentialSub: "Väntande offertvärde × acceptansgrad", disclaimer: "Alla siffror kommer från påhittade demoofferter och den simulerade klockan. De visar hur systemet fungerar – inte vilka resultat ett företag får." },
      act: { created: "Offert registrerad", reminder: function (n) { return "Påminnelse " + n + " skickad (simulerad)"; }, accepted: "Kunden accepterade", declined: "Kunden tackade nej", info: "Kunden vill ha mer information", paused: "Uppföljning pausad", resumed: "Uppföljning återupptagen", no_response: "Inget svar efter sista påminnelsen", skipped: "Försenade påminnelser hoppades över" },
      notif: { title: "Aviseringar", close: "Stäng", none: "Inga aviseringar ännu.", accepted: "accepterade offerten – boka in jobbet.", declined: "tackade nej till offerten.", info: "vill ha mer information – ring eller svara på mejlet.", no_response: "har inte svarat efter tre påminnelser – ring kunden?", open: "Öppna offerten", note: "I skarp drift kommer aviseringen som mejl eller sms till hantverkaren." },
      toast: { day: function (n) { return n ? n + (n === 1 ? " påminnelse skickades (simulerat)." : " påminnelser skickades (simulerat).") : "Ingen påminnelse förföll idag."; }, reset: "Demon är återställd.", accepted: "Påminnelserna stoppades – offerten är accepterad.", declined: "Påminnelserna stoppades – offerten är avböjd.", info: "Uppföljningen pausades. Du fick en avisering.", paused: "Uppföljningen är pausad.", resumed: "Uppföljningen är återupptagen.", noMore: "Inga fler påminnelser att skicka." },
      foot: "Vexari Offertuppföljning är en demonstration. Inga mejl eller sms skickas, ingen data lämnar din webbläsare och alla personer och företag är påhittade.",
      currency: "SEK", locale: "sv-SE",
      company: "Demofirman Bygg & VVS", sender: "Erik", phone: "08-000 000 00", companyMail: "offert@demofirman.example",
      msgs: [
        { s: "Har du hunnit titta på offerten?", b: "Hej {first},\n\nTack för att du begärde en offert på {service} från {company}. Jag ville bara höra att den kommit fram och om du har några frågor.\n\nOffertbelopp: {amount}\n\nSvara på det här mejlet eller ring {phone}, så hjälper vi dig." },
        { s: "Några frågor om offerten för {service}?", b: "Hej {first},\n\nJag följer upp offerten vi skickade {date}. Är något oklart, eller vill du justera omfattningen? Vi går gärna igenom den tillsammans – det tar bara några minuter.\n\nSvara på mejlet eller ring {phone}." },
        { s: "Sista påminnelsen om din offert", b: "Hej {first},\n\nDet här är vår sista påminnelse om offerten för {service}. Är du fortfarande intresserad? Svara gärna så bokar vi in jobbet.\n\nPassar det inte just nu är det helt okej – då hör vi inte av oss mer om den här offerten." }
      ],
      sign: "Vänliga hälsningar\n{sender}\n{company}", optout: "Vill du inte få fler påminnelser? Svara STOPP.",
      services: ["Badrumsrenovering", "Köksrenovering", "Takbyte", "Fasadmålning", "Altanbygge", "Byte av varmvattenberedare", "Värmepump", "Byte av elcentral", "Dränering", "Annat"]
    },
    en: {
      skip: "Skip to content", product: "Quote Follow-up", demoPill: "DEMO — No messages are sent",
      notifications: "Notifications", reset: "Reset demo", resetConfirm: "Reset the demo? All changes are replaced with sample data.",
      nav: { overview: "Overview", quotes: "Quotes", new: "New quote", analytics: "Analytics" }, menu: "Main menu",
      demoDay: "Demo day", simulated: function (n) { return n ? "+" + n + (n === 1 ? " day simulated" : " days simulated") : "Today"; },
      nextDay: "Advance 1 day", resetSm: "Reset",
      simNote: "Simulated figures – not real business results",
      ov: { title: "Overview", lead: "Every quote awaiting a reply is followed up automatically after 2, 5 and 10 days." },
      guide: { title: "How to present this demo (under 2 minutes)", close: "Close guide",
        steps: ["<b>Open a quote</b> and see exactly which reminders the customer receives.", "<b>Advance one day</b> – reminders that fall due are \"sent\" (simulated).", "<b>Simulate the customer's reply</b> – accepts, declines or wants more info. Reminders stop immediately.", "<b>Add your own quote</b> and watch the schedule appear automatically."],
        cta: "Open a quote" },
      kpi: { total: "Total quotes", pending: "Awaiting reply", accepted: "Accepted", declined: "Declined", pendingValue: "Pending quote value", rate: "Acceptance rate", rateHint: "of decided quotes", wonValue: "Won quote value", completion: "Follow-up completed", afterReminder: "Replies after a reminder", sent: "Reminders sent" },
      pipeline: "Quote pipeline", pipelineSub: "Count and value by status",
      upcoming: "Upcoming reminders", upcomingSub: "Next 7 days", noUpcoming: "No reminders in the next 7 days.",
      recent: "Recent activity", allActivity: "View all activity",
      status: { active: "Following up", paused: "Paused", info: "Wants more info", accepted: "Accepted", declined: "Declined", no_response: "No response" },
      filters: { all: "All", pending: "Pending", action: "Needs action", accepted: "Accepted", declined: "Declined" },
      q: { title: "Quotes", lead: "Select a quote to see its timeline and simulate the customer's reply.", none: "No quotes in this filter.", next: "Next reminder", sentOn: "Sent", back: "All quotes", amount: "Amount", service: "Service", sentDate: "Quote sent", email: "Email", reminders: "Reminders", simulate: "Simulate customer reply", accept: "Accepts", decline: "Declines", info: "Wants more info", noReply: "No reply", pause: "Pause follow-up", resume: "Resume follow-up", del: "Delete", delConfirm: "Remove this quote from the demo?", timeline: "Automatic follow-up", openMsg: "Show message", from: "From", to: "To", subject: "Subject", nosend: "Demo: this message is never sent.", select: "Select a quote from the list to see details.", noReplyHelp: "Advances the demo day to the next reminder." },
      tl: { day: function (d) { return "Day " + d; }, names: ["Friendly reminder", "Second follow-up", "Final follow-up"], sent: "Sent (simulated)", scheduled: "Scheduled", cancelled: "Stopped", held: "Paused", skipped: "Skipped" },
      outcome: { accepted: "The customer accepted the quote. Remaining reminders were stopped and you were notified.", declined: "The customer declined. Remaining reminders were stopped.", info: "The customer wants more information. Follow-up is paused until you reply – you were notified.", no_response: "No reply after three reminders. Call the customer or close the quote.", paused: "Follow-up is paused. No reminders are sent until you resume it." },
      nq: { title: "New quote", lead: "Add a quote and the follow-up is scheduled automatically. Use fictional details – the demo sends nothing.", name: "Customer name", email: "Customer email", emailHelp: "Fictional addresses only, e.g. name@example.com", service: "Service", choose: "Choose a service", amount: "Quote amount", amountHelp: function (c) { return "In " + c + ", excluding tax"; }, date: "Date the quote was sent", statusLabel: "Follow-up", statusActive: "Start now", statusPaused: "Paused", save: "Save and start follow-up", saved: "Quote saved and follow-up scheduled.", preview: "Follow-up schedule", previewEmpty: "Pick a date to see the schedule.", errTitle: "Please check the following:",
        e: { name: "Enter the customer's name (2–60 characters).", email: "Enter a valid email address.", emailDemo: "In the demo, only fictional addresses ending in example.com, example.org or example.net are allowed.", service: "Choose a service.", amount: "Enter an amount greater than 0 (max 10,000,000).", date: "Choose a date.", future: "The date cannot be after the demo day.", old: "The date can be at most 30 days back." } },
      an: { title: "Analytics", lead: "How follow-up affects the quotes in this demo.", value: "Value by status", history: "Activity history", completionSub: "Sent out of all planned reminders", afterSub: function (a, b) { return a + " of " + b + " decided quotes got a reply after at least one reminder"; }, potential: "Potential revenue", potentialSub: "Pending quote value × acceptance rate", disclaimer: "All figures come from fictional demo quotes and the simulated clock. They show how the system works – not the results any business will get." },
      act: { created: "Quote added", reminder: function (n) { return "Reminder " + n + " sent (simulated)"; }, accepted: "Customer accepted", declined: "Customer declined", info: "Customer wants more information", paused: "Follow-up paused", resumed: "Follow-up resumed", no_response: "No reply after the final reminder", skipped: "Overdue reminders skipped" },
      notif: { title: "Notifications", close: "Close", none: "No notifications yet.", accepted: "accepted the quote – book the job.", declined: "declined the quote.", info: "wants more information – call or reply to the email.", no_response: "has not replied after three reminders – give them a call?", open: "Open quote", note: "In live use, the contractor receives this notification by email or text." },
      toast: { day: function (n) { return n ? n + (n === 1 ? " reminder was sent (simulated)." : " reminders were sent (simulated).") : "No reminders were due today."; }, reset: "The demo has been reset.", accepted: "Reminders stopped – the quote is accepted.", declined: "Reminders stopped – the quote is declined.", info: "Follow-up paused. You were notified.", paused: "Follow-up is paused.", resumed: "Follow-up resumed.", noMore: "No more reminders to send." },
      foot: "Vexari Quote Follow-up is a demonstration. No emails or texts are sent, no data leaves your browser, and all people and businesses are fictional.",
      currency: "USD", locale: "en-US",
      company: "Demo Home Services", sender: "Mike", phone: "555-0100", companyMail: "quotes@demohome.example",
      msgs: [
        { s: "Did you get a chance to look at our quote?", b: "Hi {first},\n\nThanks for asking {company} for a quote on your {service}. I just wanted to make sure it reached you and see if you have any questions.\n\nQuote amount: {amount}\n\nReply to this email or call {phone} and we'll be happy to help." },
        { s: "Any questions about your {service} quote?", b: "Hi {first},\n\nI'm following up on the quote we sent on {date}. Is anything unclear, or would you like to adjust the scope? We're happy to walk through it with you – it only takes a few minutes.\n\nJust reply here or call {phone}." },
        { s: "Final reminder about your quote", b: "Hi {first},\n\nThis is our last reminder about the quote for your {service}. Are you still interested? Reply and we'll get the job scheduled.\n\nIf the timing isn't right, that's completely fine – we won't follow up on this quote again." }
      ],
      sign: "Best regards,\n{sender}\n{company}", optout: "Don't want more reminders? Reply STOP.",
      services: ["Bathroom remodel", "Kitchen remodel", "Roof replacement", "Exterior painting", "Deck build", "Water heater replacement", "Heat pump installation", "Electrical panel upgrade", "Drainage", "Other"]
    }
  };

  // fictional sample data (example.com addresses only)
  var SEED = {
    sv: [
      ["Lena Ström", "Dränering", 98000, 0], ["Anna Lindqvist", "Badrumsrenovering", 148500, 1],
      ["Johan Berg", "Byte av varmvattenberedare", 18900, 3], ["Sara Nilsson", "Takbyte", 212000, 6],
      ["Mikael Ek", "Altanbygge", 64000, 8, "info", 6], ["Ali Hassan", "Köksrenovering", 176000, 9, "accepted", 2],
      ["Peter Strand", "Fasadmålning", 89000, 12, "declined", 3], ["Elin Holm", "Byte av elcentral", 27500, 13, "accepted", 5],
      ["Karin Sjöberg", "Värmepump", 124000, 18]
    ],
    en: [
      ["Laura Stone", "Drainage", 7900, 0], ["Emily Carter", "Bathroom remodel", 18500, 1],
      ["James Brooks", "Water heater replacement", 2400, 3], ["Sarah Nguyen", "Roof replacement", 26000, 6],
      ["Michael Reed", "Deck build", 9800, 8, "info", 6], ["Daniel Ortiz", "Kitchen remodel", 32000, 9, "accepted", 2],
      ["Peter Walsh", "Exterior painting", 11200, 12, "declined", 3], ["Olivia Hayes", "Electrical panel upgrade", 3600, 13, "accepted", 5],
      ["Karen Foster", "Heat pump installation", 14500, 18]
    ]
  };
  var DAYS = [2, 5, 10], NO_RESPONSE_AFTER = 4, KEY = "vexari-quote-followup-demo-v1";

  // ---------------------------------------------------------------- utils
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function add(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  function diff(a, b) { return Math.round((parse(a) - parse(b)) / 864e5); }
  var REAL_TODAY = iso(new Date());
  function today() { return add(REAL_TODAY, state.offset); }
  function L() { return T[state.lang]; }
  function money(n, cur) { return new Intl.NumberFormat(L().locale, { style: "currency", currency: cur || state.currency, maximumFractionDigits: 0 }).format(n); }
  function fdate(s, long) { return new Intl.DateTimeFormat(L().locale, long ? { weekday: "short", day: "numeric", month: "short" } : { day: "numeric", month: "short" }).format(parse(s)); }
  function first(name) { return String(name).trim().split(/\s+/)[0]; }
  function slugEmail(name) { return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "") + "@example.com"; }
  var ICON = {
    overview: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    quotes: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    new: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    analytics: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>', check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>', clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>', play: '<path d="m6 3 14 9-14 9V3z"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    forward: '<path d="m13 17 5-5-5-5M6 17l5-5-5-5"/>', back: '<path d="m15 18-6-6 6-6"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>', trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[n] + "</svg>"; }

  // ---------------------------------------------------------------- state
  var state;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode: demo still works in memory */ } }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1 && s.realToday === REAL_TODAY && Array.isArray(s.quotes)) return s; } catch (e) { }
    return null;
  }
  function log(type, q, at, extra) { state.activity.push({ id: ++state.seq, at: at || today(), type: type, qid: q ? q.id : null, name: q ? q.customer : "", n: extra }); }
  function notify(type, q, at) { state.notifs.push({ id: ++state.seq, at: at || today(), type: type, qid: q.id, name: q.customer, read: false }); }

  function makeQuote(o) {
    var q = { id: "q" + (++state.seq), customer: o.customer, email: o.email, service: o.service, amount: o.amount, currency: state.currency, sent: o.sent, status: o.status || "active", remindersAtDecision: null,
      reminders: DAYS.map(function (d, i) { return { n: i + 1, day: d, due: add(o.sent, d), state: "scheduled", sentOn: null }; }) };
    state.quotes.push(q);
    return q;
  }
  function sentCount(q) { return q.reminders.filter(function (r) { return r.state === "sent"; }).length; }
  function isOpen(q) { return q.status === "active" || q.status === "paused" || q.status === "info"; }

  // send every reminder that is due on or before `date` for active quotes; returns number sent
  function processQuote(q, date) {
    var n = 0;
    if (q.status !== "active") return 0;
    q.reminders.forEach(function (r) {
      if (r.state === "scheduled" && r.due <= date) { r.state = "sent"; r.sentOn = r.due; n++; log("reminder", q, r.due, r.n); }
    });
    var last = q.reminders[q.reminders.length - 1];
    if (last.state !== "scheduled" && q.reminders.every(function (r) { return r.state !== "scheduled"; }) && add(last.sentOn || last.due, NO_RESPONSE_AFTER) <= date) {
      var at = add(last.sentOn || last.due, NO_RESPONSE_AFTER);
      q.status = "no_response"; q.remindersAtDecision = sentCount(q); log("no_response", q, at); notify("no_response", q, at);
    }
    return n;
  }
  function processAll() { var n = 0; state.quotes.forEach(function (q) { n += processQuote(q, today()); }); return n; }

  function decide(q, type, at) {
    at = at || today();
    if (type === "info") { q.status = "info"; q.remindersAtDecision = sentCount(q); log("info", q, at); notify("info", q, at); return; }
    q.status = type; q.remindersAtDecision = sentCount(q);
    q.reminders.forEach(function (r) { if (r.state === "scheduled") r.state = "cancelled"; });
    log(type, q, at); if (type === "accepted" || type === "declined") notify(type, q, at);
  }
  function resume(q) {
    var pending = q.reminders.filter(function (r) { return r.state === "scheduled"; });
    if (pending.length && pending[0].due <= today()) { var shift = diff(today(), pending[0].due) + 1; pending.forEach(function (r) { r.due = add(r.due, shift); }); }
    q.status = "active"; q.remindersAtDecision = null; log("resumed", q);
    if (!pending.length) { processQuote(q, add(today(), NO_RESPONSE_AFTER)); }
  }

  function seed(lang) {
    state = { v: 1, realToday: REAL_TODAY, lang: lang, currency: T[lang].currency, offset: 0, quotes: [], activity: [], notifs: [], seq: 0, pristine: true, guide: true, filter: "all" };
    SEED[lang].forEach(function (s) {
      var sent = add(REAL_TODAY, -s[3]);
      var q = makeQuote({ customer: s[0], email: slugEmail(s[0]), service: s[1], amount: s[2], sent: sent });
      log("created", q, sent);
      if (s[4]) { processQuote(q, add(sent, s[5])); decide(q, s[4], add(sent, s[5])); }
      processQuote(q, REAL_TODAY);
    });
    state.notifs.forEach(function (n) { n.read = n.at < add(REAL_TODAY, -3); });
    save();
  }

  // ---------------------------------------------------------------- derived numbers
  function stats() {
    var s = { total: 0, open: 0, accepted: 0, declined: 0, noResp: 0, pendingValue: 0, wonValue: 0, sent: 0, planned: 0, decided: 0, afterReminder: 0, by: {} };
    ["active", "paused", "info", "accepted", "declined", "no_response"].forEach(function (k) { s.by[k] = { n: 0, v: 0 }; });
    state.quotes.forEach(function (q) {
      s.total++; s.by[q.status].n++; s.by[q.status].v += q.amount;
      if (isOpen(q)) { s.open++; s.pendingValue += q.amount; }
      if (q.status === "accepted") { s.accepted++; s.wonValue += q.amount; }
      if (q.status === "declined") s.declined++;
      if (q.status === "no_response") s.noResp++;
      q.reminders.forEach(function (r) { if (r.state === "sent") s.sent++; if (r.state !== "cancelled" && r.state !== "skipped") s.planned++; });
      if (q.status === "accepted" || q.status === "declined" || q.status === "info") { s.decided++; if (q.remindersAtDecision > 0) s.afterReminder++; }
    });
    var decidedFinal = s.accepted + s.declined + s.noResp;
    s.rate = decidedFinal ? s.accepted / decidedFinal : 0;
    s.completion = s.planned ? s.sent / s.planned : 0;
    return s;
  }
  function pct(x) { return new Intl.NumberFormat(L().locale, { style: "percent", maximumFractionDigits: 0 }).format(x); }

  // ---------------------------------------------------------------- render helpers
  var ORDER = ["active", "info", "paused", "no_response", "accepted", "declined"];
  function chip(st) { return '<span class="chip s-' + st + '">' + esc(L().status[st]) + "</span>"; }
  function nextReminder(q) { if (q.status !== "active") return null; return q.reminders.filter(function (r) { return r.state === "scheduled"; })[0] || null; }
  function message(q, r) {
    var t = L(), m = t.msgs[r.n - 1];
    var fill = function (s) { return s.replace(/\{first\}/g, first(q.customer)).replace(/\{service\}/g, q.service.toLowerCase()).replace(/\{company\}/g, t.company).replace(/\{amount\}/g, money(q.amount, q.currency)).replace(/\{phone\}/g, t.phone).replace(/\{date\}/g, fdate(q.sent)).replace(/\{sender\}/g, t.sender); };
    return { subject: fill(m.s), body: fill(m.b) + "\n\n" + fill(t.sign) + "\n\n" + t.optout };
  }
  function simbar(compact) {
    var t = L();
    return '<div class="simbar"><div class="day"><small>' + esc(t.demoDay) + "</small>" + esc(fdate(today(), true)) + ' <span class="sim-note">' + esc(t.simulated(state.offset)) + "</span></div>" + (compact ? "" : '<span class="grow"></span>') +
      '<button type="button" class="btn primary sm" data-act="day">' + icon("forward") + esc(t.nextDay) + "</button>" +
      '<button type="button" class="btn ghost sm" data-act="reset">' + esc(t.resetSm) + "</button></div>";
  }
  function feed(items) {
    var t = L();
    if (!items.length) return '<p class="empty">—</p>';
    return '<ul class="feed">' + items.map(function (a) {
      var ic = { created: "plus", reminder: "mail", accepted: "check", declined: "x", info: "help", paused: "pause", resumed: "play", no_response: "clock", skipped: "forward" }[a.type] || "mail";
      var label = typeof t.act[a.type] === "function" ? t.act[a.type](a.n) : t.act[a.type];
      var who = a.qid ? '<a href="#/quotes/' + esc(a.qid) + '">' + esc(a.name) + "</a>" : esc(a.name);
      return '<li class="t-' + a.type + '"><span class="ico">' + icon(ic) + "</span><span>" + esc(label) + " · " + who + "</span><time>" + esc(fdate(a.at, true)) + "</time></li>";
    }).join("") + "</ul>";
  }
  function sortedActivity() { return state.activity.slice().sort(function (a, b) { return a.at === b.at ? b.id - a.id : (a.at < b.at ? 1 : -1); }); }
  function pipeline(s, byValue) {
    var total = ORDER.reduce(function (sum, k) { return sum + (byValue ? s.by[k].v : s.by[k].n); }, 0) || 1;
    return '<div class="pipe" role="img" aria-label="' + esc(L().pipeline) + '">' + ORDER.map(function (k) { var x = byValue ? s.by[k].v : s.by[k].n; return x ? '<span class="bg-' + k + '" style="width:' + (100 * x / total).toFixed(2) + '%"></span>' : ""; }).join("") + "</div>" +
      '<ul class="legend">' + ORDER.map(function (k) { return '<li><span class="chip s-' + k + '">' + esc(L().status[k]) + "</span><b>" + s.by[k].n + " · " + esc(money(s.by[k].v)) + "</b></li>"; }).join("") + "</ul>";
  }
  function kpi(label, value, hint, accent) { return '<div class="kpi' + (accent ? " accent" : "") + '"><div class="label">' + esc(label) + '</div><div class="value">' + esc(value) + "</div>" + (hint ? '<div class="hint">' + esc(hint) + "</div>" : "") + "</div>"; }

  // ---------------------------------------------------------------- views
  function viewOverview() {
    var t = L(), s = stats();
    var up = [];
    state.quotes.forEach(function (q) { var r = nextReminder(q); if (r && diff(r.due, today()) <= 7) up.push({ q: q, r: r }); });
    up.sort(function (a, b) { return a.r.due < b.r.due ? -1 : 1; });
    return '<div class="page-head"><div><h1>' + esc(t.ov.title) + "</h1><p>" + esc(t.ov.lead) + '</p></div><span class="sim-note">' + icon("clock") + esc(t.simNote) + "</span></div>" +
      (state.guide ? '<section class="card guide" aria-labelledby="g-t"><h2 id="g-t">' + esc(t.guide.title) + '</h2><button type="button" class="btn icon ghost sm close" data-act="guide-off" aria-label="' + esc(t.guide.close) + '">' + icon("x") + "</button><ol>" + t.guide.steps.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ol><p style="margin:.8rem 0 0"><a class="btn primary sm" href="#/quotes/' + esc((state.quotes[2] || state.quotes[0] || {}).id || "") + '">' + esc(t.guide.cta) + "</a></p></section><div style=\"height:1rem\"></div>" : "") +
      '<div class="mobile-sim">' + simbar(false) + "</div>" +
      '<div class="kpis">' + kpi(t.kpi.total, s.total) + kpi(t.kpi.pending, s.open) + kpi(t.kpi.accepted, s.accepted) + kpi(t.kpi.declined, s.declined) + kpi(t.kpi.pendingValue, money(s.pendingValue), null, true) + kpi(t.kpi.rate, pct(s.rate), t.kpi.rateHint) + "</div>" +
      '<div class="two"><div class="grid"><section class="card"><h2>' + esc(t.pipeline) + '</h2><p class="sub">' + esc(t.pipelineSub) + "</p>" + pipeline(s) + "</section>" +
      '<section class="card"><h2>' + esc(t.upcoming) + '</h2><p class="sub">' + esc(t.upcomingSub) + " · " + esc(t.kpi.sent) + ": " + s.sent + "</p>" +
      (up.length ? '<ul class="feed">' + up.map(function (x) { return '<li class="t-reminder"><span class="ico">' + icon("mail") + '</span><span><a href="#/quotes/' + esc(x.q.id) + '">' + esc(x.q.customer) + "</a> · " + esc(t.tl.names[x.r.n - 1]) + "</span><time>" + esc(fdate(x.r.due, true)) + " · " + esc(t.tl.day(x.r.day)) + "</time></li>"; }).join("") + "</ul>" : '<p class="empty">' + esc(t.noUpcoming) + "</p>") + "</section></div>" +
      '<section class="card"><h2>' + esc(t.recent) + "</h2>" + feed(sortedActivity().slice(0, 7)) + '<p style="margin:.6rem 0 0"><a href="#/analytics">' + esc(t.allActivity) + "</a></p></section></div>";
  }

  function qMatches(q, f) {
    return f === "all" || (f === "pending" && (q.status === "active" || q.status === "paused")) || (f === "action" && (q.status === "info" || q.status === "no_response")) || q.status === f;
  }
  function viewQuotes(id) {
    var t = L(), f = state.filter || "all";
    var list = state.quotes.filter(function (q) { return qMatches(q, f); }).sort(function (a, b) { return a.sent < b.sent ? 1 : -1; });
    var sel = id && state.quotes.filter(function (q) { return q.id === id; })[0];
    var listHtml = '<div class="toolbar"><div class="seg" role="group" aria-label="Filter">' + ["all", "pending", "action", "accepted", "declined"].map(function (k) { return '<button type="button" data-filter="' + k + '" aria-pressed="' + (f === k) + '">' + esc(t.filters[k]) + "</button>"; }).join("") + "</div></div>" +
      (list.length ? '<div class="qlist">' + list.map(function (q) {
        var r = nextReminder(q);
        return '<a class="qrow" href="#/quotes/' + esc(q.id) + '"' + (sel && sel.id === q.id ? ' aria-current="true"' : "") + '><span class="name">' + esc(q.customer) + '</span><span class="amt">' + esc(money(q.amount, q.currency)) + '</span><span class="meta"><span>' + esc(q.service) + "</span>" + chip(q.status) + "<span>" + esc(t.q.reminders) + ": " + sentCount(q) + "/3</span>" + (r ? '<span class="next">' + esc(t.q.next) + ": " + esc(fdate(r.due)) + "</span>" : "") + "</span></a>";
      }).join("") + "</div>" : '<p class="empty">' + esc(t.q.none) + "</p>");
    var detail = sel ? viewDetail(sel) : '<div class="card detail" style="display:none"></div>';
    if (sel && window.matchMedia("(max-width:1099px)").matches) {
      return '<h1 class="vh">' + esc(t.q.title) + '</h1><a class="back" href="#/quotes">' + icon("back") + esc(t.q.back) + "</a>" + detail;
    }
    return '<div class="page-head"><div><h1>' + esc(t.q.title) + "</h1><p>" + esc(t.q.lead) + '</p></div><a class="btn primary" href="#/new">' + icon("plus") + esc(t.nav.new) + "</a></div>" +
      '<div class="quotes-wrap' + (sel ? " has-detail" : "") + '"><div>' + listHtml + "</div>" + (sel ? detail : "") + "</div>";
  }

  function viewDetail(q) {
    var t = L(), open = isOpen(q);
    var tl = q.reminders.map(function (r) {
      var st = r.state === "scheduled" && (q.status === "paused" || q.status === "info") ? "held" : r.state;
      var label = { sent: t.tl.sent, scheduled: t.tl.scheduled, cancelled: t.tl.cancelled, held: t.tl.held, skipped: t.tl.skipped }[st];
      var m = message(q, r);
      return '<li class="tl ' + st + '"><span class="dot"></span><div class="tl-head"><b>' + esc(t.tl.day(r.day)) + " · " + esc(t.tl.names[r.n - 1]) + '</b><span class="when">' + esc(fdate(r.sentOn || r.due, true)) + '</span><span class="tl-state">' + esc(label) + "</span></div>" +
        '<details class="msg"><summary>' + esc(t.q.openMsg) + '</summary><div class="mail"><div class="hdr"><span>' + esc(t.q.from) + "</span><b>" + esc(t.company) + " &lt;" + esc(t.companyMail) + "&gt;</b><span>" + esc(t.q.to) + "</span><b>" + esc(q.customer) + " &lt;" + esc(q.email) + "&gt;</b><span>" + esc(t.q.subject) + "</span><b>" + esc(m.subject) + "</b></div><pre>" + esc(m.body) + '</pre><p class="nosend">' + esc(t.q.nosend) + "</p></div></details></li>";
    }).join("");
    var outcome = t.outcome[q.status] ? '<div class="outcome s-' + q.status + '" role="status">' + icon({ accepted: "check", declined: "x", info: "help", no_response: "clock", paused: "pause" }[q.status]) + "<span>" + esc(t.outcome[q.status]) + "</span></div>" : "";
    var dis = function (c) { return c ? "" : " disabled"; };
    return '<section class="card detail" aria-labelledby="d-t"><div class="detail-head"><div><h2 id="d-t">' + esc(q.customer) + "</h2>" + chip(q.status) + "</div>" +
      '<div style="display:flex;gap:.4rem;flex-wrap:wrap">' + (q.status === "active" ? '<button type="button" class="btn sm" data-act="pause" data-id="' + esc(q.id) + '">' + icon("pause") + esc(t.q.pause) + "</button>" : "") +
      (q.status === "paused" || q.status === "info" ? '<button type="button" class="btn sm" data-act="resume" data-id="' + esc(q.id) + '">' + icon("play") + esc(t.q.resume) + "</button>" : "") +
      '<button type="button" class="btn sm ghost" data-act="delete" data-id="' + esc(q.id) + '" aria-label="' + esc(t.q.del + " " + q.customer) + '">' + icon("trash") + "</button></div></div>" +
      '<dl class="facts"><div><dt>' + esc(t.q.amount) + "</dt><dd>" + esc(money(q.amount, q.currency)) + "</dd></div><div><dt>" + esc(t.q.service) + "</dt><dd>" + esc(q.service) + "</dd></div><div><dt>" + esc(t.q.sentDate) + "</dt><dd>" + esc(fdate(q.sent, true)) + "</dd></div><div><dt>" + esc(t.q.email) + "</dt><dd class=\"mail-dd\">" + esc(q.email) + "</dd></div></dl>" +
      outcome +
      '<p class="sim-label">' + icon("play") + esc(t.q.simulate) + "</p>" +
      '<div class="sim-actions"><button type="button" class="btn ok" data-act="accepted" data-id="' + esc(q.id) + '"' + dis(open) + ">" + icon("check") + esc(t.q.accept) + '</button><button type="button" class="btn bad" data-act="declined" data-id="' + esc(q.id) + '"' + dis(open) + ">" + icon("x") + esc(t.q.decline) + '</button><button type="button" class="btn info" data-act="info" data-id="' + esc(q.id) + '"' + dis(q.status === "active" || q.status === "paused") + ">" + icon("help") + esc(t.q.info) + '</button><button type="button" class="btn" data-act="noreply" data-id="' + esc(q.id) + '" title="' + esc(t.q.noReplyHelp) + '"' + dis(q.status === "active") + ">" + icon("forward") + esc(t.q.noReply) + "</button></div>" +
      '<h3 style="font-size:.95rem;margin:0 0 .8rem">' + esc(t.q.timeline) + '</h3><ol class="timeline">' + tl + "</ol></section>";
  }

  function viewNew(err, vals) {
    var t = L(), v = vals || { status: "active", sent: today() }, e = err || {};
    var f = function (k, label, input, help) { return '<div class="field"><label for="f-' + k + '">' + esc(label) + "</label>" + input + (help ? '<span class="help" id="h-' + k + '">' + esc(help) + "</span>" : "") + (e[k] ? '<span class="err" id="e-' + k + '">' + esc(e[k]) + "</span>" : "") + "</div>"; };
    var aria = function (k, help) { var ids = [help ? "h-" + k : "", e[k] ? "e-" + k : ""].filter(Boolean).join(" "); return (e[k] ? ' aria-invalid="true"' : "") + (ids ? ' aria-describedby="' + ids + '"' : ""); };
    var keys = Object.keys(e);
    var sched = v.sent && /^\d{4}-\d{2}-\d{2}$/.test(v.sent) ? "<ol>" + DAYS.map(function (d, i) { return "<li>" + esc(t.tl.day(d)) + " · " + esc(t.tl.names[i]) + " — " + esc(fdate(add(v.sent, d), true)) + "</li>"; }).join("") + "</ol>" : '<p class="empty">' + esc(t.nq.previewEmpty) + "</p>";
    return '<div class="page-head"><div><h1>' + esc(t.nq.title) + "</h1><p>" + esc(t.nq.lead) + "</p></div></div>" +
      '<div class="two"><form class="form card" id="newForm" novalidate>' +
      (keys.length ? '<div class="err-summary" role="alert" tabindex="-1" id="errSum"><b>' + esc(t.nq.errTitle) + "</b><ul>" + keys.map(function (k) { return '<li><a href="#f-' + k + '">' + esc(e[k]) + "</a></li>"; }).join("") + "</ul></div>" : "") +
      '<div class="row">' + f("customer", t.nq.name, '<input id="f-customer" name="customer" autocomplete="off" maxlength="60" value="' + esc(v.customer || "") + '"' + aria("customer") + ">") +
      f("email", t.nq.email, '<input id="f-email" name="email" type="email" autocomplete="off" inputmode="email" value="' + esc(v.email || "") + '" placeholder="namn@example.com"' + aria("email", true) + ">", t.nq.emailHelp) + "</div>" +
      '<div class="row">' + f("service", t.nq.service, '<select id="f-service" name="service"' + aria("service") + '><option value="">' + esc(t.nq.choose) + "</option>" + t.services.map(function (s) { return "<option" + (v.service === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>") +
      f("amount", t.nq.amount, '<input id="f-amount" name="amount" inputmode="decimal" autocomplete="off" value="' + esc(v.amount || "") + '"' + aria("amount", true) + ">", t.nq.amountHelp(state.currency)) + "</div>" +
      '<div class="row">' + f("sent", t.nq.date, '<input id="f-sent" name="sent" type="date" max="' + today() + '" min="' + add(today(), -30) + '" value="' + esc(v.sent || "") + '"' + aria("sent") + ">") +
      '<fieldset class="field" style="border:0;padding:0;margin:0"><legend style="font-weight:600;font-size:.88rem;margin-bottom:.35rem">' + esc(t.nq.statusLabel) + '</legend><div class="radio-row"><label><input type="radio" name="status" value="active"' + (v.status !== "paused" ? " checked" : "") + ">" + esc(t.nq.statusActive) + '</label><label><input type="radio" name="status" value="paused"' + (v.status === "paused" ? " checked" : "") + ">" + esc(t.nq.statusPaused) + "</label></div></fieldset></div>" +
      '<div><button class="btn primary" type="submit">' + icon("check") + esc(t.nq.save) + "</button></div></form>" +
      '<div class="preview" aria-live="polite" id="schedPrev"><h2 style="font-size:1rem">' + esc(t.nq.preview) + "</h2>" + sched + '<p class="foot-note" style="margin-top:.8rem">' + esc(t.q.nosend) + "</p></div></div>";
  }

  function viewAnalytics() {
    var t = L(), s = stats();
    return '<div class="page-head"><div><h1>' + esc(t.an.title) + "</h1><p>" + esc(t.an.lead) + '</p></div><span class="sim-note">' + icon("clock") + esc(t.simNote) + "</span></div>" +
      '<div class="kpis">' + kpi(t.kpi.wonValue, money(s.wonValue), null, true) + kpi(t.an.potential, money(Math.round(s.pendingValue * s.rate)), t.an.potentialSub) + kpi(t.kpi.rate, pct(s.rate), t.kpi.rateHint) + kpi(t.kpi.completion, pct(s.completion), s.sent + " / " + s.planned) + kpi(t.kpi.afterReminder, s.afterReminder + " / " + s.decided) + kpi(t.kpi.sent, s.sent) + "</div>" +
      '<div class="two"><div class="grid"><section class="card"><h2>' + esc(t.an.value) + "</h2>" + pipeline(s, true) + "</section>" +
      '<section class="card"><h2>' + esc(t.kpi.completion) + '</h2><p class="sub">' + esc(t.an.completionSub) + '</p><div class="stat-row"><span>' + esc(t.kpi.sent) + "</span><b>" + s.sent + " / " + s.planned + '</b></div><div class="meter" role="img" aria-label="' + esc(pct(s.completion)) + '"><span style="width:' + (100 * s.completion).toFixed(1) + '%"></span></div>' +
      '<div class="stat-row"><span>' + esc(t.kpi.afterReminder) + "</span><b>" + s.afterReminder + " / " + s.decided + '</b></div><div class="meter" role="img" aria-label="' + esc(t.an.afterSub(s.afterReminder, s.decided)) + '"><span style="width:' + (s.decided ? 100 * s.afterReminder / s.decided : 0).toFixed(1) + '%;background:var(--ok)"></span></div><p class="foot-note" style="margin-top:.6rem">' + esc(t.an.afterSub(s.afterReminder, s.decided)) + "</p></section>" +
      '<p class="foot-note">' + esc(t.an.disclaimer) + "</p></div>" +
      '<section class="card"><h2>' + esc(t.an.history) + "</h2>" + feed(sortedActivity().slice(0, 25)) + "</section></div>";
  }

  // ---------------------------------------------------------------- shell
  var lastRoute = "";
  function route() { var h = location.hash.replace(/^#\/?/, "").split("/"); return { view: h[0] || "overview", id: h[1] || null }; }
  function renderNav() {
    var t = L(), r = route().view;
    var html = ["overview", "quotes", "new", "analytics"].map(function (k) { return '<a href="#/' + k + '"' + (r === k ? ' aria-current="page"' : "") + ">" + icon(k) + "<span>" + esc(t.nav[k]) + "</span></a>"; }).join("");
    $("#sideNav").innerHTML = html; $("#bottomNav").innerHTML = html;
    $("#sideNav").setAttribute("aria-label", t.menu); $("#bottomNav").setAttribute("aria-label", t.menu);
    $("#sideSim").innerHTML = simbar(true);
  }
  function renderChrome() {
    var t = L();
    document.documentElement.lang = state.lang;
    document.title = (state.lang === "sv" ? "Vexari Offertuppföljning – demo" : "Vexari Quote Follow-up – demo");
    document.querySelectorAll("[data-i18n]").forEach(function (el) { var k = el.getAttribute("data-i18n"); if (typeof t[k] === "string") el.textContent = t[k]; });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === state.lang)); });
    var unread = state.notifs.filter(function (n) { return !n.read; }).length, dot = $("#bellDot");
    dot.hidden = !unread; dot.textContent = unread;
    $("#bellBtn").setAttribute("aria-label", t.notifications + (unread ? " (" + unread + ")" : ""));
  }
  function render(focus) {
    var r = route(), view = $("#view"), html;
    if (r.view === "quotes") html = viewQuotes(r.id);
    else if (r.view === "new") html = viewNew();
    else if (r.view === "analytics") html = viewAnalytics();
    else html = viewOverview();
    view.innerHTML = html + '<p class="foot-note">' + esc(L().foot) + "</p>";
    var ms = view.querySelector(".mobile-sim"); if (ms && window.matchMedia("(min-width:1024px)").matches) ms.remove();
    renderNav(); renderChrome();
    var key = r.view + "/" + (r.id || "");
    if (focus !== false && key !== lastRoute) { if (lastRoute) { view.focus({ preventScroll: true }); window.scrollTo(0, 0); } }
    lastRoute = key;
  }
  var toastTimer;
  function toast(msg) {
    var old = document.querySelector(".toast"); if (old) old.remove();
    var el = document.createElement("div"); el.className = "toast"; el.textContent = msg; document.body.appendChild(el);
    $("#live").textContent = msg;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.remove(); }, 3200);
  }
  function changed() { state.pristine = false; save(); render(false); }
  function find(id) { return state.quotes.filter(function (q) { return q.id === id; })[0]; }

  function openDrawer() {
    var t = L(), list = state.notifs.slice().sort(function (a, b) { return b.id - a.id; });
    $("#drawerPanel").innerHTML = '<div class="dh"><h2 id="drawerTitle" style="font-size:1.1rem">' + esc(t.notif.title) + '</h2><button type="button" class="btn icon ghost" data-act="close-drawer" aria-label="' + esc(t.notif.close) + '">' + icon("x") + "</button></div>" +
      '<p class="foot-note" style="margin:0 0 .9rem">' + esc(t.notif.note) + "</p>" +
      (list.length ? list.map(function (n) { return '<div class="notif' + (n.read ? "" : " unread") + '"><time>' + esc(fdate(n.at, true)) + "</time><p><b>" + esc(n.name) + "</b> " + esc(t.notif[n.type]) + '</p><a href="#/quotes/' + esc(n.qid) + '" data-act="close-drawer">' + esc(t.notif.open) + "</a></div>"; }).join("") : '<p class="empty">' + esc(t.notif.none) + "</p>");
    $("#drawer").hidden = false;
    state.notifs.forEach(function (n) { n.read = true; }); save(); renderChrome();
    $("#drawerPanel button").focus();
  }
  function closeDrawer() { $("#drawer").hidden = true; $("#bellBtn").focus(); }

  // ---------------------------------------------------------------- form
  function validate(v) {
    var e = {}, t = L().nq.e, name = (v.customer || "").trim();
    if (name.length < 2 || name.length > 60) e.customer = t.name;
    var em = (v.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(em)) e.email = t.email;
    else if (!/@(?:[a-z0-9-]+\.)*example\.(com|org|net)$/.test(em)) e.email = t.emailDemo;
    if (!v.service) e.service = t.service;
    var amt = Number(String(v.amount || "").replace(/[\s ]/g, "").replace(",", "."));
    if (!isFinite(amt) || amt <= 0 || amt > 1e7) e.amount = t.amount;
    if (!v.sent || !/^\d{4}-\d{2}-\d{2}$/.test(v.sent)) e.sent = t.date;
    else if (v.sent > today()) e.sent = t.future;
    else if (v.sent < add(today(), -30)) e.sent = t.old;
    return { e: e, amount: Math.round(amt) };
  }
  function submitNew(form) {
    var fd = new FormData(form), v = {}; fd.forEach(function (val, k) { v[k] = String(val); });
    var res = validate(v);
    if (Object.keys(res.e).length) {
      $("#view").innerHTML = viewNew(res.e, v) + '<p class="foot-note">' + esc(L().foot) + "</p>";
      var s = $("#errSum"); if (s) s.focus();
      return;
    }
    var q = makeQuote({ customer: v.customer.trim(), email: v.email.trim().toLowerCase(), service: v.service, amount: res.amount, sent: v.sent, status: v.status === "paused" ? "paused" : "active" });
    log("created", q, v.sent);
    // a quote entered late: send only the latest overdue reminder today, skip earlier overdue ones
    var overdue = q.reminders.filter(function (r) { return r.due < today(); });
    if (overdue.length) { overdue.slice(0, -1).forEach(function (r) { r.state = "skipped"; }); overdue[overdue.length - 1].due = today(); if (overdue.length > 1) log("skipped", q); }
    if (q.status === "paused") log("paused", q); else processQuote(q, today());
    state.pristine = false; save();
    location.hash = "#/quotes/" + q.id;
    toast(L().nq.saved);
  }

  // ---------------------------------------------------------------- events
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-act],[data-lang],[data-filter],#bellBtn,#resetBtn");
    if (!b) { if (ev.target.id === "drawer") closeDrawer(); return; }
    var t = L();
    if (b.id === "bellBtn") return openDrawer();
    if (b.id === "resetBtn" || b.getAttribute("data-act") === "reset") {
      if (window.confirm(t.resetConfirm)) { var g = state.lang; try { localStorage.removeItem(KEY); } catch (e) { } seed(g); render(); toast(L().toast.reset); }
      return;
    }
    if (b.hasAttribute("data-lang")) {
      var lang = b.getAttribute("data-lang"); if (lang === state.lang) return;
      if (state.pristine) { var g2 = state.guide; seed(lang); state.guide = g2; } else state.lang = lang;
      save(); render(false); return;
    }
    if (b.hasAttribute("data-filter")) { state.filter = b.getAttribute("data-filter"); save(); render(false); return; }
    var act = b.getAttribute("data-act"), q = find(b.getAttribute("data-id"));
    if (act === "close-drawer") { closeDrawer(); return; }
    if (act === "guide-off") { state.guide = false; save(); render(false); return; }
    if (act === "day") { state.offset++; var n = processAll(); changed(); toast(t.toast.day(n)); return; }
    if (!q) return;
    if (act === "accepted" || act === "declined" || act === "info") { decide(q, act); changed(); toast(t.toast[act]); }
    else if (act === "pause") { q.status = "paused"; log("paused", q); changed(); toast(t.toast.paused); }
    else if (act === "resume") { resume(q); changed(); toast(t.toast.resumed); }
    else if (act === "noreply") {
      var r = nextReminder(q);
      if (!r) { var lastR = q.reminders[q.reminders.length - 1]; state.offset += Math.max(1, diff(add(lastR.sentOn || lastR.due, NO_RESPONSE_AFTER), today())); }
      else state.offset += Math.max(1, diff(r.due, today()));
      var sent = processAll(); changed(); toast(t.toast.day(sent));
    }
    else if (act === "delete") { if (window.confirm(t.q.delConfirm)) { state.quotes = state.quotes.filter(function (x) { return x !== q; }); state.activity = state.activity.filter(function (a) { return a.qid !== q.id; }); state.notifs = state.notifs.filter(function (n) { return n.qid !== q.id; }); state.pristine = false; save(); if (location.hash === "#/quotes") render(false); else location.hash = "#/quotes"; } }
  });
  document.addEventListener("submit", function (ev) { if (ev.target.id === "newForm") { ev.preventDefault(); submitNew(ev.target); } });
  document.addEventListener("input", function (ev) {
    if (ev.target.id !== "f-sent") return;
    var v = ev.target.value, t = L(), box = $("#schedPrev ol, #schedPrev .empty");
    if (!box) return;
    var html = /^\d{4}-\d{2}-\d{2}$/.test(v) ? "<ol>" + DAYS.map(function (d, i) { return "<li>" + esc(t.tl.day(d)) + " · " + esc(t.tl.names[i]) + " — " + esc(fdate(add(v, d), true)) + "</li>"; }).join("") + "</ol>" : '<p class="empty">' + esc(t.nq.previewEmpty) + "</p>";
    box.outerHTML = html;
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !$("#drawer").hidden) closeDrawer(); });
  window.addEventListener("hashchange", function () { render(); });
  var mq = window.matchMedia("(min-width:1100px)"); if (mq.addEventListener) mq.addEventListener("change", function () { render(false); });

  // ---------------------------------------------------------------- start
  state = load();
  if (!state) { var pref = (navigator.language || "sv").toLowerCase().indexOf("sv") === 0 ? "sv" : "en"; var q = /[?&]lang=(sv|en)/.exec(location.search); seed(q ? q[1] : pref); }
  if (!location.hash) history.replaceState(null, "", "#/overview");
  render(false);
})();
