/* ============================================================
   Malameran — client dashboard
   Two views, switched by the URL hash so the browser back button
   works: the project list, and one project's detail.
   ============================================================ */
(function () {
  'use strict';

  var side = document.querySelector('[data-dash-side]');
  var main = document.querySelector('[data-dash-main]');
  if (!side || !main) return;

  var esc = window.App.escapeHtml;

  var ICON_FOLDER =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

  /* ---------- sidebar --------------------------------------- */
  function renderSide(count) {
    var user = window.App.currentUser();
    if (!user) return;

    side.innerHTML =
      '<div class="dash-user">' +
        '<span class="avatar">' + esc(user.initials) + '</span>' +
        '<span class="dash-user-id">' +
          '<strong>' + esc(user.fullName) + '</strong>' +
          '<span>' + esc(user.company) + '</span>' +
        '</span>' +
      '</div>' +
      '<nav class="dash-nav" aria-label="Dashboard sections">' +
        '<span class="dash-nav-label">Menu</span>' +
        '<a href="#" class="is-active" aria-current="page">' + ICON_FOLDER + 'Projects' +
          '<span class="count">' + count + '</span>' +
        '</a>' +
      '</nav>';
  }

  /* ---------- project list ---------------------------------- */
  function renderList(projects) {
    if (!projects.length) {
      main.innerHTML =
        '<div class="dash-bar"><div><h1>Projects</h1><p>Everything you have submitted to our team.</p></div></div>' +
        '<div class="empty-state">' +
          '<div class="empty-mark" aria-hidden="true">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 11v5M9.5 13.5h5"/></svg>' +
          '</div>' +
          '<h3>No projects yet</h3>' +
          '<p>Once you submit your first procurement requirement, it will show up here.</p>' +
          '<a class="btn btn-primary" href="start-project.html">Start Your Project</a>' +
        '</div>';
      return;
    }

    var rows = projects.map(function (project) {
      return '' +
        '<a class="project-row" href="#project/' + esc(project.id) + '">' +
          '<div>' +
            '<h3>' + esc(project.sourcing || 'Untitled project') + '</h3>' +
            '<div class="project-meta">' +
              '<span>' + esc(window.App.formatDate(project.createdAt)) + '</span>' +
              '<span>' + esc(project.inquiryType) + '</span>' +
              '<span class="badge">' + esc(project.status) + '</span>' +
            '</div>' +
          '</div>' +
          '<span class="project-go" aria-hidden="true">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>' +
          '</span>' +
        '</a>';
    }).join('');

    main.innerHTML =
      '<div class="dash-bar">' +
        '<div><h1>Projects</h1><p>' + projects.length + ' project' + (projects.length === 1 ? '' : 's') + ' submitted.</p></div>' +
        '<a class="btn btn-primary" href="start-project.html">New project</a>' +
      '</div>' +
      '<div class="project-list">' + rows + '</div>';
  }

  /* ---------- project detail -------------------------------- */
  function renderDetail(project) {
    /* Long-form answers get a full-width row so they stay readable. */
    var WIDE = { sourcing: true, message: true };

    var fields = window.App.PROJECT_FIELDS.map(function (field) {
      var value = project[field.key];
      var isEmpty = !value;
      return '' +
        '<div' + (WIDE[field.key] ? ' class="is-wide"' : '') + '>' +
          '<dt>' + esc(field.label) + '</dt>' +
          '<dd' + (isEmpty ? ' class="is-empty"' : '') + '>' + esc(isEmpty ? 'Not provided' : value) + '</dd>' +
        '</div>';
    }).join('');

    main.innerHTML =
      '<a class="back-link" href="#">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>' +
        'Back to projects' +
      '</a>' +
      '<div class="detail-card">' +
        '<div class="detail-head">' +
          '<div>' +
            '<h2>' + esc(project.sourcing || 'Untitled project') + '</h2>' +
            '<div class="project-meta">' +
              '<span>Submitted ' + esc(window.App.formatDate(project.createdAt)) + '</span>' +
              '<span>' + esc(project.inquiryType) + '</span>' +
            '</div>' +
          '</div>' +
          '<span class="badge">' + esc(project.status) + '</span>' +
        '</div>' +
        '<dl class="detail-fields">' + fields + '</dl>' +
        '<div class="detail-attachments">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.5l-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.6 1.6 0 0 1-2.3-2.3l7.8-7.8"/></svg>' +
          '<div><strong>Attachments</strong><span>Image and document uploads will appear here in a later stage.</span></div>' +
        '</div>' +
      '</div>';
  }

  function renderMissing() {
    main.innerHTML =
      '<a class="back-link" href="#">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>' +
        'Back to projects' +
      '</a>' +
      '<div class="empty-state">' +
        '<h3>Project not found</h3>' +
        '<p>This project either does not exist or belongs to a different account.</p>' +
        '<a class="btn btn-secondary" href="#">Back to projects</a>' +
      '</div>';
  }

  /* ---------- routing --------------------------------------- */
  function route() {
    var projects = window.App.listProjects();
    renderSide(projects.length);

    var match = /^#project\/(.+)$/.exec(window.location.hash);
    if (!match) {
      renderList(projects);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    var project = window.App.getProject(match[1]);
    if (project) {
      renderDetail(project);
    } else {
      renderMissing();
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  window.addEventListener('hashchange', route);
  route();
})();
