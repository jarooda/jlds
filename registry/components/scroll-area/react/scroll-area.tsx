import * as React from "react";
import "./scroll-area.css";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  axis?: "x" | "y" | "both";
  maxHeight?: number | string;
  fade?: boolean;
  fadeColor?: string;
  viewportRef?:
    | React.Ref<HTMLDivElement>
    | ((node: HTMLDivElement | null) => void);
}

function assignRef(
  ref: ScrollAreaProps["viewportRef"],
  node: HTMLDivElement | null
) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
}

export function ScrollArea({
  axis = "y",
  maxHeight,
  fade = false,
  fadeColor,
  className = "",
  style,
  viewportRef,
  onScroll,
  children,
  ...rest
}: ScrollAreaProps) {
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = React.useState({ top: false, bottom: false });

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      assignRef(viewportRef, node);
    },
    [viewportRef]
  );

  const update = React.useCallback(() => {
    const el = innerRef.current;
    if (!el || !fade) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setEdges({
      top: scrollTop > 1,
      bottom: scrollTop + clientHeight < scrollHeight - 1,
    });
  }, [fade]);

  React.useEffect(() => {
    if (!fade) return;
    update();
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [fade, update]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (fade) update();
    onScroll?.(e);
  };

  const cls = ["jl-scrollarea", `jl-scrollarea--${axis}`, className].filter(Boolean).join(" ");
  const rootStyle: React.CSSProperties = { ...style };
  if (fadeColor) (rootStyle as Record<string, string>)["--_fade-bg"] = fadeColor;

  return (
    <div
      className={cls}
      style={rootStyle}
      data-fade-top={fade && edges.top ? "true" : undefined}
      data-fade-bottom={fade && edges.bottom ? "true" : undefined}
      {...rest}
    >
      {fade && <div className="jl-scrollarea__fade jl-scrollarea__fade--top" />}
      <div
        ref={setRef}
        className="jl-scrollarea__viewport"
        style={maxHeight != null ? { maxHeight } : undefined}
        onScroll={handleScroll}
      >
        {children}
      </div>
      {fade && <div className="jl-scrollarea__fade jl-scrollarea__fade--bottom" />}
    </div>
  );
}
