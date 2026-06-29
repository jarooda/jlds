import * as React from "react";
import "./rating.css";

export type RatingSize = "sm" | "md" | "lg";
export type RatingTone = "accent" | "warning" | "danger" | "neutral";

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onChange" | "defaultValue"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  size?: RatingSize;
  tone?: RatingTone;
  showValue?: boolean;
  count?: number;
}

const SIZES: Record<RatingSize, number> = { sm: 16, md: 20, lg: 26 };

const STAR_PATH = "m12 3.2 2.7 5.5 6 .9-4.35 4.24 1.03 6L12 17.1 6.62 19.84l1.03-6L3.3 9.6l6-.9Z";

function StarGlyph({ px }: { px: number }) {
  // Two stacked stars: a hollow outline track + a filled foreground clipped to the fill level.
  return (
    <span className="jl-rating__star" style={{ position: "relative", width: px, height: px }}>
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        <path d={STAR_PATH} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <svg className="jl-rating__fg jl-rating__fill" width={px} height={px} viewBox="0 0 24 24" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        <path d={STAR_PATH} fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * Rating — a row of stars for displaying or capturing a 0–max score. Supports half values,
 * read-only display with an optional value/count label, and hover preview when interactive.
 */
export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
  allowHalf = false,
  readOnly = false,
  disabled = false,
  size = "md",
  tone = "accent",
  showValue = false,
  count,
  className = "",
  "aria-label": ariaLabel = "Rating",
  ...rest
}: RatingProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const current = isControlled ? (value as number) : inner;
  const [hover, setHover] = React.useState<number | null>(null);
  const interactive = !readOnly && !disabled;
  const display = hover != null ? hover : current;
  const px = SIZES[size] || SIZES.md;

  const set = (v: number) => {
    if (!interactive) return;
    if (!isControlled) setInner(v);
    if (onChange) onChange(v);
  };

  const fillFor = (i: number): "full" | "half" | "empty" => {
    const starVal = i + 1;
    if (display >= starVal) return "full";
    if (allowHalf && display >= starVal - 0.5) return "half";
    return "empty";
  };

  // value from pointer position within a star (for half support)
  const valueAt = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!allowHalf) return i + 1;
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientX - r.left < r.width / 2 ? i + 0.5 : i + 1;
  };

  return (
    <span
      className={["jl-rating", className].filter(Boolean).join(" ")}
      data-readonly={readOnly || undefined}
      data-disabled={disabled || undefined}
      data-tone={tone !== "accent" ? tone : undefined}
      role={interactive ? "slider" : "img"}
      aria-label={interactive ? ariaLabel : `${ariaLabel}: ${current} of ${max}`}
      aria-valuenow={interactive ? current : undefined}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? max : undefined}
      onMouseLeave={() => setHover(null)}
      {...rest}
    >
      <span className="jl-rating__stars">
        {Array.from({ length: max }, (_, i) => (
          <button
            key={i}
            type="button"
            className="jl-rating__btn"
            data-fill={fillFor(i)}
            tabIndex={interactive ? 0 : -1}
            aria-hidden={!interactive}
            aria-label={`${i + 1} star${i ? "s" : ""}`}
            disabled={disabled}
            onMouseMove={interactive && allowHalf ? (e) => setHover(valueAt(i, e)) : undefined}
            onMouseEnter={interactive && !allowHalf ? () => setHover(i + 1) : undefined}
            onClick={interactive ? (e) => set(valueAt(i, e)) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                      e.preventDefault();
                      set(Math.min(max, current + (allowHalf ? 0.5 : 1)));
                    }
                    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                      e.preventDefault();
                      set(Math.max(0, current - (allowHalf ? 0.5 : 1)));
                    }
                  }
                : undefined
            }
          >
            <StarGlyph px={px} />
          </button>
        ))}
      </span>
      {showValue && (
        <span className="jl-rating__value">
          {current.toFixed(allowHalf ? 1 : 0)}
          {count != null && <span className="jl-rating__count"> ({count.toLocaleString()})</span>}
        </span>
      )}
    </span>
  );
}
