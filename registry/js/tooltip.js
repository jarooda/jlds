/* JLDS behavior — Tooltip. Shows the .jl-tooltip__pop on hover/focus of the
 * .jl-tooltip wrapper (after an optional data-delay). Requires core.js (or all.js).
 * Positioning is pure CSS via the pop's data-side. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initTooltip(tip) {
    if (tip.__jlTip) return;
    tip.__jlTip = true;
    var pop = tip.querySelector(".jl-tooltip__pop");
    if (!pop) return;
    var delay = parseInt(tip.dataset.delay, 10);
    if (isNaN(delay)) delay = 120;
    var timer;

    function open() {
      timer = setTimeout(function () {
        pop.setAttribute("data-show", "true");
      }, delay);
    }
    function close() {
      clearTimeout(timer);
      pop.removeAttribute("data-show");
    }

    tip.addEventListener("mouseenter", open);
    tip.addEventListener("mouseleave", close);
    tip.addEventListener("focusin", open);
    tip.addEventListener("focusout", close);
  }

  register("tooltip", function (root) {
    root.querySelectorAll(".jl-tooltip").forEach(initTooltip);
  });
})();
