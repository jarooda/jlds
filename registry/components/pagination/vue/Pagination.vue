<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    page?: number;
    pageCount: number;
    total?: number;
    pageSize?: number;
    siblingCount?: number;
    showSummary?: boolean;
  }>(),
  { page: 1, siblingCount: 1, showSummary: false }
);

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "change", page: number): void;
}>();

function go(p: number) {
  if (p >= 1 && p <= props.pageCount && p !== props.page) {
    emit("update:page", p);
    emit("change", p);
  }
}

const pages = computed<(number | "…")[]>(() => {
  const current = props.page;
  const total = props.pageCount;
  const siblings = props.siblingCount;
  const span = siblings * 2 + 5;
  if (total <= span) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const out: (number | "…")[] = [1];
  if (left > 2) out.push("…");
  for (let p = Math.max(left, 2); p <= Math.min(right, total - 1); p++) out.push(p);
  if (right < total - 1) out.push("…");
  out.push(total);
  return out;
});

const hasSummary = computed(() => props.total != null && props.pageSize != null);
const from = computed(() => (hasSummary.value ? (props.page - 1) * props.pageSize! + 1 : 0));
const to = computed(() => (hasSummary.value ? Math.min(props.page * props.pageSize!, props.total!) : 0));
</script>

<template>
  <nav class="jl-pagination" aria-label="Pagination">
    <div v-if="showSummary && hasSummary" class="jl-pagination__summary">
      <b>{{ from.toLocaleString() }}–{{ to.toLocaleString() }}</b> of <b>{{ total!.toLocaleString() }}</b>
    </div>
    <div v-if="showSummary" class="jl-pagination__spacer" />
    <div class="jl-pagination__list">
      <button
        type="button"
        class="jl-page jl-page--arrow"
        aria-label="Previous page"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <template v-for="(p, i) in pages" :key="typeof p === 'number' ? p : `e${i}`">
        <span v-if="p === '…'" class="jl-page jl-page--ellipsis" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          class="jl-page"
          :aria-current="p === page ? 'page' : undefined"
          :aria-label="`Page ${p}`"
          @click="go(p)"
        >
          {{ p }}
        </button>
      </template>
      <button
        type="button"
        class="jl-page jl-page--arrow"
        aria-label="Next page"
        :disabled="page >= pageCount"
        @click="go(page + 1)"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </div>
  </nav>
</template>

<style src="./pagination.css"></style>
