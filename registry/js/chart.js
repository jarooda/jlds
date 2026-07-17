/* JLDS behavior — Chart. Builds a responsive area/line/bar/sparkline SVG from data
 * attributes and re-measures on resize; hover shows a value tooltip. Requires core.js.
 * Contract (single series):
 *   <div class="jl-chart" data-values="28,41,35" data-labels="Mon,Tue,Wed"
 *     data-type="area|line|bar|sparkline" data-height="200" data-grid="false"
 *     data-axis="false" data-dots="true" data-suffix="k"></div>
 * Multi-series: data-series='[{"name":"A","data":[1,2,3],"color":"var(--info)"}]'
 *   plus optional data-stacked="true" (bars). Reference line: data-ref="90"
 *   data-ref-label="SLA" data-ref-color="var(--danger)". Labels default 1..n. */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var PALETTE = [
    "var(--accent)",
    "var(--info)",
    "var(--warning)",
    "var(--danger)",
    "var(--success)",
    "var(--text-brand)",
  ];
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
  function nums(str) {
    return (str || "")
      .split(",")
      .map(function (s) {
        return parseFloat(s.trim());
      })
      .filter(function (v) {
        return !isNaN(v);
      });
  }
  function normValues(data, labels) {
    return (data || []).map(function (d, i) {
      if (d && typeof d === "object") return { label: d.label, value: d.value };
      return { label: labels && labels[i] != null ? labels[i] : String(i + 1), value: d };
    });
  }

  function initChart(root) {
    if (root.__jlChart) return;
    root.__jlChart = true;

    var type = root.getAttribute("data-type") || "area";
    var spark = type === "sparkline";
    var isBar = type === "bar";
    var height = parseInt(root.getAttribute("data-height"), 10) || (spark ? 44 : 200);
    var stacked = root.getAttribute("data-stacked") === "true";
    var showGrid = spark ? false : root.getAttribute("data-grid") !== "false";
    var showAxis = spark ? false : root.getAttribute("data-axis") !== "false";
    var showDots = root.getAttribute("data-dots") === "true";
    var suffix = root.getAttribute("data-suffix") || "";
    var fmt = function (v) {
      return v + suffix;
    };

    // Resolve single-series or multi-series into a uniform list + shared labels.
    var list, labels, multi;
    var seriesAttr = root.getAttribute("data-series");
    if (seriesAttr) {
      var raw;
      try {
        raw = JSON.parse(seriesAttr);
      } catch (e) {
        raw = [];
      }
      list = raw.map(function (s, i) {
        var pts = normValues(s.data, null);
        return {
          name: s.name || "Series " + (i + 1),
          color: s.color || PALETTE[i % PALETTE.length],
          values: pts.map(function (p) {
            return p.value;
          }),
          labels: pts.map(function (p) {
            return p.label;
          }),
        };
      });
      labels = list[0] ? list[0].labels : [];
      multi = list.length > 1;
    } else {
      var pts = normValues(
        nums(root.getAttribute("data-values")),
        (root.getAttribute("data-labels") || "")
          .split(",")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean)
      );
      list = [
        {
          name: "Series 1",
          color: root.getAttribute("data-color") || PALETTE[0],
          values: pts.map(function (p) {
            return p.value;
          }),
          labels: pts.map(function (p) {
            return p.label;
          }),
        },
      ];
      labels = pts.map(function (p) {
        return p.label;
      });
      multi = false;
    }
    var n = labels.length;
    var stackedBar = isBar && stacked && multi;
    var legendOn =
      root.getAttribute("data-legend") != null
        ? root.getAttribute("data-legend") !== "false"
        : multi && !spark;

    var ref = null;
    if (root.getAttribute("data-ref") != null) {
      ref = {
        value: parseFloat(root.getAttribute("data-ref")),
        label: root.getAttribute("data-ref-label"),
        color: root.getAttribute("data-ref-color"),
      };
    }

    if (spark) root.classList.add("jl-chart--spark");

    var svg = el("svg", { role: "img", "aria-label": "Chart", height: height });
    root.appendChild(svg);
    var tip = document.createElement("div");
    tip.className = "jl-chart__tip";
    tip.style.display = "none";
    root.appendChild(tip);
    if (legendOn) {
      var legend = document.createElement("div");
      legend.className = "jl-chart__legend";
      list.forEach(function (s) {
        var item = document.createElement("span");
        item.className = "jl-chart__legend-item";
        var sw = document.createElement("span");
        sw.className = "jl-chart__swatch";
        sw.style.background = s.color;
        item.appendChild(sw);
        item.appendChild(document.createTextNode(s.name));
        legend.appendChild(item);
      });
      root.appendChild(legend);
    }

    function draw() {
      var w = root.clientWidth || (spark ? 120 : 560);
      svg.setAttribute("viewBox", "0 0 " + w + " " + height);
      svg.textContent = "";

      var padL = showAxis ? 34 : spark ? 1 : 6;
      var padR = spark ? 1 : 6;
      var padT = spark ? 3 : 10;
      var padB = showAxis ? 22 : spark ? 3 : 6;
      var innerW = Math.max(10, w - padL - padR);
      var innerH = Math.max(10, height - padT - padB);

      var maxV, minV;
      if (stackedBar) {
        var sums = labels.map(function (_, i) {
          return list.reduce(function (a, s) {
            return a + Math.max(0, s.values[i] || 0);
          }, 0);
        });
        maxV = Math.max.apply(null, [1].concat(sums));
        minV = 0;
      } else {
        var all = list.reduce(function (a, s) {
          return a.concat(s.values);
        }, []);
        maxV = Math.max.apply(null, [1].concat(all));
        minV = isBar ? 0 : Math.min.apply(null, [0].concat(all));
      }
      var span = maxV - minV || 1;
      var x = function (i) {
        return padL + (n <= 1 ? innerW / 2 : (innerW * i) / (n - 1));
      };
      var y = function (v) {
        return padT + innerH - ((v - minV) / span) * innerH;
      };
      var ticks = 3;
      var grid = [];
      for (var gi = 0; gi <= ticks; gi++) {
        grid.push({ v: minV + (span * gi) / ticks, yy: padT + innerH - (innerH * gi) / ticks });
      }

      if (showGrid) {
        grid.forEach(function (g, i) {
          svg.appendChild(
            el("line", { class: "jl-chart__grid", x1: padL, y1: g.yy, x2: w - padR, y2: g.yy, opacity: i === 0 ? 1 : 0.6 })
          );
        });
      }
      if (showAxis) {
        grid.forEach(function (g) {
          var t = el("text", { class: "jl-chart__axis", x: padL - 8, y: g.yy + 3, "text-anchor": "end" });
          t.textContent = fmt(Math.round(g.v));
          svg.appendChild(t);
        });
        labels.forEach(function (lb, i) {
          if (!(n <= 8 || i % Math.ceil(n / 8) === 0)) return;
          var tx = isBar ? padL + (innerW * (i + 0.5)) / n : x(i);
          var t = el("text", { class: "jl-chart__axis", x: tx, y: height - 6, "text-anchor": "middle" });
          t.textContent = lb;
          svg.appendChild(t);
        });
      }

      if (ref) {
        var rg = el("g", {});
        if (ref.color) rg.setAttribute("style", "--_rc:" + ref.color);
        rg.appendChild(el("line", { class: "jl-chart__ref", x1: padL, y1: y(ref.value), x2: w - padR, y2: y(ref.value) }));
        if (ref.label) {
          var rl = el("text", { class: "jl-chart__ref-label", x: w - padR, y: y(ref.value) - 4, "text-anchor": "end" });
          rl.textContent = ref.label;
          rg.appendChild(rl);
        }
        svg.appendChild(rg);
      }

      if (isBar) {
        var band = n ? innerW / n : innerW;
        if (stackedBar) {
          var bw = Math.min(46, band * 0.62);
          labels.forEach(function (_, i) {
            var acc = 0;
            list.forEach(function (s) {
              var val = Math.max(0, s.values[i] || 0);
              var y0 = y(acc);
              var y1 = y(acc + val);
              acc += val;
              svg.appendChild(
                el("rect", { class: "jl-chart__bar", x: padL + band * i + (band - bw) / 2, y: y1, width: bw, height: Math.max(0, y0 - y1), rx: 3, style: "--_c:" + s.color })
              );
            });
          });
        } else {
          var groupW = band * 0.62;
          var gbw = groupW / list.length;
          labels.forEach(function (_, i) {
            list.forEach(function (s, si) {
              var val = s.values[i] || 0;
              svg.appendChild(
                el("rect", { class: "jl-chart__bar", x: padL + band * i + (band - groupW) / 2 + gbw * si, y: y(Math.max(0, val)), width: Math.max(1, gbw - 1), height: Math.max(1, Math.abs(y(val) - y(0))), rx: 3, style: "--_c:" + s.color })
              );
            });
          });
        }
      } else {
        list.forEach(function (s) {
          var lg = el("g", { style: "--_c:" + s.color });
          var d = s.values
            .map(function (v, i) {
              return (i === 0 ? "M" : "L") + x(i) + "," + y(v);
            })
            .join(" ");
          if (type === "area") {
            lg.appendChild(el("path", { class: "jl-chart__area", d: d + " L" + x(n - 1) + "," + (padT + innerH) + " L" + x(0) + "," + (padT + innerH) + " Z" }));
          }
          lg.appendChild(el("path", { class: "jl-chart__line", d: d }));
          if (showDots) {
            s.values.forEach(function (v, i) {
              lg.appendChild(el("circle", { class: "jl-chart__dot", cx: x(i), cy: y(v), r: 3.5 }));
            });
          }
          svg.appendChild(lg);
        });
      }
      root.__jlChartGeo = { x: x, y: y, padL: padL, padT: padT, innerW: innerW, innerH: innerH };
    }

    var cursor;
    function onMove(e) {
      var geo = root.__jlChartGeo;
      if (spark || !geo || !n) return;
      var rect = root.getBoundingClientRect();
      var px = e.clientX - rect.left;
      var i = isBar
        ? Math.floor(((px - geo.padL) / geo.innerW) * n)
        : Math.round(((px - geo.padL) / geo.innerW) * (n - 1));
      i = Math.max(0, Math.min(n - 1, i));
      var hx = isBar ? geo.padL + (geo.innerW * (i + 0.5)) / n : geo.x(i);
      var topV = stackedBar
        ? list.reduce(function (a, s) {
            return a + Math.max(0, s.values[i] || 0);
          }, 0)
        : Math.max.apply(
            null,
            list.map(function (s) {
              return s.values[i] || 0;
            })
          );
      var hy = geo.y(topV);
      if (!cursor) {
        cursor = el("line", { class: "jl-chart__cursor" });
        svg.insertBefore(cursor, svg.firstChild);
      }
      cursor.setAttribute("x1", hx);
      cursor.setAttribute("y1", geo.padT);
      cursor.setAttribute("x2", hx);
      cursor.setAttribute("y2", geo.padT + geo.innerH);
      cursor.style.display = "";
      if (isBar) {
        Array.prototype.forEach.call(svg.querySelectorAll(".jl-chart__bar"), function (b) {
          b.setAttribute("opacity", 0.55);
        });
      }
      if (multi) {
        var rows = list
          .map(function (s) {
            return (
              '<div class="jl-chart__tip-row"><span class="jl-chart__tip-dot" style="background:' +
              s.color +
              '"></span><span>' +
              s.name +
              '</span> <b style="margin-left:auto">' +
              fmt(s.values[i]) +
              "</b></div>"
            );
          })
          .join("");
        tip.innerHTML = '<div style="margin-bottom:3px;opacity:.75">' + labels[i] + "</div>" + rows;
      } else {
        tip.innerHTML = labels[i] + " · <b>" + fmt(list[0].values[i]) + "</b>";
      }
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
    if (!spark) {
      root.addEventListener("mousemove", onMove);
      root.addEventListener("mouseleave", onLeave);
    }

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
