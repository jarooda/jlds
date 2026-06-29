<script setup lang="ts">
import { computed, ref } from "vue";

type DatePickerSize = "sm" | "md";
type DateInput = Date | string | number | null | undefined;

const props = withDefaults(
  defineProps<{
    /** v-model: the selected date */
    modelValue?: DateInput;
    /** v-model:month: the visible month */
    month?: DateInput;
    defaultMonth?: DateInput;
    min?: DateInput;
    max?: DateInput;
    disabledDate?: (date: Date) => boolean;
    weekStartsOn?: number;
    size?: DatePickerSize;
  }>(),
  {
    modelValue: null,
    month: undefined,
    defaultMonth: undefined,
    min: undefined,
    max: undefined,
    disabledDate: undefined,
    weekStartsOn: 0,
    size: "md",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", date: Date): void;
  (e: "update:month", month: Date): void;
  (e: "change", date: Date): void;
}>();

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const toDate = (v: DateInput): Date | null => (v == null ? null : v instanceof Date ? v : new Date(v));

const sel = computed(() => toDate(props.modelValue));

const initialView = toDate(props.month) || toDate(props.defaultMonth) || sel.value || new Date();
const innerView = ref(new Date(initialView.getFullYear(), initialView.getMonth(), 1));
const view = computed(() =>
  props.month !== undefined ? new Date(toDate(props.month)!.getFullYear(), toDate(props.month)!.getMonth(), 1) : innerView.value
);

function setView(next: Date) {
  if (props.month === undefined) innerView.value = next;
  emit("update:month", next);
}

const minD = computed(() => (props.min ? startOfDay(toDate(props.min)!) : null));
const maxD = computed(() => (props.max ? startOfDay(toDate(props.max)!) : null));
const today = startOfDay(new Date());

function isDisabled(d: Date) {
  const day = startOfDay(d);
  if (minD.value && day < minD.value) return true;
  if (maxD.value && day > maxD.value) return true;
  if (props.disabledDate && props.disabledDate(day)) return true;
  return false;
}

function pick(d: Date) {
  if (isDisabled(d)) return;
  emit("update:modelValue", d);
  emit("change", d);
}

function buildWeeks(viewMonth: Date, weekStartsOn: number) {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(first);
  start.setDate(1 - lead);
  const days: Date[] = [];
  const cur = new Date(start);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

const days = computed(() => buildWeeks(view.value, props.weekStartsOn));
const orderedDays = computed(() => WEEKDAYS.slice(props.weekStartsOn).concat(WEEKDAYS.slice(0, props.weekStartsOn)));

function dayLabel(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
</script>

<template>
  <div class="jl-cal" :class="props.size === 'sm' ? 'jl-cal--sm' : ''">
    <div class="jl-cal__header">
      <button type="button" class="jl-cal__nav" aria-label="Previous month" @click="setView(addMonths(view, -1))">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="jl-cal__title" aria-live="polite">{{ MONTHS[view.getMonth()] }} {{ view.getFullYear() }}</div>
      <button type="button" class="jl-cal__nav" aria-label="Next month" @click="setView(addMonths(view, 1))">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
    <div class="jl-cal__grid" role="grid">
      <div v-for="w in orderedDays" :key="w" class="jl-cal__weekday" role="columnheader">{{ w }}</div>
      <button
        v-for="(d, i) in days"
        :key="i"
        type="button"
        class="jl-cal__day"
        role="gridcell"
        :disabled="isDisabled(d)"
        :data-outside="d.getMonth() !== view.getMonth() || undefined"
        :data-today="sameDay(d, today) || undefined"
        :data-selected="sameDay(d, sel) || undefined"
        :aria-selected="sameDay(d, sel) || undefined"
        :aria-label="dayLabel(d)"
        @click="pick(d)"
      >
        {{ d.getDate() }}
      </button>
    </div>
  </div>
</template>

<style src="./date-picker.css"></style>
