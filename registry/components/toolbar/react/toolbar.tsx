import * as React from "react";
import "./toolbar.css";

export interface ToolbarItem {
  /** Stable id (also used as the icon-only aria-label fallback). */
  id?: string;
  /** Render a vertical rule instead of a button. */
  type?: "button" | "separator";
  /** Button text. Omit for an icon-only button. */
  label?: string;
  /** Icon node. */
  icon?: React.ReactNode;
  /** Tooltip / accessible name — used for icon-only buttons and overflow labels. */
  tooltip?: string;
  /** Toggle state — renders a pressed (accent) style. */
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Actions, in priority order — the first items survive longest as width shrinks. */
  items: ToolbarItem[];
  /** Stretch to fill the parent width. @default false */
  block?: boolean;
  /** Accessible label for the overflow button. @default "More" */
  moreLabel?: string;
  className?: string;
}

function Btn({ item }: { item: ToolbarItem }) {
  if (item.type === "separator") return <span className="jl-toolbar__sep" aria-hidden="true" />;
  const iconOnly = item.icon && !item.label;
  return (
    <button
      type="button"
      className={["jl-toolbar__btn", iconOnly ? "jl-toolbar__btn--icon" : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={item.onClick}
      disabled={item.disabled}
      aria-pressed={item.active != null ? !!item.active : undefined}
      aria-label={iconOnly ? item.tooltip || item.id : undefined}
      title={item.tooltip}
    >
      {item.icon}
      {item.label && <span>{item.label}</span>}
    </button>
  );
}

/**
 * Toolbar — a horizontal action bar that collapses overflowing items into a "More" menu
 * when space runs out (Tier 2, container-measured). Pure responsive behavior, no API change.
 */
export function Toolbar({
  items = [],
  block = false,
  moreLabel = "More",
  className = "",
  ...rest
}: ToolbarProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(items.length);
  const [open, setOpen] = React.useState(false);

  const measure = React.useCallback(() => {
    const wrap = wrapRef.current;
    const ghost = ghostRef.current;
    if (!wrap || !ghost) return;
    const avail = wrap.clientWidth - 8; // padding
    const kids = Array.from(ghost.children);
    const widths = kids.map((k) => k.getBoundingClientRect().width + 4);
    const total = widths.reduce((a, b) => a + b, 0);
    if (total <= avail) {
      setVisibleCount(items.length);
      return;
    }
    const moreW = 44;
    let used = moreW;
    let n = 0;
    for (let i = 0; i < widths.length; i++) {
      used += widths[i];
      if (used > avail) break;
      n++;
    }
    // don't leave a trailing separator visible
    while (n > 0 && items[n - 1] && items[n - 1].type === "separator") n--;
    setVisibleCount(n);
  }, [items]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, items]);
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shown = items.slice(0, visibleCount);
  const overflow = items.slice(visibleCount).filter((it) => it.type !== "separator");

  return (
    <div
      ref={wrapRef}
      className={["jl-toolbar", block ? "jl-toolbar--block" : "", className]
        .filter(Boolean)
        .join(" ")}
      role="toolbar"
      {...rest}
    >
      {shown.map((it, i) => (
        <Btn key={it.id || `sep${i}`} item={it} />
      ))}

      {overflow.length > 0 && (
        <div className="jl-toolbar__more" style={{ marginLeft: "auto" }}>
          <button
            type="button"
            className="jl-toolbar__btn jl-toolbar__btn--icon"
            aria-label={moreLabel}
            aria-haspopup="menu"
            aria-expanded={open}
            title={moreLabel}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="12" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="19" cy="12" r="1.7" />
            </svg>
          </button>
          {open && (
            <div className="jl-toolbar__menu" role="menu">
              {overflow.map((it, i) => (
                <button
                  key={it.id || i}
                  type="button"
                  role="menuitem"
                  className="jl-toolbar__mitem"
                  disabled={it.disabled}
                  aria-pressed={it.active != null ? !!it.active : undefined}
                  onClick={() => {
                    it.onClick?.();
                    setOpen(false);
                  }}
                >
                  {it.icon}
                  <span>{it.label || it.tooltip || it.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* hidden measuring clone: always all items at natural width */}
      <div className="jl-toolbar__ghost" ref={ghostRef} aria-hidden="true">
        {items.map((it, i) => (
          <Btn key={`g${it.id || i}`} item={it} />
        ))}
      </div>
    </div>
  );
}
