import * as React from "react";
import "./input.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: InputSize;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Trailing node (icon, button, hint). */
  trailing?: React.ReactNode;
  /** Inline text/node before the field (e.g. "https://"). */
  prefix?: React.ReactNode;
  /** Inline text/node after the field (e.g. ".dev", a unit). */
  suffix?: React.ReactNode;
  /** Show a clear (×) button when the controlled value is non-empty. @default false */
  clearable?: boolean;
  /** Called when the clear button is pressed; defaults to emitting an empty-value change. */
  onClear?: (e: React.MouseEvent) => void;
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      icon,
      trailing,
      prefix,
      suffix,
      clearable = false,
      onClear,
      invalid = false,
      disabled = false,
      value,
      onChange,
      className = "",
      ...props
    },
    ref
  ) => {
    const controlled = value !== undefined;
    const showClear =
      clearable && !disabled && controlled && value != null && value !== "";
    const clear = (e: React.MouseEvent) => {
      if (onClear) return onClear(e);
      onChange?.({
        ...e,
        target: { ...(e.target as HTMLInputElement), value: "" },
        currentTarget: { ...(e.currentTarget as HTMLInputElement), value: "" },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    };
    return (
      <div
        className={["jl-input-wrap", `jl-input-wrap--${size}`, className]
          .filter(Boolean)
          .join(" ")}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        {icon && <span className="jl-input-adorn">{icon}</span>}
        {prefix && <span className="jl-input-affix">{prefix}</span>}
        <input
          ref={ref}
          className="jl-input"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          value={value}
          onChange={onChange}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            className="jl-input-clear"
            aria-label="Clear"
            onClick={clear}
            tabIndex={-1}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {suffix && <span className="jl-input-affix">{suffix}</span>}
        {trailing && <span className="jl-input-adorn">{trailing}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
