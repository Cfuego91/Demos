// Vexari Demo Kit – tiny progressive enhancement. The page works without it.
(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      nav.hidden = !open;
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { btn.setAttribute('aria-expanded', 'false'); nav.hidden = true; }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !nav.hidden) { nav.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  }
  // Demo form: never sends anything. method="dialog" already blocks submission without JS.
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.demo-ok');
      if (ok) { ok.hidden = false; ok.focus(); }
      var b = form.querySelector('button[type=submit]');
      if (b) b.disabled = true;
    });
  });
})();
