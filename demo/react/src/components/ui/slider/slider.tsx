import * as React from "react";
import "./slider.css";

export type SliderMark = number | { value: number; label: React.ReactNode };
export type SliderSize = "sm" | "md" | "lg";
export type SliderValue = number | [number, number];

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: SliderValue;
  defaultValue?: SliderValue;
  range?: boolean;
  onChange?: (value: SliderValue) => void;
  onChangeEnd?: (value: SliderValue) => void;
  disabled?: boolean;
  size?: SliderSize;
  marks?: SliderMark[];
  showValue?: boolean;
  formatValue?: (v: number) => React.ReactNode;
  label?: React.ReactNode;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  range = false,
  onChange,
  onChangeEnd,
  disabled = false,
  size = "md",
  marks,
  showValue = false,
  formatValue = (v) => v,
  label,
  className = "",
}: SliderProps) {
  const isControlled = value != null;
  const initial: SliderValue =
    defaultValue != null ? defaultValue : range ? [min, max] : min;
  const [internal, setInternal] = React.useState<SliderValue>(initial);
  const current = isControlled ? (value as SliderValue) : internal;
  const vals = (range ? (current as [number, number]) : [current as number]) as number[];

  const trackRef = React.useRef<HTMLDivElement>(null);
  const valsRef = React.useRef<number[]>(vals);
  React.useEffect(() => {
    valsRef.current = vals;
  });
  const dragRef = React.useRef<number | null>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const roundStep = (v: number) =>
    clamp(Number((Math.round((v - min) / step) * step + min).toFixed(10)));
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const commit = (next: SliderValue, end: boolean) => {
    if (!isControlled) setInternal(next);
    if (onChange) onChange(next);
    if (end && onChangeEnd) onChangeEnd(next);
  };

  const applyThumb = (i: number, v: number, end: boolean) => {
    const cur = valsRef.current;
    let next: SliderValue;
    if (range) {
      const arr = [...cur];
      if (i === 0) arr[0] = Math.min(v, cur[1]);
      else arr[1] = Math.max(v, cur[0]);
      next = [arr[0], arr[1]];
    } else {
      next = v;
    }
    valsRef.current = range ? (next as [number, number]) : [next as number];
    commit(next, end);
  };

  const valueFromClient = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return roundStep(min + ratio * (max - min));
  };

  const onTrackPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const v = valueFromClient(e.clientX);
    const cur = valsRef.current;
    const i = range ? (Math.abs(cur[0] - v) <= Math.abs(cur[1] - v) ? 0 : 1) : 0;
    dragRef.current = i;
    applyThumb(i, v, false);
    const move = (ev: PointerEvent) =>
      applyThumb(dragRef.current!, valueFromClient(ev.clientX), false);
    const up = (ev: PointerEvent) => {
      applyThumb(dragRef.current!, valueFromClient(ev.clientX), true);
      dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onThumbKeyDown = (i: number) => (e: React.KeyboardEvent) => {
    if (disabled) return;
    const cur = valsRef.current[i];
    const big = step * 10;
    let v: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        v = cur + step;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        v = cur - step;
        break;
      case "PageUp":
        v = cur + big;
        break;
      case "PageDown":
        v = cur - big;
        break;
      case "Home":
        v = min;
        break;
      case "End":
        v = max;
        break;
      default:
        return;
    }
    e.preventDefault();
    applyThumb(i, roundStep(v), true);
  };

  const fillStyle: React.CSSProperties = range
    ? { left: `${pct(vals[0])}%`, right: `${100 - pct(vals[1])}%` }
    : { left: 0, width: `${pct(vals[0])}%` };

  const cls = [
    "jl-slider",
    `jl-slider--${size}`,
    disabled ? "jl-slider--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const valueText = range
    ? `${formatValue(vals[0])} – ${formatValue(vals[1])}`
    : `${formatValue(vals[0])}`;

  return (
    <div className={cls}>
      {(label || showValue) && (
        <div className="jl-slider__head">
          {label && <span className="jl-slider__label">{label}</span>}
          {showValue && <span className="jl-slider__value">{valueText}</span>}
        </div>
      )}
      <div className="jl-slider__track" ref={trackRef} onPointerDown={onTrackPointerDown}>
        <span className="jl-slider__fill" style={fillStyle} />
        {vals.map((v, i) => (
          <button
            key={i}
            type="button"
            className="jl-slider__thumb"
            style={{ left: `${pct(v)}%` }}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={v}
            aria-label={
              label ? `${label}${range ? ` ${i === 0 ? "minimum" : "maximum"}` : ""}` : undefined
            }
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={onThumbKeyDown(i)}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.preventDefault()}
          />
        ))}
      </div>
      {marks && marks.length > 0 && (
        <div className="jl-slider__marks">
          {marks.map((m, i) => {
            const mv = typeof m === "object" ? m.value : m;
            const ml = typeof m === "object" ? m.label : m;
            return (
              <span key={i} className="jl-slider__mark" style={{ left: `${pct(mv)}%` }}>
                {ml}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
