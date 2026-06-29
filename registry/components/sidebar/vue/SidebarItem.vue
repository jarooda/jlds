<script setup lang="ts">
import { inject, computed, type Ref } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    active?: boolean;
    badge?: string | number;
    href?: string;
    disabled?: boolean;
    title?: string;
  }>(),
  {
    label: "",
    active: false,
    badge: undefined,
    href: undefined,
    disabled: false,
    title: undefined,
  }
);

const ctx = inject<{ collapsed: Ref<boolean> }>("jlSidebar", { collapsed: { value: false } as Ref<boolean> });

const resolvedTitle = computed(() =>
  props.title != null ? props.title : ctx.collapsed.value && props.label ? props.label : undefined
);
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : 'button'"
    :href="href"
    class="jl-sidebar__item"
    :data-active="active || undefined"
    :aria-disabled="disabled || undefined"
    :aria-current="active ? 'page' : undefined"
    :title="resolvedTitle"
  >
    <span v-if="$slots.icon" class="jl-sidebar__item-icon"><slot name="icon" /></span>
    <span class="jl-sidebar__item-label"><slot>{{ label }}</slot></span>
    <span v-if="badge != null" class="jl-sidebar__item-badge">{{ badge }}</span>
    <span v-if="$slots.trailing" class="jl-sidebar__item-trail"><slot name="trailing" /></span>
  </component>
</template>
