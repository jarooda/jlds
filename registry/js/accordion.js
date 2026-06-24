/* JLDS behavior — Accordion. Clicking a .jl-acc-trigger opens/closes its
 * .jl-acc-item (toggles data-open + aria-expanded). Single-open by default;
 * set data-type="multiple" on the .jl-accordion to allow several open at once.
 * Emits jl-accordion:toggle. Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initAccordion(acc) {
    if (acc.__jlAcc) return;
    acc.__jlAcc = true;
    var multiple = acc.dataset.type === "multiple";
    var items = Array.prototype.slice.call(acc.querySelectorAll(".jl-acc-item"));

    function setOpen(item, open) {
      var trigger = item.querySelector(".jl-acc-trigger");
      if (open) item.setAttribute("data-open", "true");
      else item.removeAttribute("data-open");
      if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    items.forEach(function (item) {
      var trigger = item.querySelector(".jl-acc-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        if (trigger.disabled) return;
        var open = item.getAttribute("data-open") === "true";
        if (!multiple) {
          items.forEach(function (o) {
            if (o !== item) setOpen(o, false);
          });
        }
        setOpen(item, !open);
        acc.dispatchEvent(
          new CustomEvent("jl-accordion:toggle", {
            detail: { value: trigger.getAttribute("aria-controls") || null, open: !open },
            bubbles: true,
          })
        );
      });
    });
  }

  register("accordion", function (root) {
    root.querySelectorAll(".jl-accordion").forEach(initAccordion);
  });
})();
