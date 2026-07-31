import * as React from "react";
import { useAnchoredPopup, AnchoredPortal } from "../anchored-popup";
import "./tooltip.css";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  side?: TooltipSide;
  delay?: number;
  /** Controlled open state. Omit for uncontrolled hover/focus behavior. */
  open?: boolean;
  /** Called when the tooltip wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Render the trigger without any tooltip. @default false */
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Tooltip({
  content,
  side = "top",
  delay = 120,
  open,
  onOpenChange,
  disabled = false,
  className = "",
  children,
}: TooltipProps) {
  const isControlled = open !== undefined;
  const [internal, setInternal] = React.useState(false);
  const show = isControlled ? open : internal;
  const set = (v: boolean) => {
    if (!isControlled) setInternal(v);
    onOpenChange?.(v);
  };
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // The bubble is portaled to <body> so a clipping ancestor (a Card's overflow: hidden,
  // a scrolling table wrapper) can't crop it, and anchored to the trigger instead. It
  // stays mounted — `retainOnClose` keeps the last position so the fade-out plays in
  // place rather than jumping. Tooltips are suppressed on touch, so no sheet.
  const { anchorRef, popupRef } = useAnchoredPopup<HTMLSpanElement, HTMLSpanElement>({
    open: show,
    side,
    align: "center",
    gap: 8,
    sheetBreakpoint: 0,
    retainOnClose: true,
  });

  const openIt = () => {
    timer.current = setTimeout(() => set(true), delay);
  };
  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    set(false);
  };

  if (disabled || content == null) return <>{children}</>;

  return (
    <span
      ref={anchorRef}
      className={["jl-tooltip", className].filter(Boolean).join(" ")}
      onMouseEnter={openIt}
      onMouseLeave={close}
      onFocus={openIt}
      onBlur={close}
    >
      {children}
      <AnchoredPortal>
        <span
          ref={popupRef}
          className="jl-tooltip__pop"
          role="tooltip"
          data-side={side}
          data-show={show || undefined}
        >
          {content}
          <span className="jl-tooltip__arrow" />
        </span>
      </AnchoredPortal>
    </span>
  );
}
