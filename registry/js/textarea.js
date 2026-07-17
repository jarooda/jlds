/* JLDS behavior — Textarea. Opt-in auto-resize and a character counter for plain
 * HTML. Requires core.js (or the all.js bundle).
 * Contract:
 *   Auto-resize — add `data-auto-resize` (or class `jl-textarea--auto`) to the
 *     <textarea class="jl-textarea">; it grows to fit its content.
 *   Counter — wrap the textarea in `.jl-textarea-wrap` with a sibling
 *     `.jl-textarea__count`; set `maxlength` for an "n/max" readout that turns red
 *     past the limit. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initTextarea(el) {
    if (el.__jlTextarea) return;
    el.__jlTextarea = true;

    var auto = el.hasAttribute("data-auto-resize") || el.classList.contains("jl-textarea--auto");
    if (auto) el.classList.add("jl-textarea--auto");
    var wrap = el.closest(".jl-textarea-wrap");
    var counter = wrap ? wrap.querySelector(".jl-textarea__count") : null;
    var maxAttr = el.getAttribute("maxlength");
    var max = maxAttr != null ? parseInt(maxAttr, 10) : null;

    function fit() {
      if (!auto) return;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
    function count() {
      if (!counter) return;
      var len = el.value.length;
      counter.textContent = max != null ? len + "/" + max : String(len);
      if (max != null) counter.setAttribute("data-over", len > max ? "true" : "false");
    }

    el.addEventListener("input", function () {
      fit();
      count();
    });
    fit();
    count();
  }

  register("textarea", function (root) {
    root.querySelectorAll(".jl-textarea").forEach(initTextarea);
  });
})();
