<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import { useAnchoredPopup } from "../anchored-popup";

type TooltipSide = "top" | "bottom" | "left" | "right";

const props = withDefaults(
  defineProps<{
    content?: string;
    side?: TooltipSide;
    delay?: number;
    /** Controlled open state (`v-model:open`). Omit for uncontrolled hover/focus. */
    open?: boolean;
    /** Render the trigger without any tooltip. @default false */
    disabled?: boolean;
  }>(),
  { content: "", side: "top", delay: 120, disabled: false, open: undefined }
);

const emit = defineEmits<{ "update:open": [value: boolean] }>();

const isControlled = computed(() => props.open !== undefined);
const internal = ref(false);
const show = computed(() => !!(isControlled.value ? props.open : internal.value));

// The bubble is teleported to <body> so a clipping ancestor (a Card's overflow: hidden,
// a scrolling table wrapper) can't crop it, and anchored to the trigger instead. It stays
// mounted — `retainOnClose` keeps the last position so the fade-out plays in place rather
// than jumping. Tooltips are suppressed on touch, so no sheet.
const { anchorRef, popupRef } = useAnchoredPopup({
  open: show,
  side: props.side,
  align: "center",
  gap: 8,
  sheetBreakpoint: 0,
  retainOnClose: true,
});

let timer: ReturnType<typeof setTimeout> | null = null;
function set(v: boolean) {
  if (!isControlled.value) internal.value = v;
  emit("update:open", v);
}
function onEnter() {
  timer = setTimeout(() => set(true), props.delay);
}
function close() {
  if (timer) clearTimeout(timer);
  set(false);
}
onBeforeUnmount(() => timer && clearTimeout(timer));
</script>

<template>
  <span v-if="disabled" class="jl-tooltip">
    <slot />
  </span>
  <span
    v-else
    ref="anchorRef"
    class="jl-tooltip"
    @mouseenter="onEnter"
    @mouseleave="close"
    @focusin="onEnter"
    @focusout="close"
  >
    <slot />
    <Teleport to="body">
      <span
        ref="popupRef"
        class="jl-tooltip__pop"
        role="tooltip"
        :data-side="side"
        :data-show="show || undefined"
      >
        <slot name="content">{{ content }}</slot>
        <span class="jl-tooltip__arrow" />
      </span>
    </Teleport>
  </span>
</template>

<style src="./tooltip.css"></style>
