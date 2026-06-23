/* JLDS behavior — Tag remove. Clicking .jl-tag__remove removes its .jl-tag.
 * Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  register("tag", function (root) {
    root.querySelectorAll(".jl-tag__remove").forEach(function (btn) {
      if (btn.__jlTag) return;
      btn.__jlTag = true;
      btn.addEventListener("click", function (e) {
        e.stopPropagation(); // don't trigger a selectable tag's own click
        var el = btn.closest(".jl-tag");
        if (el) el.remove();
      });
    });
  });
})();
