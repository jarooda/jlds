/* JLDS behavior — DropdownMenu. Click the trigger to open the .jl-menu__pop
 * (initially `hidden`); closes on plain-item click, outside-click, or Esc (via
 * JLDS.util). Requires core.js + util.js (or the all.js bundle).
 * Contract: .jl-menu holds a trigger (first <button> / [data-menu-trigger]) and
 * a .jl-menu__pop[hidden] with .jl-menu__item buttons. Roving ↑↓/Home/End
 * navigation; menuitemcheckbox toggles aria-checked and keeps the menu open;
 * menuitemradio selects within its parent group (single-select) and keeps it
 * open. Add [data-close-on-select] to a checkable item to close after select. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function items(pop) {
    return Array.prototype.slice
      .call(pop.querySelectorAll('[role^="menuitem"]'))
      .filter(function (el) {
        return el.getAttribute("aria-disabled") !== "true";
      });
  }

  function initMenu(menu) {
    if (menu.__jlMenu) return;
    menu.__jlMenu = true;
    var trigger = menu.querySelector("[data-menu-trigger]") || menu.querySelector("button");
    var pop = menu.querySelector(".jl-menu__pop");
    if (!trigger || !pop) return;

    var cleanup = null;
    function close() {
      if (pop.hidden) return;
      pop.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    }
    function open() {
      pop.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      var u = window.JLDS && window.JLDS.util;
      var a = u && u.onClickOutside ? u.onClickOutside(menu, close) : function () {};
      var b = u && u.onEscape ? u.onEscape(close) : function () {};
      cleanup = function () {
        a();
        b();
      };
      var first = items(pop)[0];
      if (first) first.focus();
    }

    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    if (!pop.hasAttribute("hidden")) pop.hidden = true;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (pop.hidden) open();
      else close();
    });

    pop.addEventListener("keydown", function (e) {
      var list = items(pop);
      if (!list.length) return;
      var i = list.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        list[(i + 1) % list.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        list[(i - 1 + list.length) % list.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        list[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        list[list.length - 1].focus();
      }
    });

    pop.querySelectorAll(".jl-menu__item").forEach(function (item) {
      item.addEventListener("click", function () {
        if (item.getAttribute("aria-disabled") === "true") return;
        var role = item.getAttribute("role");
        if (role === "menuitemcheckbox") {
          item.setAttribute(
            "aria-checked",
            item.getAttribute("aria-checked") === "true" ? "false" : "true"
          );
          if (item.hasAttribute("data-close-on-select")) close();
          return;
        }
        if (role === "menuitemradio") {
          var parent = item.parentElement;
          if (parent) {
            parent.querySelectorAll('[role="menuitemradio"]').forEach(function (r) {
              r.setAttribute("aria-checked", r === item ? "true" : "false");
            });
          }
          if (item.hasAttribute("data-close-on-select")) close();
          return;
        }
        close();
      });
    });
  }

  register("menu", function (root) {
    root.querySelectorAll(".jl-menu").forEach(initMenu);
  });
})();
