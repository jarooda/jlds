import * as React from "react";
import "./carousel.css";

/** Slides per view by container width — keys map to the breakpoint tokens. */
export interface CarouselPerView {
  /** < 600px (mobile). @default 1 */
  base?: number;
  /** ≥ 600px (--bp-mobile). */
  sm?: number;
  /** ≥ 900px (--bp-tablet). */
  md?: number;
  /** ≥ 1200px (--bp-desktop). */
  lg?: number;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slides — one per child. */
  children?: React.ReactNode;
  /** Slides visible at once — a fixed number, or a responsive map by breakpoint. @default 1 */
  perView?: number | CarouselPerView;
  /** Gap between slides in px. @default 16 */
  gap?: number;
  /** Show prev/next arrows on pointer devices. @default true */
  showArrows?: boolean;
  /** Show page dots. @default true */
  showDots?: boolean;
  className?: string;
}

/**
 * Carousel — scroll-snap track with adaptive slides-per-view, native touch swipe,
 * arrows (desktop) and page dots. Tier-2 adaptive: perView shrinks on narrow screens.
 */
export function Carousel({
  children,
  perView = 1,
  gap = 16,
  showArrows = true,
  showDots = true,
  className = "",
  ...rest
}: CarouselProps) {
  const slides = React.Children.toArray(children).filter(Boolean);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const suppressClick = React.useRef(false);
  const [columns, setColumns] = React.useState(typeof perView === "number" ? perView : 1);
  const [active, setActive] = React.useState(0);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  // Resolve responsive perView ({ base, sm, md, lg } against container width).
  const resolveCols = React.useCallback(() => {
    const w = trackRef.current ? trackRef.current.clientWidth : 0;
    if (typeof perView === "number") return perView;
    const p = perView || {};
    let c = p.base || 1;
    if (w >= 600 && p.sm != null) c = p.sm;
    if (w >= 900 && p.md != null) c = p.md;
    if (w >= 1200 && p.lg != null) c = p.lg;
    return c;
  }, [perView]);

  React.useEffect(() => {
    const update = () => setColumns(resolveCols());
    update();
    const t = trackRef.current;
    if (t && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(t);
      return () => ro.disconnect();
    }
  }, [resolveCols]);

  const pages = Math.max(1, Math.ceil(slides.length / columns));

  const onScroll = React.useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const slideW = (t.clientWidth - gap * (columns - 1)) / columns + gap;
    const idx = Math.round(t.scrollLeft / slideW);
    setActive(Math.min(pages - 1, Math.max(0, Math.round(idx / columns))));
    setAtStart(t.scrollLeft <= 2);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 2);
  }, [columns, gap, pages]);

  React.useEffect(() => {
    onScroll();
  }, [onScroll, columns]);

  const goToPage = (p: number) => {
    const t = trackRef.current;
    if (!t) return;
    const target = (t.scrollWidth / pages) * p;
    t.scrollTo({ left: target, behavior: "smooth" });
  };
  const step = (dir: number) => {
    const t = trackRef.current;
    if (!t) return;
    const slideW = (t.clientWidth - gap * (columns - 1)) / columns + gap;
    t.scrollBy({ left: dir * slideW * columns, behavior: "smooth" });
  };

  // Drag-to-scroll for mouse (touch scrolls natively).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const t = trackRef.current;
    if (!t) return;
    suppressClick.current = false;
    drag.current = { x: e.clientX, scroll: t.scrollLeft, moved: false };
    t.classList.add("jl-carousel__track--dragging");
    t.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const t = trackRef.current;
    if (!t) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    t.scrollLeft = drag.current.scroll - dx;
  };
  const onPointerUp = () => {
    if (drag.current?.moved) suppressClick.current = true;
    trackRef.current?.classList.remove("jl-carousel__track--dragging");
    drag.current = null;
  };

  const basis =
    columns === 1 ? "100%" : `calc((100% - ${gap * (columns - 1)}px) / ${columns})`;

  return (
    <div className={["jl-carousel", className].filter(Boolean).join(" ")} {...rest}>
      {showArrows && slides.length > columns && (
        <button
          type="button"
          className="jl-carousel__arrow jl-carousel__arrow--prev"
          aria-label="Previous"
          disabled={atStart}
          onClick={() => step(-1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
      )}
      <div
        ref={trackRef}
        className="jl-carousel__track"
        style={{ "--_gap": `${gap}px` } as React.CSSProperties}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
            suppressClick.current = false;
          }
        }}
        role="group"
        aria-label="Carousel"
      >
        {slides.map((s, i) => (
          <div
            className="jl-carousel__slide"
            key={i}
            style={{ "--_basis": basis } as React.CSSProperties}
          >
            {s}
          </div>
        ))}
      </div>
      {showArrows && slides.length > columns && (
        <button
          type="button"
          className="jl-carousel__arrow jl-carousel__arrow--next"
          aria-label="Next"
          disabled={atEnd}
          onClick={() => step(1)}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      )}
      {showDots && pages > 1 && (
        <div className="jl-carousel__dots" role="tablist" aria-label="Slide">
          {Array.from({ length: pages }).map((_, p) => (
            <button
              key={p}
              type="button"
              role="tab"
              className="jl-carousel__dot"
              aria-current={p === active}
              aria-label={`Go to slide ${p + 1}`}
              onClick={() => goToPage(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
