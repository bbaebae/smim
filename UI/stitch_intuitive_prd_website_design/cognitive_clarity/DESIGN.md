---
name: Cognitive Clarity
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#454651'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#767683'
  outline-variant: '#c6c5d3'
  surface-tint: '#4b57aa'
  primary: '#132175'
  on-primary: '#ffffff'
  primary-container: '#2d3a8c'
  on-primary-container: '#9da9ff'
  inverse-primary: '#bbc3ff'
  secondary: '#136299'
  on-secondary: '#ffffff'
  secondary-container: '#82c1fd'
  on-secondary-container: '#004e7e'
  tertiary: '#4b2000'
  on-tertiary: '#ffffff'
  tertiary-container: '#6d3100'
  on-tertiary-container: '#f19a62'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000e5f'
  on-primary-fixed-variant: '#323f91'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#98cbff'
  on-secondary-fixed: '#001d33'
  on-secondary-fixed-variant: '#004a77'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#ffb68a'
  on-tertiary-fixed: '#321300'
  on-tertiary-fixed-variant: '#733504'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-reading:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-ui:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1120px
  gutter: 24px
---

## Brand & Style

The brand personality is intellectual, reliable, and unobtrusive. It aims to evoke a sense of "absorption"—the quiet, steady process of turning information into long-term knowledge. The UI is designed to disappear, leaving the user alone with their thoughts and the material they are mastering.

The visual style follows a **Modern Corporate** approach with a heavy emphasis on **Minimalism**. This design system prioritizes legibility and structural discipline. Every element serves a functional purpose, using whitespace not just as a design choice, but as a cognitive breathing room to reduce mental load during intensive study sessions.

## Colors

The palette is anchored in **Deep Indigo**, representing depth and institutional trust. **Water Blue** is utilized for interactive elements and highlights, suggesting fluidity and the movement of information.

The background uses a warm **Off-white** rather than a stark pure white to reduce eye strain during long-form reading and spaced repetition sessions. Text colors are categorized by hierarchy: Deep Indigo for primary headings to maintain brand presence, and a soft neutral slate for body copy to ensure comfort.

## Typography

The design system utilizes **Inter** for its exceptional readability in digital interfaces and its neutral, systematic character. 

Hierarchy is established through weight and scale rather than decorative flourishes. **Body-reading** is specifically optimized with a 1.6 line-height to facilitate deep focus during knowledge consumption. **Label-caps** are used for metadata, such as SRS (Spaced Repetition System) intervals and tag categories, providing a distinct visual break from content.

## Layout & Spacing

This design system employs a **Fixed Grid** model for content-heavy pages to ensure text lines do not become too wide for comfortable reading. The central content container is capped at 1120px, with margins that expand dynamically on larger displays.

A 8px base unit dictates the rhythm of the layout. Spacing between related items (like a question and its answer) uses `sm` (12px), while major section breaks use `lg` (48px) to provide clear visual separation.

## Elevation & Depth

Depth is communicated through **Ambient Shadows** and **Tonal Layers**. Instead of harsh borders, the design system uses extremely soft, low-opacity shadows (Indigo-tinted) to lift cards from the Off-white background.

1.  **Level 0 (Base):** Off-white background (#F8F7F4).
2.  **Level 1 (Surface):** Pure White cards (#FFFFFF) with a 4px blur, 2% opacity indigo shadow.
3.  **Level 2 (Active/Hover):** Pure White cards with an 8px blur, 6% opacity indigo shadow, creating a subtle "lift" effect when interacting with knowledge cards.

## Shapes

The design system uses **Soft (Level 1)** roundedness to maintain a professional and structured aesthetic. A 4px (0.25rem) radius is the standard for most UI components, providing enough softness to feel modern without losing the precision of a high-end productivity tool.

- **Standard Buttons/Inputs:** 4px radius.
- **Large Cards:** 8px (0.5rem) radius.
- **Search Bars:** Fully rounded (pill) to distinguish them as global utility elements.

## Components

### Buttons
Primary buttons use the Deep Indigo background with White text. Secondary buttons use a Water Blue ghost style (border only) or a subtle light-blue tint. Interactions should be calm, with color shifts rather than dramatic scaling.

### Knowledge Cards
The core of the system. Cards feature a white surface, subtle Level 1 shadow, and 8px rounded corners. Content within the card follows the 1.6 line-height rule for maximum clarity.

### Chips & Tags
Tags for categorization use a semi-transparent Water Blue background with Deep Indigo text. This ensures they are visible but do not compete with primary action buttons.

### Progress Indicators
For spaced repetition tracking, use thin, horizontal linear bars in Water Blue. Avoid circular "gamified" rings to keep the interface feeling professional and focused on long-term mastery rather than short-term dopamine.

### Input Fields
Inputs are minimal, featuring a 1px border in a light indigo-grey. On focus, the border transitions to Water Blue with a soft glow (glow opacity 10%).