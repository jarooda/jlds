import * as React from "react";
import "./switch.css";

export type SwitchSize = "sm" | "md";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  /** Supporting text under the label. */
  description?: React.ReactNode;
  /** Which side the label sits on. @default "end" */
  labelPlacement?: "start" | "end";
  size?: SwitchSize;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    { label, description, labelPlacement = "end", size = "md", disabled = false, className = "", ...props },
    ref
  ) => {
    return (
      <label
        className={[
          "jl-switch",
          `jl-switch--${size}`,
          labelPlacement === "start" ? "jl-switch--start" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-disabled={disabled || undefined}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className="jl-switch__input"
          disabled={disabled}
          {...props}
        />
        <span className="jl-switch__track">
          <span className="jl-switch__thumb" />
        </span>
        {(label || description) && (
          <span className="jl-switch__body">
            {label && <span className="jl-switch__label">{label}</span>}
            {description && <span className="jl-switch__desc">{description}</span>}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
