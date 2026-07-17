import * as React from "react";
import "./timeline.css";

export type TimelineTone = "accent" | "success" | "warning" | "danger" | "info" | "muted";
export type TimelineSize = "sm" | "md";

export interface TimelineItemData {
  id?: string | number;
  title?: React.ReactNode;
  time?: React.ReactNode;
  description?: React.ReactNode;
  tone?: TimelineTone;
  icon?: React.ReactNode;
  /** Render a small dot instead of a full-size marker (for compact, icon-less feeds). */
  plain?: boolean;
  /** Extra content rendered below the description. */
  children?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  /** Data-driven entries. Omit when composing with <Timeline.Item>. */
  items?: TimelineItemData[];
  size?: TimelineSize;
}

export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  title?: React.ReactNode;
  time?: React.ReactNode;
  description?: React.ReactNode;
  tone?: TimelineTone;
  icon?: React.ReactNode;
  plain?: boolean;
}

interface TimelineComponent extends React.FC<TimelineProps> {
  Item: React.FC<TimelineItemProps>;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  time,
  description,
  tone = "muted",
  icon,
  plain = false,
  children,
  ...rest
}) => {
  return (
    <li className="jl-timeline__item" {...rest}>
      <div className="jl-timeline__rail">
        <span className="jl-timeline__dot" data-tone={tone} data-plain={plain || undefined} aria-hidden="true">
          {icon}
        </span>
        <span className="jl-timeline__line" aria-hidden="true" />
      </div>
      <div className="jl-timeline__body">
        <div className="jl-timeline__head">
          {title != null && <span className="jl-timeline__title">{title}</span>}
          {time != null && <span className="jl-timeline__time">{time}</span>}
        </div>
        {description != null && <div className="jl-timeline__desc">{description}</div>}
        {children != null && <div className="jl-timeline__extra">{children}</div>}
      </div>
    </li>
  );
};
TimelineItem.displayName = "Timeline.Item";

const Timeline = (({ items = [], size = "md", className = "", children, ...rest }: TimelineProps) => {
  const cls = ["jl-timeline", size === "sm" ? "jl-timeline--sm" : "", className].filter(Boolean).join(" ");

  // Composable form: <Timeline><Timeline.Item .../></Timeline>
  // The last item's connector line is hidden via CSS (:last-child), so children render as-is.
  if (children != null) {
    return (
      <ol className={cls} {...rest}>
        {children}
      </ol>
    );
  }

  return (
    <ol className={cls} {...rest}>
      {items.map((it, i) => (
        <TimelineItem
          key={it.id ?? i}
          title={it.title}
          time={it.time}
          description={it.description}
          tone={it.tone}
          icon={it.icon}
          plain={it.plain}
        >
          {it.children}
        </TimelineItem>
      ))}
    </ol>
  );
}) as TimelineComponent;

Timeline.displayName = "Timeline";
Timeline.Item = TimelineItem;

export { Timeline };
