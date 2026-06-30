import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import Preview from './components/Preview.vue'
import NpmVersion from './components/NpmVersion.vue'
import ViewportControl from './components/ViewportControl.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(NpmVersion),
      // Floating viewport switcher — drives every <Preview> on the page via the
      // shared viewportWidth store.
      'doc-before': () => h(ViewportControl)
    })
  },
  enhanceApp({ app }) {
    app.component('Preview', Preview)
  }
} satisfies Theme
