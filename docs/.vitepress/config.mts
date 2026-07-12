import { defineConfig } from 'vitepress'

// Resolve the latest published version at build time so the nav can show it
// without a client-side request. Falls back to empty (hidden) if npm is
// unreachable during the build.
async function getNpmVersion(): Promise<string> {
  try {
    const res = await fetch('https://registry.npmjs.org/@jarooda/jlds/latest')
    if (!res.ok) return ''
    const data = (await res.json()) as { version?: string }
    return data.version ?? ''
  } catch {
    return ''
  }
}

const npmVersion = await getNpmVersion()

// Shared by the /cli/ and /registry/ prefixes so both sections appear under the
// single "Reference" nav item.
const referenceSidebar = [
  {
    text: 'CLI Reference',
    items: [
      { text: 'Overview & Config', link: '/cli/' },
      { text: 'init', link: '/cli/init' },
      { text: 'add', link: '/cli/add' },
      { text: 'update', link: '/cli/update' },
      { text: 'list', link: '/cli/list' }
    ]
  },
  {
    text: 'Registry',
    items: [
      { text: 'How it works', link: '/registry/' },
      { text: 'Self-hosting', link: '/registry/self-hosting' }
    ]
  }
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "jlds",
  description: "Design system for rapid prototyping. It exists to let a designer or agent stand up a polished, production-credible interface in minutes.",
  sitemap: { hostname: 'https://jlds.jaluwibowo.id' },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',
    // Exposed to the custom Layout slot (see theme/index.ts → NpmVersion.vue).
    npmVersion,
    nav: [
      { text: 'Guide', link: '/guide/what-is-jlds' },
      { text: 'Components', link: '/components/' },
      { text: 'Reference', link: '/cli/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is JLDS?', link: '/guide/what-is-jlds' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        },
        {
          text: 'Customization',
          items: [
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Responsive', link: '/guide/responsive' },
            { text: 'HTML', link: '/guide/vanilla-html' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'Accordion', link: '/components/accordion' },
            { text: 'Alert', link: '/components/alert' },
            { text: 'App Shell', link: '/components/app-shell' },
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Banner', link: '/components/banner' },
            { text: 'Bottom Nav', link: '/components/bottom-nav' },
            { text: 'Breadcrumb', link: '/components/breadcrumb' },
            { text: 'Button', link: '/components/button' },
            { text: 'Card', link: '/components/card' },
            { text: 'Carousel', link: '/components/carousel' },
            { text: 'Chart', link: '/components/chart' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Collapsible', link: '/components/collapsible' },
            { text: 'Combobox', link: '/components/combobox' },
            { text: 'Command Palette', link: '/components/command-palette' },
            { text: 'Date Picker', link: '/components/date-picker' },
            { text: 'Dialog', link: '/components/dialog' },
            { text: 'Divider', link: '/components/divider' },
            { text: 'Drawer', link: '/components/drawer' },
            { text: 'Dropdown Menu', link: '/components/dropdown-menu' },
            { text: 'Empty State', link: '/components/empty-state' },
            { text: 'Field', link: '/components/field' },
            { text: 'File Upload', link: '/components/file-upload' },
            { text: 'Icon Button', link: '/components/icon-button' },
            { text: 'Input', link: '/components/input' },
            { text: 'Kbd', link: '/components/kbd' },
            { text: 'Number Input', link: '/components/number-input' },
            { text: 'Page Header', link: '/components/page-header' },
            { text: 'Pagination', link: '/components/pagination' },
            { text: 'Popover', link: '/components/popover' },
            { text: 'Progress', link: '/components/progress' },
            { text: 'Radio Group', link: '/components/radio-group' },
            { text: 'Rating', link: '/components/rating' },
            { text: 'Resizable', link: '/components/resizable' },
            { text: 'Responsive Table', link: '/components/responsive-table' },
            { text: 'Scroll Area', link: '/components/scroll-area' },
            { text: 'Segmented Control', link: '/components/segmented-control' },
            { text: 'Select', link: '/components/select' },
            { text: 'Sidebar', link: '/components/sidebar' },
            { text: 'Skeleton', link: '/components/skeleton' },
            { text: 'Slider', link: '/components/slider' },
            { text: 'Snippet', link: '/components/snippet' },
            { text: 'Spinner', link: '/components/spinner' },
            { text: 'Stat', link: '/components/stat' },
            { text: 'Stepper', link: '/components/stepper' },
            { text: 'Swipe Row', link: '/components/swipe-row' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Table', link: '/components/table' },
            { text: 'Tabs', link: '/components/tabs' },
            { text: 'Tag', link: '/components/tag' },
            { text: 'Textarea', link: '/components/textarea' },
            { text: 'Timeline', link: '/components/timeline' },
            { text: 'Toast', link: '/components/toast' },
            { text: 'Toggle', link: '/components/toggle' },
            { text: 'Toolbar', link: '/components/toolbar' },
            { text: 'Tooltip', link: '/components/tooltip' },
            { text: 'Tree View', link: '/components/tree-view' }
          ]
        }
      ],
      // CLI and Registry share one sidebar so both live under the single
      // "Reference" nav item. Bound to both prefixes so the full sidebar
      // shows regardless of which section the visitor lands on.
      '/cli/': referenceSidebar,
      '/registry/': referenceSidebar
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jarooda/jlds' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present <a href="https://jaluwibowo.id" target="_blank" rel="noopener">Jalu Wibowo Aji</a>'
    }
  },
  base: '/'
})
