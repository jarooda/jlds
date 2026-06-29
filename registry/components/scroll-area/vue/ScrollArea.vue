<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, type CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    axis?: "x" | "y" | "both";
    maxHeight?: number | string;
    fade?: boolean;
    fadeColor?: string;
  }>(),
  { axis: "y", maxHeight: undefined, fade: false, fadeColor: undefined }
);

const emit = defineEmits<{ (e: "scroll", ev: Event): void }>();

const viewport = ref<HTMLDivElement | null>(null);
const edges = ref({ top: false, bottom: false });
let ro: ResizeObserver | null = null;

function update() {
  const el = viewport.value;
  if (!el || !props.fade) return;
  const { scrollTop, scrollHeight, clientHeight } = el;
  edges.value = {
    top: scrollTop > 1,
    bottom: scrollTop + clientHeight < scrollHeight - 1,
  };
}

function handleScroll(ev: Event) {
  if (props.fade) update();
  emit("scroll", ev);
}

function setup() {
  teardown();
  if (!props.fade) return;
  update();
  const el = viewport.value;
  if (!el) return;
  ro = new ResizeObserver(update);
  ro.observe(el);
  if (el.firstElementChild) ro.observe(el.firstElementChild);
}

function teardown() {
  if (ro) {
    ro.disconnect();
    ro = null;
  }
}

onMounted(setup);
onBeforeUnmount(teardown);
watch(() => props.fade, setup);

defineExpose({ viewport });

const cls = computed(() => ["jl-scrollarea", `jl-scrollarea--${props.axis}`].join(" "));
const rootStyle = computed<CSSProperties>(() =>
  props.fadeColor ? ({ "--_fade-bg": props.fadeColor } as CSSProperties) : {}
);
const viewportStyle = computed<CSSProperties | undefined>(() =>
  props.maxHeight != null ? { maxHeight: props.maxHeight } : undefined
);
</script>

<template>
  <div
    :class="cls"
    :style="rootStyle"
    :data-fade-top="fade && edges.top ? 'true' : undefined"
    :data-fade-bottom="fade && edges.bottom ? 'true' : undefined"
  >
    <div v-if="fade" class="jl-scrollarea__fade jl-scrollarea__fade--top" />
    <div ref="viewport" class="jl-scrollarea__viewport" :style="viewportStyle" @scroll="handleScroll">
      <slot />
    </div>
    <div v-if="fade" class="jl-scrollarea__fade jl-scrollarea__fade--bottom" />
  </div>
</template>

<style src="./scroll-area.css"></style>
