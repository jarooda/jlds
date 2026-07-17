import * as React from "react";
import "./textarea.css";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Grow the field to fit its content. @default false */
  autoResize?: boolean;
  /** Show a character counter (turns red past `maxLength`). @default false */
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { invalid = false, autoResize = false, showCount = false, maxLength, value, defaultValue, onChange, className = "", ...props },
    ref
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);
    const [len, setLen] = React.useState(String(value ?? defaultValue ?? "").length);

    const fit = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    React.useEffect(() => {
      fit();
    }, [fit, value]);

    const handle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLen(e.target.value.length);
      fit();
      onChange?.(e);
    };

    const ta = (
      <textarea
        ref={innerRef}
        className={["jl-textarea", autoResize ? "jl-textarea--auto" : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={invalid || undefined}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handle}
        {...props}
      />
    );

    if (!showCount) return ta;
    return (
      <span className="jl-textarea-wrap">
        {ta}
        <span
          className="jl-textarea__count"
          data-over={(maxLength != null && len > maxLength) || undefined}
        >
          {maxLength != null ? `${len}/${maxLength}` : len}
        </span>
      </span>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
