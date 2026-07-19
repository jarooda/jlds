/* JLDS behavior — Slider drag + keyboard. Requires core.js (or the all.js bundle).
 *
 * Markup contract (HTML users): on the root `.jl-slider` set data-min / data-max /
 * data-step (default 0 / 100 / 1) and optional data-suffix for the readout. Each
 * `.jl-slider__thumb` carries its initial data-value; two thumbs = a range slider.
 * On change the root emits a `jl-slider:change` CustomEvent ({ detail: { value } }).
 */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initSlider(sl) {
    if (sl.__jlSlider) return;
    sl.__jlSlider = true;

    var track = sl.querySelector(".jl-slider__track");
    if (!track) return;
    var fill = sl.querySelector(".jl-slider__fill");
    var readout = sl.querySelector(".jl-slider__value");
    var thumbs = Array.prototype.slice.call(sl.querySelectorAll(".jl-slider__thumb"));
    if (!thumbs.length) return;

    var min = parseFloat(sl.dataset.min) || 0;
    var max = parseFloat(sl.dataset.max);
    if (isNaN(max)) max = 100;
    var step = parseFloat(sl.dataset.step) || 1;
    var suffix = sl.dataset.suffix || "";
    var range = thumbs.length > 1;
    var vals = thumbs.map(function (t) {
      var v = parseFloat(t.dataset.value);
      return isNaN(v) ? min : v;
    });

    function pct(v) {
      return ((v - min) / (max - min)) * 100;
    }
    function round(v) {
      return Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));
    }

    function render() {
      thumbs.forEach(function (t, i) {
        t.style.left = pct(vals[i]) + "%";
        t.setAttribute("aria-valuenow", vals[i]);
      });
      if (range) {
        fill.style.left = pct(vals[0]) + "%";
        fill.style.right = 100 - pct(vals[1]) + "%";
      } else {
        fill.style.left = "0";
        fill.style.width = pct(vals[0]) + "%";
      }
      if (readout) {
        readout.textContent = range
          ? vals[0] + suffix + " – " + vals[1] + suffix
          : vals[0] + suffix;
      }
    }

    function fromX(x) {
      var r = track.getBoundingClientRect();
      var ratio = Math.min(1, Math.max(0, (x - r.left) / r.width));
      return round(min + ratio * (max - min));
    }

    function apply(i, v) {
      if (range) {
        if (i === 0) vals[0] = Math.min(v, vals[1]);
        else vals[1] = Math.max(v, vals[0]);
      } else {
        vals[0] = v;
      }
      render();
      sl.dispatchEvent(
        new CustomEvent("jl-slider:change", {
          detail: { value: range ? vals.slice() : vals[0] },
          bubbles: true,
        })
      );
    }

    function startDrag(i, clientX) {
      apply(i, fromX(clientX));
      function move(ev) {
        apply(i, fromX(ev.clientX));
      }
      function up() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      }
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }

    track.addEventListener("pointerdown", function (e) {
      if (sl.classList.contains("jl-slider--disabled")) return;
      var v = fromX(e.clientX);
      var i = range ? (Math.abs(vals[0] - v) <= Math.abs(vals[1] - v) ? 0 : 1) : 0;
      startDrag(i, e.clientX);
    });

    thumbs.forEach(function (t, i) {
      t.addEventListener("pointerdown", function (e) {
        // Grab this specific thumb (don't let the track re-pick by proximity —
        // matters when two range thumbs overlap), then start dragging it.
        if (sl.classList.contains("jl-slider--disabled")) return;
        e.stopPropagation();
        t.focus();
        startDrag(i, e.clientX);
      });
      t.addEventListener("keydown", function (e) {
        if (sl.classList.contains("jl-slider--disabled")) return;
        var big = step * 10;
        var v;
        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            v = vals[i] + step;
            break;
          case "ArrowLeft":
          case "ArrowDown":
            v = vals[i] - step;
            break;
          case "PageUp":
            v = vals[i] + big;
            break;
          case "PageDown":
            v = vals[i] - big;
            break;
          case "Home":
            v = min;
            break;
          case "End":
            v = max;
            break;
          default:
            return;
        }
        e.preventDefault();
        apply(i, round(v));
      });
    });

    render();
  }

  register("slider", function (root) {
    root.querySelectorAll(".jl-slider").forEach(initSlider);
  });
})();
