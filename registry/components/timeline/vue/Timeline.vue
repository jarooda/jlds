<script setup lang="ts">
import { computed } from "vue";

type TimelineTone = "accent" | "success" | "warning" | "danger" | "info" | "muted";
type TimelineSize = "sm" | "md";

interface TimelineItemData {
  id?: string | number;
  title?: string;
  time?: string;
  description?: string;
  tone?: TimelineTone;
}

const props = withDefaults(
  defineProps<{
    /** Data-driven entries. Omit when composing with <TimelineItem>. */
    items?: TimelineItemData[];
    size?: TimelineSize;
  }>(),
  { items: () => [], size: "md" }
);

const cls = computed(() => ["jl-timeline", props.size === "sm" ? "jl-timeline--sm" : ""].filter(Boolean));
</script>

<template>
  <ol class="jl-timeline" :class="cls">
    <slot>
      <li v-for="(it, i) in props.items" :key="it.id ?? i" class="jl-timeline__item">
        <div class="jl-timeline__rail">
          <span class="jl-timeline__dot" :data-tone="it.tone || 'muted'" data-plain="true" aria-hidden="true" />
          <span class="jl-timeline__line" aria-hidden="true" />
        </div>
        <div class="jl-timeline__body">
          <div class="jl-timeline__head">
            <span v-if="it.title != null" class="jl-timeline__title">{{ it.title }}</span>
            <span v-if="it.time != null" class="jl-timeline__time">{{ it.time }}</span>
          </div>
          <div v-if="it.description != null" class="jl-timeline__desc">{{ it.description }}</div>
        </div>
      </li>
    </slot>
  </ol>
</template>

<style src="./timeline.css"></style>
