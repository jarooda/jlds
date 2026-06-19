# Components

All components are self-contained — each ships its own `.jl-*` CSS classes built on the
[design tokens](/guide/theming) and works with or without Tailwind.

| Component | Frameworks | Status |
|---|---|---|
| [Avatar](/components/avatar) | React, Vue | Available |
| [Badge](/components/badge) | React, Vue | Available |
| [Button](/components/button) | React, Vue | Available |
| [Divider](/components/divider) | React, Vue | Available |
| [Kbd](/components/kbd) | React, Vue | Available |
| [Skeleton](/components/skeleton) | React, Vue | Available |
| [Spinner](/components/spinner) | React, Vue | Available |
| Input | React, Vue | Planned |

Run `jlds list` from a project with `jlds.json` to see what's available for your detected
framework — see [CLI: list](/cli/list).

Regardless of the "Frameworks" column, every component's `.jl-*` CSS classes also work
directly in plain HTML — no CLI or framework required, see [HTML](/guide/vanilla-html).
