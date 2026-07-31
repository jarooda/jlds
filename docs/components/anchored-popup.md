# Anchored Popup

A positioning primitive, not a visual component. It renders a popup into `<body>` and anchors it
to its trigger, so the popup escapes any ancestor that would clip it.

```bash
jlds add anchored-popup
```

You rarely install it directly — the overlay components that need it declare it as a registry
dependency, so `jlds add combobox` pulls it in automatically. Used by
[Combobox](/components/combobox), [Date Picker](/components/date-picker),
[Dropdown Menu](/components/dropdown-menu), [Popover](/components/popover),
[Tooltip](/components/tooltip), and the [Toolbar](/components/toolbar) overflow menu.

## The problem it solves

A popup positioned in-flow (`position: absolute`, next to its trigger) is cropped by any ancestor
with a non-visible `overflow`:

- a [Card](/components/card) — `overflow: hidden` keeps content inside its rounded corners;
- a [Table](/components/table) wrapper — `overflow-x: auto` for horizontal scrolling;
- an [Accordion](/components/accordion) panel, a [Scroll Area](/components/scroll-area), a
  [Sidebar](/components/sidebar).

`z-index` cannot help: an ancestor's `overflow` clips its descendants regardless of stacking
order. The only escape is a different containing block — which is what this primitive provides.

Below the `--bp-mobile` breakpoint the popup docks as a bottom sheet through the component's own
`@media` block, so the positioner steps aside and clears its inline styles.

## Usage

::: code-group

```tsx [React]
import { useAnchoredPopup, AnchoredPortal } from "@/components/ui/anchored-popup"

function Menu() {
  const [open, setOpen] = React.useState(false)
  const { anchorRef, popupRef, contains } = useAnchoredPopup<HTMLButtonElement, HTMLDivElement>({
    open,
    matchWidth: true,
  })

  React.useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      // `contains` covers the portaled popup as well as the trigger
      if (!contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open, contains])

  return (
    <>
      <button ref={anchorRef} onClick={() => setOpen(true)}>Open</button>
      {open && (
        <AnchoredPortal>
          <div ref={popupRef} className="my-popup">…</div>
        </AnchoredPortal>
      )}
    </>
  )
}
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { useAnchoredPopup } from "@/components/ui/anchored-popup"

const open = ref(false)
const { anchorRef, popupRef, contains } = useAnchoredPopup({ open, matchWidth: true })
</script>

<template>
  <button ref="anchorRef" @click="open = true">Open</button>
  <Teleport to="body">
    <div v-if="open" ref="popupRef" class="my-popup">…</div>
  </Teleport>
</template>
```

```js [HTML]
// core.js + util.js expose JLDS.util
var handle = JLDS.util.anchorPopup(trigger, popup, { matchWidth: true })

handle.update()   // recompute — after the popup's contents change, say
handle.release()  // on close: clears positioning and puts the popup back where it was
```

:::

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` (React) / `Ref<boolean>` (Vue) | — | Whether the popup is currently rendered. Not used by the HTML API, which positions on call |
| `side` | `"bottom" \| "top" \| "left" \| "right"` | `"bottom"` | Preferred side. Flips to the opposite side automatically when there is not enough room |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment along the anchor's edge — horizontal for `top`/`bottom`, vertical for `left`/`right` |
| `gap` | `number` | `5` | Space between anchor and popup, in px |
| `matchWidth` | `boolean` | `false` | Size the popup to the anchor's width — for select-style listboxes |
| `sheetBreakpoint` | `number` | `600` | Viewport width at or below which the component's CSS docks the popup as a bottom sheet and the positioner steps aside. `0` disables — for popups with no sheet promotion, like Tooltip and the Toolbar menu |
| `retainOnClose` | `boolean` | `false` | Keep the last position when the popup closes instead of clearing it. For popups that stay mounted and fade out (Tooltip) — clearing would make them jump |

## Returns

| Name | Type | Description |
|---|---|---|
| `anchorRef` | ref | Attach to the trigger the popup is positioned against |
| `popupRef` | ref | Attach to the popup element itself |
| `docked` | `boolean` (React) / `Ref<boolean>` (Vue) | True while the popup is docked as a bottom sheet |
| `contains` | `(node) => boolean` | True when `node` is inside the anchor **or** the popup. The popup lives in `<body>`, so a plain `root.contains(e.target)` click-outside test would close on the popup's own clicks — use this instead |
| `update` | `() => void` | Recompute the position |

The HTML `anchorPopup` returns `{ update, release }` instead; `release()` also restores the popup
to its original place in the DOM.

## Behavior

- **Repositions** on scroll (capture phase, so a scrolling ancestor counts), on resize, and via a
  `ResizeObserver` on both the anchor and the popup — a filtered list that shrinks stays put.
- **Flips** to the opposite side when the popup doesn't fit and there is more room the other way,
  and clamps to within 8px of the viewport edges.
- **Marks state** on the popup element: `data-jl-anchored` while active, `data-jl-placement`
  (the side it landed on), and `data-jl-docked` while docked as a sheet.
- **Cleans up** on close — inline styles removed, attributes dropped, popup restored — unless
  `retainOnClose` keeps the position for a fade-out.

## CSS classes (HTML)

| Selector | Purpose |
|---|---|
| `[data-jl-anchored]` | On the popup while it is anchored. `position: fixed` — the positioner writes `top`/`left`/`width` inline, so this stylesheet is documentation rather than a requirement |
| `[data-jl-placement="top" \| "bottom" \| "left" \| "right"]` | Which side the popup was placed on, after flipping. Components hang their arrow off this rather than the requested side |
| `[data-jl-docked]` | Set while the popup is docked as a bottom sheet |
