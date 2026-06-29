<script setup lang="ts">
import { inject } from "vue";
import type { AppShellCtx } from "./AppShell.vue";

const ctx = inject<AppShellCtx>("jlAppShell")!;
</script>

<template>
  <button
    type="button"
    class="jl-appshell__menubtn"
    :aria-label="ctx.open.value ? 'Close navigation' : 'Open navigation'"
    :aria-expanded="ctx.open.value"
    @click="ctx.setOpen(!ctx.open.value)"
  >
    <slot>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" /></svg>
    </slot>
  </button>
</template>
