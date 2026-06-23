import * as React from "react";
import "./stepper.css";

export type Step =
  | string
  | {
      label: React.ReactNode;
      description?: React.ReactNode;
      icon?: React.ReactNode;
    };

export interface StepperProps extends React.OlHTMLAttributes<HTMLOListElement> {
  steps: Step[];
  active?: number;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md";
  onStepClick?: (index: number, step: Step) => void;
}

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Stepper({
  steps = [],
  active = 0,
  orientation = "horizontal",
  size = "md",
  onStepClick,
  className = "",
  ...rest
}: StepperProps) {
  const norm = steps.map((s) => (typeof s === "string" ? { label: s } : s));
  const cls = [
    "jl-stepper",
    `jl-stepper--${orientation}`,
    size === "sm" ? "jl-stepper--sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ol className={cls} {...rest}>
      {norm.map((s, i) => {
        const state = i < active ? "completed" : i === active ? "current" : "upcoming";
        const isLast = i === norm.length - 1;
        const clickable = !!onStepClick;
        const markerContent = state === "completed" ? CHECK : (s as { icon?: React.ReactNode }).icon ?? i + 1;
        const markerProps = {
          className: "jl-step__marker",
          "aria-current": state === "current" ? ("step" as const) : undefined,
        };
        return (
          <li className="jl-step" data-state={state} key={i}>
            <div className="jl-step__indicator">
              {clickable ? (
                <button type="button" {...markerProps} onClick={() => onStepClick(i, steps[i])}>
                  {markerContent}
                </button>
              ) : (
                <span {...markerProps}>{markerContent}</span>
              )}
              {!isLast && <span className="jl-step__line" aria-hidden="true" />}
            </div>
            <div className="jl-step__body">
              <div className="jl-step__label">{s.label}</div>
              {s.description && <div className="jl-step__desc">{s.description}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
