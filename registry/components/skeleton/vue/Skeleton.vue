<script setup lang="ts">
import { computed } from "vue";

type SkeletonVariant = "text" | "circle" | "rect";

const props = withDefaults(
  defineProps<{
    variant?: SkeletonVariant;
    width?: number | string;
    height?: number | string;
    lines?: number;
    radius?: number | string;
  }>(),
  { variant: "text", lines: 1 }
);

const dim = (v?: number | string) => (typeof v === "number" ? `${v}px` : v);

const isMultiline = computed(() => props.variant === "text" && props.lines > 1);

const resolved = computed(() => {
  const isCircle = props.variant === "circle";
  return {
    width: dim(props.width ?? (isCircle ? 40 : undefined)),
    height: dim(props.height ?? (isCircle ? props.width ?? 40 : undefined)),
    borderRadius: props.radius != null ? dim(props.radius) : undefined,
  };
});
</script>

<template>
  <div v-if="isMultiline" class="jl-skel-lines" aria-hidden="true">
    <span
      v-for="i in props.lines"
      :key="i"
      class="jl-skel jl-skel--text"
      :style="{ width: i === props.lines ? '62%' : (props.width ? dim(props.width) : '100%') }"
    />
  </div>
  <span
    v-else
    class="jl-skel"
    :class="`jl-skel--${props.variant}`"
    :style="resolved"
    aria-hidden="true"
  />
</template>

<style src="./skeleton.css"></style>
