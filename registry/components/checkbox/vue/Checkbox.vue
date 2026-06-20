<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    description?: string;
    indeterminate?: boolean;
    disabled?: boolean;
    modelValue?: boolean;
  }>(),
  { indeterminate: false, disabled: false, modelValue: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const input = ref<HTMLInputElement | null>(null);

function syncIndeterminate() {
  if (input.value) input.value.indeterminate = props.indeterminate;
}
onMounted(syncIndeterminate);
watch(() => props.indeterminate, syncIndeterminate);

function onChange(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label class="jl-check" :data-disabled="props.disabled || undefined">
    <input
      ref="input"
      type="checkbox"
      class="jl-check__input"
      :checked="props.modelValue"
      :disabled="props.disabled"
      v-bind="$attrs"
      @change="onChange"
    />
    <span class="jl-check__box">
      <svg class="jl-check__mark" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="jl-check__dash" aria-hidden="true" />
    </span>
    <span v-if="props.label || props.description || $slots.default" class="jl-check__body">
      <span v-if="props.label || $slots.default" class="jl-check__label"><slot>{{ props.label }}</slot></span>
      <span v-if="props.description" class="jl-check__desc">{{ props.description }}</span>
    </span>
  </label>
</template>

<style src="./checkbox.css"></style>
