/* JLDS behavior — NumberInput steppers + keyboard. Requires core.js (or all.js).
 * Contract: .jl-number with data-min / data-max / data-step / data-precision (all
 * optional); a .jl-number__input (set its `value` for the initial number); and
 * .jl-number__btn--dec / --inc buttons. Emits jl-number:change on commit. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function decimals(s) {
    s = String(s);
    return s.indexOf(".") >= 0 ? s.split(".")[1].length : 0;
  }

  function initNumber(el) {
    if (el.__jlNum) return;
    el.__jlNum = true;

    var input = el.querySelector(".jl-number__input");
    if (!input) return;
    var dec = el.querySelector(".jl-number__btn--dec");
    var inc = el.querySelector(".jl-number__btn--inc");

    var min = el.dataset.min != null ? parseFloat(el.dataset.min) : -Infinity;
    var max = el.dataset.max != null ? parseFloat(el.dataset.max) : Infinity;
    var step = parseFloat(el.dataset.step) || 1;
    var prec = el.dataset.precision != null ? parseInt(el.dataset.precision, 10) : decimals(step);

    function clamp(n) {
      return Math.min(max, Math.max(min, n));
    }
    function round(n) {
      return Number(n.toFixed(prec));
    }
    function cur() {
      var n = parseFloat(input.value);
      return isNaN(n) ? null : n;
    }
    function sync() {
      var c = cur();
      if (dec) dec.disabled = c != null && c <= min;
      if (inc) inc.disabled = c != null && c >= max;
      input.setAttribute("aria-valuenow", c == null ? "" : c);
    }
    function commit(n) {
      var next = n == null || isNaN(n) ? "" : round(clamp(n));
      input.value = next === "" ? "" : String(next);
      sync();
      el.dispatchEvent(
        new CustomEvent("jl-number:change", {
          detail: { value: next === "" ? null : next },
          bubbles: true,
        })
      );
    }
    function bump(dir) {
      var b = cur();
      var start = b == null ? (isFinite(min) ? min : 0) : b;
      commit(start + dir * step);
    }

    if (dec) dec.addEventListener("click", function () { bump(-1); });
    if (inc) inc.addEventListener("click", function () { bump(1); });
    input.addEventListener("input", function () {
      if (!/^-?\d*\.?\d*$/.test(input.value)) {
        input.value = input.value.replace(/[^\d.-]/g, "");
      }
      sync();
    });
    input.addEventListener("blur", function () { commit(cur()); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") { e.preventDefault(); bump(1); }
      else if (e.key === "ArrowDown") { e.preventDefault(); bump(-1); }
    });

    // aria bounds
    if (isFinite(min)) input.setAttribute("aria-valuemin", min);
    if (isFinite(max)) input.setAttribute("aria-valuemax", max);
    sync();
  }

  register("number", function (root) {
    root.querySelectorAll(".jl-number").forEach(initNumber);
  });
})();
