/* JLDS behavior — Drawer. A slide-in overlay (.jl-drawer__overlay[hidden][data-side])
 * opened by a [data-drawer-trigger] (optional data-drawer-target="#id"); closes on
 * overlay click, Esc, .jl-drawer__close, or [data-drawer-close]. Locks body scroll
 * and traps focus via JLDS.util while open. Requires core.js + util.js (or all.js). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initOverlay(overlay) {
    if (overlay.__jlDrawer) return;
    overlay.__jlDrawer = true;
    var panel = overlay.querySelector(".jl-drawer");
    var cleanup = null;

    function close() {
      if (overlay.hidden) return;
      overlay.hidden = true;
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    }
    function open() {
      if (!overlay.hidden) return;
      overlay.hidden = false;
      var u = window.JLDS && window.JLDS.util;
      var unlock = u && u.lockScroll ? u.lockScroll() : function () {};
      var release = u && u.focusTrap && panel ? u.focusTrap(panel) : function () {};
      var offEsc = u && u.onEscape ? u.onEscape(close) : function () {};
      cleanup = function () {
        unlock();
        release();
        offEsc();
      };
    }
    overlay.__open = open;
    overlay.__close = close;

    overlay.addEventListener("mousedown", function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelectorAll(".jl-drawer__close, [data-drawer-close]").forEach(function (b) {
      b.addEventListener("click", close);
    });
    if (!overlay.hasAttribute("hidden")) overlay.hidden = true;
  }

  register("drawer", function (root) {
    root.querySelectorAll(".jl-drawer__overlay").forEach(initOverlay);
    root.querySelectorAll("[data-drawer-trigger]").forEach(function (trigger) {
      if (trigger.__jlDrawerTrig) return;
      trigger.__jlDrawerTrig = true;
      trigger.addEventListener("click", function () {
        var sel = trigger.getAttribute("data-drawer-target");
        var overlay = sel ? document.querySelector(sel) : document.querySelector(".jl-drawer__overlay");
        if (overlay && overlay.__open) overlay.__open();
      });
    });
  });
})();
