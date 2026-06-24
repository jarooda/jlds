import * as React from "react";
import "./combobox.css";

export type ComboboxOption =
  | string
  | {
      value: string;
      label: React.ReactNode;
      icon?: React.ReactNode;
      group?: string;
      disabled?: boolean;
    };

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  multiple?: boolean;
  creatable?: boolean;
  loading?: boolean;
  onInputChange?: (query: string) => void;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  loadingMessage?: React.ReactNode;
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

type Opt = { value: string; label: React.ReactNode; icon?: React.ReactNode; group?: string; disabled?: boolean };
const norm = (o: ComboboxOption): Opt => (typeof o === "string" ? { value: o, label: o } : o);

const Xicon = <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
const Checkicon = <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Chevicon = <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function Combobox({
  options = [],
  value,
  defaultValue,
  onChange,
  multiple = false,
  creatable = false,
  loading = false,
  onInputChange,
  placeholder = "Select…",
  emptyMessage = "No results.",
  loadingMessage = "Loading…",
  clearable = false,
  disabled = false,
  invalid = false,
  size = "md",
  className = "",
}: ComboboxProps) {
  const opts = options.map(norm);
  const isControlled = value !== undefined;
  const [unc, setUnc] = React.useState<string | string[] | null>(
    defaultValue !== undefined ? defaultValue : multiple ? [] : null
  );
  const current = isControlled ? value! : unc;
  const selected = multiple ? ((current as string[]) || []) : current;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setValue = (v: string | string[] | null) => {
    if (!isControlled) setUnc(v);
    onChange?.(v);
  };

  const labelFor = (val: string) => {
    const o = opts.find((x) => x.value === val);
    return o ? o.label : val;
  };
  const isSel = (val: string) =>
    multiple ? ((selected as string[]) || []).includes(val) : selected === val;

  const filtered = onInputChange
    ? opts
    : opts.filter((o) => String(o.label).toLowerCase().includes(query.toLowerCase()));

  const showCreate =
    creatable &&
    !!query.trim() &&
    !opts.some((o) => String(o.label).toLowerCase() === query.trim().toLowerCase());

  const groups: { name: string; items: Opt[] }[] = [];
  filtered.forEach((o) => {
    const g = o.group || "";
    let entry = groups.find((x) => x.name === g);
    if (!entry) {
      entry = { name: g, items: [] };
      groups.push(entry);
    }
    entry.items.push(o);
  });
  const flat = [
    ...filtered.map((o) => ({ type: "opt" as const, o })),
    ...(showCreate ? [{ type: "create" as const }] : []),
  ];

  React.useEffect(() => setActive(0), [query, open]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  React.useEffect(() => {
    if (!open || !rootRef.current) return;
    const el = rootRef.current.querySelector<HTMLElement>('.jl-combobox__opt[data-active="true"]');
    const pop = rootRef.current.querySelector<HTMLElement>(".jl-combobox__pop");
    if (!el || !pop) return;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < pop.scrollTop) pop.scrollTop = top - 6;
    else if (bottom > pop.scrollTop + pop.clientHeight) pop.scrollTop = bottom - pop.clientHeight + 6;
  }, [active, open]);

  const openPop = () => {
    if (!disabled) setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setQuery("");
    onInputChange?.("");
  };

  const choose = (o: Opt) => {
    if (!o || o.disabled) return;
    if (multiple) {
      const arr = (selected as string[]) || [];
      const next = arr.includes(o.value) ? arr.filter((v) => v !== o.value) : [...arr, o.value];
      setValue(next);
      setQuery("");
      onInputChange?.("");
      inputRef.current?.focus();
    } else {
      setValue(o.value);
      close();
    }
  };

  const create = () => {
    const label = query.trim();
    if (!label) return;
    if (multiple) {
      const arr = (selected as string[]) || [];
      if (!arr.includes(label)) setValue([...arr, label]);
      setQuery("");
      onInputChange?.("");
    } else {
      setValue(label);
      close();
    }
  };

  const removeChip = (val: string) =>
    setValue(((selected as string[]) || []).filter((v) => v !== val));

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!open) setOpen(true);
    onInputChange?.(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        openPop();
        return;
      }
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (!item) return;
      if (item.type === "create") create();
      else choose(item.o);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
    } else if (e.key === "Backspace" && multiple && !query && ((selected as string[]) || []).length) {
      setValue(((selected as string[]) || []).slice(0, -1));
    }
  };

  const hasValue = multiple
    ? ((selected as string[]) || []).length > 0
    : selected != null && selected !== "";
  const cls = [
    "jl-combobox",
    `jl-combobox--${size}`,
    open ? "jl-combobox--open" : "",
    disabled ? "jl-combobox--disabled" : "",
    invalid ? "jl-combobox--invalid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  let idx = -1;
  return (
    <div className={cls} ref={rootRef}>
      <div
        className="jl-combobox__control"
        onClick={() => {
          openPop();
          inputRef.current?.focus();
        }}
      >
        {multiple &&
          ((selected as string[]) || []).map((val) => (
            <span className="jl-combobox__chip" key={val}>
              {labelFor(val)}
              <button
                type="button"
                className="jl-combobox__chip-x"
                aria-label={`Remove ${val}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(val);
                }}
              >
                {Xicon}
              </button>
            </span>
          ))}
        <span className="jl-combobox__field">
          {!multiple && !query && (
            <span
              className={`jl-combobox__single ${hasValue ? "" : "jl-combobox__single--placeholder"}`}
              style={{ position: "absolute", pointerEvents: "none", left: 0, right: 0 }}
            >
              {hasValue ? labelFor(selected as string) : placeholder}
            </span>
          )}
          <input
            ref={inputRef}
            className="jl-combobox__input"
            value={query}
            placeholder={multiple && !((selected as string[]) || []).length ? placeholder : ""}
            disabled={disabled}
            onChange={onInput}
            onFocus={openPop}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
        </span>
        <span className="jl-combobox__adorn">
          {loading && <span className="jl-combobox__spinner" aria-hidden="true" />}
          {clearable && hasValue && !loading && (
            <button
              type="button"
              className="jl-combobox__btn"
              aria-label="Clear"
              onClick={(e) => {
                e.stopPropagation();
                setValue(multiple ? [] : null);
              }}
            >
              {Xicon}
            </button>
          )}
          <span className="jl-combobox__btn jl-combobox__chevron" aria-hidden="true">
            {Chevicon}
          </span>
        </span>
      </div>

      {open && (
        <div className="jl-combobox__pop" role="listbox">
          {loading ? (
            <div className="jl-combobox__loading">
              <span className="jl-combobox__spinner" />
              {loadingMessage}
            </div>
          ) : flat.length === 0 ? (
            <div className="jl-combobox__empty">{emptyMessage}</div>
          ) : (
            <>
              {groups.map((g) => (
                <div key={g.name || "_"} role="group">
                  {g.name && <div className="jl-combobox__group-label">{g.name}</div>}
                  {g.items.map((o) => {
                    idx += 1;
                    const i = idx;
                    return (
                      <div
                        key={o.value}
                        className="jl-combobox__opt"
                        role="option"
                        aria-selected={isSel(o.value)}
                        aria-disabled={o.disabled || undefined}
                        data-active={i === active}
                        onMouseMove={() => setActive(i)}
                        onClick={() => choose(o)}
                      >
                        {o.icon && <span className="jl-combobox__opt-icon">{o.icon}</span>}
                        <span className="jl-combobox__opt-label">{o.label}</span>
                        {isSel(o.value) && <span className="jl-combobox__opt-check">{Checkicon}</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
              {showCreate &&
                (() => {
                  idx += 1;
                  const i = idx;
                  return (
                    <div
                      className="jl-combobox__opt"
                      role="option"
                      data-active={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={create}
                    >
                      <span className="jl-combobox__create-mark">
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
                          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="jl-combobox__opt-label">Create “{query.trim()}”</span>
                    </div>
                  );
                })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
