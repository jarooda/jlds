<script setup lang="ts">
import { useSlots } from "vue";

type TimelineTone = "accent" | "success" | "warning" | "danger" | "info" | "muted";

const props = withDefaults(
  defineProps<{
    title?: string;
    time?: string;
    description?: string;
    tone?: TimelineTone;
    /** Render a small dot instead of a full-size marker (for compact, icon-less feeds). */
    plain?: boolean;
  }>(),
  { title: undefined, time: undefined, description: undefined, tone: "muted", plain: false }
);

const slots = useSlots();
</script>

<template>
  <li class="jl-timeline__item">
    <div class="jl-timeline__rail">
      <span class="jl-timeline__dot" :data-tone="props.tone" :data-plain="props.plain || undefined" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span class="jl-timeline__line" aria-hidden="true" />
    </div>
    <div class="jl-timeline__body">
      <div class="jl-timeline__head">
        <span v-if="props.title != null" class="jl-timeline__title">{{ props.title }}</span>
        <span v-if="props.time != null" class="jl-timeline__time">{{ props.time }}</span>
      </div>
      <div v-if="props.description != null" class="jl-timeline__desc">{{ props.description }}</div>
      <div v-if="slots.default" class="jl-timeline__extra"><slot /></div>
    </div>
  </li>
</template>

<style src="./timeline.css"></style>
