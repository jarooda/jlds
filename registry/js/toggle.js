/* JLDS behavior — Toggle. A standalone .jl-toggle flips its own aria-pressed;
 * a .jl-toggle-group manages single (default) or data-type="multiple" selection.
 * Emits jl-toggle:change. Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function val(btn) {
    return btn.dataset.value || btn.textContent.trim();
  }

  function initStandalone(btn) {
    if (btn.__jlToggle || btn.closest(".jl-toggle-group")) return;
    btn.__jlToggle = true;
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      var on = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", on ? "false" : "true");
      btn.dispatchEvent(
        new CustomEvent("jl-toggle:change", { detail: { pressed: !on }, bubbles: true })
      );
    });
  }

  function initGroup(group) {
    if (group.__jlToggle) return;
    group.__jlToggle = true;
    var multiple = group.dataset.type === "multiple";
    var btns = Array.prototype.slice.call(group.querySelectorAll(".jl-toggle"));

    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        var on = btn.getAttribute("aria-pressed") === "true";
        if (multiple) {
          btn.setAttribute("aria-pressed", on ? "false" : "true");
        } else {
          btns.forEach(function (b) {
            b.setAttribute("aria-pressed", "false");
          });
          if (!on) btn.setAttribute("aria-pressed", "true");
        }
        var value;
        if (multiple) {
          value = btns
            .filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })
            .map(val);
        } else {
          var sel = group.querySelector('.jl-toggle[aria-pressed="true"]');
          value = sel ? val(sel) : null;
        }
        group.dispatchEvent(
          new CustomEvent("jl-toggle:change", { detail: { value: value }, bubbles: true })
        );
      });
    });
  }

  register("toggle", function (root) {
    root.querySelectorAll(".jl-toggle-group").forEach(initGroup);
    root.querySelectorAll(".jl-toggle").forEach(initStandalone);
  });
})();
