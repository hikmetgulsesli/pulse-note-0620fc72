---
name: Pulse Note Design System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3e4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7f4025'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c573a'
  on-tertiary-container: '#ffe5db'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb598'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#72361b'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system focuses on "dense but calm" utility. It is engineered for high-productivity environments where information density is a requirement, not a hindrance. The aesthetic follows a **Minimalist Corporate** approach, stripping away ornamental flourishes to prioritize data clarity and user efficiency. 

The brand personality is precise, reliable, and unobtrusive. It seeks to evoke a sense of professional mastery, allowing users to feel in control of complex workflows without cognitive overload. Visual interest is achieved through rhythmic spacing and subtle tonal shifts rather than aggressive colors or shapes.

## Colors
This design system utilizes a professional, cool-toned palette. 

- **Primary (Deep Teal):** Used exclusively for primary actions, focus states, and meaningful progress indicators. It provides a calm but distinct "pulse" within the interface.
- **Neutral Base:** A sophisticated range of Slate and Gray scales. The background uses a soft off-white (`#F8FAFC`) to reduce eye strain, while borders use a crisp light gray (`#E2E8F0`) to define structure.
- **Semantic Colors:** Error (Red), Warning (Amber), and Success (Emerald) should be used sparingly in desaturated tones to maintain the "calm" aesthetic while providing necessary feedback.

## Typography
The system uses **Inter** for all roles to leverage its exceptional legibility and systematic feel. 

- **Headlines:** Use tighter letter-spacing and semi-bold weights to anchor page sections.
- **Body:** Set at 14px for the standard `body-md` to allow for high-density layouts while maintaining a comfortable line height of 1.4-1.5x.
- **Labels:** Utilized for metadata, table headers, and small UI cues. Uppercase is reserved for the smallest label size to ensure distinctiveness.

## Layout & Spacing
The design system employs a **4px baseline grid** to achieve a "dense but calm" rhythm. 

- **Grid:** A 12-column fluid grid for desktop with 16px gutters. For data-heavy utility views, a "Compact Mode" is supported where vertical spacing is halved.
- **Margins:** Desktop containers use 32px outer margins. Mobile views collapse to 16px.
- **Density:** High density is achieved by reducing vertical padding on list items and table cells (8px) while maintaining wider horizontal gaps (16px) to guide the eye across rows.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Subtle Outlines**. 

- **Level 0 (Base):** The primary background color.
- **Level 1 (Cards/Surfaces):** White background with a 1px solid border (`#E2E8F0`). No shadow.
- **Level 2 (Interactive/Floating):** White background with a soft, neutral shadow: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`.
- **Level 3 (Modals):** A more pronounced shadow to create distinct separation: `0 20px 25px -5px rgb(0 0 0 / 0.1)`.

Avoid heavy blurs. Use borders as the primary method of defining containment.

## Shapes
The shape language is **Soft** and systematic. 

Standard components (buttons, inputs) use a 4px (0.25rem) radius to maintain a professional, sharp-edged appearance that feels modern but grounded. Cards and larger containers use an 8px (0.5rem) radius to slightly soften the overall layout.

## Components
- **Buttons:** Primary buttons use the Deep Teal fill with white text. Secondary buttons use a subtle gray border and slate text. Padding is 8px vertical by 16px horizontal for standard density.
- **Input Fields:** Use a 1px border. On focus, the border transitions to Primary Teal with a subtle 2px outer glow (ring).
- **Tables:** Table headers use `label-sm` with a background tint of `#F1F5F9`. Rows have 1px bottom borders. No vertical lines. Hover states on rows use a very faint gray fill.
- **Metric Cards:** Use `headline-md` for the value and `label-md` for the category title. Metrics include a 1px border and are grouped with tight 16px spacing.
- **Chips:** Small, low-contrast pills (4px radius) used for tagging and status. Backgrounds are desaturated versions of semantic colors.
- **Lists:** High-density vertical stacks with 8px of internal padding. Left-aligned icons are used to provide quick visual scanning.