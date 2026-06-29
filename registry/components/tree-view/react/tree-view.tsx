import * as React from "react";
import "./tree-view.css";

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeViewProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect"> {
  items?: TreeNode[];
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  guides?: boolean;
}

interface Entry {
  node: TreeNode;
  depth: number;
}

const Twist = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function flatten(nodes: TreeNode[], expandedSet: Set<string>, depth = 0, out: Entry[] = []): Entry[] {
  for (const n of nodes) {
    out.push({ node: n, depth });
    const kids = n.children;
    if (kids && kids.length && expandedSet.has(n.id)) flatten(kids, expandedSet, depth + 1, out);
  }
  return out;
}

export function TreeView({
  items = [],
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelect,
  guides = true,
  className = "",
  ...rest
}: TreeViewProps) {
  const expControlled = expandedProp != null;
  const selControlled = selectedProp != null;
  const [expInternal, setExpInternal] = React.useState<string[]>(defaultExpanded);
  const [selInternal, setSelInternal] = React.useState<string | null>(defaultSelected);
  const expanded = expControlled ? expandedProp : expInternal;
  const selected = selControlled ? selectedProp : selInternal;
  const expandedSet = React.useMemo(() => new Set(expanded), [expanded]);
  const [focusId, setFocusId] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLUListElement>(null);
  const rowRefs = React.useRef(new Map<string, HTMLDivElement>());

  const visible = React.useMemo(() => flatten(items, expandedSet), [items, expandedSet]);

  const setExpanded = (next: string[]) => {
    if (!expControlled) setExpInternal(next);
    onExpandedChange?.(next);
  };
  const toggle = (id: string) => {
    const next = expandedSet.has(id) ? expanded.filter((x) => x !== id) : [...expanded, id];
    setExpanded(next);
  };
  const select = (node: TreeNode) => {
    if (!selControlled) setSelInternal(node.id);
    onSelect?.(node.id, node);
  };

  const focusRow = (id: string) => {
    setFocusId(id);
    const el = rowRefs.current.get(id);
    if (el) el.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, entry: Entry) => {
    const { node } = entry;
    const idx = visible.findIndex((v) => v.node.id === node.id);
    const hasKids = !!(node.children && node.children.length);
    const isOpen = expandedSet.has(node.id);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (idx < visible.length - 1) focusRow(visible[idx + 1].node.id);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (idx > 0) focusRow(visible[idx - 1].node.id);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (hasKids && !isOpen) toggle(node.id);
        else if (hasKids && isOpen) focusRow(node.children![0].id);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (hasKids && isOpen) toggle(node.id);
        else {
          for (let i = idx - 1; i >= 0; i--) {
            if (visible[i].depth < entry.depth) {
              focusRow(visible[i].node.id);
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
      default:
        break;
    }
  };

  const renderNodes = (nodes: TreeNode[], depth: number) => (
    <ul className="jl-tree__group" role="group">
      {nodes.map((node) => renderItem(node, depth))}
    </ul>
  );

  const renderItem = (node: TreeNode, depth: number): React.JSX.Element => {
    const hasKids = !!(node.children && node.children.length);
    const isOpen = expandedSet.has(node.id);
    const isSel = selected === node.id;
    const entry: Entry = { node, depth };
    const isDefaultFocus =
      selected === node.id || (selected == null && visible[0] && visible[0].node.id === node.id);
    const tab = (focusId == null ? isDefaultFocus : focusId === node.id) ? 0 : -1;
    return (
      <li className="jl-tree__li" role="none" key={node.id}>
        <div
          className="jl-tree__row"
          role="treeitem"
          data-id={node.id}
          ref={(el) => {
            if (el) rowRefs.current.set(node.id, el);
            else rowRefs.current.delete(node.id);
          }}
          data-selected={isSel || undefined}
          data-expanded={hasKids ? isOpen : undefined}
          aria-expanded={hasKids ? isOpen : undefined}
          aria-selected={isSel}
          aria-disabled={node.disabled || undefined}
          tabIndex={tab}
          style={{ paddingLeft: guides ? undefined : `calc(${depth} * 16px + var(--space-2))` }}
          onClick={() => {
            if (node.disabled) return;
            if (hasKids) toggle(node.id);
            select(node);
            setFocusId(node.id);
          }}
          onKeyDown={(e) => onKeyDown(e, entry)}
        >
          <span className={["jl-tree__twist", hasKids ? "" : "jl-tree__twist--leaf"].filter(Boolean).join(" ")}>
            <Twist />
          </span>
          {node.icon && <span className="jl-tree__icon">{node.icon}</span>}
          <span className="jl-tree__label">{node.label}</span>
          {node.trailing != null && <span className="jl-tree__trail">{node.trailing}</span>}
        </div>
        {hasKids && isOpen && renderNodes(node.children!, depth + 1)}
      </li>
    );
  };

  return (
    <ul
      ref={rootRef}
      className={["jl-tree", guides ? "jl-tree--guides" : "", className].filter(Boolean).join(" ")}
      role="tree"
      {...rest}
    >
      {items.map((node) => renderItem(node, 0))}
    </ul>
  );
}
