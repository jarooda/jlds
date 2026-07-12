/* JLDS behavior — Carousel. Turns a .jl-carousel with a .jl-carousel__track of slide
 * children into a scroll-snap carousel: adaptive slides-per-view, generated arrows +
 * page dots, native touch swipe. Requires core.js.
 * Contract: .jl-carousel > .jl-carousel__track > (slides). Data attributes on the root:
 *   data-per-view / data-per-view-sm / -md / -lg (numbers), data-gap (px),
 *   data-arrows="false", data-dots="false". */
(function () {
  function register(name, fn) {
    var J = (window.JLDS = window.JLDS || {});
    if (J.register) J.register(name, fn);
    else (J._pending = J._pending || []).push([name, fn]);
  }

  function num(el, attr, dflt) {
    var v = parseFloat(el.getAttribute(attr));
    return isNaN(v) ? dflt : v;
  }

  function svg(d) {
    return (
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'
    );
  }

  function initCarousel(root) {
    if (root.__jlCarousel) return;
    root.__jlCarousel = true;

    var track = root.querySelector(".jl-carousel__track");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    slides.forEach(function (s) {
      s.classList.add("jl-carousel__slide");
    });

    var gap = num(root, "data-gap", 16);
    track.style.setProperty("--_gap", gap + "px");
    var wantArrows = root.getAttribute("data-arrows") !== "false";
    var wantDots = root.getAttribute("data-dots") !== "false";

    function columns() {
      var w = track.clientWidth;
      var c = num(root, "data-per-view", 1);
      if (w >= 600) c = num(root, "data-per-view-sm", c);
      if (w >= 900) c = num(root, "data-per-view-md", c);
      if (w >= 1200) c = num(root, "data-per-view-lg", c);
      return Math.max(1, c);
    }
    function pages(cols) {
      return Math.max(1, Math.ceil(slides.length / cols));
    }

    // Arrows
    var prev, next;
    if (wantArrows) {
      prev = document.createElement("button");
      prev.type = "button";
      prev.className = "jl-carousel__arrow jl-carousel__arrow--prev";
      prev.setAttribute("aria-label", "Previous");
      prev.innerHTML = svg("m15 6-6 6 6 6");
      next = document.createElement("button");
      next.type = "button";
      next.className = "jl-carousel__arrow jl-carousel__arrow--next";
      next.setAttribute("aria-label", "Next");
      next.innerHTML = svg("m9 6 6 6-6 6");
      root.insertBefore(prev, track);
      root.appendChild(next);
      prev.addEventListener("click", function () {
        step(-1);
      });
      next.addEventListener("click", function () {
        step(1);
      });
    }

    // Dots
    var dotsWrap;
    if (wantDots) {
      dotsWrap = document.createElement("div");
      dotsWrap.className = "jl-carousel__dots";
      dotsWrap.setAttribute("role", "tablist");
      dotsWrap.setAttribute("aria-label", "Slide");
      root.appendChild(dotsWrap);
    }

    function apply() {
      var cols = columns();
      var basis =
        cols === 1 ? "100%" : "calc((100% - " + gap * (cols - 1) + "px) / " + cols + ")";
      track.style.setProperty("--_basis", basis);

      var p = pages(cols);
      if (dotsWrap) {
        dotsWrap.style.display = p > 1 ? "" : "none";
        if (dotsWrap.children.length !== p) {
          dotsWrap.textContent = "";
          for (var i = 0; i < p; i++) {
            (function (idx) {
              var dot = document.createElement("button");
              dot.type = "button";
              dot.className = "jl-carousel__dot";
              dot.setAttribute("role", "tab");
              dot.setAttribute("aria-label", "Go to slide " + (idx + 1));
              dot.addEventListener("click", function () {
                track.scrollTo({ left: (track.scrollWidth / p) * idx, behavior: "smooth" });
              });
              dotsWrap.appendChild(dot);
            })(i);
          }
        }
      }
      if (prev || next) {
        var many = slides.length > cols;
        if (prev) prev.style.display = many ? "" : "none";
        if (next) next.style.display = many ? "" : "none";
      }
      onScroll();
    }

    function step(dir) {
      var cols = columns();
      var slideW = (track.clientWidth - gap * (cols - 1)) / cols + gap;
      track.scrollBy({ left: dir * slideW * cols, behavior: "smooth" });
    }

    function onScroll() {
      var cols = columns();
      var p = pages(cols);
      var slideW = (track.clientWidth - gap * (cols - 1)) / cols + gap;
      var idx = Math.round(track.scrollLeft / slideW);
      var active = Math.min(p - 1, Math.max(0, Math.round(idx / cols)));
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          if (i === active) d.setAttribute("aria-current", "true");
          else d.removeAttribute("aria-current");
        });
      }
      var atStart = track.scrollLeft <= 2;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
    }

    track.addEventListener("scroll", onScroll);

    // Drag-to-scroll for mouse (touch scrolls natively).
    var drag = null;
    var suppressClick = false;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      suppressClick = false;
      drag = { x: e.clientX, scroll: track.scrollLeft, moved: false };
      track.classList.add("jl-carousel__track--dragging");
      if (track.setPointerCapture) track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 3) drag.moved = true;
      track.scrollLeft = drag.scroll - dx;
    });
    function endDrag() {
      if (!drag) return;
      if (drag.moved) suppressClick = true;
      track.classList.remove("jl-carousel__track--dragging");
      drag = null;
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener(
      "click",
      function (e) {
        if (suppressClick) {
          e.preventDefault();
          e.stopPropagation();
          suppressClick = false;
        }
      },
      true
    );

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(apply).observe(track);
    } else {
      window.addEventListener("resize", apply);
    }
    apply();
  }

  register("carousel", function (root) {
    root.querySelectorAll(".jl-carousel").forEach(initCarousel);
  });
})();
