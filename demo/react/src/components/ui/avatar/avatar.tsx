import * as React from "react";
import "./avatar.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "busy" | "away" | "offline";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  name?: string;
  size?: AvatarSize | number;
  square?: boolean;
  status?: AvatarStatus;
  ring?: boolean;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  max?: number;
  size?: AvatarSize | number;
}

const SIZES: Record<AvatarSize, number> = { xs: 22, sm: 28, md: 36, lg: 48, xl: 64 };
const PALETTE = ["#1b8a64", "#2ea67c", "#0ea5e9", "#f59e0b", "#7c5cff", "#ef4444"];

function hashColor(str = ""): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function initials(name = ""): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]).join("").toUpperCase() || "?";
}

function resolveSize(size: AvatarSize | number): number {
  return typeof size === "number" ? size : SIZES[size] ?? 36;
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      name = "",
      size = "md",
      square = false,
      status,
      ring = false,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const px = resolveSize(size);
    const cls = [
      "jl-avatar",
      square ? "jl-avatar--square" : "",
      ring ? "jl-avatar__ring" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={cls}
        style={{
          width: px,
          height: px,
          fontSize: Math.max(10, Math.round(px * 0.4)),
          background: src ? undefined : hashColor(name),
          ...style,
        }}
        {...props}
      >
        {src ? (
          <img className="jl-avatar__img" src={src} alt={name} />
        ) : (
          initials(name)
        )}
        {status && (
          <span className={`jl-avatar__status jl-avatar__status--${status}`} />
        )}
      </span>
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarGroup = React.forwardRef<HTMLSpanElement, AvatarGroupProps>(
  ({ max, size = "md", className = "", children, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const px = resolveSize(size);
    const shown = max ? items.slice(0, max) : items;
    const extra = max ? items.length - shown.length : 0;

    return (
      <span
        ref={ref}
        className={["jl-avatar-group", className].filter(Boolean).join(" ")}
        {...props}
      >
        {shown}
        {extra > 0 && (
          <span className="jl-avatar-group__more" style={{ width: px, height: px }}>
            +{extra}
          </span>
        )}
      </span>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
