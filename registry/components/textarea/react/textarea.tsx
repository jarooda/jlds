import * as React from "react";
import "./textarea.css";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid = false, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={["jl-textarea", className].filter(Boolean).join(" ")}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
