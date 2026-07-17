/* JLDS behavior — Tabs. Click or arrow-key to switch tabs; if a tab has
 * aria-controls, its panel is shown and the others hidden. Emits jl-tabs:change.
 * Requires core.js (or the all.js bundle).
 * Contract: .jl-tabs holds .jl-tab buttons (role="tab", aria-selected). Optional
 * aria-controls="panelId" pairs each tab with an element to toggle. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initTabs(strip) {
    if (strip.__jlTabs) return;
    strip.__jlTabs = true;

    var tabs = Array.prototype.slice.call(strip.querySelectorAll(".jl-tab"));
    if (!tabs.length) return;

    function panelFor(tab) {
      var id = tab.getAttribute("aria-controls");
      return id ? document.getElementById(id) : null;
    }
    function applyState(active, emit) {
      tabs.forEach(function (t) {
        var on = t === active;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var p = panelFor(t);
        if (p) p.hidden = !on;
      });
      if (emit) {
        strip.dispatchEvent(
          new CustomEvent("jl-tabs:change", {
            detail: { value: active.dataset.value || active.textContent.trim() },
            bubbles: true,
          })
        );
      }
    }

    function isDisabled(t) {
      return t.disabled || t.getAttribute("aria-disabled") === "true";
    }
    function step(from, dir) {
      var n = tabs.length;
      for (var k = 1; k <= n; k++) {
        var t = tabs[(from + dir * k + n * k) % n];
        if (!isDisabled(t)) return t;
      }
      return null;
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        if (isDisabled(tab)) return;
        applyState(tab, true);
      });
      tab.addEventListener("keydown", function (e) {
        var next;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = step(i, 1);
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = step(i, -1);
        else if (e.key === "Home") next = isDisabled(tabs[0]) ? step(0, 1) : tabs[0];
        else if (e.key === "End")
          next = isDisabled(tabs[tabs.length - 1]) ? step(tabs.length - 1, -1) : tabs[tabs.length - 1];
        else return;
        e.preventDefault();
        if (!next) return;
        next.focus();
        applyState(next, true);
      });
    });

    var selected = strip.querySelector('.jl-tab[aria-selected="true"]') || tabs[0];
    applyState(selected, false);
  }

  register("tabs", function (root) {
    root.querySelectorAll(".jl-tabs").forEach(initTabs);
  });
})();
