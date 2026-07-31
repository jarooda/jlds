import { ref, watch, onBeforeUnmount, nextTick, type Ref } from "vue";

/* Positioning primitive for popups that must escape a clipping ancestor.
 *
 * A popup positioned in-flow (`position: absolute` next to its trigger) is cropped
 * by any ancestor with a non-visible `overflow` — a Card, a scrolling table wrapper,
 * an accordion panel. Pair this composable with `<Teleport to="body">` on the popup:
 * the popup then lives outside every clipping ancestor and is positioned against the
 * trigger's viewport rect, flipping above the trigger when there is no room below.
 *
 * Below `sheetBreakpoint` the popup is left alone: components dock their popup as a
 * bottom sheet with a pure-CSS `@media` block, so the positioner clears its inline
 * styles and reports `docked: true`.
 *
 * `anchored-popup.css` documents the anchored state but is not required — the
 * positioner writes inline styles, which beat any component rule. */

export type AnchoredSide = "bottom" | "top" | "left" | "right";
export type AnchoredAlign = "start" | "center" | "end";

export interface UseAnchoredPopupOptions {
  /** Whether the popup is currently rendered. */
  open: Ref<boolean>;
  /** Preferred side. Flips automatically when there is not enough room. */
  side?: AnchoredSide;
  /** Horizontal alignment against the anchor. */
  align?: AnchoredAlign;
  /** Space between anchor and popup, in px. */
  gap?: number;
  /** Size the popup to the anchor's width (combobox/select-style listboxes). */
  matchWidth?: boolean;
  /** Viewport width (px) at or below which the component's CSS docks the popup as a
   *  bottom sheet and the positioner steps aside. Matches --bp-mobile. 0 disables. */
  sheetBreakpoint?: number;
  /** Keep the last position when the popup closes instead of clearing it. For popups
   *  that stay mounted and fade out (tooltips) — clearing would make them jump. */
  retainOnClose?: boolean;
}

/** Distance kept between the popup and the viewport edges, in px. */
const VIEWPORT_MARGIN = 8;

function clearPosition(popup: HTMLElement) {
  const s = popup.style;
  s.position = "";
  s.top = "";
  s.left = "";
  s.right = "";
  s.bottom = "";
  s.width = "";
  s.margin = "";
  s.translate = "";
  popup.removeAttribute("data-jl-placement");
}

/** Keep `pos` inside the viewport along one axis, without pushing past the near edge
 *  when the popup is taller/wider than the space available. */
function clamp(pos: number, viewport: number, size: number) {
  return Math.min(Math.max(pos, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, viewport - size - VIEWPORT_MARGIN));
}

function place(
  anchor: HTMLElement,
  popup: HTMLElement,
  side: AnchoredSide,
  align: AnchoredAlign,
  gap: number,
  matchWidth: boolean
) {
  const a = anchor.getBoundingClientRect();
  const s = popup.style;

  // Neutralize the component's in-flow rule (`top: calc(100% + 5px)`, `right: 0`, the
  // `translate` some popups centre themselves with) before measuring, and take the
  // anchor's width first so the height we measure is the height at the final width.
  s.position = "fixed";
  s.right = "auto";
  s.bottom = "auto";
  s.margin = "0";
  s.translate = "none";
  if (matchWidth) s.width = `${a.width}px`;

  const p = popup.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  let top: number;
  let left: number;
  let placement: AnchoredSide;

  if (side === "left" || side === "right") {
    // Horizontal sides: `align` runs down the anchor's edge instead of across it.
    const fitsRight = p.width <= vw - a.right - gap;
    const fitsLeft = p.width <= a.left - gap;
    const onLeft = side === "left" ? fitsLeft || !fitsRight : !fitsRight && fitsLeft;
    left = onLeft ? a.left - p.width - gap : a.right + gap;
    top = align === "start" ? a.top : align === "end" ? a.bottom - p.height : a.top + (a.height - p.height) / 2;
    placement = onLeft ? "left" : "right";
  } else {
    const fitsBelow = p.height <= vh - a.bottom - gap;
    const fitsAbove = p.height <= a.top - gap;
    const onTop = side === "top" ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove;
    top = onTop ? a.top - p.height - gap : a.bottom + gap;
    left = align === "end" ? a.right - p.width : align === "center" ? a.left + (a.width - p.width) / 2 : a.left;
    placement = onTop ? "top" : "bottom";
  }

  s.top = `${Math.round(clamp(top, vh, p.height))}px`;
  s.left = `${Math.round(clamp(left, vw, p.width))}px`;
  popup.setAttribute("data-jl-placement", placement);
}

export function useAnchoredPopup(options: UseAnchoredPopupOptions) {
  const {
    open,
    side = "bottom",
    align = "start",
    gap = 5,
    matchWidth = false,
    sheetBreakpoint = 600,
    retainOnClose = false,
  } = options;

  /** Attach to the trigger the popup is positioned against. */
  const anchorRef = ref<HTMLElement | null>(null);
  /** Attach to the teleported popup element itself. */
  const popupRef = ref<HTMLElement | null>(null);
  /** True while the popup is docked as a bottom sheet (positioning is CSS-owned). */
  const docked = ref(false);

  function update() {
    const anchor = anchorRef.value;
    const popup = popupRef.value;
    if (!anchor || !popup) return;

    const isDocked = sheetBreakpoint > 0 && window.matchMedia(`(max-width: ${sheetBreakpoint}px)`).matches;
    docked.value = isDocked;
    if (isDocked) {
      popup.setAttribute("data-jl-docked", "");
      clearPosition(popup);
      return;
    }
    popup.removeAttribute("data-jl-docked");
    place(anchor, popup, side, align, gap, matchWidth);
  }

  let ro: ResizeObserver | null = null;

  function stop() {
    // Capture-phase scroll so the popup follows a scrolling ancestor, not just the page.
    window.removeEventListener("scroll", update, true);
    window.removeEventListener("resize", update);
    ro?.disconnect();
    ro = null;
    const popup = popupRef.value;
    if (popup) {
      if (!retainOnClose) clearPosition(popup);
      popup.removeAttribute("data-jl-anchored");
      popup.removeAttribute("data-jl-docked");
    }
  }

  watch(
    open,
    async (isOpen) => {
      if (!isOpen) {
        stop();
        return;
      }
      // The popup is rendered by the same v-if that flipped `open`; wait for it.
      await nextTick();
      const popup = popupRef.value;
      if (!popup) return;
      popup.setAttribute("data-jl-anchored", "");
      update();
      window.addEventListener("scroll", update, true);
      window.addEventListener("resize", update);
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(update);
        ro.observe(popup);
        if (anchorRef.value) ro.observe(anchorRef.value);
      }
    },
    { immediate: true }
  );

  onBeforeUnmount(stop);

  /** True when `node` is inside the anchor or the popup — the popup is teleported to
   *  <body>, so a plain `root.contains(e.target)` click-outside test would close on
   *  its own clicks. */
  function contains(node: Node | null) {
    return !!node && (!!anchorRef.value?.contains(node) || !!popupRef.value?.contains(node));
  }

  return { anchorRef, popupRef, docked, contains, update };
}
