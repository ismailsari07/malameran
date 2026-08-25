/* ============================================================
   Malameran — form helpers
   Shared so auth, contact and project intake all report problems
   the same way: inline, next to the field that caused them.
   ============================================================ */
(function (global) {
  'use strict';

  function clearErrors(form) {
    Array.prototype.forEach.call(form.querySelectorAll('.field.has-error'), function (field) {
      field.classList.remove('has-error');
    });
    Array.prototype.forEach.call(form.querySelectorAll('.field-error'), function (slot) {
      slot.textContent = '';
    });
    var alertBox = form.querySelector('[data-form-alert]');
    if (alertBox) {
      alertBox.hidden = true;
      alertBox.textContent = '';
    }
  }

  function showAlert(form, message) {
    var alertBox = form.querySelector('[data-form-alert]');
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.hidden = false;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* Falls back to the form-level alert when the field cannot be found,
     so an error is never swallowed. */
  function showError(form, fieldName, message) {
    var input = fieldName ? form.querySelector('[name="' + fieldName + '"]') : null;
    var wrapper = input ? input.closest('.field') : null;

    if (!wrapper) {
      showAlert(form, message);
      return;
    }

    wrapper.classList.add('has-error');
    var slot = wrapper.querySelector('.field-error');
    if (slot) slot.textContent = message;
    input.focus({ preventScroll: true });
    wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function valuesOf(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (element) {
      if (element.name) data[element.name] = element.value;
    });
    return data;
  }

  /* fields: [{ key, label, required }] — stops at the first problem so
     the visitor is not hit with a wall of red at once. */
  function validateRequired(form, fields) {
    var values = valuesOf(form);

    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];
      if (!field.required) continue;

      if (!String(values[field.key] || '').trim()) {
        showError(form, field.key, field.label + ' is required.');
        return null;
      }

      if (field.key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        showError(form, 'email', 'Please enter a valid email address.');
        return null;
      }
    }

    return values;
  }

  global.AppForms = {
    clearErrors: clearErrors,
    showError: showError,
    showAlert: showAlert,
    valuesOf: valuesOf,
    validateRequired: validateRequired
  };
})(window);
