import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "jlds",
  description: "Design system for rapid prototyping. It exists to let a designer or agent stand up a polished, production-credible interface in minutes.",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/what-is-jlds' },
      { text: 'Components', link: '/components/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Registry', link: '/registry/' }
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
            { text: 'HTML', link: '/guide/vanilla-html' }
          ]
        }
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            { text: 'Alert', link: '/components/alert' },
            { text: 'Avatar', link: '/components/avatar' },
            { text: 'Badge', link: '/components/badge' },
            { text: 'Banner', link: '/components/banner' },
            { text: 'Button', link: '/components/button' },
            { text: 'Checkbox', link: '/components/checkbox' },
            { text: 'Divider', link: '/components/divider' },
            { text: 'Icon Button', link: '/components/icon-button' },
            { text: 'Input', link: '/components/input' },
            { text: 'Kbd', link: '/components/kbd' },
            { text: 'Progress', link: '/components/progress' },
            { text: 'Radio Group', link: '/components/radio-group' },
            { text: 'Select', link: '/components/select' },
            { text: 'Skeleton', link: '/components/skeleton' },
            { text: 'Slider', link: '/components/slider' },
            { text: 'Spinner', link: '/components/spinner' },
            { text: 'Stat', link: '/components/stat' },
            { text: 'Switch', link: '/components/switch' },
            { text: 'Tag', link: '/components/tag' },
            { text: 'Textarea', link: '/components/textarea' }
          ]
        }
      ],
      '/cli/': [
        {
          text: 'CLI Reference',
          items: [
            { text: 'Overview & Config', link: '/cli/' },
            { text: 'init', link: '/cli/init' },
            { text: 'add', link: '/cli/add' },
            { text: 'update', link: '/cli/update' },
            { text: 'list', link: '/cli/list' }
          ]
        }
      ],
      '/registry/': [
        {
          text: 'Registry',
          items: [
            { text: 'How it works', link: '/registry/' },
            { text: 'Self-hosting', link: '/registry/self-hosting' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jarooda/jlds' }
    ]
  },
  base: '/'
})
