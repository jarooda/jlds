/* JLDS behavior — TreeView. A static nested .jl-tree (role="tree") of
 * .jl-tree__row[role="treeitem"] items, each in an .jl-tree__li that may hold a
 * child .jl-tree__group. Rows with children expand/collapse (toggles the group's
 * [hidden] + the row's data-expanded/aria-expanded); any row selects
 * (data-selected, single). Arrow keys move focus / open / close; Enter / Space
 * toggle + select. Authors set data-expanded="true" on initially-open rows.
 * Emits jl-tree:select and jl-tree:toggle. Requires core.js (or all.js). */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function childGroup(row) {
    var li = row.closest(".jl-tree__li");
    if (!li) return null;
    return li.querySelector(":scope > .jl-tree__group");
  }

  function setExpanded(row, open) {
    var group = childGroup(row);
    if (!group) return;
    if (open) {
      row.setAttribute("data-expanded", "true");
      group.hidden = false;
    } else {
      row.removeAttribute("data-expanded");
      group.hidden = true;
    }
    row.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function initTree(tree) {
    if (tree.__jlTree) return;
    tree.__jlTree = true;

    var rows = function () {
      return Array.prototype.slice.call(tree.querySelectorAll(".jl-tree__row"));
    };

    // Sync initial expand state from each row's data-expanded.
    rows().forEach(function (row) {
      if (childGroup(row)) setExpanded(row, row.getAttribute("data-expanded") === "true");
    });

    function visibleRows() {
      return rows().filter(function (row) {
        var g = row.closest(".jl-tree__group[hidden]");
        return !g || !tree.contains(g);
      });
    }

    function select(row) {
      rows().forEach(function (r) {
        r.removeAttribute("data-selected");
        r.setAttribute("aria-selected", "false");
      });
      row.setAttribute("data-selected", "true");
      row.setAttribute("aria-selected", "true");
      tree.dispatchEvent(
        new CustomEvent("jl-tree:select", { detail: { id: row.dataset.id || null }, bubbles: true })
      );
    }

    function focusRow(row) {
      rows().forEach(function (r) {
        r.tabIndex = -1;
      });
      row.tabIndex = 0;
      row.focus();
    }

    tree.addEventListener("click", function (e) {
      var row = e.target.closest(".jl-tree__row");
      if (!row || !tree.contains(row)) return;
      if (row.getAttribute("aria-disabled") === "true") return;
      if (childGroup(row)) {
        var open = row.getAttribute("data-expanded") === "true";
        setExpanded(row, !open);
        tree.dispatchEvent(
          new CustomEvent("jl-tree:toggle", {
            detail: { id: row.dataset.id || null, open: !open },
            bubbles: true,
          })
        );
      }
      select(row);
      focusRow(row);
    });

    tree.addEventListener("keydown", function (e) {
      var row = e.target.closest(".jl-tree__row");
      if (!row || !tree.contains(row)) return;
      var vis = visibleRows();
      var idx = vis.indexOf(row);
      var hasKids = !!childGroup(row);
      var isOpen = row.getAttribute("data-expanded") === "true";
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (idx < vis.length - 1) focusRow(vis[idx + 1]);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (idx > 0) focusRow(vis[idx - 1]);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (hasKids && !isOpen) setExpanded(row, true);
          else if (hasKids && isOpen) {
            var g = childGroup(row);
            var first = g && g.querySelector(".jl-tree__row");
            if (first) focusRow(first);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (hasKids && isOpen) setExpanded(row, false);
          else {
            var parentLi = row.closest(".jl-tree__group");
            parentLi = parentLi && parentLi.closest(".jl-tree__li");
            var prow = parentLi && parentLi.querySelector(":scope > .jl-tree__row");
            if (prow) focusRow(prow);
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (hasKids) {
            setExpanded(row, !isOpen);
          }
          if (row.getAttribute("aria-disabled") !== "true") select(row);
          break;
        default:
          break;
      }
    });
  }

  register("tree-view", function (root) {
    root.querySelectorAll(".jl-tree").forEach(initTree);
  });
})();
