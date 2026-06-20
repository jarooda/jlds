<script setup lang="ts">
type SwitchSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    label?: string;
    size?: SwitchSize;
    disabled?: boolean;
    modelValue?: boolean;
  }>(),
  { size: "md", disabled: false, modelValue: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function onChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label
    class="jl-switch"
    :class="`jl-switch--${props.size}`"
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
    <span v-if="props.label || $slots.default" class="jl-switch__label"><slot>{{ props.label }}</slot></span>
  </label>
</template>

<style src="./switch.css"></style>
