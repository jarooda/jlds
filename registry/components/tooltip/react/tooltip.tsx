import * as React from "react";
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
      className={["jl-tooltip", className].filter(Boolean).join(" ")}
      onMouseEnter={openIt}
      onMouseLeave={close}
      onFocus={openIt}
      onBlur={close}
    >
      {children}
      <span
        className="jl-tooltip__pop"
        role="tooltip"
        data-side={side}
        data-show={show || undefined}
      >
        {content}
        <span className="jl-tooltip__arrow" />
      </span>
    </span>
  );
}
