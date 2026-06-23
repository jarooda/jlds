/* JLDS behavior layer — shared utilities.
 * Framework-agnostic DOM primitives reused across component behaviors (and the
 * overlay components especially). Exposed as `JLDS.util`. Load before the
 * component behavior files (the all.js bundle orders this right after core).
 */
(function () {
  var J = (window.JLDS = window.JLDS || {});
  var util = (J.util = J.util || {});

  /* Copy text to the clipboard, with a hidden-textarea fallback for old/insecure contexts. */
  util.copy = function (text) {
    function legacy() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch (e) {
        /* noop */
      }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(legacy);
    }
    legacy();
    return Promise.resolve();
  };

  /* Call handler when a pointerdown lands outside `el`. Returns a cleanup fn. */
  util.onClickOutside = function (el, handler) {
    function onDown(e) {
      if (!el.contains(e.target)) handler(e);
    }
    document.addEventListener("pointerdown", onDown, true);
    return function () {
      document.removeEventListener("pointerdown", onDown, true);
    };
  };

  /* Call handler on Escape. Returns a cleanup fn. */
  util.onEscape = function (handler) {
    function onKey(e) {
      if (e.key === "Escape") handler(e);
    }
    document.addEventListener("keydown", onKey);
    return function () {
      document.removeEventListener("keydown", onKey);
    };
  };

  /* Lock body scroll (compensating for the scrollbar). Ref-counted so nested
   * overlays don't unlock early. Returns an unlock fn. */
  var locks = 0;
  var prevOverflow = "";
  var prevPad = "";
  util.lockScroll = function () {
    if (locks === 0) {
      var sbw = window.innerWidth - document.documentElement.clientWidth;
      prevOverflow = document.body.style.overflow;
      prevPad = document.body.style.paddingRight;
      document.body.style.overflow = "hidden";
      if (sbw > 0) document.body.style.paddingRight = sbw + "px";
    }
    locks++;
    var released = false;
    return function unlock() {
      if (released) return;
      released = true;
      locks = Math.max(0, locks - 1);
      if (locks === 0) {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPad;
      }
    };
  };

  var FOCUSABLE =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

  /* Trap Tab focus within `el`, focus the first focusable, and restore focus to
   * the previously-focused element on release. Returns a release fn. */
  util.focusTrap = function (el) {
    var prev = document.activeElement;
    function focusables() {
      return Array.prototype.slice.call(el.querySelectorAll(FOCUSABLE)).filter(function (n) {
        return n.offsetParent !== null || n === document.activeElement;
      });
    }
    function onKey(e) {
      if (e.key !== "Tab") return;
      var f = focusables();
      if (!f.length) {
        e.preventDefault();
        return;
      }
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    el.addEventListener("keydown", onKey);
    var f = focusables();
    (f[0] || el).focus();
    return function release() {
      el.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus();
    };
  };
})();
