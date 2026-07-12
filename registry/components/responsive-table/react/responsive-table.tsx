import * as React from "react";
import "./responsive-table.css";

export interface ResponsiveColumn<Row = Record<string, unknown>> {
  /** Key into the row object. */
  key: string;
  /** Column header / stacked-card field label. */
  header: React.ReactNode;
  /** Cell renderer. Defaults to `row[key]`. */
  render?: (value: unknown, row: Row) => React.ReactNode;
  /** Right-align + mono tabular figures. @default false */
  numeric?: boolean;
  /** Header/cell text alignment (overrides numeric default). */
  align?: "left" | "center" | "right";
  /** Use as the card title in stacked mode. @default first column */
  primary?: boolean;
  /** Drop this field from the stacked card (keep it table-only). @default false */
  hideOnStack?: boolean;
}

export interface ResponsiveTableProps<Row = Record<string, unknown>>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Column definitions, left to right. */
  columns: ResponsiveColumn<Row>[];
  /** Row objects. */
  data: Row[];
  /** Stable key per row. @default row.id ?? index */
  rowKey?: (row: Row, index: number) => React.Key;
  /** Row click handler (makes rows/cards interactive). */
  onRowClick?: (row: Row) => void;
  /** Container width (px) below which it switches to stacked cards. @default 560 */
  breakpoint?: number;
  className?: string;
}

/**
 * ResponsiveTable — a real data table on wide containers that transforms into a
 * stacked key/value card list when its container narrows past `breakpoint`.
 * Tier-2 adaptive: same columns + data, presentation flips by available width.
 */
export function ResponsiveTable<Row extends Record<string, unknown> = Record<string, unknown>>({
  columns = [],
  data = [],
  rowKey = (row: Row, i: number) => (row.id as React.Key | undefined) ?? i,
  onRowClick,
  breakpoint = 560,
  className = "",
  ...rest
}: ResponsiveTableProps<Row>) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [stacked, setStacked] = React.useState(false);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setStacked((el.clientWidth || 9999) < breakpoint);
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [breakpoint]);

  const cellValue = (col: ResponsiveColumn<Row>, row: Row) =>
    col.render ? col.render(row[col.key], row) : (row[col.key] as React.ReactNode);

  return (
    <div
      ref={wrapRef}
      className={["jl-rtable", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {!stacked ? (
        <table className="jl-rtable__table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={c.numeric ? "jl-rtable--num" : ""}
                  style={{ textAlign: c.align }}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                className={onRowClick ? "jl-rtable__row--clickable" : ""}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={c.numeric ? "jl-rtable--num" : ""}
                    style={{ textAlign: c.align }}
                  >
                    {cellValue(c, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="jl-rtable__cards">
          {data.map((row, i) => {
            const primaryCol = columns.find((c) => c.primary) || columns[0];
            const rest2 = columns.filter((c) => c !== primaryCol && !c.hideOnStack);
            return (
              <div
                key={rowKey(row, i)}
                className={[
                  "jl-rtable__card",
                  onRowClick ? "jl-rtable__card--clickable" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                <div className="jl-rtable__card-primary">{cellValue(primaryCol, row)}</div>
                {rest2.map((c) => (
                  <div className="jl-rtable__pair" key={c.key}>
                    <span className="jl-rtable__k">{c.header}</span>
                    <span
                      className={["jl-rtable__v", c.numeric ? "jl-rtable__v--num" : ""]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {cellValue(c, row)}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
