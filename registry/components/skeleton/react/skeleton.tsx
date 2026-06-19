import * as React from "react";
import "./skeleton.css";

export type SkeletonVariant = "text" | "circle" | "rect";

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  lines?: number;
  radius?: number | string;
}

const dim = (v?: number | string) => (typeof v === "number" ? `${v}px` : v);

const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      lines = 1,
      radius,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    if (variant === "text" && lines > 1) {
      return (
        <div
          className={["jl-skel-lines", className].filter(Boolean).join(" ")}
          aria-hidden="true"
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <span
              key={i}
              className="jl-skel jl-skel--text"
              style={{ width: i === lines - 1 ? "62%" : width ? dim(width) : "100%" }}
            />
          ))}
        </div>
      );
    }

    const isCircle = variant === "circle";
    const resolved: React.CSSProperties = {
      width: dim(width ?? (isCircle ? 40 : undefined)),
      height: dim(height ?? (isCircle ? width ?? 40 : undefined)),
      borderRadius: radius != null ? dim(radius) : undefined,
      ...style,
    };

    return (
      <span
        ref={ref}
        className={["jl-skel", `jl-skel--${variant}`, className]
          .filter(Boolean)
          .join(" ")}
        style={resolved}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
