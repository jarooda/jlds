/* JLDS behavior — CommandPalette (declarative HTML). Enhances a
 * .jl-cmdk__overlay[hidden]: a global ⌘K/Ctrl-K toggle (or data-key), fuzzy
 * filter over the .jl-cmdk__item rows (matches text + data-keywords), arrow/
 * enter/escape nav, overlay-click + Esc close, and scroll-lock via JLDS.util.
 * A `[data-cmdk-trigger]` element (optional data-cmdk-target="#id") also opens it.
 * Requires core.js + util.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initOverlay(overlay) {
    if (overlay.__jlCmdk) return;
    overlay.__jlCmdk = true;
    var input = overlay.querySelector(".jl-cmdk__input");
    var list = overlay.querySelector(".jl-cmdk__list");
    var items = Array.prototype.slice.call(overlay.querySelectorAll(".jl-cmdk__item"));
    var emptyEl = overlay.querySelector(".jl-cmdk__empty");
    var key = (overlay.dataset.key || "k").toLowerCase();
    var active = 0;
    var unlock = null;

    function text(it) {
      var l = it.querySelector(".jl-cmdk__item-label");
      return ((l ? l.textContent : it.textContent) + " " + (it.dataset.keywords || "")).toLowerCase();
    }
    function visible() {
      return items.filter(function (it) {
        return it.style.display !== "none" && it.getAttribute("aria-disabled") !== "true";
      });
    }
    function setActive(i) {
      var vis = visible();
      active = Math.max(0, Math.min(vis.length - 1, i));
      items.forEach(function (it) { it.removeAttribute("data-active"); });
      var el = vis[active];
      if (!el) return;
      el.setAttribute("data-active", "true");
      if (list) {
        var top = el.offsetTop;
        var bottom = top + el.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top - 8;
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 8;
      }
    }
    function filter() {
      var tokens = (input ? input.value : "").toLowerCase().split(/\s+/).filter(Boolean);
      var any = false;
      items.forEach(function (it) {
        var ok = tokens.every(function (t) { return text(it).indexOf(t) >= 0; });
        it.style.display = ok ? "" : "none";
        if (ok) any = true;
      });
      if (emptyEl) emptyEl.style.display = any ? "none" : "";
      setActive(0);
    }
    function open() {
      if (!overlay.hidden) return;
      overlay.hidden = false;
      var u = window.JLDS && window.JLDS.util;
      unlock = u && u.lockScroll ? u.lockScroll() : function () {};
      if (input) input.value = "";
      filter();
      setTimeout(function () { input && input.focus(); }, 20);
    }
    function close() {
      if (overlay.hidden) return;
      overlay.hidden = true;
      if (unlock) { unlock(); unlock = null; }
    }
    overlay.__cmdkOpen = open;
    overlay.__cmdkClose = close;

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key) {
        e.preventDefault();
        if (overlay.hidden) open();
        else close();
      }
    });
    overlay.addEventListener("mousedown", function (e) {
      if (e.target === overlay) close();
    });
    if (input) {
      input.addEventListener("input", filter);
      input.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
        else if (e.key === "Enter") { e.preventDefault(); var it = visible()[active]; if (it) it.click(); }
        else if (e.key === "Escape") { e.preventDefault(); close(); }
      });
    }
    items.forEach(function (it) {
      it.addEventListener("mousemove", function () {
        var i = visible().indexOf(it);
        if (i >= 0) setActive(i);
      });
      it.addEventListener("click", function () {
        if (it.getAttribute("aria-disabled") === "true") return;
        close();
      });
    });
    if (!overlay.hasAttribute("hidden")) overlay.hidden = true;
  }

  register("cmdk", function (root) {
    root.querySelectorAll(".jl-cmdk__overlay").forEach(initOverlay);
    root.querySelectorAll("[data-cmdk-trigger]").forEach(function (trigger) {
      if (trigger.__jlCmdkTrig) return;
      trigger.__jlCmdkTrig = true;
      trigger.addEventListener("click", function () {
        var sel = trigger.getAttribute("data-cmdk-target");
        var overlay = sel ? document.querySelector(sel) : document.querySelector(".jl-cmdk__overlay");
        if (overlay && overlay.__cmdkOpen) overlay.__cmdkOpen();
      });
    });
  });
})();
