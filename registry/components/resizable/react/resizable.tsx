/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import "./resizable.css";

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
}

export interface ResizableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onResize"> {
  direction?: "horizontal" | "vertical";
  onResize?: (sizes: number[]) => void;
}

interface ResizableComposition {
  (props: ResizableProps): React.JSX.Element;
  Panel: (props: ResizablePanelProps) => null;
}

// marker component; the actual panel + handle are rendered by Resizable
function ResizablePanel(): null {
  return null;
}

interface DragState {
  i: number;
  start: number;
  total: number;
  sizes: number[];
}

function ResizableRoot({
  direction = "horizontal",
  className = "",
  onResize,
  children,
  ...rest
}: ResizableProps) {
  const horizontal = direction === "horizontal";
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<DragState | null>(null);

  const panels = React.Children.toArray(children).filter((c) =>
    React.isValidElement(c)
  ) as React.ReactElement<ResizablePanelProps>[];
  const mins = panels.map((p) => (p.props.minSize != null ? p.props.minSize : 8));

  const [sizes, setSizes] = React.useState<number[]>(() => {
    const explicit = panels.map((p) => (p.props.defaultSize != null ? p.props.defaultSize : null));
    const given = explicit.filter((v): v is number => v != null).reduce((a, b) => a + b, 0);
    const missing = explicit.filter((v) => v == null).length;
    const fill = missing > 0 ? (100 - given) / missing : 0;
    return explicit.map((v) => (v != null ? v : fill));
  });

  const startDrag = (e: React.PointerEvent, i: number) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const total = horizontal ? rect.width : rect.height;
    dragRef.current = {
      i,
      start: horizontal ? e.clientX : e.clientY,
      total,
      sizes: [...sizes],
    };
    document.body.setAttribute("data-jl-resizing", horizontal ? "x" : "y");
    e.currentTarget.setAttribute("data-dragging", "true");
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const pos = horizontal ? e.clientX : e.clientY;
    let deltaPct = ((pos - d.start) / d.total) * 100;
    const a = d.sizes[d.i];
    const b = d.sizes[d.i + 1];
    deltaPct = Math.max(deltaPct, -(a - mins[d.i]));
    deltaPct = Math.min(deltaPct, b - mins[d.i + 1]);
    const next = [...d.sizes];
    next[d.i] = a + deltaPct;
    next[d.i + 1] = b - deltaPct;
    setSizes(next);
    onResize?.(next);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    document.body.removeAttribute("data-jl-resizing");
    e.currentTarget.removeAttribute("data-dragging");
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = 2;
    let dir = 0;
    if (e.key === (horizontal ? "ArrowRight" : "ArrowDown")) dir = 1;
    else if (e.key === (horizontal ? "ArrowLeft" : "ArrowUp")) dir = -1;
    if (!dir) return;
    e.preventDefault();
    const a = sizes[i],
      b = sizes[i + 1];
    let delta = dir * step;
    delta = Math.max(delta, -(a - mins[i]));
    delta = Math.min(delta, b - mins[i + 1]);
    const next = [...sizes];
    next[i] = a + delta;
    next[i + 1] = b - delta;
    setSizes(next);
    onResize?.(next);
  };

  return (
    <div
      ref={containerRef}
      className={["jl-resizable", `jl-resizable--${direction}`, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {panels.map((panel, i) => {
        const { className: pcls = "", style: pstyle, children: pchildren } = panel.props;
        const out: React.ReactNode[] = [
          <div
            key={`p-${i}`}
            className={["jl-resizable__panel", pcls].filter(Boolean).join(" ")}
            style={{ flexBasis: `${sizes[i]}%`, flexGrow: 0, flexShrink: 0, ...pstyle }}
          >
            {pchildren}
          </div>,
        ];
        if (i < panels.length - 1) {
          out.push(
            <div
              key={`h-${i}`}
              className="jl-resizable__handle"
              role="separator"
              tabIndex={0}
              aria-orientation={horizontal ? "vertical" : "horizontal"}
              aria-valuenow={Math.round(sizes[i])}
              onPointerDown={(e) => startDrag(e, i)}
              onPointerMove={onMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={(e) => onKey(e, i)}
            >
              <span className="jl-resizable__grip">
                <span />
                <span />
                <span />
              </span>
            </div>
          );
        }
        return out;
      })}
    </div>
  );
}

export const Resizable = Object.assign(ResizableRoot, {
  Panel: ResizablePanel,
}) as ResizableComposition;
