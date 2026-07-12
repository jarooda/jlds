import * as React from "react";
import "./chart.css";

export interface ChartPoint {
  /** X-axis label. */
  label: string;
  /** Y value. */
  value: number;
}

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Data — plain numbers (auto-indexed) or `{ label, value }` points. */
  data: number[] | ChartPoint[];
  /** Visual form. @default "area" */
  type?: "area" | "line" | "bar";
  /** Plot height in px (width is always fluid). @default 200 */
  height?: number;
  /** Override the series color (any CSS color). Defaults to `--accent`. */
  color?: string;
  /** Draw horizontal grid lines. @default true */
  showGrid?: boolean;
  /** Draw value + label axes. @default true */
  showAxis?: boolean;
  /** Always show point markers (line/area). @default false */
  showDots?: boolean;
  /** Format axis ticks and tooltip values. @default String */
  valueFormat?: (v: number) => string;
  className?: string;
}

function norm(data: number[] | ChartPoint[]): ChartPoint[] {
  return (data || []).map((d, i) =>
    typeof d === "number" ? { label: String(i + 1), value: d } : { label: d.label, value: d.value }
  );
}

/**
 * Chart — a responsive SVG area / line / bar chart that re-measures its container.
 * Tier-1 adapt: fluid width, optional axis/grid, hover tooltips on pointer devices.
 */
export function Chart({
  data = [],
  type = "area",
  height = 200,
  color,
  showGrid = true,
  showAxis = true,
  showDots = false,
  valueFormat = (v) => String(v),
  className = "",
  ...rest
}: ChartProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(560);
  const [hover, setHover] = React.useState<{ i: number; x: number; y: number } | null>(null);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth || 560);
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, []);

  const points = norm(data);
  const padL = showAxis ? 34 : 6;
  const padR = 6;
  const padT = 10;
  const padB = showAxis ? 22 : 6;
  const innerW = Math.max(10, w - padL - padR);
  const innerH = Math.max(10, height - padT - padB);

  const vals = points.map((p) => p.value);
  const maxV = Math.max(1, ...vals);
  const minV = Math.min(0, ...vals);
  const span = maxV - minV || 1;

  const x = (i: number) =>
    padL + (points.length <= 1 ? innerW / 2 : (innerW * i) / (points.length - 1));
  const y = (v: number) => padT + innerH - ((v - minV) / span) * innerH;

  const ticks = 3;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = minV + (span * i) / ticks;
    return { v, yy: padT + innerH - (innerH * i) / ticks };
  });

  const cVar = color ? ({ "--_c": color } as React.CSSProperties) : undefined;

  let body: React.ReactNode;
  if (type === "bar") {
    const bw = points.length ? Math.min(46, (innerW / points.length) * 0.62) : 10;
    body = points.map((p, i) => {
      const bx = padL + (innerW * (i + 0.5)) / points.length - bw / 2;
      const by = y(Math.max(0, p.value));
      const bh = Math.abs(y(p.value) - y(0));
      const isHover = hover && hover.i === i;
      return (
        <rect
          key={i}
          className="jl-chart__bar"
          x={bx}
          y={by}
          width={bw}
          height={Math.max(1, bh)}
          rx="4"
          opacity={hover && !isHover ? 0.55 : 1}
        />
      );
    });
  } else {
    const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");
    const area = `${line} L${x(points.length - 1)},${padT + innerH} L${x(0)},${padT + innerH} Z`;
    body = (
      <>
        {type === "area" && <path className="jl-chart__area" d={area} />}
        <path className="jl-chart__line" d={line} />
        {(showDots || hover) &&
          points.map(
            (p, i) =>
              (showDots || (hover && hover.i === i)) && (
                <circle key={i} className="jl-chart__dot" cx={x(i)} cy={y(p.value)} r="3.5" />
              )
          )}
      </>
    );
  }

  const onMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let i: number;
    if (type === "bar") i = Math.floor(((px - padL) / innerW) * points.length);
    else i = Math.round(((px - padL) / innerW) * (points.length - 1));
    i = Math.max(0, Math.min(points.length - 1, i));
    if (!points[i]) return;
    setHover({
      i,
      x: x(i),
      y: type === "bar" ? y(Math.max(0, points[i].value)) : y(points[i].value),
    });
  };

  return (
    <div
      ref={wrapRef}
      className={["jl-chart", className].filter(Boolean).join(" ")}
      style={cVar}
      onMouseMove={points.length ? onMove : undefined}
      onMouseLeave={() => setHover(null)}
      {...rest}
    >
      <svg viewBox={`0 0 ${w} ${height}`} height={height} role="img" aria-label="Chart">
        {showGrid &&
          gridLines.map((g, i) => (
            <line
              key={i}
              className="jl-chart__grid"
              x1={padL}
              y1={g.yy}
              x2={w - padR}
              y2={g.yy}
              opacity={i === 0 ? 1 : 0.6}
            />
          ))}
        {showAxis &&
          gridLines.map((g, i) => (
            <text key={i} className="jl-chart__axis" x={padL - 8} y={g.yy + 3} textAnchor="end">
              {valueFormat(Math.round(g.v))}
            </text>
          ))}
        {showAxis &&
          points.map(
            (p, i) =>
              (points.length <= 8 || i % Math.ceil(points.length / 8) === 0) && (
                <text
                  key={i}
                  className="jl-chart__axis"
                  x={type === "bar" ? padL + (innerW * (i + 0.5)) / points.length : x(i)}
                  y={height - 6}
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              )
          )}
        {hover && (
          <line
            className="jl-chart__cursor"
            x1={hover.x}
            y1={padT}
            x2={hover.x}
            y2={padT + innerH}
          />
        )}
        {body}
      </svg>
      {hover && points[hover.i] && (
        <div className="jl-chart__tip" style={{ left: hover.x, top: hover.y - 8 }}>
          {points[hover.i].label} · <b>{valueFormat(points[hover.i].value)}</b>
        </div>
      )}
    </div>
  );
}
