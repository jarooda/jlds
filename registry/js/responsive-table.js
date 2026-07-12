/* JLDS behavior — ResponsiveTable. Below the container breakpoint, hides the real
 * .jl-rtable__table and renders a stacked key/value card list built from the table's
 * own headers + cells; above it, shows the table. Requires core.js.
 * Contract: .jl-rtable[data-breakpoint="560"] > table.jl-rtable__table with a thead of
 * <th> (add class jl-rtable--num for numeric, data-primary for the card title, and
 * data-hide-on-stack to omit a column from the cards). Optional data-clickable on the
 * root makes rows/cards emit jl-rtable:rowclick with the row index. */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function initRTable(root) {
    if (root.__jlRTable) return;
    root.__jlRTable = true;

    var table = root.querySelector(".jl-rtable__table");
    if (!table) return;
    var bp = parseInt(root.getAttribute("data-breakpoint"), 10) || 560;
    var clickable = root.getAttribute("data-clickable") != null;

    var ths = Array.prototype.slice.call(table.querySelectorAll("thead th"));
    var cols = ths.map(function (th) {
      return {
        header: th.textContent.trim(),
        numeric: th.classList.contains("jl-rtable--num"),
        primary: th.hasAttribute("data-primary"),
        hideOnStack: th.hasAttribute("data-hide-on-stack"),
      };
    });
    var primaryIdx = cols.findIndex(function (c) {
      return c.primary;
    });
    if (primaryIdx < 0) primaryIdx = 0;

    // Build the cards view once from the table body.
    var cards = document.createElement("div");
    cards.className = "jl-rtable__cards";
    cards.hidden = true;
    var bodyRows = Array.prototype.slice.call(table.querySelectorAll("tbody tr"));
    bodyRows.forEach(function (tr, rowIdx) {
      var tds = Array.prototype.slice.call(tr.children);
      var card = document.createElement("div");
      card.className = "jl-rtable__card" + (clickable ? " jl-rtable__card--clickable" : "");
      var primary = document.createElement("div");
      primary.className = "jl-rtable__card-primary";
      primary.innerHTML = tds[primaryIdx] ? tds[primaryIdx].innerHTML : "";
      card.appendChild(primary);
      cols.forEach(function (c, i) {
        if (i === primaryIdx || c.hideOnStack) return;
        var pair = document.createElement("div");
        pair.className = "jl-rtable__pair";
        var k = document.createElement("span");
        k.className = "jl-rtable__k";
        k.textContent = c.header;
        var v = document.createElement("span");
        v.className = "jl-rtable__v" + (c.numeric ? " jl-rtable__v--num" : "");
        v.innerHTML = tds[i] ? tds[i].innerHTML : "";
        pair.appendChild(k);
        pair.appendChild(v);
        card.appendChild(pair);
      });
      if (clickable) {
        card.addEventListener("click", function () {
          root.dispatchEvent(
            new CustomEvent("jl-rtable:rowclick", { detail: { index: rowIdx }, bubbles: true })
          );
        });
      }
      cards.appendChild(card);
    });
    root.appendChild(cards);

    if (clickable) {
      bodyRows.forEach(function (tr, rowIdx) {
        tr.classList.add("jl-rtable__row--clickable");
        tr.addEventListener("click", function () {
          root.dispatchEvent(
            new CustomEvent("jl-rtable:rowclick", { detail: { index: rowIdx }, bubbles: true })
          );
        });
      });
    }

    function apply() {
      var stacked = (root.clientWidth || 9999) < bp;
      table.hidden = stacked;
      cards.hidden = !stacked;
    }
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(apply).observe(root);
    } else {
      window.addEventListener("resize", apply);
    }
    apply();
  }

  register("responsive-table", function (root) {
    root.querySelectorAll(".jl-rtable").forEach(initRTable);
  });
})();
