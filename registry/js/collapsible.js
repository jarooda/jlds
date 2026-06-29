/* JLDS behavior — Collapsible. Clicking a .jl-collapsible__trigger toggles its
 * .jl-collapsible (data-open + aria-expanded), animating the grid-rows region.
 * Emits jl-collapsible:toggle. Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initCollapsible(root) {
    if (root.__jlCol) return;
    root.__jlCol = true;
    var trigger = root.querySelector(".jl-collapsible__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      if (trigger.disabled) return;
      var open = root.getAttribute("data-open") === "true";
      if (open) root.removeAttribute("data-open");
      else root.setAttribute("data-open", "true");
      trigger.setAttribute("aria-expanded", open ? "false" : "true");
      root.dispatchEvent(
        new CustomEvent("jl-collapsible:toggle", { detail: { open: !open }, bubbles: true })
      );
    });
  }

  register("collapsible", function (root) {
    root.querySelectorAll(".jl-collapsible").forEach(initCollapsible);
  });
})();
