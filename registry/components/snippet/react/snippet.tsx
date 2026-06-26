import * as React from "react";
import "./snippet.css";

export type SnippetVariant = "inline" | "block";

export interface SnippetProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "title"> {
  children?: React.ReactNode;
  /** Explicit copy text — use when children is styled/non-string. */
  code?: string;
  variant?: SnippetVariant;
  prompt?: React.ReactNode;
  language?: string;
  title?: React.ReactNode;
  lineNumbers?: boolean;
  copyable?: boolean;
  className?: string;
}

function useCopy(text: string): [boolean, () => void] {
  const [done, setDone] = React.useState(false);
  const copy = React.useCallback(() => {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else {
      fallback();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }, [text]);
  return [done, copy];
}

function CopyGlyph({ done }: { done: boolean }) {
  return done ? (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13 4.5 6.5 11 3 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3.5 10.5A1.5 1.5 0 0 1 2.5 9V3.5A1.5 1.5 0 0 1 4 2h5a1.5 1.5 0 0 1 1.5 1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Snippet({
  children,
  code,
  variant = "inline",
  prompt = variant === "inline" ? "$" : null,
  language,
  title,
  lineNumbers = false,
  copyable = true,
  className = "",
  ...rest
}: SnippetProps) {
  const text = code != null ? code : typeof children === "string" ? children : "";
  const [done, copy] = useCopy(text);

  if (variant === "block") {
    const lines = String(text).replace(/\n$/, "").split("\n");
    const hasBar = !!(title || language);
    const cls = [
      "jl-codeblock",
      lineNumbers ? "jl-codeblock--numbered" : "",
      hasBar ? "" : "jl-codeblock--barless",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <div className={cls} {...rest}>
        {hasBar && (
          <div className="jl-codeblock__bar">
            {title && <span className="jl-codeblock__title">{title}</span>}
            {language && <span className="jl-codeblock__lang">{language}</span>}
            {copyable && (
              <button
                type="button"
                className={`jl-codeblock__copy ${done ? "jl-codeblock__copy--done" : ""}`}
                onClick={copy}
              >
                <CopyGlyph done={done} />
                {done ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        )}
        {!hasBar && copyable && (
          <button
            type="button"
            className={`jl-codeblock__copy ${done ? "jl-codeblock__copy--done" : ""}`}
            aria-label="Copy code"
            onClick={copy}
          >
            <CopyGlyph done={done} />
          </button>
        )}
        <div className="jl-codeblock__scroll">
          <pre>
            <code>
              {lines.map((ln, i) => (
                <span className="jl-codeblock__row" key={i}>
                  {ln + (i < lines.length - 1 ? "\n" : "")}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <span className={["jl-snippet", className].filter(Boolean).join(" ")} {...rest}>
      {prompt && <span className="jl-snippet__prompt">{prompt}</span>}
      <span className="jl-snippet__code">{children != null ? children : text}</span>
      {copyable && (
        <button
          type="button"
          className={`jl-snippet__copy ${done ? "jl-snippet__copy--done" : ""}`}
          aria-label="Copy"
          onClick={copy}
        >
          <CopyGlyph done={done} />
        </button>
      )}
    </span>
  );
}
