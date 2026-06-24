import * as React from "react";
import "./accordion.css";

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  variant?: "bordered" | "separated";
  defaultValue?: string | string[];
}

export interface AccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  value?: string;
  title: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface Ctx {
  open: string[];
  toggle: (value: string) => void;
}
const AccCtx = React.createContext<Ctx | null>(null);
let _uid = 0;

function AccordionRoot({
  type = "single",
  variant = "bordered",
  defaultValue,
  className = "",
  children,
  ...rest
}: AccordionProps) {
  const initial =
    defaultValue != null ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [];
  const [open, setOpen] = React.useState<string[]>(initial);

  const toggle = React.useCallback(
    (value: string) => {
      setOpen((cur) => {
        const has = cur.includes(value);
        if (type === "multiple") return has ? cur.filter((v) => v !== value) : [...cur, value];
        return has ? [] : [value];
      });
    },
    [type]
  );

  const cls = [
    "jl-accordion",
    variant === "separated" ? "jl-accordion--separated" : "jl-accordion--bordered",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AccCtx.Provider value={{ open, toggle }}>
      <div className={cls} {...rest}>
        {children}
      </div>
    </AccCtx.Provider>
  );
}

function AccordionItem({
  value,
  title,
  icon = null,
  disabled = false,
  className = "",
  children,
  ...rest
}: AccordionItemProps) {
  const ctx = React.useContext(AccCtx)!;
  const fallback = React.useRef(value ?? `acc-${++_uid}`);
  const v = value ?? fallback.current;
  const isOpen = ctx.open.includes(v);
  const id = React.useMemo(() => `jlacc-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <div
      className={["jl-acc-item", className].filter(Boolean).join(" ")}
      data-open={isOpen || undefined}
      {...rest}
    >
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          className="jl-acc-trigger"
          aria-expanded={isOpen}
          aria-controls={id}
          disabled={disabled}
          onClick={() => ctx.toggle(v)}
        >
          {icon && <span className="jl-acc-trigger__icon">{icon}</span>}
          <span className="jl-acc-trigger__label">{title}</span>
          <span className="jl-acc-trigger__chevron">
            <Chevron />
          </span>
        </button>
      </h3>
      <div className="jl-acc-region" id={id} role="region">
        <div className="jl-acc-content">
          <div className="jl-acc-content__inner">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });
