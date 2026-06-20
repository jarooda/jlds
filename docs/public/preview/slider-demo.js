// Minimal vanilla slider behavior for the docs previews only.
// The shipped component (React/Vue) carries the real implementation; this just
// makes the preview iframes interactive without pulling in a framework.
document.querySelectorAll(".jl-slider").forEach(function (sl) {
  var track = sl.querySelector(".jl-slider__track");
  var fill = sl.querySelector(".jl-slider__fill");
  var readout = sl.querySelector(".jl-slider__value");
  var thumbs = [].slice.call(sl.querySelectorAll(".jl-slider__thumb"));
  var min = +sl.dataset.min || 0;
  var max = +sl.dataset.max || 100;
  var step = +sl.dataset.step || 1;
  var suffix = sl.dataset.suffix || "";
  var range = thumbs.length > 1;
  var vals = thumbs.map(function (t) { return +t.dataset.value; });

  function pct(v) { return ((v - min) / (max - min)) * 100; }
  function round(v) { return Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min)); }

  function render() {
    thumbs.forEach(function (t, i) {
      t.style.left = pct(vals[i]) + "%";
      t.setAttribute("aria-valuenow", vals[i]);
    });
    if (range) {
      fill.style.left = pct(vals[0]) + "%";
      fill.style.right = 100 - pct(vals[1]) + "%";
    } else {
      fill.style.left = "0";
      fill.style.width = pct(vals[0]) + "%";
    }
    if (readout) {
      readout.textContent = range
        ? vals[0] + suffix + " – " + vals[1] + suffix
        : vals[0] + suffix;
    }
  }

  function fromX(x) {
    var r = track.getBoundingClientRect();
    var ratio = Math.min(1, Math.max(0, (x - r.left) / r.width));
    return round(min + ratio * (max - min));
  }

  function apply(i, v) {
    if (range) {
      if (i === 0) vals[0] = Math.min(v, vals[1]);
      else vals[1] = Math.max(v, vals[0]);
    } else {
      vals[0] = v;
    }
    render();
  }

  track.addEventListener("pointerdown", function (e) {
    var v = fromX(e.clientX);
    var i = range ? (Math.abs(vals[0] - v) <= Math.abs(vals[1] - v) ? 0 : 1) : 0;
    apply(i, v);
    function move(ev) { apply(i, fromX(ev.clientX)); }
    function up() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });

  thumbs.forEach(function (t, i) {
    t.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    t.addEventListener("keydown", function (e) {
      var d =
        e.key === "ArrowRight" || e.key === "ArrowUp" ? step
        : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -step
        : 0;
      if (!d) return;
      e.preventDefault();
      apply(i, round(vals[i] + d));
    });
  });

  render();
});
