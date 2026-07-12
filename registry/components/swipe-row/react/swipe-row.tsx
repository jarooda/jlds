import * as React from "react";
import "./swipe-row.css";

export interface SwipeAction {
  /** Stable id. */
  id: string;
  /** Action label (stacked under the icon). */
  label?: string;
  /** Icon node (white on colored tones). */
  icon?: React.ReactNode;
  /** Color treatment. @default "neutral" */
  tone?: "neutral" | "accent" | "warning" | "danger";
  onClick?: () => void;
}

export interface SwipeRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trailing actions, revealed right-to-left. Keep to 1–3. */
  actions: SwipeAction[];
  /** Row content (the always-visible panel). */
  children?: React.ReactNode;
  /** Px the row must be dragged to latch open. @default 40% of the actions' width */
  threshold?: number;
  className?: string;
}

/**
 * SwipeRow — a list row whose trailing actions are revealed by a horizontal swipe on
 * touch, and by a hover-revealed button cluster on fine-pointer (desktop) devices.
 * Tier-3 native pattern.
 */
export function SwipeRow({
  actions = [],
  children,
  threshold,
  className = "",
  ...rest
}: SwipeRowProps) {
  const actionsRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; base: number; moved: boolean } | null>(null);
  const [offset, setOffset] = React.useState(0);
  const [animate, setAnimate] = React.useState(false);
  const [actWidth, setActWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    if (actionsRef.current) setActWidth(actionsRef.current.offsetWidth);
  }, [actions]);

  const open = () => {
    setAnimate(true);
    setOffset(-actWidth);
  };
  const close = () => {
    setAnimate(true);
    setOffset(0);
  };

  // Desktop affordance: reveal actions on hover for fine pointers.
  const finePointer = React.useRef(false);
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }
  }, []);
  const onEnter = () => {
    if (finePointer.current && !drag.current) open();
  };
  const onLeave = () => {
    if (finePointer.current && !drag.current) close();
  };

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return; // mouse uses hover cluster
    drag.current = { x: e.clientX, base: offset, moved: false };
    setAnimate(false);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    let next = drag.current.base + dx;
    next = Math.max(-actWidth - 24, Math.min(0, next)); // clamp with slight rubber band
    if (next > 0) next = 0;
    setOffset(next);
  };
  const onUp = () => {
    if (!drag.current) return;
    const t = threshold != null ? threshold : actWidth * 0.4;
    if (-offset > t) open();
    else close();
    drag.current = null;
  };

  const isOpen = offset < -2;

  return (
    <div
      className={["jl-swiperow", isOpen ? "jl-swiperow--open" : "", className]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...rest}
    >
      <div className="jl-swiperow__actions" ref={actionsRef}>
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            className="jl-swiperow__action"
            data-tone={a.tone || "neutral"}
            onClick={() => {
              a.onClick?.();
              close();
            }}
          >
            {a.icon}
            {a.label && <span>{a.label}</span>}
          </button>
        ))}
      </div>
      <div
        className={["jl-swiperow__panel", animate ? "jl-swiperow__panel--animate" : ""]
          .filter(Boolean)
          .join(" ")}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onClickCapture={(e) => {
          if (drag.current && drag.current.moved) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
