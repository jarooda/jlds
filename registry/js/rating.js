/* JLDS behavior — Rating. Enhances an interactive .jl-rating: hover previews the
 * score, click sets it (half values when data-allow-half is present), arrow keys
 * adjust. Updates each .jl-rating__btn[data-fill] and the optional
 * .jl-rating__value, and reflects the choice on the host's data-value.
 * Read-only / disabled ratings ([data-readonly] / [data-disabled]) are left as-is.
 * Emits jl-rating:change { value }. Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initRating(el) {
    if (el.__jlRating) return;
    el.__jlRating = true;
    if (el.getAttribute("data-readonly") === "true" || el.getAttribute("data-disabled") === "true") return;

    var btns = Array.prototype.slice.call(el.querySelectorAll(".jl-rating__btn"));
    if (!btns.length) return;
    var max = btns.length;
    var half = el.getAttribute("data-allow-half") === "true";
    var valueEl = el.querySelector(".jl-rating__value");
    var current = parseFloat(el.getAttribute("data-value") || "0") || 0;

    function fillFor(i, display) {
      var starVal = i + 1;
      if (display >= starVal) return "full";
      if (half && display >= starVal - 0.5) return "half";
      return "empty";
    }
    function paint(display) {
      btns.forEach(function (b, i) {
        b.setAttribute("data-fill", fillFor(i, display));
      });
    }
    function valueAt(i, e) {
      if (!half) return i + 1;
      var r = btns[i].getBoundingClientRect();
      return e.clientX - r.left < r.width / 2 ? i + 0.5 : i + 1;
    }
    function commit(v) {
      current = v;
      el.setAttribute("data-value", String(v));
      paint(v);
      if (valueEl) {
        var count = valueEl.querySelector(".jl-rating__count");
        valueEl.textContent = v.toFixed(half ? 1 : 0);
        if (count) valueEl.appendChild(count);
      }
      el.dispatchEvent(new CustomEvent("jl-rating:change", { detail: { value: v }, bubbles: true }));
    }

    paint(current);

    btns.forEach(function (b, i) {
      b.addEventListener("mousemove", function (e) { paint(half ? valueAt(i, e) : i + 1); });
      b.addEventListener("click", function (e) { commit(valueAt(i, e)); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); commit(Math.min(max, current + (half ? 0.5 : 1))); }
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); commit(Math.max(0, current - (half ? 0.5 : 1))); }
      });
    });
    el.addEventListener("mouseleave", function () { paint(current); });
  }

  register("rating", function (root) {
    root.querySelectorAll(".jl-rating").forEach(initRating);
  });
})();
