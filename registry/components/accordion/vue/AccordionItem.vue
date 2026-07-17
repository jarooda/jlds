<script setup lang="ts">
import { inject, computed, type Ref } from "vue";

const props = withDefaults(
  defineProps<{ value: string; title?: string; disabled?: boolean }>(),
  { title: "", disabled: false }
);

const ctx = inject<{ open: Ref<string[]>; toggle: (v: string) => void }>("jlAccordion")!;
const isOpen = computed(() => ctx.open.value.includes(props.value));
const id = `jlacc-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <div class="jl-acc-item" :data-open="isOpen || undefined">
    <h3 style="margin: 0">
      <button
        type="button"
        class="jl-acc-trigger"
        :aria-expanded="isOpen"
        :aria-controls="id"
        :disabled="disabled"
        @click="ctx.toggle(value)"
      >
        <span v-if="$slots.icon" class="jl-acc-trigger__icon"><slot name="icon" /></span>
        <span class="jl-acc-trigger__label">{{ title }}</span>
        <span v-if="$slots.meta" class="jl-acc-trigger__meta"><slot name="meta" /></span>
        <span class="jl-acc-trigger__chevron">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </button>
    </h3>
    <div :id="id" class="jl-acc-region" role="region">
      <div class="jl-acc-content"><div class="jl-acc-content__inner"><slot /></div></div>
    </div>
  </div>
</template>
