<script setup lang="ts">
import { computed } from "vue";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "busy" | "away" | "offline";

const props = withDefaults(
  defineProps<{
    src?: string;
    name?: string;
    size?: AvatarSize | number;
    square?: boolean;
    status?: AvatarStatus;
    ring?: boolean;
  }>(),
  { src: "", name: "", size: "md", square: false, status: undefined, ring: false }
);

const SIZES: Record<AvatarSize, number> = { xs: 22, sm: 28, md: 36, lg: 48, xl: 64 };
const PALETTE = ["#1b8a64", "#2ea67c", "#0ea5e9", "#f59e0b", "#7c5cff", "#ef4444"];

function hashColor(str = ""): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length]!;
}

function initials(name = ""): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]).join("").toUpperCase() || "?";
}

const px = computed(() =>
  typeof props.size === "number" ? props.size : SIZES[props.size] ?? 36
);

const cls = computed(() =>
  [
    "jl-avatar",
    props.square ? "jl-avatar--square" : "",
    props.ring ? "jl-avatar__ring" : "",
  ]
    .filter(Boolean)
    .join(" ")
);

const style = computed(() => ({
  width: `${px.value}px`,
  height: `${px.value}px`,
  fontSize: `${Math.max(10, Math.round(px.value * 0.4))}px`,
  background: props.src ? undefined : hashColor(props.name),
}));
</script>

<template>
  <span :class="cls" :style="style">
    <img v-if="props.src" class="jl-avatar__img" :src="props.src" :alt="props.name" />
    <template v-else>{{ initials(props.name) }}</template>
    <span
      v-if="props.status"
      :class="`jl-avatar__status jl-avatar__status--${props.status}`"
    />
  </span>
</template>

<style src="./avatar.css"></style>
