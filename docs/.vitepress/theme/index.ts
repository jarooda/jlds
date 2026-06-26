import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import Preview from './components/Preview.vue'
import NpmVersion from './components/NpmVersion.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(NpmVersion)
    })
  },
  enhanceApp({ app }) {
    app.component('Preview', Preview)
  }
} satisfies Theme
