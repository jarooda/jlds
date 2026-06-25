<script setup lang="ts">
import { computed } from "vue";

type KbdSize = "sm" | "md";

const props = withDefaults(
  defineProps<{
    keys?: string[];
    size?: KbdSize;
  }>(),
  { keys: undefined, size: "md" }
);

const PRETTY: Record<string, string> = {
  mod: "⌘", cmd: "⌘", meta: "⌘", shift: "⇧", alt: "⌥", option: "⌥",
  ctrl: "⌃", control: "⌃", enter: "↵", return: "↵", esc: "Esc",
  escape: "Esc", tab: "Tab", up: "↑", down: "↓", left: "←", right: "→",
  backspace: "⌫", del: "⌦", delete: "⌦", space: "Space",
};

function prettify(k: string): string {
  return PRETTY[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k);
}

const cls = computed(() =>
  ["jl-kbd", props.size === "sm" ? "jl-kbd--sm" : ""].filter(Boolean).join(" ")
);
</script>

<template>
  <span v-if="props.keys && props.keys.length" class="jl-kbd-group">
    <template v-for="(k, i) in props.keys" :key="i">
      <span v-if="i > 0" class="jl-kbd-group__plus" aria-hidden="true">+</span>
      <kbd :class="cls">{{ prettify(k) }}</kbd>
    </template>
  </span>
  <kbd v-else :class="cls"><slot /></kbd>
</template>

<style src="./kbd.css"></style>
