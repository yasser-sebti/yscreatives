# Design & Typography Guide - Yasser Creatives

## Core Colors

| Key | Variable | Value | Usage |
|-----|----------|-------|-------|
| Void Black | `--void-black` | `#000000` | Primary Background |
| Void White | `--void-white` | `#ffffff` | Primary Type |
| Void Muted | `--void-muted` | `rgba(255,255,255,0.7)` | Secondary descriptions, sub-headings |
| Void Subtle| `--void-subtle`| `rgba(255,255,255,0.15)`| Borders, separators |
| Accelerator | `--void-accent`| `#4ade80` | Interactive accents (rare) |

## Font Families

- **Serif**: `--font-serif: 'PP Editorial New', Georgia, serif;`
    - *Weights*: 200 (Ultralight), 400 (Regular)
    - *Usage*: Main display titles, logo, luxury storytelling.
- **Mono**: `--font-mono: 'SF Mono', 'Fira Code', monospace;`
    - *Usage*: Navigation, bylines, labels, technical metadata.

## Type Scale

| Token | Size (Clamp / Rem) | Usage Examples |
|-------|--------------------|----------------|
| `--text-micro` | `0.875rem` | Fine print, metadata |
| `--text-small` | `1rem` | Brands labels, scroll indicators, methodology steps |
| `--text-button`| `1rem` | Primary CTA buttons |
| `1.125rem` | (Raw val) | Navigation links, methodology descriptions, human subtitles |
| `--text-body`  | `1.25rem` | Portfolio category, detailed Mono text |
| `--text-display-sm` | `clamp(2rem, 5vw, 3.5rem)` | Human-Designed statement |
| `--text-display-md` | `clamp(3rem, 7vw, 6rem)` | Methodology names, Portfolio titles, Service names |
| `--text-display-lg` | `clamp(5rem, 12vw, 12rem)`| Section Titles (Methodology, Services) |
| `--text-display-xl` | `clamp(6rem, 14vw, 18rem)`| Large accent displays |
| `--text-display-hero`| `clamp(5rem, 12vw, 16rem)`| Primary Hero Title |

## Structural Hierarchy & Spacing

### Cursor Interaction
- **Cursor Label**: `--text-micro` (9px) / `PP Editorial New` / 500 Weight / 0.15em Letter Spacing.
- **Glass Disk**: `backdrop-filter: blur(12px)` / `rgba(255, 255, 255, 0.9)` background.

### Hero Composition
- **Title**: `--text-display-hero`, `1.1` line-height, `-0.04em` letter-spacing.
- **Byline**: `1.25rem` Mono, `0.3em` letter-spacing, `0.7` opacity.
- **Vertical Rhythm**:
    - Title → Byline: `4vh`
    - Byline → Statement: `5vh`
    - Statement → CTA: `3vh`
    - CTA → Scroll: `4vh`

### Section Patterns
- **Section Padding**: `--space-xl` (8rem) to `--space-section` (12vh).
- **Grid Margins**: `--grid-margin: 6vw` (used for global horizontal padding).
- **Transitions**: `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` for all reveals.
