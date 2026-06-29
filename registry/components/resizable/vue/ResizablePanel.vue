<script setup lang="ts">
import { inject, computed, type CSSProperties } from "vue";
import type { ResizableCtx } from "./Resizable.vue";

const props = withDefaults(
  defineProps<{ defaultSize?: number; minSize?: number }>(),
  { defaultSize: undefined, minSize: undefined }
);

const ctx = inject<ResizableCtx>("jlResizable")!;
const index = ctx.register({ defaultSize: props.defaultSize, minSize: props.minSize });

const size = computed(() =>
  ctx.sizes.value[index] != null ? ctx.sizes.value[index] : 100 / ctx.count.value
);
const panelStyle = computed<CSSProperties>(() => ({
  flexBasis: `${size.value}%`,
  flexGrow: 0,
  flexShrink: 0,
}));
const isLast = computed(() => index >= ctx.count.value - 1);
</script>

<template>
  <div class="jl-resizable__panel" :style="panelStyle"><slot /></div>
  <div
    v-if="!isLast"
    class="jl-resizable__handle"
    role="separator"
    tabindex="0"
    :aria-orientation="ctx.horizontal.value ? 'vertical' : 'horizontal'"
    :aria-valuenow="Math.round(size)"
    @pointerdown="ctx.startDrag($event, index)"
    @pointermove="ctx.onMove($event)"
    @pointerup="ctx.endDrag($event)"
    @pointercancel="ctx.endDrag($event)"
    @keydown="ctx.onKey($event, index)"
  >
    <span class="jl-resizable__grip"><span /><span /><span /></span>
  </div>
</template>
