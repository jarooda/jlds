import * as React from "react";
import "./progress.css";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressTone = "brand" | "success" | "warning" | "danger";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: ProgressSize;
  tone?: ProgressTone;
  label?: React.ReactNode;
  showValue?: boolean;
  indeterminate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = "md",
      tone = "brand",
      label,
      showValue = false,
      indeterminate = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (
      <div
        ref={ref}
        className={["jl-progress", `jl-progress--${size}`, `jl-progress--${tone}`, className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {(label || showValue) && (
          <div className="jl-progress__meta">
            {label && <span className="jl-progress__label">{label}</span>}
            {showValue && <span className="jl-progress__value">{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          className={[
            "jl-progress__track",
            indeterminate ? "jl-progress__track--indeterminate" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="jl-progress__fill"
            style={{ width: indeterminate ? undefined : `${pct}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
