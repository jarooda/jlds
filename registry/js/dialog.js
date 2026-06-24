/* JLDS behavior — Dialog. A modal overlay (.jl-dialog__overlay[hidden]) opened by
 * a [data-dialog-trigger] (optional data-dialog-target="#id"); closes on overlay
 * click, Esc, .jl-dialog__close, or [data-dialog-close]. While open it locks body
 * scroll and traps focus via JLDS.util. Requires core.js + util.js (or all.js). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initOverlay(overlay) {
    if (overlay.__jlDialog) return;
    overlay.__jlDialog = true;
    var panel = overlay.querySelector(".jl-dialog");
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
    overlay.querySelectorAll(".jl-dialog__close, [data-dialog-close]").forEach(function (b) {
      b.addEventListener("click", close);
    });
    if (!overlay.hasAttribute("hidden")) overlay.hidden = true;
  }

  register("dialog", function (root) {
    root.querySelectorAll(".jl-dialog__overlay").forEach(initOverlay);
    root.querySelectorAll("[data-dialog-trigger]").forEach(function (trigger) {
      if (trigger.__jlDialogTrig) return;
      trigger.__jlDialogTrig = true;
      trigger.addEventListener("click", function () {
        var sel = trigger.getAttribute("data-dialog-target");
        var overlay = sel ? document.querySelector(sel) : document.querySelector(".jl-dialog__overlay");
        if (overlay && overlay.__open) overlay.__open();
      });
    });
  });
})();
