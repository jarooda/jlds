/* JLDS behavior — ScrollArea fade masks. For a .jl-scrollarea[data-fade] the
 * viewport's scroll position toggles data-fade-top / data-fade-bottom on the
 * root so the edge gradients reveal only where there is more to scroll.
 * The thin scrollbar itself is pure CSS — this is only for the optional fade.
 * Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initScrollArea(root) {
    if (root.__jlSA) return;
    root.__jlSA = true;
    var vp = root.querySelector(".jl-scrollarea__viewport");
    if (!vp) return;

    function update() {
      var top = vp.scrollTop > 1;
      var bottom = vp.scrollTop + vp.clientHeight < vp.scrollHeight - 1;
      if (top) root.setAttribute("data-fade-top", "true");
      else root.removeAttribute("data-fade-top");
      if (bottom) root.setAttribute("data-fade-bottom", "true");
      else root.removeAttribute("data-fade-bottom");
    }

    vp.addEventListener("scroll", update, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(update);
      ro.observe(vp);
      if (vp.firstElementChild) ro.observe(vp.firstElementChild);
    }
    update();
  }

  register("scroll-area", function (root) {
    root.querySelectorAll(".jl-scrollarea[data-fade]").forEach(initScrollArea);
  });
})();
