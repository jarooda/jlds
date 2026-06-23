<script setup lang="ts">
import { computed } from "vue";

type Step = string | { label: string; description?: string };

const props = withDefaults(
  defineProps<{
    steps: Step[];
    active?: number;
    orientation?: "horizontal" | "vertical";
    size?: "sm" | "md";
    clickable?: boolean;
  }>(),
  { active: 0, orientation: "horizontal", size: "md", clickable: false }
);

const emit = defineEmits<{ (e: "step-click", index: number, step: Step): void }>();

const norm = computed(() =>
  props.steps.map((s) => (typeof s === "string" ? { label: s } : s))
);

function stateOf(i: number) {
  return i < props.active ? "completed" : i === props.active ? "current" : "upcoming";
}

const cls = computed(() =>
  [
    "jl-stepper",
    `jl-stepper--${props.orientation}`,
    props.size === "sm" ? "jl-stepper--sm" : "",
  ]
    .filter(Boolean)
    .join(" ")
);
</script>

<template>
  <ol :class="cls">
    <li v-for="(s, i) in norm" :key="i" class="jl-step" :data-state="stateOf(i)">
      <div class="jl-step__indicator">
        <component
          :is="clickable ? 'button' : 'span'"
          class="jl-step__marker"
          :type="clickable ? 'button' : undefined"
          :aria-current="stateOf(i) === 'current' ? 'step' : undefined"
          @click="clickable && emit('step-click', i, steps[i])"
        >
          <svg v-if="stateOf(i) === 'completed'" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <template v-else>{{ i + 1 }}</template>
        </component>
        <span v-if="i < norm.length - 1" class="jl-step__line" aria-hidden="true" />
      </div>
      <div class="jl-step__body">
        <div class="jl-step__label">{{ s.label }}</div>
        <div v-if="s.description" class="jl-step__desc">{{ s.description }}</div>
      </div>
    </li>
  </ol>
</template>

<style src="./stepper.css"></style>
