/* JLDS behavior — Toolbar. Measures the .jl-toolbar and folds trailing .jl-toolbar__btn
 * items that don't fit into a generated "More" menu; re-runs on resize. Overflow menu
 * items proxy their click to the original (hidden) button. Requires core.js.
 * Contract: .jl-toolbar holds .jl-toolbar__btn buttons and .jl-toolbar__sep rules, in
 * priority order (first survive longest). Optional data-more-label on the toolbar. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initToolbar(bar) {
    if (bar.__jlToolbar) return;
    bar.__jlToolbar = true;

    var moreLabel = bar.getAttribute("data-more-label") || "More";
    var items = Array.prototype.slice
      .call(bar.children)
      .filter(function (el) {
        return el.classList.contains("jl-toolbar__btn") || el.classList.contains("jl-toolbar__sep");
      });
    if (!items.length) return;

    // Natural widths, measured once while everything is visible.
    var widths = items.map(function (el) {
      return el.getBoundingClientRect().width + 4;
    });
    var isSep = items.map(function (el) {
      return el.classList.contains("jl-toolbar__sep");
    });

    // Build the More control.
    var more = document.createElement("div");
    more.className = "jl-toolbar__more";
    more.style.marginLeft = "auto";
    var moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "jl-toolbar__btn jl-toolbar__btn--icon";
    moreBtn.setAttribute("aria-label", moreLabel);
    moreBtn.setAttribute("aria-haspopup", "menu");
    moreBtn.setAttribute("aria-expanded", "false");
    moreBtn.title = moreLabel;
    moreBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
      '<circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>';
    var menu = document.createElement("div");
    menu.className = "jl-toolbar__menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    more.appendChild(moreBtn);
    more.appendChild(menu);
    bar.appendChild(more);

    var open = false;
    function setOpen(o) {
      open = o;
      menu.hidden = !o;
      moreBtn.setAttribute("aria-expanded", o ? "true" : "false");
    }
    moreBtn.addEventListener("click", function () {
      setOpen(!open);
    });
    document.addEventListener("mousedown", function (e) {
      if (open && !bar.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) setOpen(false);
    });

    function measure() {
      var avail = bar.clientWidth - 8;
      var total = widths.reduce(function (a, b) {
        return a + b;
      }, 0);
      var n;
      if (total <= avail) {
        n = items.length;
      } else {
        var moreW = 44;
        var used = moreW;
        n = 0;
        for (var i = 0; i < widths.length; i++) {
          used += widths[i];
          if (used > avail) break;
          n++;
        }
        while (n > 0 && isSep[n - 1]) n--;
      }

      // Show first n, hide the rest; rebuild the overflow menu.
      menu.textContent = "";
      var overflow = 0;
      items.forEach(function (el, i) {
        if (i < n) {
          el.hidden = false;
        } else {
          el.hidden = true;
          if (isSep[i]) return;
          overflow++;
          var mi = document.createElement("button");
          mi.type = "button";
          mi.className = "jl-toolbar__mitem";
          mi.setAttribute("role", "menuitem");
          if (el.disabled) mi.disabled = true;
          if (el.getAttribute("aria-pressed") === "true") mi.setAttribute("aria-pressed", "true");
          mi.innerHTML = el.innerHTML;
          if (!el.querySelector("span")) {
            // icon-only button: label from aria-label/title
            var lbl = document.createElement("span");
            lbl.textContent = el.getAttribute("aria-label") || el.title || "";
            mi.appendChild(lbl);
          }
          mi.addEventListener("click", function () {
            setOpen(false);
            el.click();
          });
          menu.appendChild(mi);
        }
      });
      more.hidden = overflow === 0;
    }

    if (typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function () {
        measure();
      });
      ro.observe(bar);
    } else {
      window.addEventListener("resize", measure);
    }
    measure();
  }

  register("toolbar", function (root) {
    root.querySelectorAll(".jl-toolbar").forEach(initToolbar);
  });
})();
