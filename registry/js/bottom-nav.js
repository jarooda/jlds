/* JLDS behavior — BottomNav. Click a tab to make it current: sets aria-current="page"
 * on the tapped .jl-bottomnav__item and clears its siblings. Emits jl-bottomnav:change
 * with the item's data-id. Requires core.js (or the all.js bundle).
 * Contract: .jl-bottomnav holds .jl-bottomnav__item buttons, each with a data-id. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initBottomNav(nav) {
    if (nav.__jlBottomNav) return;
    nav.__jlBottomNav = true;

    var items = Array.prototype.slice.call(nav.querySelectorAll(".jl-bottomnav__item"));
    if (!items.length) return;

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        items.forEach(function (t) {
          t.removeAttribute("aria-current");
        });
        item.setAttribute("aria-current", "page");
        nav.dispatchEvent(
          new CustomEvent("jl-bottomnav:change", {
            detail: { id: item.getAttribute("data-id") },
            bubbles: true,
          })
        );
      });
    });
  }

  register("bottom-nav", function (root) {
    root.querySelectorAll(".jl-bottomnav").forEach(initBottomNav);
  });
})();
