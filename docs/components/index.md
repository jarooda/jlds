# Components

All components are self-contained — each ships its own `.jl-*` CSS classes built on the
[design tokens](/guide/theming) and works with or without Tailwind.

| Component | Frameworks | Status |
|---|---|---|
| [Button](/components/button) | React, Vue | Available |
| Input | React, Vue | Planned |
| Badge | React, Vue | Planned |

Run `jlds list` from a project with `jlds.json` to see what's available for your detected
framework — see [CLI: list](/cli/list).

Regardless of the "Frameworks" column, every component's `.jl-*` CSS classes also work
directly in plain HTML — no CLI or framework required, see [HTML](/guide/vanilla-html).
