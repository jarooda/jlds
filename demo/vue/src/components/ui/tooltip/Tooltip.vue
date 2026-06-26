<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

type TooltipSide = "top" | "bottom" | "left" | "right";

const props = withDefaults(
  defineProps<{ content?: string; side?: TooltipSide; delay?: number }>(),
  { content: "", side: "top", delay: 120 }
);

const show = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

function open() {
  timer = setTimeout(() => (show.value = true), props.delay);
}
function close() {
  if (timer) clearTimeout(timer);
  show.value = false;
}
onBeforeUnmount(() => timer && clearTimeout(timer));
</script>

<template>
  <span class="jl-tooltip" @mouseenter="open" @mouseleave="close" @focusin="open" @focusout="close">
    <slot />
    <span class="jl-tooltip__pop" role="tooltip" :data-side="side" :data-show="show || undefined">
      <slot name="content">{{ content }}</slot>
      <span class="jl-tooltip__arrow" />
    </span>
  </span>
</template>

<style src="./tooltip.css"></style>
