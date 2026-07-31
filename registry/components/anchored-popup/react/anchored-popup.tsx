import * as React from "react";
import "./anchored-popup.css";

/* Positioning primitive for popups that must escape a clipping ancestor.
 *
 * A popup positioned in-flow (`position: absolute` next to its trigger) is cropped
 * by any ancestor with a non-visible `overflow` — a Card, a scrolling table wrapper,
 * an accordion panel. Render the popup with `AnchoredPortal` so it lives in <body>;
 * this hook positions it against the trigger's viewport rect, flipping above the
 * trigger when there is no room below.
 *
 * Below `sheetBreakpoint` the popup is left alone: components dock their popup as a
 * bottom sheet with a pure-CSS `@media` block, so the positioner clears its inline
 * styles and reports `docked: true`. */

export type AnchoredSide = "bottom" | "top" | "left" | "right";
export type AnchoredAlign = "start" | "center" | "end";

export interface UseAnchoredPopupOptions {
  /** Whether the popup is currently rendered. */
  open: boolean;
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

export interface AnchoredPopup<A extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement> {
  /** Attach to the trigger the popup is positioned against. */
  anchorRef: React.RefObject<A | null>;
  /** Attach to the popup element itself. */
  popupRef: React.RefObject<P | null>;
  /** True while the popup is docked as a bottom sheet (positioning is CSS-owned). */
  docked: boolean;
  /** True when `node` is inside the anchor or the popup — the popup lives in <body>,
   *  so a plain `root.contains(e.target)` click-outside test would close on its own
   *  clicks. */
  contains: (node: Node | null) => boolean;
  /** Recompute the position — after the popup's contents change size, say. */
  update: () => void;
}

/** Distance kept between the popup and the viewport edges, in px. */
const VIEWPORT_MARGIN = 8;

/* useLayoutEffect warns when it runs during SSR; the popup is client-only anyway. */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

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

/** Keep `pos` inside the viewport along one axis, without pushing past the near edge
 *  when the popup is taller/wider than the space available. */
function clamp(pos: number, viewport: number, size: number) {
  return Math.min(Math.max(pos, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, viewport - size - VIEWPORT_MARGIN));
}

export function useAnchoredPopup<A extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement>({
  open,
  side = "bottom",
  align = "start",
  gap = 5,
  matchWidth = false,
  sheetBreakpoint = 600,
  retainOnClose = false,
}: UseAnchoredPopupOptions): AnchoredPopup<A, P> {
  const anchorRef = React.useRef<A | null>(null);
  const popupRef = React.useRef<P | null>(null);
  const [docked, setDocked] = React.useState(false);

  const update = React.useCallback(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;

    const isDocked = sheetBreakpoint > 0 && window.matchMedia(`(max-width: ${sheetBreakpoint}px)`).matches;
    setDocked(isDocked);
    if (isDocked) {
      popup.setAttribute("data-jl-docked", "");
      clearPosition(popup);
      return;
    }
    popup.removeAttribute("data-jl-docked");
    place(anchor, popup, side, align, gap, matchWidth);
  }, [side, align, gap, matchWidth, sheetBreakpoint]);

  useIsomorphicLayoutEffect(() => {
    const popup = popupRef.current;
    if (!open || !popup) return;

    popup.setAttribute("data-jl-anchored", "");
    update();

    // Capture-phase scroll so the popup follows a scrolling ancestor, not just the page.
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(popup);
    if (anchorRef.current) ro?.observe(anchorRef.current);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      ro?.disconnect();
      if (!retainOnClose) clearPosition(popup);
      popup.removeAttribute("data-jl-anchored");
      popup.removeAttribute("data-jl-docked");
    };
  }, [open, update, retainOnClose]);

  const contains = React.useCallback(
    (node: Node | null) =>
      !!node && (!!anchorRef.current?.contains(node) || !!popupRef.current?.contains(node)),
    []
  );

  return { anchorRef, popupRef, docked, contains, update };
}
