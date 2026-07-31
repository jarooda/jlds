/* JLDS behavior — Tooltip. Shows the .jl-tooltip__pop on hover/focus of the
 * .jl-tooltip wrapper (after an optional data-delay). Requires core.js + util.js
 * (or all.js). The bubble is anchored to the trigger via JLDS.util.anchorPopup so a
 * clipping ancestor (a Card, a scrolling table wrapper) can't crop it; the pop's
 * data-side is the requested side, data-jl-placement the one it landed on. */
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
    var anchored = null;

    function open() {
      timer = setTimeout(function () {
        var u = window.JLDS && window.JLDS.util;
        if (u && u.anchorPopup && !anchored) {
          anchored = u.anchorPopup(tip, pop, {
            side: pop.getAttribute("data-side") || "top",
            align: "center",
            gap: 8,
            sheetBreakpoint: 0,
            // Keep the position while it fades out, then release on the next open.
            retainOnClose: true,
          });
        }
        pop.setAttribute("data-show", "true");
      }, delay);
    }
    function close() {
      clearTimeout(timer);
      pop.removeAttribute("data-show");
      if (anchored) {
        anchored.release();
        anchored = null;
      }
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
