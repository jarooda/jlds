<script setup lang="ts">
import { ref, computed, provide } from "vue";
import TreeViewNode from "./TreeViewNode.vue";
import type { TreeNode, TreeEntry, TreeCtx } from "./types";

const props = withDefaults(
  defineProps<{
    items?: TreeNode[];
    expanded?: string[];
    defaultExpanded?: string[];
    selected?: string | null;
    defaultSelected?: string | null;
    guides?: boolean;
  }>(),
  {
    items: () => [],
    expanded: undefined,
    defaultExpanded: () => [],
    selected: undefined,
    defaultSelected: null,
    guides: true,
  }
);

const emit = defineEmits<{
  (e: "update:expanded", value: string[]): void;
  (e: "update:selected", value: string): void;
  (e: "select", id: string, node: TreeNode): void;
}>();

const expInternal = ref<string[]>(props.defaultExpanded);
const selInternal = ref<string | null>(props.defaultSelected);
const expControlled = computed(() => props.expanded != null);
const selControlled = computed(() => props.selected != null);
const expanded = computed(() => (expControlled.value ? props.expanded! : expInternal.value));
const selected = computed(() => (selControlled.value ? props.selected! : selInternal.value));
const expandedSet = computed(() => new Set(expanded.value));

const focusId = ref<string | null>(null);
const rowRefs = new Map<string, HTMLElement>();

function flatten(nodes: TreeNode[], depth = 0, out: TreeEntry[] = []): TreeEntry[] {
  for (const n of nodes) {
    out.push({ node: n, depth });
    if (n.children && n.children.length && expandedSet.value.has(n.id))
      flatten(n.children, depth + 1, out);
  }
  return out;
}
const visible = computed(() => flatten(props.items));

function toggle(id: string) {
  const next = expandedSet.value.has(id)
    ? expanded.value.filter((x) => x !== id)
    : [...expanded.value, id];
  if (!expControlled.value) expInternal.value = next;
  emit("update:expanded", next);
}
function select(node: TreeNode) {
  if (!selControlled.value) selInternal.value = node.id;
  emit("update:selected", node.id);
  emit("select", node.id, node);
}
function registerRow(id: string, el: HTMLElement | null) {
  if (el) rowRefs.set(id, el);
  else rowRefs.delete(id);
}
function focusRow(id: string) {
  focusId.value = id;
  rowRefs.get(id)?.focus();
}
function onKeydown(e: KeyboardEvent, entry: TreeEntry) {
  const { node } = entry;
  const list = visible.value;
  const idx = list.findIndex((v) => v.node.id === node.id);
  const hasKids = !!(node.children && node.children.length);
  const isOpen = expandedSet.value.has(node.id);
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (idx < list.length - 1) focusRow(list[idx + 1]!.node.id);
      break;
    case "ArrowUp":
      e.preventDefault();
      if (idx > 0) focusRow(list[idx - 1]!.node.id);
      break;
    case "ArrowRight":
      e.preventDefault();
      if (hasKids && !isOpen) toggle(node.id);
      else if (hasKids && isOpen) focusRow(node.children![0]!.id);
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (hasKids && isOpen) toggle(node.id);
      else {
        for (let i = idx - 1; i >= 0; i--) {
          if (list[i]!.depth < entry.depth) {
            focusRow(list[i]!.node.id);
            break;
          }
        }
      }
      break;
    case "Enter":
    case " ":
      e.preventDefault();
      if (hasKids) toggle(node.id);
      if (!node.disabled) select(node);
      break;
  }
}

provide<TreeCtx>("jlTree", {
  expandedSet,
  selected,
  focusId,
  visible,
  guides: computed(() => props.guides),
  toggle,
  select,
  registerRow,
  setFocus: (id) => (focusId.value = id),
  onKeydown,
});
</script>

<template>
  <ul :class="['jl-tree', guides ? 'jl-tree--guides' : '']" role="tree">
    <TreeViewNode v-for="node in items" :key="node.id" :node="node" :depth="0" />
  </ul>
</template>

<style src="./tree-view.css"></style>
