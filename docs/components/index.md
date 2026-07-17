# Components

50+ components, all self-contained — each ships its own `.jl-*` CSS classes built on the
[design tokens](/guide/theming) and works with or without Tailwind.

Every component ships in **HTML** (the `.jl-*` classes, plus a small vanilla JS controller for the
interactive ones), **Vue**, and **React**. The last two columns tell you how a component behaves on
small screens — for the details, see [Responsive & mobile](/guide/responsive):

- **Responsive** — looks right at any width. It reflows, goes full-width, and grows its touch
  targets, but keeps the same shape and behavior.
- **Adaptive** — changes how it looks *and* works on a phone. Overlays dock to the bottom as sheets,
  the navigation collapses into a slide-in drawer, and inputs hand off to the native mobile picker.
  An adaptive component is responsive as well.

| Component | HTML | Vue | React | Responsive | Adaptive |
|---|:---:|:---:|:---:|:---:|:---:|
| [Accordion](/components/accordion) | ✅ | ✅ | ✅ | — | — |
| [Alert](/components/alert) | ✅ | ✅ | ✅ | — | — |
| [App Shell](/components/app-shell) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Avatar](/components/avatar) | ✅ | ✅ | ✅ | — | — |
| [Badge](/components/badge) | ✅ | ✅ | ✅ | — | — |
| [Banner](/components/banner) | ✅ | ✅ | ✅ | — | — |
| [Bottom Nav](/components/bottom-nav) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Breadcrumb](/components/breadcrumb) | ✅ | ✅ | ✅ | ✅ | — |
| [Button](/components/button) | ✅ | ✅ | ✅ | ✅ | — |
| [Card](/components/card) | ✅ | ✅ | ✅ | ✅ | — |
| [Carousel](/components/carousel) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Chart](/components/chart) | ✅ | ✅ | ✅ | ✅ | — |
| [Checkbox](/components/checkbox) | ✅ | ✅ | ✅ | ✅ | — |
| [Collapsible](/components/collapsible) | ✅ | ✅ | ✅ | — | — |
| [Combobox](/components/combobox) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Command Palette](/components/command-palette) | ✅ | ✅ | ✅ | — | — |
| [Date Picker](/components/date-picker) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Dialog](/components/dialog) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Divider](/components/divider) | ✅ | ✅ | ✅ | — | — |
| [Drawer](/components/drawer) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [File Upload](/components/file-upload) | ✅ | ✅ | ✅ | — | — |
| [Dropdown Menu](/components/dropdown-menu) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Empty State](/components/empty-state) | ✅ | ✅ | ✅ | — | — |
| [Field](/components/field) | ✅ | ✅ | ✅ | ✅ | — |
| [Icon Button](/components/icon-button) | ✅ | ✅ | ✅ | ✅ | — |
| [Input](/components/input) | ✅ | ✅ | ✅ | ✅ | — |
| [Kbd](/components/kbd) | ✅ | ✅ | ✅ | — | — |
| [Number Input](/components/number-input) | ✅ | ✅ | ✅ | ✅ | — |
| [Page Header](/components/page-header) | ✅ | ✅ | ✅ | ✅ | — |
| [Pagination](/components/pagination) | ✅ | ✅ | ✅ | ✅ | — |
| [Popover](/components/popover) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Progress](/components/progress) | ✅ | ✅ | ✅ | — | — |
| [Radio Group](/components/radio-group) | ✅ | ✅ | ✅ | ✅ | — |
| [Rating](/components/rating) | ✅ | ✅ | ✅ | — | — |
| [Resizable](/components/resizable) | ✅ | ✅ | ✅ | ✅ | — |
| [Responsive Table](/components/responsive-table) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Scroll Area](/components/scroll-area) | ✅ | ✅ | ✅ | — | — |
| [Segmented Control](/components/segmented-control) | ✅ | ✅ | ✅ | ✅ | — |
| [Select](/components/select) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Sidebar](/components/sidebar) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Skeleton](/components/skeleton) | ✅ | ✅ | ✅ | — | — |
| [Slider](/components/slider) | ✅ | ✅ | ✅ | — | — |
| [Snippet](/components/snippet) | ✅ | ✅ | ✅ | — | — |
| [Spinner](/components/spinner) | ✅ | ✅ | ✅ | — | — |
| [Stat](/components/stat) | ✅ | ✅ | ✅ | ✅ | — |
| [Stepper](/components/stepper) | ✅ | ✅ | ✅ | ✅ | — |
| [Swipe Row](/components/swipe-row) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Switch](/components/switch) | ✅ | ✅ | ✅ | ✅ | — |
| [Table](/components/table) | ✅ | ✅ | ✅ | ✅ | — |
| [Tabs](/components/tabs) | ✅ | ✅ | ✅ | ✅ | — |
| [Tag](/components/tag) | ✅ | ✅ | ✅ | — | — |
| [Textarea](/components/textarea) | ✅ | ✅ | ✅ | ✅ | — |
| [Timeline](/components/timeline) | ✅ | ✅ | ✅ | — | — |
| [Toast](/components/toast) | ✅ | ✅ | ✅ | — | — |
| [Toggle](/components/toggle) | ✅ | ✅ | ✅ | — | — |
| [Toolbar](/components/toolbar) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Tooltip](/components/tooltip) | ✅ | ✅ | ✅ | ✅ | ✅ |
| [Tree View](/components/tree-view) | ✅ | ✅ | ✅ | — | — |

Run `jlds list` from a project with `jlds.json` to see what's available for your detected
framework — see [CLI: list](/cli/list).

The **HTML** column means the component's `.jl-*` CSS classes (and JS controller, where needed)
work directly in markup — no CLI or framework required, see [HTML](/guide/vanilla-html).
