<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'

defineProps<{ src: string }>()

const { isDark } = useData()
const frame = ref<HTMLIFrameElement | null>(null)
const height = ref(60)

// Tell the preview document which JLDS theme to render (data-theme="dark").
function sendTheme() {
  frame.value?.contentWindow?.postMessage(
    { type: 'jlds-preview-theme', dark: isDark.value },
    '*'
  )
}

function onMessage(event: MessageEvent) {
  if (event.source !== frame.value?.contentWindow) return
  if (event.data?.type === 'jlds-preview-height') {
    height.value = event.data.height
  } else if (event.data?.type === 'jlds-preview-ready') {
    sendTheme()
  }
}

// Re-sync whenever the site's appearance toggle flips.
watch(isDark, sendTheme)

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <iframe
    ref="frame"
    :src="src"
    :style="{ height: height + 'px' }"
    class="jlds-preview"
    :class="{ dark: isDark }"
    sandbox="allow-scripts"
    loading="lazy"
    title="Component preview"
    @load="sendTheme"
  />
</template>

<style scoped>
.jlds-preview {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 16px 0;
  /* Match the JLDS surface so there's no flash before the iframe paints. */
  background: #f3f5f3;
}
.jlds-preview.dark {
  background: #0a0d0c;
}
</style>
