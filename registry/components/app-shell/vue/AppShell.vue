<script setup lang="ts">
import { ref, computed, provide, onMounted, onBeforeUnmount, watch, type CSSProperties, type Ref } from "vue";

export interface AppShellCtx {
  open: Ref<boolean>;
  setOpen: (open: boolean) => void;
}

const props = withDefaults(
  defineProps<{
    padded?: boolean;
    fullHeight?: boolean;
    mobileBreakpoint?: number;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
  }>(),
  {
    padded: false,
    fullHeight: true,
    mobileBreakpoint: 880,
    mobileOpen: undefined,
    defaultMobileOpen: false,
  }
);

const emit = defineEmits<{ (e: "update:mobileOpen", value: boolean): void }>();

const mobile = ref(false);
const internalOpen = ref(props.defaultMobileOpen);
const isControlled = computed(() => props.mobileOpen != null);
const open = computed(() => (isControlled.value ? props.mobileOpen! : internalOpen.value));

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit("update:mobileOpen", next);
}

let mql: MediaQueryList | null = null;
function apply() {
  if (mql) mobile.value = mql.matches;
}

onMounted(() => {
  if (typeof window === "undefined" || !window.matchMedia) return;
  mql = window.matchMedia(`(max-width: ${props.mobileBreakpoint}px)`);
  apply();
  mql.addEventListener("change", apply);
});
onBeforeUnmount(() => {
  if (mql) mql.removeEventListener("change", apply);
});

// Close the drawer when leaving mobile.
watch(mobile, (m) => {
  if (!m && open.value) setOpen(false);
});

provide<AppShellCtx>("jlAppShell", { open, setOpen });

const rootStyle = computed<CSSProperties>(() => ({
  height: props.fullHeight ? "100dvh" : "100%",
}));
</script>

<template>
  <div
    class="jl-appshell"
    :data-mobile="mobile || undefined"
    :data-open="mobile && open ? 'true' : undefined"
    :style="rootStyle"
  >
    <div v-if="$slots.sidebar" class="jl-appshell__aside"><slot name="sidebar" /></div>
    <div v-if="mobile" class="jl-appshell__backdrop" aria-hidden="true" @click="setOpen(false)" />
    <div class="jl-appshell__main">
      <div v-if="$slots.header" class="jl-appshell__header"><slot name="header" /></div>
      <div :class="['jl-appshell__content', padded ? 'jl-appshell__content--padded' : '']">
        <slot />
      </div>
    </div>
  </div>
</template>

<style src="./app-shell.css"></style>
