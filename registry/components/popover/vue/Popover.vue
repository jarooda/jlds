<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useAnchoredPopup } from "../anchored-popup";

type Side = "bottom" | "top";
type Align = "start" | "center" | "end";

const props = withDefaults(
  defineProps<{
    side?: Side;
    align?: Align;
    arrow?: boolean;
    padded?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
  }>(),
  { side: "bottom", align: "center", arrow: true, padded: true, defaultOpen: false, open: undefined }
);

const emit = defineEmits<{ (e: "update:open", v: boolean): void }>();

const isControlled = computed(() => props.open !== undefined);
const internal = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? props.open! : internal.value));

// The panel is teleported to <body> so a clipping ancestor (a Card's overflow: hidden,
// a scrolling table wrapper) can't crop it, and anchored to the trigger instead.
const { anchorRef, popupRef, contains } = useAnchoredPopup({
  open,
  side: props.side,
  align: props.align,
  gap: 8,
});

function setOpen(v: boolean) {
  if (!isControlled.value) internal.value = v;
  emit("update:open", v);
}
const toggle = () => setOpen(!open.value);
const close = () => setOpen(false);

function onDown(e: MouseEvent) {
  // `contains` covers the teleported panel as well as the trigger.
  if (!contains(e.target as Node)) close();
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}
watch(open, (v) => {
  if (v) {
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
  } else {
    document.removeEventListener("mousedown", onDown);
    document.removeEventListener("keydown", onKey);
  }
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDown);
  document.removeEventListener("keydown", onKey);
});

const origin = computed(() => `${props.side === "top" ? "bottom" : "top"} ${props.align}`);
const popStyle = computed(() => ({
  "--_origin": origin.value,
  "--_pad": props.padded ? undefined : "0",
}));
</script>

<template>
  <span ref="anchorRef" class="jl-popover">
    <span class="jl-popover__trigger" :aria-haspopup="'dialog'" :aria-expanded="open" @click="toggle">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <div
        v-if="open"
        ref="popupRef"
        class="jl-popover__pop"
        role="dialog"
        :data-side="side"
        :data-align="align"
        :style="popStyle"
      >
        <span v-if="arrow" class="jl-popover__arrow" aria-hidden="true" />
        <slot :close="close" />
      </div>
    </Teleport>
  </span>
</template>

<style src="./popover.css"></style>
