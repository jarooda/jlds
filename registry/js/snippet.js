/* JLDS behavior — Snippet copy buttons. Requires core.js + util.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function copy(text) {
    var u = window.JLDS && window.JLDS.util;
    if (u && u.copy) u.copy(text);
  }

  function flash(btn, doneClass) {
    btn.classList.add(doneClass);
    setTimeout(function () {
      btn.classList.remove(doneClass);
    }, 1600);
  }

  function wire(root, btnSelector, wrapSelector, codeSelector, doneClass) {
    root.querySelectorAll(btnSelector).forEach(function (btn) {
      if (btn.__jlSnippet) return;
      btn.__jlSnippet = true;
      btn.addEventListener("click", function () {
        var wrap = btn.closest(wrapSelector);
        var code = wrap && wrap.querySelector(codeSelector);
        copy(code ? code.textContent : "");
        flash(btn, doneClass);
      });
    });
  }

  register("snippet", function (root) {
    wire(root, ".jl-snippet__copy", ".jl-snippet", ".jl-snippet__code", "jl-snippet__copy--done");
    wire(root, ".jl-codeblock__copy", ".jl-codeblock", "code", "jl-codeblock__copy--done");
  });
})();
