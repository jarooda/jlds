# Responsive & mobile

JLDS is desktop-first, but every component is built to hold up on a phone. The rule is simple:
**adapt by default, promote where the form factor flips, and build new only for patterns that
don't exist on desktop.** JLDS never ships parallel `MobileX` components — the same component, the
same props, two presentations.

The responsive tokens live in
[`registry/css/breakpoints.css`](https://github.com/jarooda/jlds/blob/main/registry/css/breakpoints.css)
and are injected alongside the design tokens by `jlds init`.

## The three tiers

| Tier | Strategy | What changes |
|---|---|---|
| **1 · Adapt** | Same model, reflow | Pure CSS — reflow, go full-width, grow touch targets. No API change. ~80% of the system. |
| **2 · Promote** | Form factor flips | Same component, different presentation — anchored popovers become bottom sheets. Same props/callbacks. |
| **3 · New** | Native-only pattern | No desktop equivalent (bottom nav, swipe rows). Earns its own component. Built only when needed. |

## Breakpoint scale

These tokens are the **single source of truth** for where layouts adapt.

| Token | Value | Below it |
|---|---|---|
| `--bp-mobile` | `600px` | Single column · sheets · bottom nav |
| `--bp-tablet` | `900px` | Sidebar → overlay drawer · 2-col grids |
| `--bp-desktop` | `1200px` | Full multi-pane / resizable layouts |

::: warning CSS variables can't be used inside `@media()`
A media query can't read `var(--bp-mobile)`. The tokens are the source of truth for
**documentation** and for **JS** (`getComputedStyle`); in CSS, write the matching **literal px**
in your `@media` query and keep it in sync. JLDS components do exactly this.
:::

```js
// Read the breakpoint in JS for a true behavior swap (matches the CSS).
JLDS.util.isMobile() // true below --bp-mobile
```

## See it adapt

::: tip Try the viewport toggle
Every preview on this page (and on every component page) is driven by the floating **viewport
switcher** in the **bottom-right corner** of the docs. Pick a width — **Fit** (fills the page),
**Mobile (380px)**, **Tablet (768px)**, or **Desktop (1024px)** — and **every example on the page
reflows at once**, so you can watch the whole system adapt without resizing your browser. Collapse it
into its handle (the `›` chevron) when you want it out of the way; your choice sticks as you move
between pages.
:::

Pick **Mobile** and the demo below reflows: the stat grid collapses to one column and the action row
goes full-width (Tier 1). On a real component page, overlay components (Dialog, menus, Combobox,
DatePicker) dock as bottom sheets (Tier 2).

<Preview src="/preview/responsive/tiers.html" />

## Touch targets & safe areas

| Token | Value | Use |
|---|---|---|
| `--target-min` | `44px` | Minimum hit target on coarse pointers |
| `--target-comfortable` | `48px` | Preferred for primary actions |
| `--safe-top/right/bottom/left` | `env(safe-area-inset-*, 0px)` | Notch / home-indicator padding (resolve to `0` without insets) |

On coarse pointers (`@media (pointer: coarse)`) every interactive element clears 44px. Inputs grow
to ≥44px and use 16px text on mobile to stop iOS auto-zoom. Safe-area insets fold into the AppShell
content padding, the overlay drawer, and every bottom sheet — and are always safe to add because
they resolve to `0` on devices without a notch.

## Bottom-sheet primitive

Below `--bp-mobile`, overlays that anchor to a trigger on desktop dock to the bottom of the screen
as a sheet. The sheet tokens drive the look:

| Token | Value |
|---|---|
| `--sheet-radius` | `20px` (top corners only) |
| `--sheet-handle-w` / `--sheet-handle-h` | `36px` / `4px` (grab handle) |
| `--sheet-max-h` | `92dvh` |

## What adapts

**Tier 1 — Adapt (pure CSS):** AppShell (overlay drawer at `--bp-tablet` + safe areas), Sidebar,
PageHeader, Table (scroll wrapper), Tabs · SegmentedControl · Breadcrumb (scroll), Stepper
(horizontal → vertical), Pagination (prev/next + count), Resizable (stack, drag off), Card ·
Stat.Group (single column), and the form controls (Button · IconButton · Checkbox · Switch ·
RadioGroup clear 44px; Input · Textarea · Select · Field · NumberInput go full-width / 16px / ≥44px).

**Tier 2 — Promote (behavior swap, same API):** Dialog, DropdownMenu, Combobox, DatePicker, and
Popover render as bottom sheets below `--bp-mobile`; Drawer `side="bottom"` is the shared sheet
primitive (grab handle + `--sheet-radius`); Tooltip is suppressed on touch; native `Select` uses
the OS picker.

### Worked example — Dialog → sheet

Consumer code is identical at every breakpoint. Below `--bp-mobile` the centered dialog renders as
a bottom sheet with a grab handle and `--sheet-radius` corners — one component, two presentations.

```jsx
// Same open / onClose at every width. Sheet on mobile by default.
<Dialog open={open} onClose={close} title="Settings">…</Dialog>

// Opt out per-instance — stay centered even on mobile:
<Dialog open={open} onClose={close} mobile="center">…</Dialog>
```

In HTML, the dialog promotes to a sheet by default; add `data-mobile="center"` to the overlay to
keep it centered.

## Do & don't

**Do**
- Adapt the existing component in place wherever the mental model holds.
- Drive layout with CSS; reserve JS (`JLDS.util.isMobile()`) for true behavior swaps.
- Adapt every component at the same breakpoint **token** — no per-component guesses.
- Keep the same props and callbacks across breakpoints.
- Clear 44px on every touch target; fold in safe-area insets.

**Don't**
- Build parallel `MobileModal` / `MobileX` components.
- Hardcode pixel breakpoints that drift from the tokens.
- Use CSS variables inside `@media()` — they don't resolve there.
- Rely on hover for anything essential on touch devices.
- Crowd mobile layouts — keep the generous whitespace, just reflowed.
