import * as React from "react";
import "./toggle.css";

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  size = "md",
  icon,
  disabled = false,
  className = "",
  children,
  ...rest
}: ToggleProps) {
  const isControlled = pressed !== undefined;
  const [unc, setUnc] = React.useState(defaultPressed);
  const on = isControlled ? pressed : unc;
  const toggle = () => {
    const next = !on;
    if (!isControlled) setUnc(next);
    onPressedChange?.(next);
  };
  const iconOnly = icon && !children;
  const cls = [
    "jl-toggle",
    `jl-toggle--${size}`,
    iconOnly ? "jl-toggle--icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={cls} aria-pressed={on} disabled={disabled} onClick={toggle} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export type ToggleOption =
  | string
  | {
      value: string;
      label?: React.ReactNode;
      icon?: React.ReactNode;
      ariaLabel?: string;
      disabled?: boolean;
    };

export interface ToggleGroupProps {
  type?: "single" | "multiple";
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  options: ToggleOption[];
  size?: "sm" | "md" | "lg";
  variant?: "attached" | "spaced";
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function ToggleGroup({
  type = "single",
  value,
  defaultValue,
  onChange,
  options = [],
  size = "md",
  variant = "attached",
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: ToggleGroupProps) {
  const isControlled = value !== undefined;
  const [unc, setUnc] = React.useState<string | string[] | null>(
    defaultValue !== undefined ? defaultValue : type === "multiple" ? [] : null
  );
  const current = isControlled ? value : unc;

  const setValue = (v: string | string[] | null) => {
    if (!isControlled) setUnc(v);
    onChange?.(v);
  };
  const isOn = (val: string) =>
    type === "multiple"
      ? ((current as string[]) || []).includes(val)
      : current === val;
  const select = (val: string) => {
    if (type === "multiple") {
      const arr = (current as string[]) || [];
      setValue(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    } else {
      setValue(current === val ? null : val);
    }
  };

  const cls = [
    "jl-toggle-group",
    `jl-toggle-group--${variant}`,
    `jl-toggle-group--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const iconOnly = opt.icon && !opt.label;
        return (
          <button
            key={opt.value}
            type="button"
            className={["jl-toggle", `jl-toggle--${size}`, iconOnly ? "jl-toggle--icon" : ""]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={isOn(opt.value)}
            aria-label={opt.ariaLabel || (iconOnly ? opt.value : undefined)}
            disabled={disabled || opt.disabled}
            onClick={() => select(opt.value)}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
