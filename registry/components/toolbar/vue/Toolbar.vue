<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";

export interface ToolbarItem {
  /** Stable id (also used as the icon-only aria-label fallback). */
  id?: string;
  /** Render a vertical rule instead of a button. */
  type?: "button" | "separator";
  /** Button text. Omit for an icon-only button. */
  label?: string;
  /** Inline SVG/HTML markup for the icon (rendered with v-html). */
  icon?: string;
  /** Tooltip / accessible name — used for icon-only buttons and overflow labels. */
  tooltip?: string;
  /** Toggle state — renders a pressed (accent) style. */
  active?: boolean;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** Actions, in priority order — the first items survive longest as width shrinks. */
    items: ToolbarItem[];
    /** Stretch to fill the parent width. */
    block?: boolean;
    /** Accessible label for the overflow button. */
    moreLabel?: string;
  }>(),
  { block: false, moreLabel: "More" }
);

const emit = defineEmits<{ select: [item: ToolbarItem] }>();

const wrapRef = ref<HTMLElement | null>(null);
const ghostRef = ref<HTMLElement | null>(null);
const visibleCount = ref(props.items.length);
const open = ref(false);

function measure() {
  const wrap = wrapRef.value;
  const ghost = ghostRef.value;
  if (!wrap || !ghost) return;
  const avail = wrap.clientWidth - 8;
  const kids = Array.from(ghost.children) as HTMLElement[];
  const widths = kids.map((k) => k.getBoundingClientRect().width + 4);
  const total = widths.reduce((a, b) => a + b, 0);
  if (total <= avail) {
    visibleCount.value = props.items.length;
    return;
  }
  const moreW = 44;
  let used = moreW;
  let n = 0;
  for (let i = 0; i < widths.length; i++) {
    used += widths[i] ?? 0;
    if (used > avail) break;
    n++;
  }
  while (n > 0) {
    const prevItem = props.items[n - 1];
    if (prevItem && prevItem.type === "separator") n--;
    else break;
  }
  visibleCount.value = n;
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  measure();
  if (wrapRef.value && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => measure());
    ro.observe(wrapRef.value);
  }
});
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  document.removeEventListener("mousedown", onDoc);
  document.removeEventListener("keydown", onKey);
});
watch(() => props.items, () => nextTick(measure), { deep: true });

function onDoc(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) open.value = false;
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") open.value = false;
}
watch(open, (o) => {
  if (o) {
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
  } else {
    document.removeEventListener("mousedown", onDoc);
    document.removeEventListener("keydown", onKey);
  }
});

const shown = computed(() => props.items.slice(0, visibleCount.value));
const overflow = computed(() =>
  props.items.slice(visibleCount.value).filter((it) => it.type !== "separator")
);

function iconOnly(it: ToolbarItem) {
  return !!it.icon && !it.label;
}
function pick(it: ToolbarItem) {
  emit("select", it);
  open.value = false;
}
</script>

<template>
  <div
    ref="wrapRef"
    :class="['jl-toolbar', block ? 'jl-toolbar--block' : '']"
    role="toolbar"
  >
    <template v-for="(it, i) in shown" :key="it.id || `sep${i}`">
      <span v-if="it.type === 'separator'" class="jl-toolbar__sep" aria-hidden="true" />
      <button
        v-else
        type="button"
        :class="['jl-toolbar__btn', iconOnly(it) ? 'jl-toolbar__btn--icon' : '']"
        :disabled="it.disabled"
        :aria-pressed="it.active != null ? !!it.active : undefined"
        :aria-label="iconOnly(it) ? it.tooltip || it.id : undefined"
        :title="it.tooltip"
        @click="pick(it)"
      >
        <!-- eslint-disable-next-line vue/no-v-html -- icon is developer-authored inline SVG markup, not user input -->
        <span v-if="it.icon" style="display: contents" v-html="it.icon" />
        <span v-if="it.label">{{ it.label }}</span>
      </button>
    </template>

    <div v-if="overflow.length" class="jl-toolbar__more" style="margin-left: auto">
      <button
        type="button"
        class="jl-toolbar__btn jl-toolbar__btn--icon"
        :aria-label="moreLabel"
        aria-haspopup="menu"
        :aria-expanded="open"
        :title="moreLabel"
        @click="open = !open"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>
      <div v-if="open" class="jl-toolbar__menu" role="menu">
        <button
          v-for="(it, i) in overflow"
          :key="it.id || i"
          type="button"
          role="menuitem"
          class="jl-toolbar__mitem"
          :disabled="it.disabled"
          :aria-pressed="it.active != null ? !!it.active : undefined"
          @click="pick(it)"
        >
          <!-- eslint-disable-next-line vue/no-v-html -- icon is developer-authored inline SVG markup, not user input -->
          <span v-if="it.icon" style="display: contents" v-html="it.icon" />
          <span>{{ it.label || it.tooltip || it.id }}</span>
        </button>
      </div>
    </div>

    <!-- hidden measuring clone: always all items at natural width -->
    <div ref="ghostRef" class="jl-toolbar__ghost" aria-hidden="true">
      <template v-for="(it, i) in items" :key="`g${it.id || i}`">
        <span v-if="it.type === 'separator'" class="jl-toolbar__sep" />
        <button
          v-else
          type="button"
          :class="['jl-toolbar__btn', iconOnly(it) ? 'jl-toolbar__btn--icon' : '']"
        >
          <!-- eslint-disable-next-line vue/no-v-html -- icon is developer-authored inline SVG markup, not user input -->
          <span v-if="it.icon" style="display: contents" v-html="it.icon" />
          <span v-if="it.label">{{ it.label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<style src="./toolbar.css"></style>
