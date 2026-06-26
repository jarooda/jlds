<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()

// Start from the version baked in at build time (instant render, no flash),
// then refresh from jsDelivr's CDN-cached API on mount so the badge stays
// current between docs rebuilds.
const version = ref((theme.value as { npmVersion?: string }).npmVersion ?? '')

onMounted(async () => {
  try {
    const res = await fetch(
      'https://data.jsdelivr.com/v1/packages/npm/@jarooda/jlds/resolved'
    )
    if (!res.ok) return
    const data = (await res.json()) as { version?: string }
    if (data.version) version.value = data.version
  } catch {
    // Offline or rate-limited — keep the build-time value.
  }
})
</script>

<template>
  <a
    v-if="version"
    class="npm-version"
    href="https://www.npmjs.com/package/@jarooda/jlds"
    target="_blank"
    rel="noopener"
    :title="`@jarooda/jlds@${version} on npm`"
  >
    v{{ version }}
  </a>
</template>

<style scoped>
.npm-version {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  margin-right: 8px;
  margin-left: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-2);
  transition: color 0.25s, border-color 0.25s;
}
.npm-version:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
</style>
