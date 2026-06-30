/* JLDS behavior — AppShell responsive drawer. Below the breakpoint (the shell's
 * data-mobile-breakpoint, default 900px = --bp-tablet) the .jl-appshell gets data-mobile and
 * its sidebar becomes an overlay drawer: the .jl-appshell__menubtn toggles
 * data-open, the .jl-appshell__backdrop and Escape close it. Leaving mobile
 * closes the drawer. Emits jl-appshell:toggle. Requires core.js (or all.js). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initAppShell(shell) {
    if (shell.__jlShell) return;
    shell.__jlShell = true;
    var bp = parseInt(shell.getAttribute("data-mobile-breakpoint"), 10) || 900;
    var mql = window.matchMedia ? window.matchMedia("(max-width: " + bp + "px)") : null;

    function isOpen() {
      return shell.getAttribute("data-open") === "true";
    }
    function setOpen(open) {
      if (open) shell.setAttribute("data-open", "true");
      else shell.removeAttribute("data-open");
      var btn = shell.querySelector(".jl-appshell__menubtn");
      if (btn) {
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      }
      shell.dispatchEvent(
        new CustomEvent("jl-appshell:toggle", { detail: { open: open }, bubbles: true })
      );
    }
    function applyMobile() {
      var mobile = mql ? mql.matches : false;
      if (mobile) shell.setAttribute("data-mobile", "true");
      else {
        shell.removeAttribute("data-mobile");
        if (isOpen()) setOpen(false);
      }
    }

    var btn = shell.querySelector(".jl-appshell__menubtn");
    if (btn) btn.addEventListener("click", function () { setOpen(!isOpen()); });

    var backdrop = shell.querySelector(".jl-appshell__backdrop");
    if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) setOpen(false);
    });

    if (mql) {
      if (mql.addEventListener) mql.addEventListener("change", applyMobile);
      else mql.addListener(applyMobile);
    }
    applyMobile();
  }

  register("app-shell", function (root) {
    root.querySelectorAll(".jl-appshell").forEach(initAppShell);
  });
})();
