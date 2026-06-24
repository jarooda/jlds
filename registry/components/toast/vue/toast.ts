import { ref } from "vue";

export type ToastTone = "success" | "warning" | "danger" | "info";

export interface ToastOptions {
  title?: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; onClick?: () => void };
  id?: number;
}

export interface ToastRecord extends ToastOptions {
  id: number;
}

let _id = 0;
export const toasts = ref<ToastRecord[]>([]);

function add(opts: ToastOptions): number {
  const id = opts.id ?? ++_id;
  toasts.value = [...toasts.value.filter((t) => t.id !== id), { ...opts, id }];
  return id;
}

export function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

export const toast = Object.assign(
  (opts: ToastOptions | string) =>
    add(typeof opts === "string" ? { description: opts } : opts),
  {
    success: (description: string, opts?: ToastOptions) =>
      add({ tone: "success", description, ...opts }),
    warning: (description: string, opts?: ToastOptions) =>
      add({ tone: "warning", description, ...opts }),
    danger: (description: string, opts?: ToastOptions) =>
      add({ tone: "danger", description, ...opts }),
    info: (description: string, opts?: ToastOptions) =>
      add({ tone: "info", description, ...opts }),
    dismiss: (id: number) => removeToast(id),
  }
);
