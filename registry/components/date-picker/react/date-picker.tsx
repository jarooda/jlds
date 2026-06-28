import * as React from "react";
import "./date-picker.css";

export type DatePickerSize = "sm" | "md";

type DateInput = Date | string | number | null | undefined;

const ChevL = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ChevR = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const CalIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2.2" stroke="currentColor" strokeWidth="1.75" /><path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
);

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const toDate = (v: DateInput): Date | null => (v == null ? null : v instanceof Date ? v : new Date(v));

function defaultFormat(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function buildWeeks(viewMonth: Date, weekStartsOn: number) {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(first);
  start.setDate(1 - lead);
  const weeks: Date[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: DateInput;
  defaultValue?: DateInput;
  onChange?: (date: Date) => void;
  month?: DateInput;
  defaultMonth?: DateInput;
  onMonthChange?: (month: Date) => void;
  min?: DateInput;
  max?: DateInput;
  disabledDate?: (date: Date) => boolean;
  weekStartsOn?: number;
  size?: DatePickerSize;
}

/**
 * Calendar — a static month grid for picking a single date. The visual core of DatePicker,
 * usable standalone for inline date selection.
 */
export function Calendar({
  value,
  defaultValue = null,
  onChange,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  min,
  max,
  disabledDate,
  weekStartsOn = 0,
  size = "md",
  className = "",
  ...rest
}: CalendarProps) {
  const [innerSel, setInnerSel] = React.useState<Date | null>(toDate(defaultValue));
  const sel = value !== undefined ? toDate(value) : innerSel;

  const initialView = toDate(monthProp) || toDate(defaultMonth) || sel || new Date();
  const [innerView, setInnerView] = React.useState(new Date(initialView.getFullYear(), initialView.getMonth(), 1));
  const view =
    monthProp !== undefined
      ? new Date(toDate(monthProp)!.getFullYear(), toDate(monthProp)!.getMonth(), 1)
      : innerView;

  const setView = (next: Date) => {
    if (monthProp === undefined) setInnerView(next);
    if (onMonthChange) onMonthChange(next);
  };

  const minD = min ? startOfDay(toDate(min)!) : null;
  const maxD = max ? startOfDay(toDate(max)!) : null;
  const today = startOfDay(new Date());

  const isDisabled = (d: Date) => {
    const day = startOfDay(d);
    if (minD && day < minD) return true;
    if (maxD && day > maxD) return true;
    if (disabledDate && disabledDate(day)) return true;
    return false;
  };

  const pick = (d: Date) => {
    if (isDisabled(d)) return;
    if (value === undefined) setInnerSel(d);
    if (onChange) onChange(d);
  };

  const weeks = buildWeeks(view, weekStartsOn);
  const orderedDays = WEEKDAYS.slice(weekStartsOn).concat(WEEKDAYS.slice(0, weekStartsOn));

  return (
    <div className={["jl-cal", size === "sm" ? "jl-cal--sm" : "", className].filter(Boolean).join(" ")} {...rest}>
      <div className="jl-cal__header">
        <button type="button" className="jl-cal__nav" onClick={() => setView(addMonths(view, -1))} aria-label="Previous month">{ChevL}</button>
        <div className="jl-cal__title" aria-live="polite">{MONTHS[view.getMonth()]} {view.getFullYear()}</div>
        <button type="button" className="jl-cal__nav" onClick={() => setView(addMonths(view, 1))} aria-label="Next month">{ChevR}</button>
      </div>
      <div className="jl-cal__grid" role="grid">
        {orderedDays.map((w) => <div className="jl-cal__weekday" key={w} role="columnheader">{w}</div>)}
        {weeks.flat().map((d, i) => {
          const outside = d.getMonth() !== view.getMonth();
          const isSel = sameDay(d, sel);
          const isToday = sameDay(d, today);
          const disabled = isDisabled(d);
          return (
            <button
              type="button"
              key={i}
              className="jl-cal__day"
              role="gridcell"
              disabled={disabled}
              data-outside={outside || undefined}
              data-today={isToday || undefined}
              data-selected={isSel || undefined}
              aria-selected={isSel || undefined}
              aria-label={d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              onClick={() => pick(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onChange" | "defaultValue"> {
  value?: DateInput;
  defaultValue?: DateInput;
  onChange?: (date: Date) => void;
  placeholder?: string;
  format?: (date: Date) => string;
  min?: DateInput;
  max?: DateInput;
  disabledDate?: (date: Date) => boolean;
  weekStartsOn?: number;
  disabled?: boolean;
  size?: DatePickerSize;
  align?: "start" | "end";
}

/**
 * DatePicker — a trigger button that opens a Calendar in a popover and shows the chosen date.
 */
export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  placeholder = "Pick a date",
  format = defaultFormat,
  min,
  max,
  disabledDate,
  weekStartsOn = 0,
  disabled = false,
  size = "md",
  align = "start",
  className = "",
  ...rest
}: DatePickerProps) {
  const [innerVal, setInnerVal] = React.useState<Date | null>(toDate(defaultValue));
  const sel = value !== undefined ? toDate(value) : innerVal;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

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

  const handle = (d: Date) => {
    if (value === undefined) setInnerVal(d);
    if (onChange) onChange(d);
    setOpen(false);
  };

  return (
    <span className={["jl-datepicker", size === "sm" ? "jl-datepicker--sm" : "", className].filter(Boolean).join(" ")} ref={ref} {...rest}>
      <button
        type="button"
        className="jl-datepicker__trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="jl-datepicker__icon">{CalIcon}</span>
        <span className="jl-datepicker__value" data-placeholder={!sel || undefined}>{sel ? format(sel) : placeholder}</span>
      </button>
      {open && (
        <div className="jl-datepicker__pop" role="dialog" data-align={align}>
          <Calendar
            value={sel}
            onChange={handle}
            defaultMonth={sel || undefined}
            min={min}
            max={max}
            disabledDate={disabledDate}
            weekStartsOn={weekStartsOn}
          />
        </div>
      )}
    </span>
  );
}
