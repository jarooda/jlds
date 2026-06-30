<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'
import { VIEWPORTS, viewportWidth } from '../viewport'
import DeviceIcon from './DeviceIcon.vue'

defineProps<{ src: string }>()

// The active viewport, shown as a caption only when constrained (not "Fit"), so
// readers know why a preview looks narrow / scrolls. At Fit there's nothing to show.
const activeViewport = computed(() =>
  VIEWPORTS.find((w) => w.value === viewportWidth.value)
)

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
  <!-- Width is driven by the shared viewportWidth store (ViewportControl.vue at
       the top of the page), so one control flips every example at once. null =
       Fit (fills the column); a px value narrows the frame so the media queries
       inside it fire. Wider-than-column widths scroll inside the stage. -->
  <div
    v-if="activeViewport && activeViewport.value"
    class="jlds-preview-vp"
    :title="`Previewing at ${activeViewport.label} width`"
  >
    <DeviceIcon :name="activeViewport.icon" />
    <span>Example of {{ activeViewport.label }} · {{ activeViewport.value }}px</span>
  </div>
  <div class="jlds-preview-stage">
    <iframe
      ref="frame"
      :src="src"
      :style="{ height: height + 'px', width: viewportWidth ? viewportWidth + 'px' : '100%' }"
      class="jlds-preview"
      :class="{ dark: isDark }"
      sandbox="allow-scripts"
      loading="lazy"
      title="Component preview"
      @load="sendTheme"
    />
  </div>
</template>

<style scoped>
/* Small caption naming the active viewport — only shown when constrained. */
.jlds-preview-vp {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 16px 0 -4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
/* Center narrow viewports; scroll (don't clamp) viewports wider than the docs
   column. `safe center` keeps the left edge reachable when the frame overflows. */
.jlds-preview-stage {
  display: flex;
  justify-content: safe center;
  overflow-x: auto;
  margin: 16px 0;
}
.jlds-preview {
  display: block;
  flex: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: width 0.2s ease;
  /* Match the JLDS surface so there's no flash before the iframe paints. */
  background: #f3f5f3;
}
.jlds-preview.dark {
  background: #0a0d0c;
}

@media (prefers-reduced-motion: reduce) {
  .jlds-preview {
    transition: none;
  }
}
</style>
