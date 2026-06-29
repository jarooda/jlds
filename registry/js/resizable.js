/* JLDS behavior — Resizable split panes. A .jl-resizable (horizontal/vertical)
 * holds .jl-resizable__panel elements separated by .jl-resizable__handle
 * elements. Dragging (or arrow keys on a focused handle) resizes the two
 * adjacent panels, keeping their combined size constant. Authors set the
 * starting split via each panel's flex-basis (e.g. style="flex-basis:40%") and
 * an optional data-min-size (percent, default 8). Emits jl-resizable:resize.
 * Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initResizable(root) {
    if (root.__jlRz) return;
    root.__jlRz = true;
    var horizontal = !root.classList.contains("jl-resizable--vertical");

    function panels() {
      return Array.prototype.slice.call(root.children).filter(function (c) {
        return c.classList.contains("jl-resizable__panel");
      });
    }
    function minOf(panel) {
      var v = parseFloat(panel.getAttribute("data-min-size"));
      return isNaN(v) ? 8 : v;
    }
    function pct(panel) {
      var total = horizontal ? root.clientWidth : root.clientHeight;
      var size = horizontal ? panel.offsetWidth : panel.offsetHeight;
      return total ? (size / total) * 100 : 0;
    }
    function setPair(a, b, sa, sb) {
      a.style.flex = "0 0 " + sa + "%";
      b.style.flex = "0 0 " + sb + "%";
      root.dispatchEvent(
        new CustomEvent("jl-resizable:resize", {
          detail: { sizes: panels().map(pct) },
          bubbles: true,
        })
      );
    }

    var drag = null;

    function neighbors(handle) {
      var a = handle.previousElementSibling;
      var b = handle.nextElementSibling;
      return a && b ? { a: a, b: b } : null;
    }

    root.querySelectorAll(":scope > .jl-resizable__handle").forEach(function (handle) {
      handle.addEventListener("pointerdown", function (e) {
        var nb = neighbors(handle);
        if (!nb) return;
        e.preventDefault();
        var total = horizontal ? root.clientWidth : root.clientHeight;
        drag = {
          handle: handle,
          a: nb.a,
          b: nb.b,
          start: horizontal ? e.clientX : e.clientY,
          total: total,
          sa: pct(nb.a),
          sb: pct(nb.b),
        };
        document.body.setAttribute("data-jl-resizing", horizontal ? "x" : "y");
        handle.setAttribute("data-dragging", "true");
        if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
      });
      handle.addEventListener("pointermove", function (e) {
        if (!drag || drag.handle !== handle) return;
        var pos = horizontal ? e.clientX : e.clientY;
        var delta = ((pos - drag.start) / drag.total) * 100;
        delta = Math.max(delta, -(drag.sa - minOf(drag.a)));
        delta = Math.min(delta, drag.sb - minOf(drag.b));
        setPair(drag.a, drag.b, drag.sa + delta, drag.sb - delta);
      });
      function end(e) {
        if (!drag) return;
        drag = null;
        document.body.removeAttribute("data-jl-resizing");
        handle.removeAttribute("data-dragging");
        if (handle.releasePointerCapture && e.pointerId != null) {
          try {
            handle.releasePointerCapture(e.pointerId);
          } catch (_) {}
        }
      }
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);

      handle.addEventListener("keydown", function (e) {
        var nb = neighbors(handle);
        if (!nb) return;
        var dir = 0;
        if (e.key === (horizontal ? "ArrowRight" : "ArrowDown")) dir = 1;
        else if (e.key === (horizontal ? "ArrowLeft" : "ArrowUp")) dir = -1;
        if (!dir) return;
        e.preventDefault();
        var sa = pct(nb.a);
        var sb = pct(nb.b);
        var delta = dir * 2;
        delta = Math.max(delta, -(sa - minOf(nb.a)));
        delta = Math.min(delta, sb - minOf(nb.b));
        setPair(nb.a, nb.b, sa + delta, sb - delta);
      });
    });
  }

  register("resizable", function (root) {
    root.querySelectorAll(".jl-resizable").forEach(initResizable);
  });
})();
