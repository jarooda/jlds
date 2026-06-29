import * as React from "react";
import "./collapsible.css";

export interface CollapsibleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  trigger: React.ReactNode;
  icon?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  variant?: "ghost" | "bordered";
  chevronPosition?: "start" | "end";
}

const Caret = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Collapsible({
  trigger,
  icon = null,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  variant = "ghost",
  chevronPosition = "end",
  className = "",
  children,
  ...rest
}: CollapsibleProps) {
  const isControlled = openProp != null;
  const [internal, setInternal] = React.useState(defaultOpen);
  const open = isControlled ? openProp : internal;
  const reactId = React.useId();
  const id = `jlcol-${reactId}`;

  const toggle = () => {
    if (disabled) return;
    const next = !open;
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };

  const cls = [
    "jl-collapsible",
    variant === "bordered" ? "jl-collapsible--bordered" : "jl-collapsible--ghost",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} data-open={open || undefined} {...rest}>
      <button
        type="button"
        className="jl-collapsible__trigger"
        data-chevron={chevronPosition}
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={toggle}
      >
        {icon && <span className="jl-collapsible__leadicon">{icon}</span>}
        <span className="jl-collapsible__label">{trigger}</span>
        <span className="jl-collapsible__chevron">
          <Caret />
        </span>
      </button>
      <div className="jl-collapsible__region" id={id} role="region">
        <div className="jl-collapsible__content">
          <div className="jl-collapsible__inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
