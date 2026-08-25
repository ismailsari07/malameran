/* ============================================================
   Malameran — data layer
   ------------------------------------------------------------
   This is the ONLY file that talks to storage. Every page calls
   these functions and nothing else, so when a real backend lands
   you replace the bodies here with fetch() calls and no page code
   has to change.

   NOTE: this is a first-stage prototype. Accounts live in the
   browser, so data is per-device and there is NO real security
   here. Do not ship this to production as-is.
   ============================================================ */
(function (global) {
  'use strict';

  var USERS_KEY = 'malameran.users';
  var SESSION_KEY = 'malameran.session';
  var PROJECTS_KEY = 'malameran.projects';

  /* --- storage with an in-memory fallback ------------------- */
  /* Private browsing and some file:// setups throw on localStorage.
     Falling back keeps the demo usable instead of crashing. */
  var store = (function () {
    try {
      var probe = '__malameran_probe__';
      global.localStorage.setItem(probe, '1');
      global.localStorage.removeItem(probe);
      return global.localStorage;
    } catch (err) {
      var memory = {};
      return {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null; },
        setItem: function (k, v) { memory[k] = String(v); },
        removeItem: function (k) { delete memory[k]; }
      };
    }
  })();

  function read(key, fallback) {
    try {
      var raw = store.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  /* --- helpers ---------------------------------------------- */

  /* Deliberately NOT a security measure — it only keeps plain
     passwords out of the storage inspector. A real backend must
     hash properly (bcrypt/argon2) server-side. */
  function obscure(password) {
    var hash = 5381;
    var salted = 'malameran::' + password;
    for (var i = 0; i < salted.length; i += 1) {
      hash = ((hash << 5) + hash + salted.charCodeAt(i)) >>> 0;
    }
    return 'v1$' + hash.toString(36) + '$' + salted.length.toString(36);
  }

  function normaliseEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function makeId() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initialsOf(fullName) {
    var parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function formatDate(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /* --- project shape ---------------------------------------- */
  /* Single source of truth for the project form and the dashboard
     detail view, so labels can never drift apart. */
  var PROJECT_FIELDS = [
    { key: 'fullName', label: 'Full Name', required: true },
    { key: 'companyName', label: 'Company Name' },
    { key: 'email', label: 'Email Address', required: true },
    { key: 'phone', label: 'Phone Number' },
    { key: 'country', label: 'Country' },
    { key: 'industry', label: 'Industry' },
    { key: 'inquiryType', label: 'Inquiry Type', required: true },
    { key: 'sourcing', label: 'What are you looking to source?', required: true },
    { key: 'quantity', label: 'Estimated order quantity or project size' },
    { key: 'preferredCountry', label: 'Preferred supplier country' },
    { key: 'message', label: 'Message', required: true }
  ];

  /* --- accounts --------------------------------------------- */

  function allUsers() {
    var users = read(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
  }

  function findUser(email) {
    var target = normaliseEmail(email);
    var users = allUsers();
    for (var i = 0; i < users.length; i += 1) {
      if (normaliseEmail(users[i].email) === target) return users[i];
    }
    return null;
  }

  /* All auth calls return { ok: true, user } or { ok: false, error, field }
     so pages can put the message next to the right input. */
  function signUp(input) {
    var fullName = String(input.fullName || '').trim();
    var email = normaliseEmail(input.email);
    var company = String(input.company || '').trim();
    var password = String(input.password || '');

    /* Wording matches the field labels and the project form, so the
       whole site reports missing input the same way. */
    if (!fullName) return { ok: false, field: 'fullName', error: 'Full Name is required.' };
    if (!email) return { ok: false, field: 'email', error: 'Email Address is required.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, field: 'email', error: 'Please enter a valid email address.' };
    if (!company) return { ok: false, field: 'company', error: 'Company Name is required.' };
    if (password.length < 6) return { ok: false, field: 'password', error: 'Password must be at least 6 characters.' };
    if (findUser(email)) return { ok: false, field: 'email', error: 'An account with this email already exists.' };

    var user = {
      fullName: fullName,
      email: email,
      company: company,
      password: obscure(password),
      createdAt: new Date().toISOString()
    };

    var users = allUsers();
    users.push(user);
    if (!write(USERS_KEY, users)) {
      return { ok: false, error: 'Could not save your account in this browser.' };
    }

    write(SESSION_KEY, { email: email });
    return { ok: true, user: publicUser(user) };
  }

  function logIn(email, password) {
    var normalised = normaliseEmail(email);
    if (!normalised) return { ok: false, field: 'email', error: 'Email Address is required.' };
    if (!password) return { ok: false, field: 'password', error: 'Password is required.' };

    var user = findUser(normalised);
    /* Same message for both cases so the form does not confirm
       which emails have accounts. */
    if (!user || user.password !== obscure(String(password))) {
      return { ok: false, field: 'password', error: 'Email or password is incorrect.' };
    }

    write(SESSION_KEY, { email: normalised });
    return { ok: true, user: publicUser(user) };
  }

  function logOut() {
    try {
      store.removeItem(SESSION_KEY);
    } catch (err) { /* nothing useful to do */ }
  }

  function publicUser(user) {
    if (!user) return null;
    return {
      fullName: user.fullName,
      email: user.email,
      company: user.company,
      createdAt: user.createdAt,
      initials: initialsOf(user.fullName)
    };
  }

  function currentUser() {
    var session = read(SESSION_KEY, null);
    if (!session || !session.email) return null;
    return publicUser(findUser(session.email));
  }

  /* --- projects --------------------------------------------- */

  function allProjects() {
    var projects = read(PROJECTS_KEY, []);
    return Array.isArray(projects) ? projects : [];
  }

  function addProject(data) {
    var user = currentUser();
    if (!user) return { ok: false, error: 'You need to be signed in to submit a project.' };

    var project = {
      id: makeId(),
      ownerEmail: user.email,
      createdAt: new Date().toISOString(),
      status: 'Submitted'
    };

    PROJECT_FIELDS.forEach(function (field) {
      project[field.key] = String(data[field.key] || '').trim();
    });

    var projects = allProjects();
    projects.push(project);
    if (!write(PROJECTS_KEY, projects)) {
      return { ok: false, error: 'Could not save your project in this browser.' };
    }

    return { ok: true, project: project };
  }

  /* Newest first — the dashboard shows recent work at the top. */
  function listProjects() {
    var user = currentUser();
    if (!user) return [];
    return allProjects()
      .filter(function (project) { return normaliseEmail(project.ownerEmail) === user.email; })
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  }

  function getProject(id) {
    var user = currentUser();
    if (!user) return null;
    var matches = allProjects().filter(function (project) {
      return project.id === id && normaliseEmail(project.ownerEmail) === user.email;
    });
    return matches.length ? matches[0] : null;
  }

  global.App = {
    PROJECT_FIELDS: PROJECT_FIELDS,
    signUp: signUp,
    logIn: logIn,
    logOut: logOut,
    currentUser: currentUser,
    addProject: addProject,
    listProjects: listProjects,
    getProject: getProject,
    escapeHtml: escapeHtml,
    initialsOf: initialsOf,
    formatDate: formatDate
  };
})(window);
