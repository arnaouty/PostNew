// TQM – Tri-QM for Export: site behaviour

(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Mobile navigation ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // ---------- Active nav link while scrolling ----------
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    // The hero has no nav link, so reaching it clears the highlight
    Object.keys(byId).concat('top').forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  // ---------- Sector tabs ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  // Product cards can open a specific sector tab
  document.querySelectorAll('[data-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      var tab = document.getElementById('tab-' + link.getAttribute('data-tab'));
      if (tab) selectTab(tab);
    });
  });

  // ---------- Enquiry form ----------
  // There is no server yet, so a valid enquiry is shown ready to send:
  // the visitor can copy it or open it in their email app.
  // Swap this for a form service when hosting is chosen.
  var ENQUIRY_EMAIL = 'm.ali@qm-eg.com';
  var ENQUIRY_CC = 'm.ismail@qm-eg.com';
  var form = document.getElementById('enquiry');
  var status = document.getElementById('form-status');
  var ready = document.getElementById('enquiry-ready');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var required = ['company', 'name', 'email', 'message'];
      var firstInvalid = null;

      required.forEach(function (name) {
        var input = f[name];
        var value = input.value.trim();
        var ok = value !== '' && (name !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        input.classList.toggle('invalid', !ok);
        input.setAttribute('aria-invalid', String(!ok));
        if (!ok && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        ready.hidden = true;
        status.className = 'form-status error';
        status.textContent = 'Please fill in company, contact name, a valid email and your message.';
        firstInvalid.focus();
        return;
      }

      var subject = 'Quote request: ' + f.product.value + ' – ' + f.company.value.trim();
      var body = [
        'Company: ' + f.company.value.trim(),
        'Contact: ' + f.name.value.trim(),
        'Email: ' + f.email.value.trim(),
        'Phone / WhatsApp: ' + f.phone.value.trim(),
        'Product: ' + f.product.value,
        'Quantity (tons/month): ' + f.quantity.value.trim(),
        'Delivery country / port: ' + f.destination.value.trim(),
        '',
        f.message.value.trim()
      ].join('\n');

      document.getElementById('enquiry-text').textContent = 'Subject: ' + subject + '\n\n' + body;
      document.getElementById('enquiry-mail').href = 'mailto:' + ENQUIRY_EMAIL +
        '?cc=' + encodeURIComponent(ENQUIRY_CC) +
        '&subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      status.className = 'form-status';
      status.textContent = '';
      ready.hidden = false;
      ready.scrollIntoView({ block: 'nearest' });
    });

    document.getElementById('enquiry-copy').addEventListener('click', function () {
      var button = this;
      var text = document.getElementById('enquiry-text');
      function selectText() {
        var range = document.createRange();
        range.selectNodeContents(text);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        button.textContent = 'Selected – press Ctrl+C';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text.textContent).then(function () {
          button.textContent = 'Copied';
        }, selectText);
      } else {
        selectText();
      }
    });
  }
})();
