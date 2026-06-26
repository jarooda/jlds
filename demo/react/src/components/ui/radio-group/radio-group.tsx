import * as React from "react";
import "./radio-group.css";

export type RadioOption =
  | string
  | {
      value: string;
      label: React.ReactNode;
      description?: React.ReactNode;
      disabled?: boolean;
    };

export interface RadioGroupProps {
  /** Shared input name. */
  name: string;
  /** Currently selected value (controlled). */
  value?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  options: RadioOption[];
  /** Stack vertically or inline. @default "column" */
  direction?: "column" | "row";
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  direction = "column",
  disabled = false,
  className = "",
}: RadioGroupProps) {
  return (
    <div
      className={[
        "jl-radiogroup",
        direction === "row" ? "jl-radiogroup--row" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="radiogroup"
    >
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const isDisabled = disabled || ("disabled" in opt && opt.disabled);
        return (
          <label key={opt.value} className="jl-radio" data-disabled={isDisabled || undefined}>
            <input
              type="radio"
              className="jl-radio__input"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              disabled={isDisabled}
              onChange={(e) => onChange && onChange(e.target.value, e)}
            />
            <span className="jl-radio__dot" />
            <span className="jl-radio__body">
              <span className="jl-radio__label">{opt.label}</span>
              {"description" in opt && opt.description && (
                <span className="jl-radio__desc">{opt.description}</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}
