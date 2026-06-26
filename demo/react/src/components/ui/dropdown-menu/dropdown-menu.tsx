/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import "./dropdown-menu.css";

export interface DropdownMenuProps {
  trigger: React.ReactElement;
  align?: "start" | "end";
  side?: "bottom" | "top";
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  tone?: "default" | "danger";
  disabled?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

interface TriggerProps {
  onClick?: (e: React.MouseEvent) => void;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-expanded"?: boolean;
}

const MenuCtx = React.createContext<{ close: () => void }>({ close: () => {} });

function DropdownMenuRoot({
  trigger,
  align = "start",
  side = "bottom",
  className = "",
  children,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerEl = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<TriggerProps>, {
        onClick: (e: React.MouseEvent) => {
          (trigger.props as TriggerProps).onClick?.(e);
          setOpen((v) => !v);
        },
        "aria-haspopup": "menu",
        "aria-expanded": open,
      })
    : trigger;

  const origin = `${side === "top" ? "bottom" : "top"} ${align === "end" ? "right" : "left"}`;

  return (
    <span className={["jl-menu", className].filter(Boolean).join(" ")} ref={ref}>
      {triggerEl}
      {open && (
        <MenuCtx.Provider value={{ close }}>
          <div
            className="jl-menu__pop"
            role="menu"
            data-side={side}
            data-align={align}
            style={{ "--_origin": origin } as React.CSSProperties}
          >
            {children}
          </div>
        </MenuCtx.Provider>
      )}
    </span>
  );
}

function MenuItem({
  icon = null,
  shortcut = null,
  tone = "default",
  disabled = false,
  onSelect,
  className = "",
  children,
  ...rest
}: DropdownMenuItemProps) {
  const { close } = React.useContext(MenuCtx);
  const cls = [
    "jl-menu__item",
    tone === "danger" ? "jl-menu__item--danger" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      role="menuitem"
      className={cls}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        onSelect?.(e);
        close();
      }}
      {...rest}
    >
      {icon && <span className="jl-menu__item-icon">{icon}</span>}
      <span className="jl-menu__item-label">{children}</span>
      {shortcut && <span className="jl-menu__item-shortcut">{shortcut}</span>}
    </button>
  );
}

function MenuLabel({ className = "", children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["jl-menu__label", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

function MenuSeparator({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["jl-menu__sep", className].filter(Boolean).join(" ")} role="separator" {...rest} />
  );
}

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Item: MenuItem,
  Label: MenuLabel,
  Separator: MenuSeparator,
});
