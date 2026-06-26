import * as React from "react";
import "./command-palette.css";

export interface CommandItem {
  id?: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: (item: CommandItem) => void;
}

export interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  shortcut?: string[];
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  footer?: React.ReactNode | null;
  className?: string;
}

function matches(item: CommandItem, q: string) {
  if (!q) return true;
  const hay = [item.label, item.hint, item.group, ...(item.keywords || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t));
}

export function CommandPalette({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  shortcut = ["mod", "k"],
  items = [],
  placeholder = "Type a command or search…",
  emptyMessage = "No results found.",
  footer,
  className = "",
}: CommandPaletteProps) {
  const isControlled = controlledOpen != null;
  const [unc, setUnc] = React.useState(defaultOpen);
  const open = isControlled ? controlledOpen! : unc;
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setUnc(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  const groups: { name: string; items: CommandItem[] }[] = [];
  items
    .filter((it) => matches(it, query))
    .forEach((it) => {
      const name = it.group || "";
      let g = groups.find((x) => x.name === name);
      if (!g) {
        g = { name, items: [] };
        groups.push(g);
      }
      g.items.push(it);
    });
  const flat = groups.flatMap((g) => g.items);

  React.useEffect(() => {
    const wantMod = shortcut.some((k) => ["mod", "cmd", "meta", "ctrl"].includes(k));
    const key = shortcut[shortcut.length - 1];
    const onKey = (e: KeyboardEvent) => {
      if ((!wantMod || e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen, shortcut]);

  // Reset the active item whenever the query or open state changes, derived
  // during render (React docs "adjust state during render" pattern).
  const [activeResetKey, setActiveResetKey] = React.useState(`${query}|${open}`);
  if (activeResetKey !== `${query}|${open}`) {
    setActiveResetKey(`${query}|${open}`);
    setActive(0);
  }

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!el) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top - 8;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 8;
  }, [active, query]);

  const select = (item?: CommandItem) => {
    if (!item || item.disabled) return;
    setOpen(false);
    setQuery("");
    item.onSelect?.(item);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(flat[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  if (!open) return null;

  let idx = -1;
  return (
    <div
      className="jl-cmdk__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        className={["jl-cmdk", className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
      >
        <div className="jl-cmdk__search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
            <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="jl-cmdk__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search commands"
          />
        </div>

        <div className="jl-cmdk__list" ref={listRef} role="listbox">
          {flat.length === 0 && <div className="jl-cmdk__empty">{emptyMessage}</div>}
          {groups.map((g) => (
            <div key={g.name || "_"} role="group" aria-label={g.name || undefined}>
              {g.name && <div className="jl-cmdk__group-label">{g.name}</div>}
              {g.items.map((it) => {
                idx += 1;
                const i = idx;
                return (
                  <div
                    key={it.id ?? String(it.label)}
                    className="jl-cmdk__item"
                    role="option"
                    aria-selected={i === active}
                    aria-disabled={it.disabled || undefined}
                    data-active={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => select(it)}
                  >
                    {it.icon && <span className="jl-cmdk__item-icon">{it.icon}</span>}
                    <span className="jl-cmdk__item-text">
                      <span className="jl-cmdk__item-label">{it.label}</span>
                      {it.hint && <span className="jl-cmdk__item-hint">{it.hint}</span>}
                    </span>
                    {it.shortcut && <span className="jl-cmdk__item-trail">{it.shortcut}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {footer !== undefined ? (
          footer && <div className="jl-cmdk__footer">{footer}</div>
        ) : (
          <div className="jl-cmdk__footer">
            <span className="jl-cmdk__footer-hint"><kbd className="jl-cmdk__key">↑↓</kbd> navigate</span>
            <span className="jl-cmdk__footer-hint"><kbd className="jl-cmdk__key">↵</kbd> select</span>
            <span className="jl-cmdk__footer-hint"><kbd className="jl-cmdk__key">esc</kbd> close</span>
          </div>
        )}
      </div>
    </div>
  );
}
