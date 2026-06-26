import * as React from "react";
import "./banner.css";

export type BannerTone = "info" | "success" | "warning" | "danger" | "accent" | "neutral";
export type BannerVariant = "subtle" | "solid";
export type BannerAlign = "left" | "center";

export interface BannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: BannerTone;
  variant?: BannerVariant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  /** Trailing action node, e.g. a small button. */
  action?: React.ReactNode;
  /** Show a dismiss × and call this when clicked. */
  onDismiss?: () => void;
  sticky?: boolean;
  align?: BannerAlign;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      tone = "info",
      variant = "subtle",
      title,
      icon,
      action,
      onDismiss,
      sticky = false,
      align = "left",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const cls = [
      "jl-banner",
      `jl-banner--${variant}`,
      `jl-banner--${tone}`,
      sticky ? "jl-banner--sticky" : "",
      align === "center" ? "jl-banner--center" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={cls} role="status" {...props}>
        {icon && <span className="jl-banner__icon">{icon}</span>}
        <span className="jl-banner__content">
          {title && <span className="jl-banner__title">{title}</span>}
          {children && <span className="jl-banner__text">{children}</span>}
        </span>
        {action && <span className="jl-banner__action">{action}</span>}
        {onDismiss && (
          <button type="button" className="jl-banner__close" aria-label="Dismiss" onClick={onDismiss}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Banner.displayName = "Banner";

export { Banner };
