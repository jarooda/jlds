<script setup lang="ts">
import { provide, computed, toRef, type CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    collapsed?: boolean;
    width?: number | string;
    collapsedWidth?: number | string;
  }>(),
  { collapsed: false, width: 260, collapsedWidth: 68 }
);

provide("jlSidebar", { collapsed: toRef(props, "collapsed") });

const vars = computed<CSSProperties>(() => ({
  "--_w": typeof props.width === "number" ? `${props.width}px` : props.width,
  "--_cw":
    typeof props.collapsedWidth === "number" ? `${props.collapsedWidth}px` : props.collapsedWidth,
}) as CSSProperties);
</script>

<template>
  <aside class="jl-sidebar" :data-collapsed="collapsed || undefined" :style="vars">
    <slot />
  </aside>
</template>

<style src="./sidebar.css"></style>
