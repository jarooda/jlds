import * as React from "react";
import "./pagination.css";

export interface PaginationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  page?: number;
  pageCount: number;
  total?: number;
  pageSize?: number;
  siblingCount?: number;
  showSummary?: boolean;
  onChange?: (page: number) => void;
}

function pageList(current: number, total: number, siblings: number): (number | "…")[] {
  const span = siblings * 2 + 5;
  if (total <= span) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;
  const out: (number | "…")[] = [1];
  if (showLeftDots) out.push("…");
  for (let p = Math.max(left, 2); p <= Math.min(right, total - 1); p++) out.push(p);
  if (showRightDots) out.push("…");
  out.push(total);
  return out;
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pagination({
  page = 1,
  pageCount,
  total,
  pageSize,
  siblingCount = 1,
  showSummary = false,
  onChange,
  className = "",
  ...rest
}: PaginationProps) {
  const go = (p: number) => {
    if (p >= 1 && p <= pageCount && p !== page && onChange) onChange(p);
  };
  const pages = pageList(page, pageCount, siblingCount);

  const from = total != null && pageSize != null ? (page - 1) * pageSize + 1 : null;
  const to = total != null && pageSize != null ? Math.min(page * pageSize, total) : null;

  return (
    <nav
      className={["jl-pagination", className].filter(Boolean).join(" ")}
      aria-label="Pagination"
      {...rest}
    >
      {showSummary && from != null && (
        <div className="jl-pagination__summary">
          <b>
            {from.toLocaleString()}–{to!.toLocaleString()}
          </b>{" "}
          of <b>{total!.toLocaleString()}</b>
        </div>
      )}
      {showSummary && <div className="jl-pagination__spacer" />}
      <div className="jl-pagination__list">
        <button
          type="button"
          className="jl-page jl-page--arrow"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => go(page - 1)}
        >
          <Arrow dir="left" />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="jl-page jl-page--ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className="jl-page"
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              onClick={() => go(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          className="jl-page jl-page--arrow"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => go(page + 1)}
        >
          <Arrow dir="right" />
        </button>
      </div>
    </nav>
  );
}
