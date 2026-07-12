import * as React from "react";
import "./bottom-nav.css";

export interface BottomNavItem {
  /** Stable id, compared against `value` for the active tab. */
  id: string;
  /** Tab label (hidden when `showLabels` is false). */
  label?: string;
  /** Icon node, typically a 22–24px icon. */
  icon?: React.ReactNode;
  /** Count badge, or `true` for a bare attention dot. */
  badge?: number | string | boolean;
}

export interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Destinations, left to right (keep to 3–5). */
  items: BottomNavItem[];
  /** Id of the active tab. */
  value?: string;
  /** Fires with the tapped item's id. */
  onChange?: (id: string) => void;
  /** Show text labels under icons. @default true */
  showLabels?: boolean;
  /** Pin to the viewport bottom (position: fixed). @default true */
  fixed?: boolean;
  className?: string;
}

/**
 * BottomNav — fixed mobile tab bar (Tier 3, native-only). Safe-area aware, the phone
 * counterpart to Sidebar.
 */
export function BottomNav({
  items = [],
  value,
  onChange,
  showLabels = true,
  fixed = true,
  className = "",
  ...rest
}: BottomNavProps) {
  return (
    <nav
      className={["jl-bottomnav", fixed ? "jl-bottomnav--fixed" : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-label="Primary"
      {...rest}
    >
      {items.map((it) => {
        const active = it.id === value;
        const badge = it.badge;
        return (
          <button
            key={it.id}
            type="button"
            className="jl-bottomnav__item"
            aria-current={active ? "page" : undefined}
            onClick={() => onChange?.(it.id)}
          >
            <span className="jl-bottomnav__icon">
              {it.icon}
              {badge != null &&
                badge !== false &&
                (badge === true ? (
                  <span className="jl-bottomnav__dot" aria-hidden="true" />
                ) : (
                  <span className="jl-bottomnav__badge">{badge}</span>
                ))}
            </span>
            {showLabels && it.label && <span className="jl-bottomnav__label">{it.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
