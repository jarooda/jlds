import type { ComputedRef, Ref } from "vue";

export interface TreeNode {
  id: string;
  label: string;
  /** Inline SVG/HTML markup for the leading icon (rendered with v-html). */
  icon?: string;
  trailing?: string;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeEntry {
  node: TreeNode;
  depth: number;
}

export interface TreeCtx {
  expandedSet: ComputedRef<Set<string>>;
  selected: ComputedRef<string | null>;
  focusId: Ref<string | null>;
  visible: ComputedRef<TreeEntry[]>;
  guides: ComputedRef<boolean>;
  toggle: (id: string) => void;
  select: (node: TreeNode) => void;
  registerRow: (id: string, el: HTMLElement | null) => void;
  setFocus: (id: string) => void;
  onKeydown: (e: KeyboardEvent, entry: TreeEntry) => void;
}
