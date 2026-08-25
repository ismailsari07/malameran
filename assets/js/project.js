/* ============================================================
   Malameran — project intake (start-project.html)
   Stage one: the submission is stored so it shows up on the
   dashboard. No email is sent yet.
   ============================================================ */
(function () {
  'use strict';

  var form = document.querySelector('[data-project-form]');
  if (!form) return;

  var panel = document.querySelector('[data-project-success]');
  var another = document.querySelector('[data-submit-another]');

  /* Saves the visitor retyping what we already know about them. */
  function prefill() {
    var user = window.App.currentUser();
    if (!user) return;

    var map = { fullName: user.fullName, email: user.email, companyName: user.company };
    Object.keys(map).forEach(function (name) {
      var input = form.querySelector('[name="' + name + '"]');
      if (input && !input.value) input.value = map[name];
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    window.AppForms.clearErrors(form);

    var values = window.AppForms.validateRequired(form, window.App.PROJECT_FIELDS);
    if (!values) return;

    var result = window.App.addProject(values);
    if (!result.ok) {
      window.AppForms.showAlert(form, result.error);
      return;
    }

    form.hidden = true;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  if (another) {
    another.addEventListener('click', function () {
      form.reset();
      window.AppForms.clearErrors(form);
      panel.hidden = true;
      form.hidden = false;
      prefill();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  prefill();
})();
