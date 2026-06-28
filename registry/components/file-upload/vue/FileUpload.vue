<script setup lang="ts">
import { computed, ref } from "vue";

type FileUploadSize = "sm" | "md";
type FileUploadStatus = "done" | "uploading" | "error";

interface UploadFile {
  name: string;
  size?: number;
  status?: FileUploadStatus;
  progress?: number;
  error?: string;
  file?: File;
}

const props = withDefaults(
  defineProps<{
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    disabled?: boolean;
    size?: FileUploadSize;
    hint?: string;
    /** Controlled list of files to render (with progress/status). */
    files?: UploadFile[];
  }>(),
  {
    accept: undefined,
    multiple: false,
    maxSize: undefined,
    disabled: false,
    size: "md",
    hint: undefined,
    files: undefined,
  }
);

const emit = defineEmits<{
  (e: "files", files: File[]): void;
  (e: "remove", index: number, item: UploadFile): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const dragging = ref(false);
const internal = ref<UploadFile[]>([]);
const list = computed(() => (props.files !== undefined ? props.files : internal.value));

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

const defaultHint = computed(() =>
  [
    props.accept ? props.accept.replace(/\./g, "").toUpperCase().replace(/,\s*/g, ", ") : null,
    props.maxSize ? `up to ${formatBytes(props.maxSize)}` : null,
  ]
    .filter(Boolean)
    .join(" · ")
);

function accepting(incoming: FileList) {
  const arr = Array.from(incoming);
  const ok = props.maxSize ? arr.filter((f) => f.size <= props.maxSize!) : arr;
  const next = props.multiple ? ok : ok.slice(0, 1);
  if (props.files === undefined) {
    internal.value = next.map((f) => ({ name: f.name, size: f.size, status: "done" as const, progress: 100, file: f }));
  }
  emit("files", next);
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  dragging.value = false;
  if (props.disabled) return;
  if (e.dataTransfer && e.dataTransfer.files.length) accepting(e.dataTransfer.files);
}

function openPicker() {
  if (!props.disabled && inputRef.value) inputRef.value.click();
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length) accepting(target.files);
  target.value = "";
}

function remove(idx: number, item: UploadFile) {
  if (props.files === undefined) internal.value = internal.value.filter((_, i) => i !== idx);
  emit("remove", idx, item);
}

function statusOf(f: UploadFile): FileUploadStatus {
  return f.status || "done";
}
function progressOf(f: UploadFile) {
  return f.progress != null ? f.progress : statusOf(f) === "done" ? 100 : 0;
}
</script>

<template>
  <div class="jl-upload" :class="props.size === 'sm' ? 'jl-upload--sm' : ''">
    <div
      class="jl-upload__zone"
      role="button"
      :tabindex="props.disabled ? -1 : 0"
      :data-dragging="dragging || undefined"
      :data-disabled="props.disabled || undefined"
      @click="openPicker"
      @keydown="(e: KeyboardEvent) => { if ((e.key === 'Enter' || e.key === ' ') && !props.disabled) { e.preventDefault(); openPicker(); } }"
      @dragover.prevent="!props.disabled && (dragging = true)"
      @dragleave="dragging = false"
      @drop="onDrop"
    >
      <span class="jl-upload__mark">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <div class="jl-upload__title"><b>Click to upload</b> or drag and drop</div>
      <div class="jl-upload__hint">{{ props.hint || defaultHint || "Any file type" }}</div>
      <input
        ref="inputRef"
        type="file"
        :accept="props.accept"
        :multiple="props.multiple"
        :disabled="props.disabled"
        style="display: none"
        @change="onInput"
      />
    </div>

    <ul v-if="list.length > 0" class="jl-upload__list">
      <li v-for="(f, i) in list" :key="f.name + i" class="jl-upload__item" :data-status="statusOf(f)">
        <span class="jl-upload__fileicon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" /><path d="M14 3v5h5" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" /></svg>
        </span>
        <div class="jl-upload__meta">
          <div class="jl-upload__name">{{ f.name }}</div>
          <div class="jl-upload__size">{{ formatBytes(f.size) }}{{ f.error ? ` · ${f.error}` : "" }}</div>
          <div v-if="statusOf(f) === 'uploading'" class="jl-upload__bar"><i :style="{ width: `${progressOf(f)}%` }" /></div>
        </div>
        <span v-if="statusOf(f) === 'done'" class="jl-upload__status" data-status="done">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
        <span v-if="statusOf(f) === 'error'" class="jl-upload__status" data-status="error">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75" /></svg>
        </span>
        <button type="button" class="jl-upload__remove" :aria-label="`Remove ${f.name}`" @click="remove(i, f)">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" /></svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<style src="./file-upload.css"></style>
