# Date Picker

A trigger button that opens a calendar in a popover and shows the chosen date. The underlying
`Calendar` is exported too, for inline month grids. Date math is native `Date` — no dependencies.
The HTML version (`date-picker.js`) builds the grid, handles month nav and selection, and closes on
outside-click or Escape.

```bash
jlds add date-picker
```

## Usage

Click the trigger to open the calendar; pick a day to set the value.

<Preview src="/preview/date-picker/usage.html" />

::: code-group

```html [HTML]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/css/date-picker.css">
<!-- behavior layer: build grid, open/close, select -->
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/core.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/util.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/jarooda/jlds@main/registry/js/date-picker.js" defer></script>

<span class="jl-datepicker">
  <button type="button" class="jl-datepicker__trigger" aria-haspopup="dialog" aria-expanded="false">
    <span class="jl-datepicker__icon">
      <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2.2" stroke="currentColor" stroke-width="1.75"/><path d="M3 9.5h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>
    </span>
    <span class="jl-datepicker__value" data-placeholder="true">Pick a date</span>
  </button>
  <!-- the calendar popover is built by date-picker.js on first open -->
</span>
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { DatePicker } from "@/components/ui/date-picker"
const date = ref<Date | null>(null)
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

```tsx [React]
import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

const [date, setDate] = useState<Date | null>(null)
<DatePicker value={date} onChange={setDate} />
```

:::

## Inline calendar

Use `Calendar` on its own for an always-visible month grid. In HTML, give a `.jl-cal` element a
`data-value` (`YYYY-MM-DD`) and the behavior renders it.

<Preview src="/preview/date-picker/calendar.html" />

::: code-group

```html [HTML]
<div class="jl-cal" data-value="2026-06-15"></div>
<!-- add data-week-start="1" to start weeks on Monday -->
```

```vue [Vue]
<script setup lang="ts">
import { ref } from "vue"
import { Calendar } from "@/components/ui/date-picker"
const date = ref(new Date(2026, 5, 15))
</script>

<template>
  <Calendar v-model="date" />
</template>
```

```tsx [React]
import { useState } from "react"
import { Calendar } from "@/components/ui/date-picker"

const [date, setDate] = useState(new Date(2026, 5, 15))
<Calendar value={date} onChange={setDate} />
```

:::

## Props

### React

`DatePicker` extends `React.HTMLAttributes<HTMLSpanElement>` (minus `onChange` / `defaultValue`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Date \| string \| number` | — | Controlled selected date |
| `defaultValue` | `Date \| string \| number` | `null` | Uncontrolled initial date |
| `onChange` | `(date: Date) => void` | — | Fires on select |
| `placeholder` | `string` | `"Pick a date"` | Empty-state trigger text |
| `format` | `(date: Date) => string` | locale short | Format the displayed value |
| `min` / `max` | `Date \| string \| number` | — | Selectable range bounds |
| `disabledDate` | `(date: Date) => boolean` | — | Disable individual days |
| `weekStartsOn` | `number` | `0` | First weekday (0 = Sunday) |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `size` | `"sm" \| "md"` | `"md"` | Trigger / calendar density |
| `align` | `"start" \| "end"` | `"start"` | Popover edge alignment |

`Calendar` shares `value` / `defaultValue` / `onChange` / `min` / `max` / `disabledDate` /
`weekStartsOn` / `size`, plus `month` / `defaultMonth` / `onMonthChange` for the visible month.

### Vue

Same options. `value`/`onChange` become **`v-model`** (with a `@change` emit); `Calendar` also
supports `v-model:month`.

## CSS classes (HTML)

| Class | Purpose |
|---|---|
| `.jl-datepicker` + `--sm` | Trigger wrapper and compact size |
| `.jl-datepicker__trigger` + `[aria-expanded]` | The button and open state |
| `.jl-datepicker__icon` / `__value[data-placeholder]` | Leading icon and value text |
| `.jl-datepicker__pop[data-align]` | The popover (built by JS) |
| `.jl-cal` + `--sm` + `[data-value]` / `[data-week-start]` | Calendar grid and config |
| `.jl-cal__header` / `__nav` / `__title` | Month header and nav buttons |
| `.jl-cal__grid` / `__weekday` / `__day` | Grid, weekday labels, and day cells |
| `.jl-cal__day[data-today]` / `[data-selected]` / `[data-outside]` | Day states |
