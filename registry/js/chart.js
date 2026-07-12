/* JLDS behavior — Chart. Builds a responsive area/line/bar SVG from data attributes and
 * re-measures on resize; hover shows a value tooltip. Requires core.js.
 * Contract: <div class="jl-chart" data-values="28,41,35" data-labels="Mon,Tue,Wed"
 *   data-type="area|line|bar" data-height="200" data-grid="false" data-axis="false"
 *   data-dots="true" data-suffix="k"></div>. Labels are optional (default 1..n). */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }
  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    return e;
  }

  function initChart(root) {
    if (root.__jlChart) return;
    root.__jlChart = true;

    var values = (root.getAttribute("data-values") || "")
      .split(",")
      .map(function (s) {
        return parseFloat(s.trim());
      })
      .filter(function (v) {
        return !isNaN(v);
      });
    var labels = (root.getAttribute("data-labels") || "")
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    var points = values.map(function (v, i) {
      return { label: labels[i] != null ? labels[i] : String(i + 1), value: v };
    });

    var type = root.getAttribute("data-type") || "area";
    var height = parseInt(root.getAttribute("data-height"), 10) || 200;
    var showGrid = root.getAttribute("data-grid") !== "false";
    var showAxis = root.getAttribute("data-axis") !== "false";
    var showDots = root.getAttribute("data-dots") === "true";
    var suffix = root.getAttribute("data-suffix") || "";
    var fmt = function (v) {
      return v + suffix;
    };

    var svg = el("svg", { role: "img", "aria-label": "Chart", height: height });
    root.appendChild(svg);
    var tip = document.createElement("div");
    tip.className = "jl-chart__tip";
    tip.style.display = "none";
    root.appendChild(tip);

    function draw() {
      var w = root.clientWidth || 560;
      svg.setAttribute("viewBox", "0 0 " + w + " " + height);
      svg.textContent = "";

      var padL = showAxis ? 34 : 6,
        padR = 6,
        padT = 10,
        padB = showAxis ? 22 : 6;
      var innerW = Math.max(10, w - padL - padR);
      var innerH = Math.max(10, height - padT - padB);
      var vals = points.map(function (p) {
        return p.value;
      });
      var maxV = Math.max.apply(null, [1].concat(vals));
      var minV = Math.min.apply(null, [0].concat(vals));
      var span = maxV - minV || 1;
      var x = function (i) {
        return padL + (points.length <= 1 ? innerW / 2 : (innerW * i) / (points.length - 1));
      };
      var y = function (v) {
        return padT + innerH - ((v - minV) / span) * innerH;
      };
      var ticks = 3;
      var grid = [];
      for (var i = 0; i <= ticks; i++) {
        grid.push({ v: minV + (span * i) / ticks, yy: padT + innerH - (innerH * i) / ticks });
      }

      if (showGrid) {
        grid.forEach(function (g, i) {
          svg.appendChild(
            el("line", {
              class: "jl-chart__grid",
              x1: padL,
              y1: g.yy,
              x2: w - padR,
              y2: g.yy,
              opacity: i === 0 ? 1 : 0.6,
            })
          );
        });
      }
      if (showAxis) {
        grid.forEach(function (g) {
          var t = el("text", { class: "jl-chart__axis", x: padL - 8, y: g.yy + 3, "text-anchor": "end" });
          t.textContent = fmt(Math.round(g.v));
          svg.appendChild(t);
        });
        points.forEach(function (p, i) {
          if (!(points.length <= 8 || i % Math.ceil(points.length / 8) === 0)) return;
          var tx = type === "bar" ? padL + (innerW * (i + 0.5)) / points.length : x(i);
          var t = el("text", { class: "jl-chart__axis", x: tx, y: height - 6, "text-anchor": "middle" });
          t.textContent = p.label;
          svg.appendChild(t);
        });
      }

      var geo = { x: x, y: y, padL: padL, padT: padT, innerW: innerW, innerH: innerH };

      if (type === "bar") {
        var bw = points.length ? Math.min(46, (innerW / points.length) * 0.62) : 10;
        points.forEach(function (p, i) {
          var bx = padL + (innerW * (i + 0.5)) / points.length - bw / 2;
          svg.appendChild(
            el("rect", {
              class: "jl-chart__bar",
              x: bx,
              y: y(Math.max(0, p.value)),
              width: bw,
              height: Math.max(1, Math.abs(y(p.value) - y(0))),
              rx: 4,
            })
          );
        });
      } else {
        var d = points
          .map(function (p, i) {
            return (i === 0 ? "M" : "L") + x(i) + "," + y(p.value);
          })
          .join(" ");
        if (type === "area") {
          svg.appendChild(
            el("path", {
              class: "jl-chart__area",
              d: d + " L" + x(points.length - 1) + "," + (padT + innerH) + " L" + x(0) + "," + (padT + innerH) + " Z",
            })
          );
        }
        svg.appendChild(el("path", { class: "jl-chart__line", d: d }));
        if (showDots) {
          points.forEach(function (p, i) {
            svg.appendChild(el("circle", { class: "jl-chart__dot", cx: x(i), cy: y(p.value), r: 3.5 }));
          });
        }
      }
      root.__jlChartGeo = geo;
    }

    var cursor, hoverDot;
    function onMove(e) {
      var geo = root.__jlChartGeo;
      if (!geo || !points.length) return;
      var rect = root.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var i;
      if (type === "bar") i = Math.floor(((px - geo.padL) / geo.innerW) * points.length);
      else i = Math.round(((px - geo.padL) / geo.innerW) * (points.length - 1));
      i = Math.max(0, Math.min(points.length - 1, i));
      var p = points[i];
      if (!p) return;
      var hx = geo.x(i);
      var hy = type === "bar" ? geo.y(Math.max(0, p.value)) : geo.y(p.value);
      if (!cursor) {
        cursor = el("line", { class: "jl-chart__cursor" });
        svg.insertBefore(cursor, svg.firstChild);
      }
      cursor.setAttribute("x1", hx);
      cursor.setAttribute("y1", geo.padT);
      cursor.setAttribute("x2", hx);
      cursor.setAttribute("y2", geo.padT + geo.innerH);
      cursor.style.display = "";
      if (type === "bar") {
        Array.prototype.forEach.call(svg.querySelectorAll(".jl-chart__bar"), function (b, bi) {
          b.setAttribute("opacity", bi === i ? 1 : 0.55);
        });
      }
      tip.innerHTML = p.label + " · <b>" + fmt(p.value) + "</b>";
      tip.style.left = hx + "px";
      tip.style.top = hy - 8 + "px";
      tip.style.display = "";
    }
    function onLeave() {
      tip.style.display = "none";
      if (cursor) cursor.style.display = "none";
      Array.prototype.forEach.call(svg.querySelectorAll(".jl-chart__bar"), function (b) {
        b.setAttribute("opacity", 1);
      });
    }
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(draw).observe(root);
    } else {
      window.addEventListener("resize", draw);
    }
    draw();
  }

  register("chart", function (root) {
    root.querySelectorAll(".jl-chart").forEach(initChart);
  });
})();
