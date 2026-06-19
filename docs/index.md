---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "JLDS"
  text: "Own your components."
  tagline: A light-first, deep-emerald design system for rapid prototyping (dark theme opt-in). It exists to let a designer or agent stand up a polished, production-credible interface in minutes
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/jarooda/jlds

features:
  - title: Own your code
    details: Components are copied into your project as plain source files — no npm package, no version lock-in. Read it, edit it, ship it.
  - title: React & Vue
    details: jlds init auto-detects your framework (including Next.js and Nuxt) and scaffolds jlds.json accordingly.
  - title: No Tailwind required
    details: Every component ships self-contained .jl-* CSS classes built on CSS variable design tokens — Tailwind is optional.
  - title: HTML too
    details: Skip the CLI entirely — link css/index.css and css/<name>.css from jsDelivr and use the same classes directly.
---
