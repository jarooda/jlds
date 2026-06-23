/* JLDS behavior — Banner dismiss. Clicking .jl-banner__close removes its .jl-banner.
 * Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  register("banner", function (root) {
    root.querySelectorAll(".jl-banner__close").forEach(function (btn) {
      if (btn.__jlBanner) return;
      btn.__jlBanner = true;
      btn.addEventListener("click", function () {
        var el = btn.closest(".jl-banner");
        if (el) el.remove();
      });
    });
  });
})();
