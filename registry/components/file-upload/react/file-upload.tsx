import * as React from "react";
import "./file-upload.css";

export type FileUploadSize = "sm" | "md";
export type FileUploadStatus = "done" | "uploading" | "error";

export interface UploadFile {
  name: string;
  size?: number;
  status?: FileUploadStatus;
  progress?: number;
  error?: string;
  file?: File;
}

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  size?: FileUploadSize;
  hint?: React.ReactNode;
  /** Controlled list of files to render (with progress/status). */
  files?: UploadFile[];
  onFiles?: (files: File[]) => void;
  onRemove?: (index: number, item: UploadFile) => void;
}

const UploadIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const FileIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" /><path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" /></svg>
);
const XIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
);
const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const AlertIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" /></svg>
);

function formatBytes(n?: number) {
  if (n == null) return "";
  if (n < 1024) return n + " B";
  const u = ["KB", "MB", "GB"];
  let i = -1;
  do {
    n /= 1024;
    i++;
  } while (n >= 1024 && i < u.length - 1);
  return n.toFixed(n < 10 ? 1 : 0) + " " + u[i];
}

/**
 * FileUpload — a drag-and-drop dropzone with a click-to-browse fallback and a list of selected files.
 * Pass `files` to render upload progress/status for a controlled list.
 */
export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  size = "md",
  hint,
  files,
  onFiles,
  onRemove,
  className = "",
  ...rest
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [internal, setInternal] = React.useState<UploadFile[]>([]);
  const list = files !== undefined ? files : internal;

  const accepting = (incoming: FileList) => {
    const arr = Array.from(incoming);
    const ok = maxSize ? arr.filter((f) => f.size <= maxSize) : arr;
    const next = multiple ? ok : ok.slice(0, 1);
    if (files === undefined) {
      setInternal(next.map((f) => ({ name: f.name, size: f.size, status: "done" as const, progress: 100, file: f })));
    }
    if (onFiles) onFiles(next);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length) accepting(e.dataTransfer.files);
  };

  const remove = (idx: number, item: UploadFile) => {
    if (files === undefined) setInternal((cur) => cur.filter((_, i) => i !== idx));
    if (onRemove) onRemove(idx, item);
  };

  const defaultHint = [
    accept ? accept.replace(/\./g, "").toUpperCase().replace(/,\s*/g, ", ") : null,
    maxSize ? `up to ${formatBytes(maxSize)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={["jl-upload", size === "sm" ? "jl-upload--sm" : "", className].filter(Boolean).join(" ")} {...rest}>
      <div
        className="jl-upload__zone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <span className="jl-upload__mark">{UploadIcon}</span>
        <div className="jl-upload__title"><b>Click to upload</b> or drag and drop</div>
        <div className="jl-upload__hint">{hint || defaultHint || "Any file type"}</div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length) accepting(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {list.length > 0 && (
        <ul className="jl-upload__list">
          {list.map((f, i) => {
            const status = f.status || "done";
            const progress = f.progress != null ? f.progress : status === "done" ? 100 : 0;
            return (
              <li className="jl-upload__item" key={f.name + i} data-status={status}>
                <span className="jl-upload__fileicon">{FileIcon}</span>
                <div className="jl-upload__meta">
                  <div className="jl-upload__name">{f.name}</div>
                  <div className="jl-upload__size">
                    {formatBytes(f.size)}
                    {f.error ? ` · ${f.error}` : ""}
                  </div>
                  {status === "uploading" && (
                    <div className="jl-upload__bar"><i style={{ width: `${progress}%` }} /></div>
                  )}
                </div>
                {status === "done" && <span className="jl-upload__status" data-status="done">{CheckIcon}</span>}
                {status === "error" && <span className="jl-upload__status" data-status="error">{AlertIcon}</span>}
                <button type="button" className="jl-upload__remove" aria-label={`Remove ${f.name}`} onClick={() => remove(i, f)}>{XIcon}</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
