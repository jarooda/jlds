/* JLDS behavior — Alert dismiss. Clicking .jl-alert__close removes its .jl-alert.
 * Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  register("alert", function (root) {
    root.querySelectorAll(".jl-alert__close").forEach(function (btn) {
      if (btn.__jlAlert) return;
      btn.__jlAlert = true;
      btn.addEventListener("click", function () {
        var el = btn.closest(".jl-alert");
        if (el) el.remove();
      });
    });
  });
})();
