/* JLDS behavior — Table. Opt-in client-side enhancements for plain-HTML tables:
 *   - Sorting: clicking a sortable header (a `.jl-th__btn`) sorts the tbody rows
 *     by that column, cycling asc/desc. Numeric columns (.jl-th--num) sort by value.
 *     Emits jl-table:sort { column, direction }.
 *   - Selection: a `.jl-table__check` checkbox per row toggles .jl-tr--selected; a
 *     header `.jl-table__check[data-select-all]` toggles all (with indeterminate).
 *     Emits jl-table:select { values }.
 * Requires core.js (or the all.js bundle). In React/Vue, sort/selection are
 * controlled via props — this is for the no-framework path only.
 */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  var ICONS = {
    none: '<path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    asc: '<path d="M8 14l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    desc: '<path d="M8 10l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  };

  function cellText(row, idx) {
    var c = row.children[idx];
    return c ? c.textContent.trim() : "";
  }

  function initSort(table) {
    var head = table.querySelector(".jl-table__head tr") || table.querySelector("thead tr");
    var body = table.querySelector(".jl-table__body") || table.querySelector("tbody");
    if (!head || !body) return;
    var ths = Array.prototype.slice.call(head.children);

    ths.forEach(function (th, idx) {
      var btn = th.querySelector(".jl-th__btn");
      if (!btn) return;
      var svg = th.querySelector(".jl-th__sort svg");
      btn.addEventListener("click", function () {
        var dir = th.getAttribute("aria-sort") === "ascending" ? "desc" : "asc";
        ths.forEach(function (o) {
          if (o === th) return;
          o.setAttribute("aria-sort", "none");
          o.classList.remove("jl-th--active");
          var s = o.querySelector(".jl-th__sort svg");
          if (s) s.innerHTML = ICONS.none;
        });
        th.setAttribute("aria-sort", dir === "asc" ? "ascending" : "descending");
        th.classList.add("jl-th--active");
        if (svg) svg.innerHTML = ICONS[dir];

        var numeric = th.classList.contains("jl-th--num");
        var rows = Array.prototype.slice.call(body.querySelectorAll("tr"));
        rows.sort(function (a, b) {
          var av = cellText(a, idx);
          var bv = cellText(b, idx);
          if (numeric) {
            av = parseFloat(av.replace(/[^0-9.eE+-]/g, ""));
            bv = parseFloat(bv.replace(/[^0-9.eE+-]/g, ""));
          }
          if (av < bv) return dir === "asc" ? -1 : 1;
          if (av > bv) return dir === "asc" ? 1 : -1;
          return 0;
        });
        rows.forEach(function (r) {
          body.appendChild(r);
        });
        table.dispatchEvent(
          new CustomEvent("jl-table:sort", { detail: { column: idx, direction: dir }, bubbles: true })
        );
      });
    });
  }

  function initSelect(table) {
    // Find the select checkbox by its cell, so it works whether the cell holds the
    // compact native `.jl-table__check` or a full `.jl-check` component input.
    var all =
      table.querySelector('.jl-table__head .jl-th--select input[type="checkbox"]') ||
      table.querySelector(".jl-table__check[data-select-all]");
    var checks = Array.prototype.slice.call(
      table.querySelectorAll(
        '.jl-table__body .jl-td--select input[type="checkbox"], .jl-table__body .jl-table__check'
      )
    ).filter(function (c, i, arr) {
      return arr.indexOf(c) === i; // de-dupe if both selectors match the same input
    });
    if (!checks.length) return;

    function rowOf(cb) {
      return cb.closest("tr");
    }
    function selectedValues() {
      return checks
        .filter(function (c) { return c.checked; })
        .map(function (c) {
          var tr = rowOf(c);
          return c.value || (tr && tr.dataset.value) || "";
        });
    }
    function emit() {
      table.dispatchEvent(
        new CustomEvent("jl-table:select", { detail: { values: selectedValues() }, bubbles: true })
      );
    }
    function syncAll() {
      if (!all) return;
      var n = checks.filter(function (c) { return c.checked; }).length;
      all.checked = n === checks.length;
      all.indeterminate = n > 0 && n < checks.length;
    }
    function paint(cb) {
      var tr = rowOf(cb);
      if (tr) {
        tr.classList.toggle("jl-tr--selected", cb.checked);
        tr.setAttribute("aria-selected", cb.checked ? "true" : "false");
      }
    }

    checks.forEach(function (cb) {
      cb.addEventListener("change", function () {
        paint(cb);
        syncAll();
        emit();
      });
    });
    if (all) {
      all.addEventListener("change", function () {
        checks.forEach(function (cb) {
          cb.checked = all.checked;
          paint(cb);
        });
        all.indeterminate = false;
        emit();
      });
    }
    checks.forEach(paint);
    syncAll();
  }

  register("table", function (root) {
    root.querySelectorAll(".jl-table").forEach(function (table) {
      if (table.__jlTable) return;
      table.__jlTable = true;
      initSort(table);
      initSelect(table);
    });
  });
})();
