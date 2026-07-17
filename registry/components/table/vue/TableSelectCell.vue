<script setup lang="ts">
import { Checkbox } from "../checkbox";

withDefaults(
  defineProps<{
    /** Render as a <th> header checkbox (select-all) instead of a row <td>. @default false */
    header?: boolean;
    checked?: boolean;
    /** Mixed state for a select-all header (shown when not fully checked). @default false */
    indeterminate?: boolean;
    ariaLabel?: string;
  }>(),
  { header: false, checked: false, indeterminate: false, ariaLabel: undefined }
);

const emit = defineEmits<{ change: [value: boolean] }>();
</script>

<template>
  <component
    :is="header ? 'th' : 'td'"
    :class="header ? 'jl-th--select' : 'jl-td--select'"
    :scope="header ? 'col' : undefined"
  >
    <Checkbox
      :model-value="checked"
      :indeterminate="indeterminate && !checked"
      :aria-label="ariaLabel || (header ? 'Select all rows' : 'Select row')"
      @update:model-value="(v: boolean) => emit('change', v)"
    />
  </component>
</template>
