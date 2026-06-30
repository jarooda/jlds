<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { VIEWPORTS, viewportWidth, viewportCollapsed } from '../viewport'
import DeviceIcon from './DeviceIcon.vue'

const { page } = useData()

// Only show where there are component previews: every /components/* page and the
// responsive guide. Elsewhere the control would be meaningless noise.
const show = computed(() => {
  const p = page.value.relativePath
  return p.startsWith('components/') || p === 'guide/responsive.md'
})

const activeIndex = computed(() =>
  VIEWPORTS.findIndex((w) => w.value === viewportWidth.value)
)
// The currently-selected viewport, for the collapsed-state label.
const activeViewport = computed(
  () => VIEWPORTS.find((w) => w.value === viewportWidth.value) ?? VIEWPORTS[0]
)
</script>

<template>
  <div v-if="show" class="jlds-vp" :class="{ 'jlds-vp--collapsed': viewportCollapsed }">
    <button
      type="button"
      class="jlds-vp__toggle"
      :aria-expanded="!viewportCollapsed"
      :title="viewportCollapsed ? 'Show viewport switcher' : 'Hide viewport switcher'"
      aria-label="Toggle viewport switcher"
      @click="viewportCollapsed = !viewportCollapsed"
    >
      <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
        <path d="M6.5 4.5L10 8l-3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <!-- Multidevice glyph — always visible (outside the clipping panel) so its
         tooltip never gets cut off. tabindex makes the tooltip keyboard-reachable. -->
    <span
      class="jlds-vp__lead jlds-tip"
      tabindex="0"
      role="img"
      aria-label="Preview viewport — set the width for every example on this page"
      data-tip="Set the preview width for every example"
    >
      <DeviceIcon name="devices" />
    </span>
    <span v-if="viewportCollapsed" class="jlds-vp__current">
      <span class="jlds-vp__px">{{ activeViewport.value ? activeViewport.value + 'px' : 'Fit' }}</span>
    </span>
    <div class="jlds-vp__panel">
      <!-- JLDS SegmentedControl pattern (sunken track + sliding thumb), themed with
           VitePress vars so it follows docs light/dark. Equal-width options keep the
           thumb pure-CSS. Drives the shared viewportWidth store. -->
      <div
        class="jlds-vp__seg"
        role="radiogroup"
        aria-label="Preview viewport width"
        :style="{ '--n': VIEWPORTS.length }"
      >
        <span
          class="jlds-vp__thumb"
          :style="{ transform: `translateX(${activeIndex * 100}%)` }"
          aria-hidden="true"
        />
        <button
          v-for="w in VIEWPORTS"
          :key="w.label"
          type="button"
          role="radio"
          :aria-checked="viewportWidth === w.value"
          class="jlds-vp__opt"
          :title="w.value ? `${w.label} · ${w.value}px` : 'Fit (fills the page)'"
          :aria-label="w.value ? `${w.label}, ${w.value} pixels` : 'Fit, fills the page'"
          @click="viewportWidth = w.value"
        >
          <DeviceIcon :name="w.icon" class="jlds-vp__icon" />
          <span v-if="w.value" class="jlds-vp__px">{{ w.value }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Floating toolbar — out of the document flow so it never pushes or covers the
   content column, but stays reachable while scrolling through a page of examples.
   Bottom-right keeps it clear of the nav and the "On this page" outline. */
.jlds-vp {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: calc(100vw - 40px);
  padding: 5px 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.14);
}
.jlds-vp--collapsed {
  padding: 4px 12px 4px 4px;
  gap: 6px;
}
/* Leading multidevice glyph (replaces the old "Preview viewport" text). */
.jlds-vp__lead {
  display: inline-flex;
  flex: none;
  color: var(--vp-c-text-3);
  cursor: help;
  border-radius: 6px;
  outline-offset: 2px;
}
.jlds-vp__lead:hover {
  color: var(--vp-c-text-1);
}
.jlds-vp__lead:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
}

/* Styled tooltip — appears above on hover / keyboard focus. The host sits
   outside the panel's overflow:hidden, so the bubble is never clipped. */
.jlds-tip {
  position: relative;
}
.jlds-tip::after {
  content: attr(data-tip);
  position: absolute;
  right: calc(100% + 9px);
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  color: var(--vp-c-bg);
  background: var(--vp-c-text-1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 1;
}
.jlds-tip::before {
  content: '';
  position: absolute;
  right: calc(100% + 4px);
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  border: 5px solid transparent;
  border-left-color: var(--vp-c-text-1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.jlds-tip:hover::after,
.jlds-tip:hover::before,
.jlds-tip:focus-visible::after,
.jlds-tip:focus-visible::before {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
/* Active viewport shown beside the handle while collapsed: icon + px. */
.jlds-vp__current {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
/* The panel (label + segmented control) collapses into the handle on the right. */
.jlds-vp__panel {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 640px;
  overflow: hidden;
  transition: max-width 0.28s cubic-bezier(0.3, 0, 0, 1), opacity 0.2s ease;
}
.jlds-vp--collapsed .jlds-vp__panel {
  max-width: 0;
  opacity: 0;
}
/* Collapse/expand handle — stays anchored at the right edge. */
.jlds-vp__toggle {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.jlds-vp__toggle:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.jlds-vp__toggle:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}
.jlds-vp__toggle svg {
  transition: transform 0.28s cubic-bezier(0.3, 0, 0, 1);
}
/* Expanded: chevron points right (collapse → right). Collapsed: points left (expand). */
.jlds-vp--collapsed .jlds-vp__toggle svg {
  transform: rotate(180deg);
}
/* On phones, tighten into the corner. */
@media (max-width: 640px) {
  .jlds-vp { right: 12px; bottom: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .jlds-vp__panel,
  .jlds-vp__toggle svg {
    transition: none;
  }
}

/* SegmentedControl — sunken track, sliding thumb, pill options. Equal-width
   columns (grid 1fr) so the pure-CSS thumb (width = track / N, translateX by
   whole columns) lines up exactly with the active option. gap:0 keeps the math
   exact — option N starts at index × column width. */
.jlds-vp__seg {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 0;
  padding: 3px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.jlds-vp__thumb {
  position: absolute;
  z-index: 0;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc((100% - 6px) / var(--n));
  border-radius: 6px;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: transform 0.22s cubic-bezier(0.3, 0, 0, 1);
}
.jlds-vp__opt {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s;
}
.jlds-vp__icon {
  flex: none;
}
.jlds-vp__px {
  font-variant-numeric: tabular-nums;
}
.jlds-vp__opt:hover[aria-checked='false'] {
  color: var(--vp-c-text-1);
}
.jlds-vp__opt[aria-checked='true'] {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.jlds-vp__opt:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

@media (prefers-reduced-motion: reduce) {
  .jlds-vp__thumb {
    transition: none;
  }
}
</style>
