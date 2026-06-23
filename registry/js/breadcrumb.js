/* JLDS behavior — Breadcrumb collapse. Clicking .jl-breadcrumb__ellipsis reveals
 * the collapsed middle items (.jl-breadcrumb__collapsed, initially `hidden`) and
 * hides the ellipsis itself. Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  register("breadcrumb", function (root) {
    root.querySelectorAll(".jl-breadcrumb__ellipsis").forEach(function (btn) {
      if (btn.__jlBc) return;
      btn.__jlBc = true;
      btn.addEventListener("click", function () {
        var nav = btn.closest(".jl-breadcrumb");
        if (!nav) return;
        nav.querySelectorAll(".jl-breadcrumb__collapsed").forEach(function (el) {
          el.hidden = false;
        });
        var item = btn.closest(".jl-breadcrumb__item");
        if (item) item.hidden = true;
      });
    });
  });
})();
