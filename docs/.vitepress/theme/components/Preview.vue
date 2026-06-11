<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps<{ src: string }>()

const frame = ref<HTMLIFrameElement | null>(null)
const height = ref(60)

function onMessage(event: MessageEvent) {
  if (
    event.data?.type === 'jlds-preview-height' &&
    event.source === frame.value?.contentWindow
  ) {
    height.value = event.data.height
  }
}

onMounted(() => window.addEventListener('message', onMessage))
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <iframe
    ref="frame"
    :src="src"
    :style="{ height: height + 'px' }"
    class="jlds-preview"
    sandbox="allow-scripts"
    loading="lazy"
    title="Component preview"
  />
</template>

<style scoped>
.jlds-preview {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 16px 0;
  background: #0a0d0c;
}
</style>
