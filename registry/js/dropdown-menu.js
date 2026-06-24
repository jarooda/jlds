/* JLDS behavior — DropdownMenu. Click the trigger to open the .jl-menu__pop
 * (initially `hidden`); closes on item click, outside-click, or Esc (via
 * JLDS.util). Requires core.js + util.js (or the all.js bundle).
 * Contract: .jl-menu holds a trigger (first <button> / [data-menu-trigger]) and
 * a .jl-menu__pop[hidden] with .jl-menu__item buttons. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
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
    }

    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    if (!pop.hasAttribute("hidden")) pop.hidden = true;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (pop.hidden) open();
      else close();
    });
    pop.querySelectorAll(".jl-menu__item").forEach(function (item) {
      item.addEventListener("click", function () {
        if (item.getAttribute("aria-disabled") === "true") return;
        close();
      });
    });
  }

  register("menu", function (root) {
    root.querySelectorAll(".jl-menu").forEach(initMenu);
  });
})();
