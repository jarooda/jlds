/* JLDS behavior — FileUpload. Enhances a .jl-upload: click/keyboard opens the
 * hidden file input, drag-over highlights the zone (data-dragging), and dropped
 * or picked files render as rows in .jl-upload__list (created if absent) with a
 * working × remove button. Reflects the selection and emits
 * jl-upload:change { files }. Requires core.js (or the all.js bundle). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  var FILE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M14 3v5h5" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>';
  var CHECK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var X_ICON =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';

  function formatBytes(n) {
    if (n == null) return "";
    if (n < 1024) return n + " B";
    var u = ["KB", "MB", "GB"];
    var i = -1;
    do {
      n /= 1024;
      i++;
    } while (n >= 1024 && i < u.length - 1);
    return n.toFixed(n < 10 ? 1 : 0) + " " + u[i];
  }

  function initUpload(el) {
    if (el.__jlUpload) return;
    el.__jlUpload = true;

    var zone = el.querySelector(".jl-upload__zone");
    var input = el.querySelector('input[type="file"]');
    if (!zone || !input) return;
    var disabled = zone.getAttribute("data-disabled") === "true";

    function listEl() {
      var ul = el.querySelector(".jl-upload__list");
      if (!ul) {
        ul = document.createElement("ul");
        ul.className = "jl-upload__list";
        el.appendChild(ul);
      }
      return ul;
    }

    function row(file) {
      var li = document.createElement("li");
      li.className = "jl-upload__item";
      li.setAttribute("data-status", "done");
      li.innerHTML =
        '<span class="jl-upload__fileicon">' + FILE_ICON + "</span>" +
        '<div class="jl-upload__meta"><div class="jl-upload__name"></div><div class="jl-upload__size"></div></div>' +
        '<span class="jl-upload__status" data-status="done">' + CHECK_ICON + "</span>" +
        '<button type="button" class="jl-upload__remove"></button>';
      li.querySelector(".jl-upload__name").textContent = file.name;
      li.querySelector(".jl-upload__size").textContent = formatBytes(file.size);
      var rm = li.querySelector(".jl-upload__remove");
      rm.setAttribute("aria-label", "Remove " + file.name);
      rm.innerHTML = X_ICON;
      rm.addEventListener("click", function () { li.remove(); });
      return li;
    }

    function accept(files) {
      if (!files || !files.length) return;
      var multiple = input.multiple;
      var ul = listEl();
      if (!multiple) ul.innerHTML = "";
      var arr = Array.prototype.slice.call(files);
      (multiple ? arr : arr.slice(0, 1)).forEach(function (f) { ul.appendChild(row(f)); });
      el.dispatchEvent(new CustomEvent("jl-upload:change", { detail: { files: arr }, bubbles: true }));
    }

    if (!disabled) {
      zone.addEventListener("click", function () { input.click(); });
      zone.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
      });
      zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.setAttribute("data-dragging", "true"); });
      zone.addEventListener("dragleave", function () { zone.removeAttribute("data-dragging"); });
      zone.addEventListener("drop", function (e) {
        e.preventDefault();
        zone.removeAttribute("data-dragging");
        if (e.dataTransfer && e.dataTransfer.files) accept(e.dataTransfer.files);
      });
      input.addEventListener("change", function () {
        accept(input.files);
        input.value = "";
      });
    }
  }

  register("file-upload", function (root) {
    root.querySelectorAll(".jl-upload").forEach(initUpload);
  });
})();
