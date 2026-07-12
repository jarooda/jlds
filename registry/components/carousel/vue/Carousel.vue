<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated, onBeforeUnmount, type CSSProperties } from "vue";

/** Slides per view by container width — keys map to the breakpoint tokens. */
export interface CarouselPerView {
  /** < 600px (mobile). @default 1 */
  base?: number;
  /** ≥ 600px (--bp-mobile). */
  sm?: number;
  /** ≥ 900px (--bp-tablet). */
  md?: number;
  /** ≥ 1200px (--bp-desktop). */
  lg?: number;
}

const props = withDefaults(
  defineProps<{
    /** Slides visible at once — a fixed number, or a responsive map by breakpoint. */
    perView?: number | CarouselPerView;
    /** Gap between slides in px. */
    gap?: number;
    /** Show prev/next arrows on pointer devices. */
    showArrows?: boolean;
    /** Show page dots. */
    showDots?: boolean;
  }>(),
  { perView: 1, gap: 16, showArrows: true, showDots: true }
);

const trackRef = ref<HTMLElement | null>(null);
const columns = ref(typeof props.perView === "number" ? props.perView : 1);
const slideCount = ref(0);
const active = ref(0);
const atStart = ref(true);
const atEnd = ref(false);

function tagSlides() {
  const t = trackRef.value;
  if (!t) return;
  const kids = Array.from(t.children) as HTMLElement[];
  kids.forEach((k) => k.classList.add("jl-carousel__slide"));
  slideCount.value = kids.length;
}

function resolveCols() {
  const w = trackRef.value ? trackRef.value.clientWidth : 0;
  if (typeof props.perView === "number") return props.perView;
  const p = props.perView || {};
  let c = p.base || 1;
  if (w >= 600 && p.sm != null) c = p.sm;
  if (w >= 900 && p.md != null) c = p.md;
  if (w >= 1200 && p.lg != null) c = p.lg;
  return c;
}

const pages = computed(() => Math.max(1, Math.ceil(slideCount.value / columns.value)));
const basis = computed(() =>
  columns.value === 1
    ? "100%"
    : `calc((100% - ${props.gap * (columns.value - 1)}px) / ${columns.value})`
);
const trackStyle = computed<CSSProperties>(() => ({
  ["--_gap" as string]: `${props.gap}px`,
  ["--_basis" as string]: basis.value,
}));

function onScroll() {
  const t = trackRef.value;
  if (!t) return;
  const slideW = (t.clientWidth - props.gap * (columns.value - 1)) / columns.value + props.gap;
  const idx = Math.round(t.scrollLeft / slideW);
  active.value = Math.min(pages.value - 1, Math.max(0, Math.round(idx / columns.value)));
  atStart.value = t.scrollLeft <= 2;
  atEnd.value = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
}

function goToPage(p: number) {
  const t = trackRef.value;
  if (!t) return;
  t.scrollTo({ left: (t.scrollWidth / pages.value) * p, behavior: "smooth" });
}
function step(dir: number) {
  const t = trackRef.value;
  if (!t) return;
  const slideW = (t.clientWidth - props.gap * (columns.value - 1)) / columns.value + props.gap;
  t.scrollBy({ left: dir * slideW * columns.value, behavior: "smooth" });
}

// Drag-to-scroll for mouse (touch scrolls natively).
let drag: { x: number; scroll: number; moved: boolean } | null = null;
let suppressClick = false;
function onPointerDown(e: PointerEvent) {
  if (e.pointerType !== "mouse") return;
  const t = trackRef.value;
  if (!t) return;
  suppressClick = false;
  drag = { x: e.clientX, scroll: t.scrollLeft, moved: false };
  t.classList.add("jl-carousel__track--dragging");
  t.setPointerCapture?.(e.pointerId);
}
function onPointerMove(e: PointerEvent) {
  if (!drag || !trackRef.value) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 3) drag.moved = true;
  trackRef.value.scrollLeft = drag.scroll - dx;
}
function onPointerUp() {
  if (drag?.moved) suppressClick = true;
  trackRef.value?.classList.remove("jl-carousel__track--dragging");
  drag = null;
}
function onClickCapture(e: MouseEvent) {
  if (suppressClick) {
    e.preventDefault();
    e.stopPropagation();
    suppressClick = false;
  }
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  tagSlides();
  columns.value = resolveCols();
  onScroll();
  if (trackRef.value && typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => {
      columns.value = resolveCols();
    });
    ro.observe(trackRef.value);
  }
});
onUpdated(tagSlides);
onBeforeUnmount(() => {
  if (ro) ro.disconnect();
});
watch(columns, onScroll);
</script>

<template>
  <div class="jl-carousel">
    <button
      v-if="showArrows && slideCount > columns"
      type="button"
      class="jl-carousel__arrow jl-carousel__arrow--prev"
      aria-label="Previous"
      :disabled="atStart"
      @click="step(-1)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6" /></svg>
    </button>
    <div
      ref="trackRef"
      class="jl-carousel__track"
      :style="trackStyle"
      role="group"
      aria-label="Carousel"
      @scroll="onScroll"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click.capture="onClickCapture"
    >
      <slot />
    </div>
    <button
      v-if="showArrows && slideCount > columns"
      type="button"
      class="jl-carousel__arrow jl-carousel__arrow--next"
      aria-label="Next"
      :disabled="atEnd"
      @click="step(1)"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
    </button>
    <div v-if="showDots && pages > 1" class="jl-carousel__dots" role="tablist" aria-label="Slide">
      <button
        v-for="p in pages"
        :key="p"
        type="button"
        role="tab"
        class="jl-carousel__dot"
        :aria-current="p - 1 === active ? 'true' : undefined"
        :aria-label="`Go to slide ${p}`"
        @click="goToPage(p - 1)"
      />
    </div>
  </div>
</template>

<style src="./carousel.css"></style>
