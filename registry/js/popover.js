/* JLDS behavior — Popover. Click the trigger to open the .jl-popover__pop panel
 * (initially `hidden`); closes on outside-click or Esc via JLDS.util. Emits
 * jl-popover:toggle. Requires core.js + util.js (or the all.js bundle).
 * Contract: .jl-popover holds a trigger (first <button>, or [data-popover-trigger])
 * and a `.jl-popover__pop[hidden]` panel. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initPopover(pop) {
    if (pop.__jlPop) return;
    pop.__jlPop = true;
    var trigger = pop.querySelector("[data-popover-trigger]") || pop.querySelector("button");
    var panel = pop.querySelector(".jl-popover__pop");
    if (!trigger || !panel) return;

    var cleanup = null;

    function close() {
      if (panel.hidden) return;
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
      pop.dispatchEvent(new CustomEvent("jl-popover:toggle", { detail: { open: false }, bubbles: true }));
    }
    function open() {
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      var u = window.JLDS && window.JLDS.util;
      var offOutside = u && u.onClickOutside ? u.onClickOutside(pop, close) : function () {};
      var offEsc = u && u.onEscape ? u.onEscape(close) : function () {};
      cleanup = function () {
        offOutside();
        offEsc();
      };
      pop.dispatchEvent(new CustomEvent("jl-popover:toggle", { detail: { open: true }, bubbles: true }));
    }

    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    if (!panel.hasAttribute("hidden")) panel.hidden = true;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panel.hidden) open();
      else close();
    });
  }

  register("popover", function (root) {
    root.querySelectorAll(".jl-popover").forEach(initPopover);
  });
})();
