<script setup lang="ts">
import { computed, useSlots } from "vue";

type BannerTone = "info" | "success" | "warning" | "danger" | "accent" | "neutral";
type BannerVariant = "subtle" | "solid";
type BannerAlign = "left" | "center";

const props = withDefaults(
  defineProps<{
    tone?: BannerTone;
    variant?: BannerVariant;
    title?: string;
    sticky?: boolean;
    align?: BannerAlign;
    dismissible?: boolean;
  }>(),
  { tone: "info", variant: "subtle", sticky: false, align: "left", dismissible: false }
);

const emit = defineEmits<{
  (e: "dismiss"): void;
}>();

const slots = useSlots();

const cls = computed(() =>
  [
    "jl-banner",
    `jl-banner--${props.variant}`,
    `jl-banner--${props.tone}`,
    props.sticky ? "jl-banner--sticky" : "",
    props.align === "center" ? "jl-banner--center" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <div :class="cls" role="status">
    <span v-if="slots.icon" class="jl-banner__icon"><slot name="icon" /></span>
    <span class="jl-banner__content">
      <span v-if="props.title" class="jl-banner__title">{{ props.title }}</span>
      <span v-if="slots.default" class="jl-banner__text"><slot /></span>
    </span>
    <span v-if="slots.action" class="jl-banner__action"><slot name="action" /></span>
    <button
      v-if="props.dismissible"
      type="button"
      class="jl-banner__close"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<style src="./banner.css"></style>
