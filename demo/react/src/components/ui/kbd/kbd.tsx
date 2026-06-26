import * as React from "react";
import "./kbd.css";

export type KbdSize = "sm" | "md";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  keys?: string[];
  size?: KbdSize;
}

const PRETTY: Record<string, string> = {
  mod: "⌘", cmd: "⌘", meta: "⌘", shift: "⇧", alt: "⌥", option: "⌥",
  ctrl: "⌃", control: "⌃", enter: "↵", return: "↵", esc: "Esc",
  escape: "Esc", tab: "Tab", up: "↑", down: "↓", left: "←", right: "→",
  backspace: "⌫", del: "⌦", delete: "⌦", space: "Space",
};

function prettify(k: React.ReactNode): React.ReactNode {
  if (typeof k !== "string") return k;
  return PRETTY[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k);
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ keys, size = "md", className = "", children, ...props }, ref) => {
    const cls = ["jl-kbd", size === "sm" ? "jl-kbd--sm" : "", className]
      .filter(Boolean)
      .join(" ");

    if (keys && keys.length) {
      return (
        <span className="jl-kbd-group" {...props}>
          {keys.map((k, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="jl-kbd-group__plus" aria-hidden="true">
                  +
                </span>
              )}
              <kbd className={cls}>{prettify(k)}</kbd>
            </React.Fragment>
          ))}
        </span>
      );
    }

    return (
      <kbd ref={ref} className={cls} {...props}>
        {prettify(children)}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";

export { Kbd };
