import * as React from "react";
import "./page-header.css";

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  icon?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  leading?: React.ReactNode;
  onBack?: () => void;
  sticky?: boolean;
  variant?: "surface" | "plain";
  as?: React.ElementType;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  icon = null,
  breadcrumb = null,
  actions = null,
  tabs = null,
  leading = null,
  onBack,
  sticky = false,
  variant = "surface",
  as,
  className = "",
  children,
  ...rest
}: PageHeaderProps) {
  const Tag = (as ?? "header") as React.ElementType;
  const cls = [
    "jl-pageheader",
    variant === "plain" ? "jl-pageheader--plain" : "jl-pageheader--surface",
    sticky ? "jl-pageheader--sticky" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={cls} {...rest}>
      {breadcrumb && <div className="jl-pageheader__crumb">{breadcrumb}</div>}
      <div className="jl-pageheader__bar">
        {(leading || onBack) && (
          <div className="jl-pageheader__lead">
            {leading}
            {onBack && (
              <button type="button" className="jl-pageheader__back" aria-label="Go back" onClick={onBack}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}
        {icon && <span className="jl-pageheader__icon">{icon}</span>}
        <div className="jl-pageheader__heading">
          {eyebrow && <div className="jl-pageheader__eyebrow">{eyebrow}</div>}
          <div className="jl-pageheader__titlerow">
            {title != null && <h1 className="jl-pageheader__title">{title}</h1>}
            {children}
          </div>
          {description && <p className="jl-pageheader__desc">{description}</p>}
        </div>
        {actions && <div className="jl-pageheader__actions">{actions}</div>}
      </div>
      {tabs && <div className="jl-pageheader__tabs">{tabs}</div>}
    </Tag>
  );
}
