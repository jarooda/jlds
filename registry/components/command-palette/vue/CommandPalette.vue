<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";

interface CommandItem {
  id?: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  shortcut?: string;
  onSelect?: (item: CommandItem) => void;
}

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    shortcut?: string[];
    items: CommandItem[];
    placeholder?: string;
    emptyMessage?: string;
  }>(),
  {
    open: undefined,
    defaultOpen: false,
    shortcut: () => ["mod", "k"],
    placeholder: "Type a command or search…",
    emptyMessage: "No results found.",
  }
);

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "select", item: CommandItem): void;
}>();

const isControlled = computed(() => props.open !== undefined);
const internal = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? props.open! : internal.value));
function setOpen(v: boolean) {
  if (!isControlled.value) internal.value = v;
  emit("update:open", v);
}

const query = ref("");
const active = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

function match(it: CommandItem, q: string) {
  if (!q) return true;
  const hay = [it.label, it.hint, it.group, ...(it.keywords || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}
const groups = computed(() => {
  const gs: { name: string; items: CommandItem[] }[] = [];
  props.items
    .filter((it) => match(it, query.value))
    .forEach((it) => {
      const name = it.group || "";
      let g = gs.find((x) => x.name === name);
      if (!g) {
        g = { name, items: [] };
        gs.push(g);
      }
      g.items.push(it);
    });
  return gs;
});
const flat = computed(() => groups.value.flatMap((g) => g.items));

function select(it?: CommandItem) {
  if (!it || it.disabled) return;
  setOpen(false);
  query.value = "";
  it.onSelect?.(it);
  emit("select", it);
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    active.value = Math.min(flat.value.length - 1, active.value + 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    active.value = Math.max(0, active.value - 1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    select(flat.value[active.value]);
  } else if (e.key === "Escape") {
    e.preventDefault();
    setOpen(false);
  }
}

watch([query, open], () => (active.value = 0));

function onGlobalKey(e: KeyboardEvent) {
  const wantMod = props.shortcut.some((k) => ["mod", "cmd", "meta", "ctrl"].includes(k));
  const key = props.shortcut[props.shortcut.length - 1];
  if (!key) return;
  if ((!wantMod || e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key.toLowerCase()) {
    e.preventDefault();
    setOpen(!open.value);
  }
}
onMounted(() => document.addEventListener("keydown", onGlobalKey));
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onGlobalKey);
  document.body.style.overflow = "";
});

watch(open, (v) => {
  if (v) {
    document.body.style.overflow = "hidden";
    nextTick(() => inputRef.value?.focus());
  } else {
    document.body.style.overflow = "";
  }
});

function flatIndex(it: CommandItem) {
  return flat.value.indexOf(it);
}
</script>

<template>
  <div
    v-if="open"
    class="jl-cmdk__overlay"
    @mousedown.self="setOpen(false)"
  >
    <div class="jl-cmdk" role="dialog" aria-modal="true" aria-label="Command palette" @keydown="onKeyDown">
      <div class="jl-cmdk__search">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.75" />
          <path d="m20 20-3.6-3.6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
        </svg>
        <input
          ref="inputRef"
          v-model="query"
          class="jl-cmdk__input"
          :placeholder="placeholder"
          aria-label="Search commands"
        />
      </div>

      <div ref="listRef" class="jl-cmdk__list" role="listbox">
        <div v-if="flat.length === 0" class="jl-cmdk__empty">{{ emptyMessage }}</div>
        <div v-for="g in groups" :key="g.name || '_'" role="group" :aria-label="g.name || undefined">
          <div v-if="g.name" class="jl-cmdk__group-label">{{ g.name }}</div>
          <div
            v-for="it in g.items"
            :key="it.id ?? it.label"
            class="jl-cmdk__item"
            role="option"
            :aria-selected="flatIndex(it) === active"
            :aria-disabled="it.disabled || undefined"
            :data-active="flatIndex(it) === active"
            @mousemove="active = flatIndex(it)"
            @click="select(it)"
          >
            <span class="jl-cmdk__item-text">
              <span class="jl-cmdk__item-label">{{ it.label }}</span>
              <span v-if="it.hint" class="jl-cmdk__item-hint">{{ it.hint }}</span>
            </span>
            <span v-if="it.shortcut" class="jl-cmdk__item-trail">{{ it.shortcut }}</span>
          </div>
        </div>
      </div>

      <div class="jl-cmdk__footer">
        <slot name="footer">
          <span class="jl-cmdk__footer-hint"><kbd class="jl-cmdk__key">↑↓</kbd> navigate</span>
          <span class="jl-cmdk__footer-hint"><kbd class="jl-cmdk__key">↵</kbd> select</span>
          <span class="jl-cmdk__footer-hint"><kbd class="jl-cmdk__key">esc</kbd> close</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<style src="./command-palette.css"></style>
