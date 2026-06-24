/* JLDS behavior — Combobox (single-select, declarative). Enhances a .jl-combobox
 * whose options are in the DOM (.jl-combobox__opt[data-value]): open on focus,
 * filter by the typed text, arrow/enter/escape keyboard nav, and single-select.
 * Emits jl-combobox:change { value }. Requires core.js + util.js (or all.js).
 * (Multiple/chips, creatable, and async are React/Vue-only.) */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  var CHECK =
    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function initCombobox(cb) {
    if (cb.__jlCombobox) return;
    cb.__jlCombobox = true;

    var control = cb.querySelector(".jl-combobox__control");
    var input = cb.querySelector(".jl-combobox__input");
    var single = cb.querySelector(".jl-combobox__single");
    var pop = cb.querySelector(".jl-combobox__pop");
    var opts = Array.prototype.slice.call(cb.querySelectorAll(".jl-combobox__opt"));
    if (!input || !pop || !opts.length) return;

    var active = 0;
    var cleanup = null;

    function labelOf(opt) {
      var l = opt.querySelector(".jl-combobox__opt-label");
      return (l ? l.textContent : opt.textContent).trim();
    }
    function visible() {
      return opts.filter(function (o) {
        return o.style.display !== "none" && o.getAttribute("aria-disabled") !== "true";
      });
    }
    function setActive(i) {
      var vis = visible();
      active = Math.max(0, Math.min(vis.length - 1, i));
      opts.forEach(function (o) { o.removeAttribute("data-active"); });
      if (vis[active]) vis[active].setAttribute("data-active", "true");
    }
    function filter() {
      var q = input.value.toLowerCase();
      opts.forEach(function (o) {
        o.style.display = labelOf(o).toLowerCase().indexOf(q) >= 0 ? "" : "none";
      });
      if (single) single.style.display = input.value ? "none" : "";
      setActive(0);
    }
    function open() {
      if (!pop.hidden) return;
      pop.hidden = false;
      cb.classList.add("jl-combobox--open");
      input.setAttribute("aria-expanded", "true");
      filter();
      var u = window.JLDS && window.JLDS.util;
      cleanup = u && u.onClickOutside ? u.onClickOutside(cb, close) : function () {};
    }
    function close() {
      if (pop.hidden) return;
      pop.hidden = true;
      cb.classList.remove("jl-combobox--open");
      input.setAttribute("aria-expanded", "false");
      input.value = "";
      if (single) single.style.display = "";
      if (cleanup) { cleanup(); cleanup = null; }
    }
    function choose(opt) {
      if (!opt || opt.getAttribute("aria-disabled") === "true") return;
      cb.dataset.value = opt.dataset.value || labelOf(opt);
      if (single) {
        single.textContent = labelOf(opt);
        single.classList.remove("jl-combobox__single--placeholder");
      }
      opts.forEach(function (o) {
        o.setAttribute("aria-selected", o === opt ? "true" : "false");
        var c = o.querySelector(".jl-combobox__opt-check");
        if (o === opt && !c) {
          var s = document.createElement("span");
          s.className = "jl-combobox__opt-check";
          s.innerHTML = CHECK;
          o.appendChild(s);
        } else if (o !== opt && c) {
          c.remove();
        }
      });
      close();
      cb.dispatchEvent(new CustomEvent("jl-combobox:change", { detail: { value: cb.dataset.value }, bubbles: true }));
    }

    if (control) control.addEventListener("click", function () { open(); input.focus(); });
    input.addEventListener("focus", open);
    input.addEventListener("input", function () { if (pop.hidden) open(); filter(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); if (pop.hidden) return open(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") { e.preventDefault(); choose(visible()[active]); }
      else if (e.key === "Escape") { if (!pop.hidden) { e.preventDefault(); close(); } }
    });
    opts.forEach(function (opt) {
      opt.addEventListener("mousemove", function () {
        var i = visible().indexOf(opt);
        if (i >= 0) setActive(i);
      });
      opt.addEventListener("click", function () { choose(opt); });
    });
  }

  register("combobox", function (root) {
    root.querySelectorAll(".jl-combobox").forEach(initCombobox);
  });
})();
