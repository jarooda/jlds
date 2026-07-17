<script setup lang="ts">
type SwitchSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    label?: string;
    /** Supporting text under the label. */
    description?: string;
    /** Which side the label sits on. @default "end" */
    labelPlacement?: "start" | "end";
    size?: SwitchSize;
    disabled?: boolean;
    modelValue?: boolean;
  }>(),
  { label: "", description: "", labelPlacement: "end", size: "md", disabled: false, modelValue: false }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

function onChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label
    class="jl-switch"
    :class="[`jl-switch--${props.size}`, props.labelPlacement === 'start' ? 'jl-switch--start' : '']"
    :data-disabled="props.disabled || undefined"
  >
    <input
      type="checkbox"
      role="switch"
      class="jl-switch__input"
      :checked="props.modelValue"
      :disabled="props.disabled"
      v-bind="$attrs"
      @change="onChange"
    />
    <span class="jl-switch__track"><span class="jl-switch__thumb" /></span>
    <span v-if="props.label || props.description || $slots.default" class="jl-switch__body">
      <span v-if="props.label || $slots.default" class="jl-switch__label"><slot>{{ props.label }}</slot></span>
      <span v-if="props.description" class="jl-switch__desc">{{ props.description }}</span>
    </span>
  </label>
</template>

<style src="./switch.css"></style>
