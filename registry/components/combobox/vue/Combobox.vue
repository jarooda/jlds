<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, type Component } from "vue";

interface Opt { value: string; label: string; icon?: Component; group?: string; disabled?: boolean }
type OptionInput = string | Opt;

const props = withDefaults(
  defineProps<{
    options: OptionInput[];
    modelValue?: string | string[] | null;
    multiple?: boolean;
    creatable?: boolean;
    loading?: boolean;
    placeholder?: string;
    emptyMessage?: string;
    loadingMessage?: string;
    clearable?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    modelValue: null,
    multiple: false,
    creatable: false,
    loading: false,
    placeholder: "Select…",
    emptyMessage: "No results.",
    loadingMessage: "Loading…",
    clearable: false,
    disabled: false,
    invalid: false,
    size: "md",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string | string[] | null): void;
  (e: "inputChange", q: string): void;
}>();

const norm = (o: OptionInput): Opt => (typeof o === "string" ? { value: o, label: o } : o);
const opts = computed(() => props.options.map(norm));

const open = ref(false);
const query = ref("");
const active = ref(0);
const root = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const selected = computed(() =>
  props.multiple ? ((props.modelValue as string[]) || []) : props.modelValue
);
function setValue(v: string | string[] | null) {
  emit("update:modelValue", v);
}
function labelFor(val: string) {
  const o = opts.value.find((x) => x.value === val);
  return o ? o.label : val;
}
function isSel(val: string) {
  return props.multiple ? ((selected.value as string[]) || []).includes(val) : selected.value === val;
}

const filtered = computed(() =>
  opts.value.filter((o) => String(o.label).toLowerCase().includes(query.value.toLowerCase()))
);
const showCreate = computed(
  () =>
    props.creatable &&
    !!query.value.trim() &&
    !opts.value.some((o) => String(o.label).toLowerCase() === query.value.trim().toLowerCase())
);
const groups = computed(() => {
  const gs: { name: string; items: Opt[] }[] = [];
  filtered.value.forEach((o) => {
    const g = o.group || "";
    let e = gs.find((x) => x.name === g);
    if (!e) {
      e = { name: g, items: [] };
      gs.push(e);
    }
    e.items.push(o);
  });
  return gs;
});
const flatCount = computed(() => filtered.value.length + (showCreate.value ? 1 : 0));

watch([query, open], () => (active.value = 0));

const hasValue = computed(() =>
  props.multiple
    ? ((selected.value as string[]) || []).length > 0
    : selected.value != null && selected.value !== ""
);

function openPop() {
  if (!props.disabled) open.value = true;
}
function close() {
  open.value = false;
  query.value = "";
  emit("inputChange", "");
}
function choose(o: Opt) {
  if (!o || o.disabled) return;
  if (props.multiple) {
    const arr = (selected.value as string[]) || [];
    setValue(arr.includes(o.value) ? arr.filter((v) => v !== o.value) : [...arr, o.value]);
    query.value = "";
    emit("inputChange", "");
    inputRef.value?.focus();
  } else {
    setValue(o.value);
    close();
  }
}
function create() {
  const label = query.value.trim();
  if (!label) return;
  if (props.multiple) {
    const arr = (selected.value as string[]) || [];
    if (!arr.includes(label)) setValue([...arr, label]);
    query.value = "";
    emit("inputChange", "");
  } else {
    setValue(label);
    close();
  }
}
function removeChip(val: string) {
  setValue(((selected.value as string[]) || []).filter((v) => v !== val));
}
function onInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value;
  if (!open.value) open.value = true;
  emit("inputChange", query.value);
}
function flatItemAt(i: number): { type: "opt"; o: Opt } | { type: "create" } | null {
  if (i < filtered.value.length) return { type: "opt", o: filtered.value[i] };
  if (showCreate.value && i === filtered.value.length) return { type: "create" };
  return null;
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!open.value) return openPop();
    active.value = Math.min(flatCount.value - 1, active.value + 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    active.value = Math.max(0, active.value - 1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    const item = flatItemAt(active.value);
    if (!item) return;
    if (item.type === "create") create();
    else choose(item.o);
  } else if (e.key === "Escape") {
    if (open.value) {
      e.preventDefault();
      close();
    }
  } else if (e.key === "Backspace" && props.multiple && !query.value && ((selected.value as string[]) || []).length) {
    setValue(((selected.value as string[]) || []).slice(0, -1));
  }
}

function onDoc(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) close();
}
watch(open, (v) => {
  if (v) document.addEventListener("mousedown", onDoc);
  else document.removeEventListener("mousedown", onDoc);
});
onBeforeUnmount(() => document.removeEventListener("mousedown", onDoc));

// flat index per option for active highlighting
function optIndex(o: Opt) {
  return filtered.value.indexOf(o);
}

const cls = computed(() =>
  [
    "jl-combobox",
    `jl-combobox--${props.size}`,
    open.value ? "jl-combobox--open" : "",
    props.disabled ? "jl-combobox--disabled" : "",
    props.invalid ? "jl-combobox--invalid" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div ref="root" :class="cls">
    <div class="jl-combobox__control" @click="openPop(); inputRef?.focus()">
      <span v-for="val in (multiple ? (selected as string[]) || [] : [])" :key="val" class="jl-combobox__chip">
        {{ labelFor(val) }}
        <button type="button" class="jl-combobox__chip-x" :aria-label="`Remove ${val}`" @click.stop="removeChip(val)">
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
        </button>
      </span>
      <span class="jl-combobox__field">
        <span
          v-if="!multiple && !query"
          class="jl-combobox__single"
          :class="{ 'jl-combobox__single--placeholder': !hasValue }"
          style="position:absolute;pointer-events:none;left:0;right:0"
        >{{ hasValue ? labelFor(selected as string) : placeholder }}</span>
        <input
          ref="inputRef"
          class="jl-combobox__input"
          :value="query"
          :placeholder="multiple && !((selected as string[]) || []).length ? placeholder : ''"
          :disabled="disabled"
          role="combobox"
          :aria-expanded="open"
          aria-autocomplete="list"
          @input="onInput"
          @focus="openPop"
          @keydown="onKeyDown"
        />
      </span>
      <span class="jl-combobox__adorn">
        <span v-if="loading" class="jl-combobox__spinner" aria-hidden="true" />
        <button v-if="clearable && hasValue && !loading" type="button" class="jl-combobox__btn" aria-label="Clear" @click.stop="setValue(multiple ? [] : null)">
          <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
        </button>
        <span class="jl-combobox__btn jl-combobox__chevron" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </span>
    </div>

    <div v-if="open" class="jl-combobox__pop" role="listbox">
      <div v-if="loading" class="jl-combobox__loading"><span class="jl-combobox__spinner" />{{ loadingMessage }}</div>
      <div v-else-if="flatCount === 0" class="jl-combobox__empty">{{ emptyMessage }}</div>
      <template v-else>
        <div v-for="g in groups" :key="g.name || '_'" role="group">
          <div v-if="g.name" class="jl-combobox__group-label">{{ g.name }}</div>
          <div
            v-for="o in g.items"
            :key="o.value"
            class="jl-combobox__opt"
            role="option"
            :aria-selected="isSel(o.value)"
            :aria-disabled="o.disabled || undefined"
            :data-active="optIndex(o) === active"
            @mousemove="active = optIndex(o)"
            @click="choose(o)"
          >
            <span v-if="o.icon" class="jl-combobox__opt-icon"><component :is="o.icon" /></span>
            <span class="jl-combobox__opt-label">{{ o.label }}</span>
            <span v-if="isSel(o.value)" class="jl-combobox__opt-check">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
          </div>
        </div>
        <div
          v-if="showCreate"
          class="jl-combobox__opt"
          role="option"
          :data-active="filtered.length === active"
          @mousemove="active = filtered.length"
          @click="create"
        >
          <span class="jl-combobox__create-mark">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
          </span>
          <span class="jl-combobox__opt-label">Create “{{ query.trim() }}”</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style src="./combobox.css"></style>
