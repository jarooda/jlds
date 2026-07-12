<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

type Row = Record<string, unknown>;

export interface ResponsiveColumn {
  /** Key into the row object. */
  key: string;
  /** Column header / stacked-card field label. */
  header: string;
  /** Right-align + mono tabular figures. */
  numeric?: boolean;
  /** Header/cell text alignment (overrides numeric default). */
  align?: "left" | "center" | "right";
  /** Use as the card title in stacked mode. @default first column */
  primary?: boolean;
  /** Drop this field from the stacked card (keep it table-only). */
  hideOnStack?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** Column definitions, left to right. */
    columns: ResponsiveColumn[];
    /** Row objects. */
    data: Row[];
    /** Stable key per row. @default row.id ?? index */
    rowKey?: (row: Row, index: number) => string | number;
    /** Container width (px) below which it switches to stacked cards. */
    breakpoint?: number;
  }>(),
  {
    rowKey: (row: Row, i: number) => (row.id != null ? (row.id as string | number) : i),
    breakpoint: 560,
  }
);

const emit = defineEmits<{ "row-click": [row: Row] }>();

const wrapRef = ref<HTMLElement | null>(null);
const stacked = ref(false);
let ro: ResizeObserver | null = null;

onMounted(() => {
  const el = wrapRef.value;
  if (!el) return;
  const update = () => (stacked.value = (el.clientWidth || 9999) < props.breakpoint);
  update();
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(update);
    ro.observe(el);
  }
});
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});

const primaryCol = computed(() => props.columns.find((c) => c.primary) || props.columns[0]);
const stackCols = computed(() =>
  props.columns.filter((c) => c !== primaryCol.value && !c.hideOnStack)
);
</script>

<template>
  <div ref="wrapRef" class="jl-rtable">
    <table v-if="!stacked" class="jl-rtable__table">
      <thead>
        <tr>
          <th
            v-for="c in columns"
            :key="c.key"
            :class="c.numeric ? 'jl-rtable--num' : ''"
            :style="{ textAlign: c.align }"
          >
            {{ c.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in data"
          :key="rowKey(row, i)"
          class="jl-rtable__row--clickable"
          @click="emit('row-click', row)"
        >
          <td
            v-for="c in columns"
            :key="c.key"
            :class="c.numeric ? 'jl-rtable--num' : ''"
            :style="{ textAlign: c.align }"
          >
            <slot :name="`cell-${c.key}`" :value="row[c.key]" :row="row">{{ row[c.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="jl-rtable__cards">
      <div
        v-for="(row, i) in data"
        :key="rowKey(row, i)"
        class="jl-rtable__card jl-rtable__card--clickable"
        @click="emit('row-click', row)"
      >
        <div v-if="primaryCol" class="jl-rtable__card-primary">
          <slot :name="`cell-${primaryCol.key}`" :value="row[primaryCol.key]" :row="row">{{
            row[primaryCol.key]
          }}</slot>
        </div>
        <div v-for="c in stackCols" :key="c.key" class="jl-rtable__pair">
          <span class="jl-rtable__k">{{ c.header }}</span>
          <span :class="['jl-rtable__v', c.numeric ? 'jl-rtable__v--num' : '']">
            <slot :name="`cell-${c.key}`" :value="row[c.key]" :row="row">{{ row[c.key] }}</slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="./responsive-table.css"></style>
