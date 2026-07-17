import * as React from "react";
import "./chart.css";

export interface ChartPoint {
  /** X-axis label. */
  label: string;
  /** Y value. */
  value: number;
}

export interface ChartSeries {
  /** Series name (shown in legend + tooltip). */
  name: string;
  /** This series' points. */
  data: number[] | ChartPoint[];
  /** Override color; defaults to the palette slot. */
  color?: string;
}

export interface ChartReferenceLine {
  /** Y value to draw the dashed threshold at. */
  value: number;
  /** Optional right-aligned label. */
  label?: React.ReactNode;
  /** Line + label color. @default --text-tertiary */
  color?: string;
}

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Single-series data — plain numbers (auto-indexed) or `{ label, value }` points. */
  data?: number[] | ChartPoint[];
  /** Multi-series data — overrides `data` when present. */
  series?: ChartSeries[];
  /** Visual form. `sparkline` is a tiny axis-less inline trend. @default "area" */
  type?: "area" | "line" | "bar" | "sparkline";
  /** Stack multiple bar series instead of grouping them. @default false */
  stacked?: boolean;
  /** Draw a dashed horizontal threshold line. Number, or a `{ value, label, color }`. */
  referenceLine?: number | ChartReferenceLine;
  /** Show the series legend. @default true when multi-series (never for sparkline). */
  showLegend?: boolean;
  /** Plot height in px (width is always fluid). @default 200 (44 for sparkline) */
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

interface ResolvedSeries {
  name: string;
  color: string;
  values: number[];
  labels: string[];
}

const PALETTE = [
  "var(--accent)",
  "var(--info)",
  "var(--warning)",
  "var(--danger)",
  "var(--success)",
  "var(--text-brand)",
];

function normValues(data: number[] | ChartPoint[] | undefined): ChartPoint[] {
  return (data || []).map((d, i) =>
    typeof d === "number" ? { label: String(i + 1), value: d } : { label: d.label, value: d.value }
  );
}

/** Resolve either `data` (single series) or `series[]` into a uniform series list + shared labels. */
function resolveSeries(
  data: number[] | ChartPoint[] | undefined,
  series: ChartSeries[] | undefined,
  color?: string
): { list: ResolvedSeries[]; labels: string[]; multi: boolean } {
  if (Array.isArray(series) && series.length) {
    const list = series.map((s, i) => {
      const pts = normValues(s.data);
      return {
        name: s.name || `Series ${i + 1}`,
        color: s.color || PALETTE[i % PALETTE.length],
        values: pts.map((p) => p.value),
        labels: pts.map((p) => p.label),
      };
    });
    return { list, labels: list[0] ? list[0].labels : [], multi: list.length > 1 };
  }
  const pts = normValues(data);
  return {
    list: [
      {
        name: "Series 1",
        color: color || PALETTE[0],
        values: pts.map((p) => p.value),
        labels: pts.map((p) => p.label),
      },
    ],
    labels: pts.map((p) => p.label),
    multi: false,
  };
}

/**
 * Chart — a responsive SVG chart that re-measures its container.
 * Single-series via `data`, or multiple via `series`. Types: area / line / bar / sparkline.
 * Bars can be `stacked`; add a `referenceLine` threshold. Hover tooltips on pointer devices.
 */
export function Chart({
  data = [],
  series,
  type = "area",
  stacked = false,
  height,
  color,
  referenceLine,
  showGrid = true,
  showAxis = true,
  showDots = false,
  showLegend,
  valueFormat = (v) => String(v),
  className = "",
  ...rest
}: ChartProps) {
  const spark = type === "sparkline";
  const H = height != null ? height : spark ? 44 : 200;
  const gridOn = spark ? false : showGrid;
  const axisOn = spark ? false : showAxis;

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(spark ? 120 : 560);
  const [hover, setHover] = React.useState<{ i: number; x: number; y: number } | null>(null);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth || (spark ? 120 : 560));
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [spark]);

  const { list, labels, multi } = resolveSeries(data, series, color);
  const n = labels.length;
  const legendOn = showLegend != null ? showLegend : multi && !spark;

  const padL = axisOn ? 34 : spark ? 1 : 6;
  const padR = spark ? 1 : 6;
  const padT = spark ? 3 : 10;
  const padB = axisOn ? 22 : spark ? 3 : 6;
  const innerW = Math.max(10, w - padL - padR);
  const innerH = Math.max(10, H - padT - padB);

  const isBar = type === "bar";
  const stackedBar = isBar && stacked && multi;

  let maxV: number, minV: number;
  if (stackedBar) {
    const sums = labels.map((_, i) => list.reduce((a, s) => a + Math.max(0, s.values[i] || 0), 0));
    maxV = Math.max(1, ...sums);
    minV = 0;
  } else {
    const all = list.flatMap((s) => s.values);
    maxV = Math.max(1, ...all);
    minV = isBar ? 0 : Math.min(0, ...all);
  }
  const span = maxV - minV || 1;

  const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (innerW * i) / (n - 1));
  const y = (v: number) => padT + innerH - ((v - minV) / span) * innerH;

  const ticks = 3;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = minV + (span * i) / ticks;
    return { v, yy: padT + innerH - (innerH * i) / ticks };
  });

  const bodies: React.ReactNode[] = [];
  if (isBar) {
    const band = n ? innerW / n : innerW;
    if (stackedBar) {
      const bw = Math.min(46, band * 0.62);
      labels.forEach((_, i) => {
        let acc = 0;
        list.forEach((s, si) => {
          const val = Math.max(0, s.values[i] || 0);
          const y0 = y(acc);
          const y1 = y(acc + val);
          acc += val;
          const isH = hover && hover.i === i;
          bodies.push(
            <rect
              key={`${si}-${i}`}
              className="jl-chart__bar"
              x={padL + band * i + (band - bw) / 2}
              y={y1}
              width={bw}
              height={Math.max(0, y0 - y1)}
              rx="3"
              style={{ "--_c": s.color } as React.CSSProperties}
              opacity={hover && !isH ? 0.55 : 1}
            />
          );
        });
      });
    } else {
      const groupW = band * 0.62;
      const bw = groupW / list.length;
      labels.forEach((_, i) => {
        list.forEach((s, si) => {
          const val = s.values[i] || 0;
          const bx = padL + band * i + (band - groupW) / 2 + bw * si;
          const isH = hover && hover.i === i;
          bodies.push(
            <rect
              key={`${si}-${i}`}
              className="jl-chart__bar"
              x={bx}
              y={y(Math.max(0, val))}
              width={Math.max(1, bw - 1)}
              height={Math.max(1, Math.abs(y(val) - y(0)))}
              rx="3"
              style={{ "--_c": s.color } as React.CSSProperties}
              opacity={hover && !isH ? 0.55 : 1}
            />
          );
        });
      });
    }
  } else {
    list.forEach((s, si) => {
      const line = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
      const area = `${line} L${x(n - 1)},${padT + innerH} L${x(0)},${padT + innerH} Z`;
      bodies.push(
        <g key={si} style={{ "--_c": s.color } as React.CSSProperties}>
          {type === "area" && <path className="jl-chart__area" d={area} />}
          <path className="jl-chart__line" d={line} />
          {(showDots || (hover && !spark)) &&
            s.values.map(
              (v, i) =>
                (showDots || (hover && hover.i === i)) && (
                  <circle key={i} className="jl-chart__dot" cx={x(i)} cy={y(v)} r="3.5" />
                )
            )}
        </g>
      );
    });
  }

  const refLine =
    referenceLine != null
      ? typeof referenceLine === "number"
        ? { value: referenceLine }
        : referenceLine
      : null;

  const onMove = (e: React.MouseEvent) => {
    if (spark || !n || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let i = isBar
      ? Math.floor(((px - padL) / innerW) * n)
      : Math.round(((px - padL) / innerW) * (n - 1));
    i = Math.max(0, Math.min(n - 1, i));
    const cx = isBar ? padL + (innerW * (i + 0.5)) / n : x(i);
    const topV = stackedBar
      ? list.reduce((a, s) => a + Math.max(0, s.values[i] || 0), 0)
      : Math.max(...list.map((s) => s.values[i] || 0));
    setHover({ i, x: cx, y: y(topV) });
  };

  return (
    <div
      ref={wrapRef}
      className={["jl-chart", spark ? "jl-chart--spark" : "", className].filter(Boolean).join(" ")}
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
      {...rest}
    >
      <svg viewBox={`0 0 ${w} ${H}`} height={H} role="img" aria-label="Chart">
        {gridOn &&
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
        {axisOn &&
          gridLines.map((g, i) => (
            <text key={i} className="jl-chart__axis" x={padL - 8} y={g.yy + 3} textAnchor="end">
              {valueFormat(Math.round(g.v))}
            </text>
          ))}
        {axisOn &&
          labels.map(
            (lb, i) =>
              (n <= 8 || i % Math.ceil(n / 8) === 0) && (
                <text
                  key={i}
                  className="jl-chart__axis"
                  x={isBar ? padL + (innerW * (i + 0.5)) / n : x(i)}
                  y={H - 6}
                  textAnchor="middle"
                >
                  {lb}
                </text>
              )
          )}
        {refLine && (
          <g style={{ "--_rc": refLine.color || "var(--text-tertiary)" } as React.CSSProperties}>
            <line
              className="jl-chart__ref"
              x1={padL}
              y1={y(refLine.value)}
              x2={w - padR}
              y2={y(refLine.value)}
            />
            {refLine.label && (
              <text
                className="jl-chart__ref-label"
                x={w - padR}
                y={y(refLine.value) - 4}
                textAnchor="end"
              >
                {refLine.label}
              </text>
            )}
          </g>
        )}
        {hover && !spark && (
          <line
            className="jl-chart__cursor"
            x1={hover.x}
            y1={padT}
            x2={hover.x}
            y2={padT + innerH}
          />
        )}
        {bodies}
      </svg>
      {hover && n > 0 && (
        <div className="jl-chart__tip" style={{ left: hover.x, top: hover.y - 8 }}>
          <div style={{ marginBottom: multi ? 3 : 0, opacity: multi ? 0.75 : 1 }}>
            {labels[hover.i]}
          </div>
          {multi ? (
            list.map((s, si) => (
              <div key={si} className="jl-chart__tip-row">
                <span className="jl-chart__tip-dot" style={{ background: s.color }} />
                <span>{s.name}</span>{" "}
                <b style={{ marginLeft: "auto" }}>{valueFormat(s.values[hover.i])}</b>
              </div>
            ))
          ) : (
            <b>{valueFormat(list[0].values[hover.i])}</b>
          )}
        </div>
      )}
      {legendOn && (
        <div className="jl-chart__legend">
          {list.map((s, si) => (
            <span key={si} className="jl-chart__legend-item">
              <span className="jl-chart__swatch" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
