<script setup lang="ts">
import { ref, computed } from "vue";

interface BreadcrumbItemData {
  label: string;
  href?: string;
  current?: boolean;
}

const props = withDefaults(
  defineProps<{
    items?: BreadcrumbItemData[];
    separator?: "chevron" | "slash";
    maxItems?: number;
  }>(),
  { separator: "chevron", maxItems: 0 }
);

const expanded = ref(false);

type RenderItem = BreadcrumbItemData & { _ellipsis?: boolean };

const list = computed<RenderItem[]>(() => {
  const items = props.items ?? [];
  if (props.maxItems > 0 && items.length > props.maxItems && !expanded.value) {
    return [items[0], { _ellipsis: true, label: "" }, ...items.slice(items.length - (props.maxItems - 1))];
  }
  return items;
});

function isCurrent(it: RenderItem, i: number): boolean {
  return i === list.value.length - 1 || !!it.current || !it.href;
}
</script>

<template>
  <nav class="jl-breadcrumb" aria-label="Breadcrumb">
    <ol class="jl-breadcrumb__list">
      <li v-for="(it, i) in list" :key="i" class="jl-breadcrumb__item">
        <button
          v-if="it._ellipsis"
          type="button"
          class="jl-breadcrumb__ellipsis"
          aria-label="Show all"
          @click="expanded = true"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="19" cy="12" r="1.6" fill="currentColor" /></svg>
        </button>
        <span v-else-if="isCurrent(it, i)" class="jl-breadcrumb__current" aria-current="page">{{ it.label }}</span>
        <a v-else class="jl-breadcrumb__link" :href="it.href">{{ it.label }}</a>

        <span
          v-if="i < list.length - 1"
          class="jl-breadcrumb__sep"
          :class="{ 'jl-breadcrumb__sep--slash': separator === 'slash' }"
          aria-hidden="true"
        >
          <template v-if="separator === 'slash'">/</template>
          <svg v-else viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style src="./breadcrumb.css"></style>
