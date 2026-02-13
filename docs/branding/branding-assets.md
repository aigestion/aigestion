# AIGestion God Level Design System

This document captures the visual tokens and design language established during the Phase 4 & 5 "God Level" upgrade.

## Core Color Palette

| Token          | Hex       | Usage                                              |
| -------------- | --------- | -------------------------------------------------- |
| Nexus Cyan     | `#00F5FF` | Primary highlights, primary buttons, digital nodes |
| Nexus Violet   | `#8A2BE2` | Secondary glows, accents, background depth         |
| Nexus Silver   | `#E0E0E0` | Primary typography (light/thin)                    |
| Nexus Obsidian | `#050505` | Background base                                    |

## Advanced Backgrounds

### Smooth Mesh Gradient (`smooth-mesh-bg`)

The signature background used across the platform to replace legacy grain and flat colors.

```css
.smooth-mesh-bg {
  background:
    radial-gradient(circle at 0% 0%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(5, 5, 5, 1) 0%, rgba(0, 0, 0, 1) 100%);
  background-attachment: fixed;
}
```

## Typography Principles

- **Orbitron**: Used exclusively for headers, tracking numbers, and technical labels. Tracking should be set to `0.2em` to `0.3em` for maximum sovereign feel.
- **Inter/Sans**: Used for body copy with high contrast and generous line height.

## Interaction Guidelines

- **Premium Glass**: All cards use a `backdrop-blur-md` with a subtle white border (`border-white/5` to `border-white/10`).
- **Neon Glow**: Buttons and active nodes use `drop-shadow` effects matching the Nexus Cyan/Violet tokens.
