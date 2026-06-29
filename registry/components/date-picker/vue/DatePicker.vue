<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import Calendar from "./Calendar.vue";

type DatePickerSize = "sm" | "md";
type DateInput = Date | string | number | null | undefined;

const props = withDefaults(
  defineProps<{
    /** v-model: the selected date */
    modelValue?: DateInput;
    placeholder?: string;
    format?: (date: Date) => string;
    min?: DateInput;
    max?: DateInput;
    disabledDate?: (date: Date) => boolean;
    weekStartsOn?: number;
    disabled?: boolean;
    size?: DatePickerSize;
    align?: "start" | "end";
  }>(),
  {
    modelValue: null,
    placeholder: "Pick a date",
    format: undefined,
    min: undefined,
    max: undefined,
    disabledDate: undefined,
    weekStartsOn: 0,
    disabled: false,
    size: "md",
    align: "start",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", date: Date): void;
  (e: "change", date: Date): void;
}>();

const toDate = (v: DateInput): Date | null => (v == null ? null : v instanceof Date ? v : new Date(v));
const defaultFormat = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const sel = computed(() => toDate(props.modelValue));
const open = ref(false);
const root = ref<HTMLElement | null>(null);

const label = computed(() => (sel.value ? (props.format || defaultFormat)(sel.value) : props.placeholder));

function onDown(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") open.value = false;
}
function teardown() {
  document.removeEventListener("mousedown", onDown);
  document.removeEventListener("keydown", onKey);
}

watch(open, (o) => {
  if (o) {
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
  } else {
    teardown();
  }
});
onBeforeUnmount(teardown);

function handle(d: Date) {
  emit("update:modelValue", d);
  emit("change", d);
  open.value = false;
}
</script>

<template>
  <span
    ref="root"
    class="jl-datepicker"
    :class="props.size === 'sm' ? 'jl-datepicker--sm' : ''"
  >
    <button
      type="button"
      class="jl-datepicker__trigger"
      :disabled="props.disabled"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="jl-datepicker__icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2.2" stroke="currentColor" stroke-width="1.75" /><path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" /></svg>
      </span>
      <span class="jl-datepicker__value" :data-placeholder="!sel || undefined">{{ label }}</span>
    </button>
    <div v-if="open" class="jl-datepicker__pop" role="dialog" :data-align="props.align">
      <Calendar
        :model-value="sel"
        :default-month="sel || undefined"
        :min="props.min"
        :max="props.max"
        :disabled-date="props.disabledDate"
        :week-starts-on="props.weekStartsOn"
        @update:model-value="handle"
      />
    </div>
  </span>
</template>

<style src="./date-picker.css"></style>
