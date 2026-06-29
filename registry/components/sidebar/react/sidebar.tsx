/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import "./sidebar.css";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  width?: number | string;
  collapsedWidth?: number | string;
}

export type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement>;

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
}

export interface SidebarItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  title?: string;
}

interface SidebarComposition {
  (props: SidebarProps): React.JSX.Element;
  Header: (props: SidebarSectionProps) => React.JSX.Element;
  Body: (props: SidebarSectionProps) => React.JSX.Element;
  Footer: (props: SidebarSectionProps) => React.JSX.Element;
  Group: (props: SidebarGroupProps) => React.JSX.Element;
  Item: (props: SidebarItemProps) => React.JSX.Element;
}

const SbCtx = React.createContext<{ collapsed: boolean }>({ collapsed: false });

function SidebarRoot({
  collapsed = false,
  width = 260,
  collapsedWidth = 68,
  className = "",
  style,
  children,
  ...rest
}: SidebarProps) {
  const vars = {
    "--_w": typeof width === "number" ? `${width}px` : width,
    "--_cw": typeof collapsedWidth === "number" ? `${collapsedWidth}px` : collapsedWidth,
    ...style,
  } as React.CSSProperties;
  return (
    <SbCtx.Provider value={{ collapsed }}>
      <aside
        className={["jl-sidebar", className].filter(Boolean).join(" ")}
        data-collapsed={collapsed || undefined}
        style={vars}
        {...rest}
      >
        {children}
      </aside>
    </SbCtx.Provider>
  );
}

function SidebarHeader({ className = "", children, ...rest }: SidebarSectionProps) {
  return (
    <div className={["jl-sidebar__header", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

function SidebarBody({ className = "", children, ...rest }: SidebarSectionProps) {
  return (
    <nav className={["jl-sidebar__body", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </nav>
  );
}

function SidebarFooter({ className = "", children, ...rest }: SidebarSectionProps) {
  return (
    <div className={["jl-sidebar__footer", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

function SidebarGroup({ label, className = "", children, ...rest }: SidebarGroupProps) {
  return (
    <div className={["jl-sidebar__group", className].filter(Boolean).join(" ")} {...rest}>
      {label != null && <div className="jl-sidebar__group-label">{label}</div>}
      {children}
    </div>
  );
}

function SidebarItem({
  icon = null,
  label,
  active = false,
  badge,
  trailing = null,
  href,
  disabled = false,
  className = "",
  children,
  title,
  ...rest
}: SidebarItemProps) {
  const { collapsed } = React.useContext(SbCtx);
  const content = label != null ? label : children;
  const Tag = (href ? "a" : "button") as React.ElementType;
  const tagProps = href ? { href } : { type: "button" as const };
  return (
    <Tag
      className={["jl-sidebar__item", className].filter(Boolean).join(" ")}
      data-active={active || undefined}
      aria-disabled={disabled || undefined}
      aria-current={active ? "page" : undefined}
      title={title != null ? title : collapsed && typeof content === "string" ? content : undefined}
      {...tagProps}
      {...rest}
    >
      {icon && <span className="jl-sidebar__item-icon">{icon}</span>}
      <span className="jl-sidebar__item-label">{content}</span>
      {badge != null && <span className="jl-sidebar__item-badge">{badge}</span>}
      {trailing && <span className="jl-sidebar__item-trail">{trailing}</span>}
    </Tag>
  );
}

export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Body: SidebarBody,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  Item: SidebarItem,
}) as SidebarComposition;
