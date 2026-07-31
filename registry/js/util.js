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

  /* True below the --bp-mobile breakpoint. Reads the token from :root via
   * getComputedStyle (CSS custom properties can't be used inside @media()), so
   * JS behavior swaps stay in sync with the CSS. Falls back to 600px. The CSS
   * tier-2 promotions (Dialog/menus → bottom sheet) are pure-CSS; use this only
   * for true behavior swaps that JS must drive. */
  util.isMobile = function () {
    var raw = getComputedStyle(document.documentElement).getPropertyValue("--bp-mobile");
    var bp = parseInt(raw, 10) || 600;
    return window.matchMedia
      ? window.matchMedia("(max-width: " + bp + "px)").matches
      : window.innerWidth <= bp;
  };

  /* Call handler when a pointerdown lands outside `el`. Accepts an array of elements
   * too — an anchored popup lives in <body>, so "outside" means outside both the
   * component and its popup. Returns a cleanup fn. */
  util.onClickOutside = function (el, handler) {
    var els = Array.isArray(el) ? el : [el];
    function onDown(e) {
      for (var i = 0; i < els.length; i++) {
        if (els[i] && els[i].contains(e.target)) return;
      }
      handler(e);
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

  /* Anchor `popup` to `anchor`, escaping any clipping ancestor.
   *
   * A popup positioned in-flow (`position: absolute` next to its trigger) is cropped
   * by any ancestor with a non-visible overflow — a Card (`overflow: hidden` for its
   * rounded corners), a scrolling table wrapper, an accordion panel. `z-index` can't
   * help; only a different containing block escapes. So the popup is moved to
   * <body> and positioned against the trigger's viewport rect, flipping above the
   * trigger when there is no room below.
   *
   * Below `opts.sheetBreakpoint` (default --bp-mobile) the component's own @media
   * block docks the popup as a bottom sheet, so positioning steps aside.
   *
   * Options: side ("bottom"|"top"|"left"|"right"), align ("start"|"center"|"end"),
   * gap (px), matchWidth (bool), sheetBreakpoint (px, 0 disables), retainOnClose
   * (bool — keep the last position on release, for popups that fade out in place).
   * Returns a handle: { update, release } — release() restores the popup to its
   * original place in the DOM. Call it when the popup closes. */
  var VIEWPORT_MARGIN = 8;

  function clearPosition(popup) {
    var s = popup.style;
    s.position = "";
    s.top = "";
    s.left = "";
    s.right = "";
    s.bottom = "";
    s.width = "";
    s.margin = "";
    s.translate = "";
    popup.removeAttribute("data-jl-placement");
  }

  /* Keep pos inside the viewport along one axis, without pushing past the near edge
   * when the popup is bigger than the space available. */
  function clampAxis(pos, viewport, size) {
    return Math.min(
      Math.max(pos, VIEWPORT_MARGIN),
      Math.max(VIEWPORT_MARGIN, viewport - size - VIEWPORT_MARGIN)
    );
  }

  util.anchorPopup = function (anchor, popup, opts) {
    opts = opts || {};
    var side = opts.side || "bottom";
    var align = opts.align || "start";
    var gap = opts.gap == null ? 5 : opts.gap;
    var matchWidth = !!opts.matchWidth;
    var retainOnClose = !!opts.retainOnClose;
    var sheetBp = opts.sheetBreakpoint == null ? null : opts.sheetBreakpoint;

    var parent = popup.parentNode;
    var next = popup.nextSibling;
    if (parent !== document.body) document.body.appendChild(popup);
    popup.setAttribute("data-jl-anchored", "");

    function docked() {
      if (sheetBp === 0) return false;
      return sheetBp == null ? util.isMobile() : window.matchMedia("(max-width: " + sheetBp + "px)").matches;
    }

    function update() {
      if (docked()) {
        popup.setAttribute("data-jl-docked", "");
        clearPosition(popup);
        return;
      }
      popup.removeAttribute("data-jl-docked");

      var a = anchor.getBoundingClientRect();
      var s = popup.style;

      // Neutralize the component's in-flow rule (`top: calc(100% + 5px)`, `right: 0`,
      // the `translate` some popups centre themselves with) before measuring, and take
      // the anchor's width first so the height we measure is the height at the final width.
      s.position = "fixed";
      s.right = "auto";
      s.bottom = "auto";
      s.margin = "0";
      s.translate = "none";
      if (matchWidth) s.width = a.width + "px";

      var p = popup.getBoundingClientRect();
      var vw = document.documentElement.clientWidth;
      var vh = document.documentElement.clientHeight;
      var top, left, placement;

      if (side === "left" || side === "right") {
        // Horizontal sides: `align` runs down the anchor's edge instead of across it.
        var fitsRight = p.width <= vw - a.right - gap;
        var fitsLeft = p.width <= a.left - gap;
        var onLeft = side === "left" ? fitsLeft || !fitsRight : !fitsRight && fitsLeft;
        left = onLeft ? a.left - p.width - gap : a.right + gap;
        top =
          align === "start" ? a.top : align === "end" ? a.bottom - p.height : a.top + (a.height - p.height) / 2;
        placement = onLeft ? "left" : "right";
      } else {
        var fitsBelow = p.height <= vh - a.bottom - gap;
        var fitsAbove = p.height <= a.top - gap;
        var onTop = side === "top" ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove;
        top = onTop ? a.top - p.height - gap : a.bottom + gap;
        left =
          align === "end" ? a.right - p.width : align === "center" ? a.left + (a.width - p.width) / 2 : a.left;
        placement = onTop ? "top" : "bottom";
      }

      s.top = Math.round(clampAxis(top, vh, p.height)) + "px";
      s.left = Math.round(clampAxis(left, vw, p.width)) + "px";
      popup.setAttribute("data-jl-placement", placement);
    }

    update();
    // Capture-phase scroll so the popup follows a scrolling ancestor, not just the page.
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    var ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(popup);
      ro.observe(anchor);
    }

    return {
      update: update,
      release: function () {
        window.removeEventListener("scroll", update, true);
        window.removeEventListener("resize", update);
        if (ro) ro.disconnect();
        if (!retainOnClose) clearPosition(popup);
        popup.removeAttribute("data-jl-anchored");
        popup.removeAttribute("data-jl-docked");
        if (parent && popup.parentNode !== parent) parent.insertBefore(popup, next);
      },
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
