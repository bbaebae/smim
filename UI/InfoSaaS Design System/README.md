# InfoSaaS Design System

## Overview

**Product**: 다양한 정보들을 관리하고 재사용하는 정보 SaaS 웹사이트  
**Translation**: An information SaaS website for managing and reusing various types of information.

This is a web-based SaaS platform focused on helping users organize, retrieve, and reuse structured information. Think of it as a knowledge management layer — a tool where documents, data, notes, and references are collected, tagged, and made searchable/reusable.

**Design Inspiration**: Stripe's design system — technically precise, premium, typographically sophisticated. The system prioritizes clarity and confidence over decoration.

### Sources
- No external codebase or Figma provided. Design system built from detailed written spec.
- Font: `sohne-var` (proprietary). Closest Google Fonts match used: **DM Sans** (variable, geometric, similar weight range). Flag: if original `sohne-var` files become available, replace the `@font-face` in `colors_and_type.css` and update `fonts/`.
- Monospace: `SourceCodePro` → loaded via Google Fonts (`Source Code Pro`).

---

## File Index

```
README.md                   ← This file
SKILL.md                    ← Agent skill definition
colors_and_type.css         ← All CSS custom properties (colors, type, spacing, elevation)
fonts/                      ← Web font files (if added)
assets/                     ← Logos, icons, illustrations
preview/                    ← Design System tab cards
  colors-primary.html
  colors-brand-dark.html
  colors-accent.html
  colors-neutral.html
  colors-surface.html
  colors-shadow.html
  type-display.html
  type-body.html
  type-mono.html
  type-scale.html
  spacing-tokens.html
  elevation-system.html
  border-radius.html
  btn-primary.html
  btn-ghost.html
  btn-states.html
  badges.html
  inputs.html
  cards.html
  navigation.html
ui_kits/
  webapp/
    README.md
    index.html
    Header.jsx
    Sidebar.jsx
    InfoCard.jsx
    DataTable.jsx
    SearchBar.jsx
    TagBadge.jsx
```

---

## CONTENT FUNDAMENTALS

### Tone & Voice
- **Clean, confident, neutral**: Korean SaaS — language should feel professional without corporate stiffness.
- **Direct**: No fluff. Labels name things exactly. "정보 관리" not "스마트한 정보 경험".
- **Action-oriented UI copy**: Buttons use verbs. "저장", "추가", "검색", "내보내기" — not nouns.
- **No emoji in UI**: The system does not use emoji as UI decoration. Emoji may appear in user-generated content but never in system UI.
- **Casing**: Sentence case for all body, labels, nav items. Title case only for product names.
- **Numbers**: Always tabular (`"tnum"`) in data contexts. Korean numerals mixed with Arabic in headings where appropriate.

### Copy Examples
- Hero: "정보를 모으고, 찾고, 다시 쓰세요." (Collect, find, reuse your information.)
- CTA: "지금 시작하기" / "무료로 시작"
- Empty state: "아직 저장된 정보가 없습니다."
- Error: "문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
- Success: "저장되었습니다."

---

## VISUAL FOUNDATIONS

### Color
- **White canvas** (`#ffffff`): All surfaces default to pure white.
- **Deep Navy headings** (`#061b31`): Primary text/heading — not black, has warmth.
- **Stripe Purple** (`#533afd`): Primary interactive color, CTAs, links.
- **Brand Dark** (`#1c1e54`): Dark section backgrounds, footers, immersive brand moments.
- **Ruby + Magenta** (`#ea2261`, `#f96bee`): Decorative only — gradients, hero accents.

### Typography
- **sohne-var** (substituted: DM Sans variable): All UI text. Weight 300 for headings/body, 400 for buttons/labels.
- **SourceCodePro**: All code, monospace labels, technical data.
- **`font-feature-settings: "ss01"`**: Enabled on all primary font usage.
- **`"tnum"`**: Financial/tabular data only.
- Light weight (300) headlines are the brand signature — never use 600–700 on headings.

### Backgrounds
- Primary: flat white `#ffffff`
- Dark sections: `#1c1e54` (deep brand indigo) — used for footers, CTAs, hero variants
- No gradients on page backgrounds; gradients only for decorative accents
- No textures, no patterns, no photography as backgrounds

### Spacing
- Base unit: 8px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.
- Dense at small end (financial data packing), generous chrome around dense areas.

### Animation
- Subtle, purposeful: hover shadows deepen, colors darken slightly.
- No bounces, no spring physics. Easing: `ease-out` for reveals, `ease` for color transitions.
- Transition duration: 120–200ms for interactive states.

### Hover / Press States
- Buttons: background darkens (purple `#533afd` → `#4434d4`)
- Ghost buttons: faint background appears (`rgba(83,58,253,0.05)`)
- Cards: shadow intensifies
- Links: color deepens

### Borders
- `1px solid #e5edf5` — standard card/input border
- `1px solid #b9b9f9` — active/selected purple-tinted border
- `1px dashed #362baa` — drop zones, placeholder areas

### Shadows (Blue-tinted, multi-layer)
- Ambient: `rgba(23,23,23,0.06) 0px 3px 6px`
- Standard: `rgba(23,23,23,0.08) 0px 15px 35px`
- Elevated: `rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px`
- Blue tint (`rgba(50,50,93,...)`) is brand-colored; shadows feel atmospheric not neutral.

### Border Radius
- 4px: buttons, inputs, badges, most cards (workhorse)
- 5–6px: standard containers, nav
- 8px: featured cards, hero elements
- Never pill-shaped (border-radius > 12px) on any UI element

### Cards
- White background, `1px solid #e5edf5`, 4–8px radius
- Blue-tinted multi-layer shadow on elevated state
- Clean interior: generous padding, light type hierarchy

### Imagery
- Product screenshots shown in contained cards with blue-tinted shadows
- No photography as section backgrounds
- Color vibe: cool, blue-adjacent — no warm filters

### Blur / Transparency
- Nav sticky header uses `backdrop-filter: blur(12px)` on scroll
- Dark overlays: `rgba(1c1e54, 0.8)` for modals
- Otherwise: minimal use of transparency

### Iconography (see ICONOGRAPHY section)

---

## ICONOGRAPHY

No proprietary icon system was provided. This design system uses **Lucide Icons** (CDN) as the icon library.

- **Style**: Stroke-based, 1.5px stroke weight, rounded joins — matches the system's clean aesthetic
- **Size**: 16px (inline/label), 20px (standard), 24px (section headers)
- **Color**: Inherits text color, or uses semantic colors (purple for active, slate for passive)
- **No emoji** as icons
- **No unicode char icons**
- **CDN**: `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`

Usage in HTML:
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="search"></i>
<script>lucide.createIcons();</script>
```

---

## Notes & Caveats

1. **Font substitution**: `sohne-var` is a proprietary Stripe font. We use **DM Sans** (Google Fonts variable) as the closest geometric match. If you have `sohne-var.woff2`, add it to `fonts/` and update `colors_and_type.css`.
2. **No logo provided**: A wordmark placeholder is used in UI kits. Replace `assets/logo.svg` with the real logo.
3. **Korean locale**: Components use Korean placeholder copy. Date/number formatting follows Korean conventions in data tables.
