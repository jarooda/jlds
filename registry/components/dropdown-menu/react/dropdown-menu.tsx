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

export interface DropdownMenuCheckboxItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean, e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  /** Close the menu after toggling. @default false — checkable items keep the menu open. */
  closeOnSelect?: boolean;
}

export interface DropdownMenuRadioGroupProps {
  value?: string;
  onChange?: (value: string, e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export interface DropdownMenuRadioItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  /** Close the menu after selecting. @default false */
  closeOnSelect?: boolean;
}

interface TriggerProps {
  onClick?: (e: React.MouseEvent) => void;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-expanded"?: boolean;
}

const MenuCtx = React.createContext<{ close: () => void }>({ close: () => {} });
const RadioCtx = React.createContext<{
  value?: string;
  onChange?: (value: string, e: React.MouseEvent) => void;
} | null>(null);

const CheckMark = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.5 8.5l3 3 6-7"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const RadioDot = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="3.5" fill="currentColor" />
  </svg>
);

/** Roving arrow-key navigation across a menu panel's items. */
function useMenuKeys(ref: React.RefObject<HTMLElement | null>) {
  return React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!ref.current) return;
      const items = Array.from(
        ref.current.querySelectorAll<HTMLElement>('[role^="menuitem"]')
      ).filter((el) => el.getAttribute("aria-disabled") !== "true");
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        items[(i + 1) % items.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[(i - 1 + items.length) % items.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1].focus();
      }
    },
    [ref]
  );
}

function DropdownMenuRoot({
  trigger,
  align = "start",
  side = "bottom",
  className = "",
  children,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const onMenuKey = useMenuKeys(panelRef);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLElement>(
      '[role^="menuitem"]:not([aria-disabled="true"])'
    );
    if (first) first.focus();
  }, [open]);

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
            ref={panelRef}
            onKeyDown={onMenuKey}
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

function MenuCheckboxItem({
  checked = false,
  onCheckedChange,
  icon = null,
  shortcut = null,
  disabled = false,
  closeOnSelect = false,
  className = "",
  children,
  ...rest
}: DropdownMenuCheckboxItemProps) {
  const { close } = React.useContext(MenuCtx);
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      className={["jl-menu__item", className].filter(Boolean).join(" ")}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        onCheckedChange?.(!checked, e);
        if (closeOnSelect) close();
      }}
      {...rest}
    >
      <span className="jl-menu__item-check">
        <CheckMark />
      </span>
      {icon && <span className="jl-menu__item-icon">{icon}</span>}
      <span className="jl-menu__item-label">{children}</span>
      {shortcut && <span className="jl-menu__item-shortcut">{shortcut}</span>}
    </button>
  );
}

function MenuRadioGroup({ value, onChange, children }: DropdownMenuRadioGroupProps) {
  const ctx = React.useMemo(() => ({ value, onChange }), [value, onChange]);
  return <RadioCtx.Provider value={ctx}>{children}</RadioCtx.Provider>;
}

function MenuRadioItem({
  value,
  icon = null,
  shortcut = null,
  disabled = false,
  closeOnSelect = false,
  className = "",
  children,
  ...rest
}: DropdownMenuRadioItemProps) {
  const grp = React.useContext(RadioCtx);
  const { close } = React.useContext(MenuCtx);
  const checked = grp?.value === value;
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      className={["jl-menu__item", className].filter(Boolean).join(" ")}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        grp?.onChange?.(value, e);
        if (closeOnSelect) close();
      }}
      {...rest}
    >
      <span className="jl-menu__item-check jl-menu__item-check--radio">
        <RadioDot />
      </span>
      {icon && <span className="jl-menu__item-icon">{icon}</span>}
      <span className="jl-menu__item-label">{children}</span>
      {shortcut && <span className="jl-menu__item-shortcut">{shortcut}</span>}
    </button>
  );
}

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Item: MenuItem,
  Label: MenuLabel,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
});
