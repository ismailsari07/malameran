/* ============================================================
   Malameran — auth pages and route protection
   Loaded in <head> on protected pages so the redirect happens
   before anything paints.
   ============================================================ */
(function (global) {
  'use strict';

  /* Only same-folder .html pages are accepted as a redirect target,
     so a crafted ?next= cannot bounce anyone off-site. */
  var SAFE_NEXT = /^[a-z0-9-]+\.html(#[\w/:-]*)?$/i;

  function requestedNext() {
    var match = /[?&]next=([^&]+)/.exec(global.location.search);
    if (!match) return '';
    var value = '';
    try {
      value = decodeURIComponent(match[1]);
    } catch (err) {
      return '';
    }
    return SAFE_NEXT.test(value) ? value : '';
  }

  function currentPage() {
    var file = global.location.pathname.split('/').pop() || 'index.html';
    return file + global.location.hash;
  }

  /* Called by protected pages before render. */
  function requireAuth() {
    if (global.App.currentUser()) return true;
    global.location.replace('login.html?next=' + encodeURIComponent(currentPage()));
    return false;
  }

  /* Called by login/signup so a signed-in visitor does not sit on a
     form they no longer need. */
  function redirectIfSignedIn() {
    if (!global.App.currentUser()) return false;
    global.location.replace(requestedNext() || 'dashboard.html');
    return true;
  }

  function initForms() {
    var forms = global.AppForms;
    var signupForm = document.querySelector('[data-signup-form]');
    var loginForm = document.querySelector('[data-login-form]');

    if (signupForm) {
      signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        forms.clearErrors(signupForm);

        var data = forms.valuesOf(signupForm);
        var result = global.App.signUp({
          fullName: data.fullName,
          email: data.email,
          company: data.company,
          password: data.password
        });

        if (!result.ok) {
          forms.showError(signupForm, result.field, result.error);
          return;
        }
        /* Sign-up signs you straight in — no verification step. */
        global.location.href = requestedNext() || 'dashboard.html';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        forms.clearErrors(loginForm);

        var data = forms.valuesOf(loginForm);
        var result = global.App.logIn(data.email, data.password);

        if (!result.ok) {
          forms.showError(loginForm, result.field, result.error);
          return;
        }
        global.location.href = requestedNext() || 'dashboard.html';
      });
    }

    /* Carry ?next= across the login <-> signup links so the visitor
       still lands where they were originally headed. */
    var next = requestedNext();
    if (next) {
      Array.prototype.forEach.call(document.querySelectorAll('[data-keep-next]'), function (link) {
        link.href = link.getAttribute('href').split('?')[0] + '?next=' + encodeURIComponent(next);
      });
    }
  }

  global.AppAuth = {
    requireAuth: requireAuth,
    redirectIfSignedIn: redirectIfSignedIn,
    requestedNext: requestedNext
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})(window);
