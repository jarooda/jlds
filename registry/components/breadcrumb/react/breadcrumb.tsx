/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import "./breadcrumb.css";

export interface BreadcrumbItemData {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export type BreadcrumbSeparator = "chevron" | "slash";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItemData[];
  separator?: BreadcrumbSeparator;
  maxItems?: number;
}

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  current?: boolean;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

const ChevronSep = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Dots = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="19" cy="12" r="1.6" fill="currentColor" />
  </svg>
);

type RenderItem = BreadcrumbItemData & { _ellipsis?: boolean };

function BreadcrumbRoot({
  items,
  separator = "chevron",
  maxItems = 0,
  className = "",
  children,
  ...rest
}: BreadcrumbProps) {
  const [expanded, setExpanded] = React.useState(false);

  const sepNode =
    separator === "slash" ? (
      <span className="jl-breadcrumb__sep jl-breadcrumb__sep--slash" aria-hidden="true">
        /
      </span>
    ) : (
      <span className="jl-breadcrumb__sep" aria-hidden="true">
        <ChevronSep />
      </span>
    );

  let rendered: React.ReactNode;
  if (items && items.length) {
    let list: RenderItem[] = items;
    if (maxItems > 0 && items.length > maxItems && !expanded) {
      list = [items[0], { _ellipsis: true, label: "" }, ...items.slice(items.length - (maxItems - 1))];
    }
    rendered = list.map((it, i) => {
      const last = i === list.length - 1;
      let node: React.ReactNode;
      if (it._ellipsis) {
        node = (
          <button
            type="button"
            className="jl-breadcrumb__ellipsis"
            aria-label="Show all"
            onClick={() => setExpanded(true)}
          >
            <Dots />
          </button>
        );
      } else if (last || it.current || !it.href) {
        node = (
          <span className="jl-breadcrumb__current" aria-current="page">
            {it.icon}
            {it.label}
          </span>
        );
      } else {
        node = (
          <a className="jl-breadcrumb__link" href={it.href} onClick={it.onClick}>
            {it.icon}
            {it.label}
          </a>
        );
      }
      return (
        <li className="jl-breadcrumb__item" key={i}>
          {node}
          {!last && sepNode}
        </li>
      );
    });
  } else {
    const arr = React.Children.toArray(children);
    rendered = arr.map((child, i) => (
      <li className="jl-breadcrumb__item" key={i}>
        {child}
        {i < arr.length - 1 && sepNode}
      </li>
    ));
  }

  return (
    <nav
      className={["jl-breadcrumb", className].filter(Boolean).join(" ")}
      aria-label="Breadcrumb"
      {...rest}
    >
      <ol className="jl-breadcrumb__list">{rendered}</ol>
    </nav>
  );
}

function BreadcrumbItem({
  href,
  current = false,
  icon = null,
  onClick,
  children,
  ...rest
}: BreadcrumbItemProps) {
  if (current || !href) {
    return (
      <span className="jl-breadcrumb__current" aria-current={current ? "page" : undefined} {...rest}>
        {icon}
        {children}
      </span>
    );
  }
  return (
    <a className="jl-breadcrumb__link" href={href} onClick={onClick} {...rest}>
      {icon}
      {children}
    </a>
  );
}

export const Breadcrumb = Object.assign(BreadcrumbRoot, { Item: BreadcrumbItem });
