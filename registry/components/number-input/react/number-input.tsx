import * as React from "react";
import "./number-input.css";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size" | "prefix"
  > {
  value?: number | "";
  defaultValue?: number | "";
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
  /** Leading affix (e.g. a currency symbol). */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
}

function decimals(step: number): number {
  const s = String(step);
  return s.includes(".") ? s.split(".")[1].length : 0;
}

export function NumberInput({
  value,
  defaultValue,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  size = "md",
  align = "center",
  prefix,
  suffix,
  disabled = false,
  invalid = false,
  placeholder,
  className = "",
  ...rest
}: NumberInputProps) {
  const isControlled = value !== undefined;
  const [unc, setUnc] = React.useState<number | "">(defaultValue ?? "");
  const raw = isControlled ? value : unc;
  const [text, setText] = React.useState(raw === "" || raw == null ? "" : String(raw));

  // Sync the text field to a controlled value, derived during render (React docs
  // "adjust state during render" pattern) instead of resetting via an effect.
  const [prevValue, setPrevValue] = React.useState(value);
  if (isControlled && value !== prevValue) {
    setPrevValue(value);
    setText(value === "" || value == null ? "" : String(value));
  }

  const prec = precision != null ? precision : decimals(step);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const round = (n: number) => Number(n.toFixed(prec));

  const cur = (): number | null => {
    const n = parseFloat(text);
    return Number.isNaN(n) ? null : n;
  };

  const commit = (n: number | "" | null) => {
    const next =
      n === "" || n == null || Number.isNaN(n) ? "" : round(clamp(n as number));
    if (!isControlled) setUnc(next);
    setText(next === "" ? "" : String(next));
    onChange?.(next === "" ? null : (next as number));
  };

  const bump = (dir: number) => {
    const base = cur();
    const start = base == null ? (Number.isFinite(min) ? min : 0) : base;
    commit(start + dir * step);
  };

  const atMin = cur() != null && (cur() as number) <= min;
  const atMax = cur() != null && (cur() as number) >= max;

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      bump(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      bump(-1);
    }
  };

  const cls = [
    "jl-number",
    `jl-number--${size}`,
    `jl-number--${align}`,
    disabled ? "jl-number--disabled" : "",
    invalid ? "jl-number--invalid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      <button
        type="button"
        className="jl-number__btn jl-number__btn--dec"
        aria-label="Decrease"
        disabled={disabled || atMin}
        onClick={() => bump(-1)}
        tabIndex={-1}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {prefix && <span className="jl-number__affix jl-number__affix--prefix">{prefix}</span>}
      <input
        className="jl-number__input"
        type="text"
        inputMode="decimal"
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        role="spinbutton"
        aria-valuenow={cur() ?? undefined}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        onChange={(e) => {
          const v = e.target.value;
          if (/^-?\d*\.?\d*$/.test(v)) {
            setText(v);
            if (!isControlled) setUnc(v === "" ? "" : (parseFloat(v) as number));
          }
        }}
        onBlur={() => {
          const n = cur();
          commit(n == null ? "" : n);
        }}
        onKeyDown={onKey}
        {...rest}
      />
      {suffix && <span className="jl-number__affix">{suffix}</span>}
      <button
        type="button"
        className="jl-number__btn jl-number__btn--inc"
        aria-label="Increase"
        disabled={disabled || atMax}
        onClick={() => bump(1)}
        tabIndex={-1}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
