<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    invalid?: boolean;
    modelValue?: string;
  }>(),
  { invalid: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
}
</script>

<template>
  <textarea
    class="jl-textarea"
    :value="props.modelValue"
    :aria-invalid="props.invalid || undefined"
    v-bind="$attrs"
    @input="onInput"
  />
</template>

<style src="./textarea.css"></style>
