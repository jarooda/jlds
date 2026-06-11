import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "jlds",
  description: "Design system for rapid prototyping. It exists to let a designer or agent stand up a polished, production-credible interface in minutes.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
            { text: 'Button', link: '/components/button' }
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
