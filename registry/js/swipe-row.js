/* JLDS behavior — SwipeRow. Reveals the trailing .jl-swiperow__actions by dragging the
 * .jl-swiperow__panel left on touch, or by hovering on fine-pointer devices. Tapping an
 * action (or releasing below the threshold) snaps the row closed. Requires core.js.
 * Contract: .jl-swiperow > .jl-swiperow__actions (buttons) + .jl-swiperow__panel.
 * Optional data-threshold (px) overrides the 40%-of-actions-width latch point. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initSwipeRow(row) {
    if (row.__jlSwipeRow) return;
    row.__jlSwipeRow = true;

    var actions = row.querySelector(".jl-swiperow__actions");
    var panel = row.querySelector(".jl-swiperow__panel");
    if (!actions || !panel) return;

    var offset = 0;
    var drag = null;
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    function actWidth() {
      return actions.offsetWidth;
    }
    function apply(animate) {
      panel.classList.toggle("jl-swiperow__panel--animate", !!animate);
      panel.style.transform = "translateX(" + offset + "px)";
      row.classList.toggle("jl-swiperow--open", offset < -2);
    }
    function open() {
      offset = -actWidth();
      apply(true);
    }
    function close() {
      offset = 0;
      apply(true);
    }

    if (fine) {
      row.addEventListener("mouseenter", function () {
        if (!drag) open();
      });
      row.addEventListener("mouseleave", function () {
        if (!drag) close();
      });
    }

    panel.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      drag = { x: e.clientX, base: offset, moved: false };
      panel.classList.remove("jl-swiperow__panel--animate");
    });
    panel.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      var next = drag.base + dx;
      next = Math.max(-actWidth() - 24, Math.min(0, next));
      if (next > 0) next = 0;
      offset = next;
      apply(false);
    });
    function up() {
      if (!drag) return;
      var attr = parseInt(row.getAttribute("data-threshold"), 10);
      var t = isNaN(attr) ? actWidth() * 0.4 : attr;
      if (-offset > t) open();
      else close();
      drag = null;
    }
    panel.addEventListener("pointerup", up);
    panel.addEventListener("pointercancel", up);
    panel.addEventListener(
      "click",
      function (e) {
        if (drag && drag.moved) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true
    );

    actions.querySelectorAll(".jl-swiperow__action").forEach(function (btn) {
      btn.addEventListener("click", function () {
        close();
      });
    });
  }

  register("swipe-row", function (root) {
    root.querySelectorAll(".jl-swiperow").forEach(initSwipeRow);
  });
})();
