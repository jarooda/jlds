/* JLDS behavior — SegmentedControl. Click an option to select it; the thumb slides
 * to it. Emits jl-segmented:change. Requires core.js (or the all.js bundle).
 * Contract: .jl-segmented holds a .jl-segmented__thumb and .jl-segmented__option
 * buttons (one with aria-checked="true"); optional data-value per option. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initSeg(seg) {
    if (seg.__jlSeg) return;
    seg.__jlSeg = true;

    var thumb = seg.querySelector(".jl-segmented__thumb");
    var opts = Array.prototype.slice.call(seg.querySelectorAll(".jl-segmented__option"));
    if (!opts.length) return;

    function moveThumb(btn) {
      if (!thumb || !btn) return;
      var pad = parseFloat(getComputedStyle(seg).paddingLeft) || 0;
      thumb.style.transform = "translateX(" + (btn.offsetLeft - pad) + "px)";
      thumb.style.width = btn.offsetWidth + "px";
    }
    function selected() {
      return seg.querySelector('.jl-segmented__option[aria-checked="true"]') || opts[0];
    }

    opts.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled || btn.getAttribute("aria-checked") === "true") return;
        opts.forEach(function (o) {
          o.setAttribute("aria-checked", o === btn ? "true" : "false");
        });
        moveThumb(btn);
        seg.dispatchEvent(
          new CustomEvent("jl-segmented:change", {
            detail: { value: btn.dataset.value || btn.textContent.trim() },
            bubbles: true,
          })
        );
      });
    });

    moveThumb(selected());
    window.addEventListener("resize", function () {
      moveThumb(selected());
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        moveThumb(selected());
      });
    }
  }

  register("segmented", function (root) {
    root.querySelectorAll(".jl-segmented").forEach(initSeg);
  });
})();
