/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Checkbox } from "../checkbox";
import "./table.css";

export type CellAlign = "left" | "center" | "right";
export type SortDirection = "asc" | "desc" | null;

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  density?: "comfortable" | "compact";
  stickyHeader?: boolean;
}
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  interactive?: boolean;
}
export interface TableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: CellAlign;
  numeric?: boolean;
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: (e: React.MouseEvent) => void;
}
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: CellAlign;
  numeric?: boolean;
}
export interface TableSelectCellProps {
  /** Render as a <th> header checkbox (select-all) instead of a row <td>. @default false */
  header?: boolean;
  /** Checked state. @default false */
  checked?: boolean;
  /** Mixed state for a select-all header (shown when not fully checked). @default false */
  indeterminate?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
  className?: string;
}

function TableRoot({
  density = "comfortable",
  stickyHeader = false,
  className = "",
  children,
  ...rest
}: TableProps) {
  const cls = [
    "jl-table",
    density === "compact" ? "jl-table--compact" : "",
    stickyHeader ? "jl-table--sticky" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="jl-table-wrap">
      <table className={cls} {...rest}>
        {children}
      </table>
    </div>
  );
}

function TableHead({ className = "", children, ...rest }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={["jl-table__head", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </thead>
  );
}

function TableBody({ className = "", children, ...rest }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={["jl-table__body", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </tbody>
  );
}

function TableRow({ selected = false, interactive = false, className = "", children, ...rest }: TableRowProps) {
  const cls = [
    interactive ? "jl-tr--interactive" : "",
    selected ? "jl-tr--selected" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <tr className={cls} aria-selected={selected || undefined} {...rest}>
      {children}
    </tr>
  );
}

const SORT_ICON: Record<"none" | "asc" | "desc", React.ReactNode> = {
  none: <path d="M8 9l4-4 4 4M8 15l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  asc: <path d="M8 14l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  desc: <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
};

function TableHeaderCell({
  align = "left",
  numeric = false,
  sortable = false,
  sortDirection = null,
  onSort,
  className = "",
  children,
  ...rest
}: TableHeaderCellProps) {
  const active = sortDirection === "asc" || sortDirection === "desc";
  const cls = [
    align === "right" ? "jl-th--right" : align === "center" ? "jl-th--center" : "",
    numeric ? "jl-th--num" : "",
    active ? "jl-th--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const ariaSort = !sortable
    ? undefined
    : active
    ? sortDirection === "asc"
      ? "ascending"
      : "descending"
    : "none";
  return (
    <th scope="col" className={cls} aria-sort={ariaSort} {...rest}>
      {sortable ? (
        <button type="button" className="jl-th__btn" onClick={onSort}>
          <span>{children}</span>
          <span className="jl-th__sort">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {SORT_ICON[sortDirection || "none"]}
            </svg>
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function TableCell({ align = "left", numeric = false, className = "", children, ...rest }: TableCellProps) {
  const cls = [
    align === "right" ? "jl-td--right" : align === "center" ? "jl-td--center" : "",
    numeric ? "jl-td--num" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <td className={cls} {...rest}>
      {children}
    </td>
  );
}

function TableSelectCell({
  header = false,
  checked = false,
  indeterminate = false,
  onChange,
  className = "",
  ...rest
}: TableSelectCellProps) {
  const Tag = header ? "th" : "td";
  const label = rest["aria-label"] || (header ? "Select all rows" : "Select row");
  return (
    <Tag
      className={[header ? "jl-th--select" : "jl-td--select", className].filter(Boolean).join(" ")}
      scope={header ? "col" : undefined}
    >
      <Checkbox
        checked={checked}
        indeterminate={indeterminate && !checked}
        onChange={onChange}
        aria-label={label}
      />
    </Tag>
  );
}

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
  SelectCell: TableSelectCell,
});
