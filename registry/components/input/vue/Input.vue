<script setup lang="ts">
import { useSlots } from "vue";

type InputSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    size?: InputSize;
    invalid?: boolean;
    disabled?: boolean;
    modelValue?: string | number;
  }>(),
  { size: "md", invalid: false, disabled: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const slots = useSlots();

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div
    class="jl-input-wrap"
    :class="`jl-input-wrap--${props.size}`"
    :data-invalid="props.invalid || undefined"
    :data-disabled="props.disabled || undefined"
  >
    <span v-if="slots.icon" class="jl-input-adorn"><slot name="icon" /></span>
    <input
      class="jl-input"
      :value="props.modelValue"
      :disabled="props.disabled"
      :aria-invalid="props.invalid || undefined"
      v-bind="$attrs"
      @input="onInput"
    />
    <span v-if="slots.trailing" class="jl-input-adorn"><slot name="trailing" /></span>
  </div>
</template>

<style src="./input.css"></style>
