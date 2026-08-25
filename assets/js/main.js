/* ============================================================
   Malameran — shared page behaviour
   Navigation, session-aware header, scroll polish.
   ============================================================ */
(function () {
  'use strict';

  var esc = window.App.escapeHtml;

  /* ---------- mobile navigation ----------------------------- */
  function initMenu() {
    var navbar = document.querySelector('.navbar');
    var toggle = document.querySelector('.menu-toggle');
    if (!navbar || !toggle) return;

    toggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navbar.addEventListener('click', function (event) {
      if (event.target.closest('.nav-links a')) {
        navbar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- header shadow on scroll ----------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var update = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- session-aware account area -------------------- */
  /* Every page ships an empty [data-nav-actions] slot; what goes in
     it depends entirely on whether someone is signed in. */
  function renderAccount() {
    var slot = document.querySelector('[data-nav-actions]');
    if (!slot) return;

    var user = window.App.currentUser();

    if (!user) {
      slot.innerHTML =
        '<a class="nav-login" href="login.html">Log in</a>' +
        '<a class="nav-cta" href="start-project.html">Start Your Project</a>';
      return;
    }

    slot.innerHTML =
      '<a class="nav-cta" href="start-project.html">Start Your Project</a>' +
      '<div class="account">' +
        '<button class="account-btn" type="button" aria-expanded="false" aria-haspopup="true">' +
          '<span class="avatar">' + esc(user.initials) + '</span>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
          '<span class="sr-only">Account menu</span>' +
        '</button>' +
        '<div class="account-menu">' +
          '<div class="account-id"><strong>' + esc(user.fullName) + '</strong><span>' + esc(user.email) + '</span></div>' +
          '<a href="dashboard.html">Dashboard</a>' +
          '<a href="start-project.html">New project</a>' +
          '<button type="button" class="menu-danger" data-logout>Log out</button>' +
        '</div>' +
      '</div>';

    var button = slot.querySelector('.account-btn');
    var menu = slot.querySelector('.account-menu');

    button.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (event) {
      if (!menu.classList.contains('is-open')) return;
      if (slot.contains(event.target)) return;
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    });

    slot.querySelector('[data-logout]').addEventListener('click', function () {
      window.App.logOut();
      window.location.href = 'index.html';
    });
  }

  /* ---------- scroll reveal --------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });
  }

  /* ---------- landing contact form -------------------------- */
  /* Stage one: no email is sent and no record is kept. The form only
     confirms receipt. Project submissions go through start-project. */
  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var success = form.querySelector('[data-form-success]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      window.AppForms.clearErrors(form);
      if (success) success.hidden = true;

      if (!window.AppForms.validateRequired(form, window.App.PROJECT_FIELDS)) return;

      form.reset();
      if (!success) return;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  initMenu();
  initHeader();
  renderAccount();
  initReveal();
  initContactForm();
})();
