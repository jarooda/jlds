<script setup lang="ts">
import { computed } from "vue";

type RadioOption =
  | string
  | { value: string; label: string; description?: string; disabled?: boolean };

const props = withDefaults(
  defineProps<{
    name: string;
    modelValue?: string;
    options: RadioOption[];
    direction?: "column" | "row";
    disabled?: boolean;
  }>(),
  { direction: "column", disabled: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const normalized = computed(() =>
  props.options.map((o) => (typeof o === "string" ? { value: o, label: o } : o))
);
</script>

<template>
  <div
    class="jl-radiogroup"
    :class="props.direction === 'row' ? 'jl-radiogroup--row' : ''"
    role="radiogroup"
  >
    <label
      v-for="opt in normalized"
      :key="opt.value"
      class="jl-radio"
      :data-disabled="(props.disabled || opt.disabled) || undefined"
    >
      <input
        type="radio"
        class="jl-radio__input"
        :name="props.name"
        :value="opt.value"
        :checked="props.modelValue === opt.value"
        :disabled="props.disabled || opt.disabled"
        @change="emit('update:modelValue', opt.value)"
      />
      <span class="jl-radio__dot" />
      <span class="jl-radio__body">
        <span class="jl-radio__label">{{ opt.label }}</span>
        <span v-if="opt.description" class="jl-radio__desc">{{ opt.description }}</span>
      </span>
    </label>
  </div>
</template>

<style src="./radio-group.css"></style>
