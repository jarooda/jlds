import * as React from "react";
import "./toast.css";

export type ToastTone = "success" | "warning" | "danger" | "info";

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  duration?: number;
  action?: { label: React.ReactNode; onClick?: () => void };
  id?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
}

export interface ToasterProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "top-center";
}

/* ---- imperative store (sonner-style: call toast() from anywhere) ---- */
let _id = 0;
const _listeners = new Set<(toasts: ToastRecord[]) => void>();
let _toasts: ToastRecord[] = [];
const _emit = () => _listeners.forEach((fn) => fn(_toasts));

function _add(toast: ToastOptions): number {
  const id = toast.id ?? ++_id;
  _toasts = [..._toasts.filter((t) => t.id !== id), { ...toast, id }];
  _emit();
  return id;
}
function _remove(id: number) {
  _toasts = _toasts.filter((t) => t.id !== id);
  _emit();
}

export interface ToastFn {
  (opts: ToastOptions | string): number;
  success(description: React.ReactNode, opts?: ToastOptions): number;
  warning(description: React.ReactNode, opts?: ToastOptions): number;
  danger(description: React.ReactNode, opts?: ToastOptions): number;
  info(description: React.ReactNode, opts?: ToastOptions): number;
  dismiss(id: number): void;
}

export const toast = ((opts: ToastOptions | string) =>
  _add(typeof opts === "string" ? { description: opts } : opts)) as ToastFn;
toast.success = (description, opts) => _add({ tone: "success", description, ...opts });
toast.warning = (description, opts) => _add({ tone: "warning", description, ...opts });
toast.danger = (description, opts) => _add({ tone: "danger", description, ...opts });
toast.info = (description, opts) => _add({ tone: "info", description, ...opts });
toast.dismiss = (id) => _remove(id);

const TONE_ICON: Record<ToastTone, React.ReactNode> = {
  success: <path d="M8 12.5l2.5 2.5 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  warning: <><path d="M12 8.5v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" /></>,
  danger: <><path d="M12 8v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" /></>,
  info: <><path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none" /></>,
};

function ToastRow({ t, onClose }: { t: ToastRecord; onClose: (id: number) => void }) {
  const [leaving, setLeaving] = React.useState(false);
  const dismiss = React.useCallback(() => {
    setLeaving(true);
    setTimeout(() => onClose(t.id), 180);
  }, [t.id, onClose]);

  React.useEffect(() => {
    if (t.duration === Infinity || t.duration === 0) return;
    const ms = t.duration ?? 4500;
    const timer = setTimeout(dismiss, ms);
    return () => clearTimeout(timer);
  }, [t.duration, dismiss]);

  return (
    <div
      className={["jl-toast", t.tone ? `jl-toast--${t.tone}` : ""].filter(Boolean).join(" ")}
      role="status"
      data-leaving={leaving || undefined}
    >
      {t.tone && (
        <span className="jl-toast__icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" opacity="0.35" />
            {TONE_ICON[t.tone]}
          </svg>
        </span>
      )}
      <div className="jl-toast__body">
        {t.title && <div className="jl-toast__title">{t.title}</div>}
        {t.description && <div className="jl-toast__desc">{t.description}</div>}
        {t.action && (
          <button
            type="button"
            className="jl-toast__action"
            onClick={() => {
              t.action!.onClick?.();
              dismiss();
            }}
          >
            {t.action.label}
          </button>
        )}
      </div>
      <button type="button" className="jl-toast__close" aria-label="Dismiss" onClick={dismiss}>
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function Toaster({ position = "bottom-right" }: ToasterProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>(_toasts);
  React.useEffect(() => {
    _listeners.add(setToasts);
    return () => {
      _listeners.delete(setToasts);
    };
  }, []);
  const ordered = position.startsWith("top") ? [...toasts].reverse() : toasts;
  return (
    <div className="jl-toaster" data-pos={position}>
      {ordered.map((t) => (
        <ToastRow key={t.id} t={t} onClose={_remove} />
      ))}
    </div>
  );
}
