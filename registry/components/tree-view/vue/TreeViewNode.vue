<script setup lang="ts">
import { inject, computed, ref, watch, onBeforeUnmount } from "vue";
import type { TreeNode, TreeCtx } from "./types";

const props = defineProps<{ node: TreeNode; depth: number }>();

const ctx = inject<TreeCtx>("jlTree")!;
const rowEl = ref<HTMLElement | null>(null);

const hasKids = computed(() => !!(props.node.children && props.node.children.length));
const isOpen = computed(() => ctx.expandedSet.value.has(props.node.id));
const isSel = computed(() => ctx.selected.value === props.node.id);

const isDefaultFocus = computed(() => {
  const v = ctx.visible.value;
  return (
    ctx.selected.value === props.node.id ||
    (ctx.selected.value == null && v[0] && v[0].node.id === props.node.id)
  );
});
const tabIndex = computed(() =>
  (ctx.focusId.value == null ? isDefaultFocus.value : ctx.focusId.value === props.node.id) ? 0 : -1
);

watch(rowEl, (el) => ctx.registerRow(props.node.id, el));
onBeforeUnmount(() => ctx.registerRow(props.node.id, null));

const padStyle = computed(() =>
  ctx.guides.value ? undefined : { paddingLeft: `calc(${props.depth} * 16px + var(--space-2))` }
);

function onClick() {
  if (props.node.disabled) return;
  if (hasKids.value) ctx.toggle(props.node.id);
  ctx.select(props.node);
  ctx.setFocus(props.node.id);
}
</script>

<template>
  <li class="jl-tree__li" role="none">
    <div
      ref="rowEl"
      class="jl-tree__row"
      role="treeitem"
      :data-id="node.id"
      :data-selected="isSel || undefined"
      :data-expanded="hasKids ? isOpen : undefined"
      :aria-expanded="hasKids ? isOpen : undefined"
      :aria-selected="isSel"
      :aria-disabled="node.disabled || undefined"
      :tabindex="tabIndex"
      :style="padStyle"
      @click="onClick"
      @keydown="ctx.onKeydown($event, { node, depth })"
    >
      <span :class="['jl-tree__twist', hasKids ? '' : 'jl-tree__twist--leaf']">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <!-- eslint-disable-next-line vue/no-v-html -- icon is developer-authored inline SVG markup, not user input -->
      <span v-if="node.icon" class="jl-tree__icon" v-html="node.icon"></span>
      <span class="jl-tree__label">{{ node.label }}</span>
      <span v-if="node.trailing != null" class="jl-tree__trail">{{ node.trailing }}</span>
    </div>
    <ul v-if="hasKids && isOpen" class="jl-tree__group" role="group">
      <TreeViewNode v-for="child in node.children" :key="child.id" :node="child" :depth="depth + 1" />
    </ul>
  </li>
</template>
