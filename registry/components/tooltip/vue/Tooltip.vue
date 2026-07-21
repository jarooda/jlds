<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";

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
const show = computed(() => (isControlled.value ? props.open : internal.value));

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
    class="jl-tooltip"
    @mouseenter="onEnter"
    @mouseleave="close"
    @focusin="onEnter"
    @focusout="close"
  >
    <slot />
    <span class="jl-tooltip__pop" role="tooltip" :data-side="side" :data-show="show || undefined">
      <slot name="content">{{ content }}</slot>
      <span class="jl-tooltip__arrow" />
    </span>
  </span>
</template>

<style src="./tooltip.css"></style>
