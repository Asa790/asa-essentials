---
name: Pastel Stationery & Coquette Desk
colors:
  surface: '#fff8f7'
  surface-dim: '#ffcdd6'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f1'
  surface-container: '#ffe9eb'
  surface-container-high: '#ffe1e5'
  surface-container-highest: '#ffd9df'
  on-surface: '#3a0818'
  on-surface-variant: '#584143'
  inverse-surface: '#541d2c'
  inverse-on-surface: '#ffecee'
  outline: '#8c7073'
  outline-variant: '#dfbfc2'
  surface-tint: '#b0284b'
  primary: '#b0284b'
  on-primary: '#ffffff'
  primary-container: '#ff6584'
  on-primary-container: '#6a0024'
  inverse-primary: '#ffb2bc'
  secondary: '#19648c'
  on-secondary: '#ffffff'
  secondary-container: '#91d0fd'
  on-secondary-container: '#025a81'
  tertiary: '#056b5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#57a899'
  on-tertiary-container: '#003932'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dd'
  primary-fixed-dim: '#ffb2bc'
  on-primary-fixed: '#400012'
  on-primary-fixed-variant: '#8f0935'
  secondary-fixed: '#c8e6ff'
  secondary-fixed-dim: '#8fcefa'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#a0f2e1'
  tertiary-fixed-dim: '#84d5c5'
  on-tertiary-fixed: '#00201b'
  on-tertiary-fixed-variant: '#005046'
  background: '#fff8f7'
  on-background: '#3a0818'
  surface-variant: '#ffd9df'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Epilogue
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system draws visual inspiration from Japanese stationery, vintage European confectionery packaging, and coquette nostalgia. It reframes everyday productivity into a tactile, joyful, and collectible desktop experience. The aesthetic fuses whimsical stationery motifs—spiral notebook perforation, grid paper textures, scalloped stamp borders, wax seal badges, and paper clips—with a functional modern layout hierarchy. 

The emotional tone is comforting, playful, and organized. It balances high-energy pastel hues with disciplined typography and deep burgundy ink tones, guaranteeing accessibility and high contrast alongside its nostalgic charm. The primary design style is a synthesis of Tactile Skeuomorphic nostalgia and Modern Stationery Minimalism, utilizing layered paper sheets, soft cast shadows, and embossed physical affordances.

## Colors

The palette references vintage candy wrappers, pastel ink pens, and lined stationery pads:

- **Primary (`#FF6584`)**: Playful candy rose used for primary actions, critical focus states, and highlight banners. Paired with soft cherry blush (`#FFB7CE`) for hover backgrounds and deep berry accents (`#E24A75`).
- **Secondary (`#7DBCE8`)**: Powder baby blue providing soft skies and cool desk surfaces, supported by light wash ice blue (`#D8ECF8`).
- **Tertiary (`#76C7B7`)**: Soft spearmint pastel serving as an accent for success chips, tags, and secondary stickers.
- **Neutral (`#501A29`)**: Deep antique burgundy acting as dark ink. It replaces standard grays and pure blacks to maintain warmth, richness, and high contrast against pastel papers.
- **Canvas & Paper (`#FFF9F0` & `#FDF2F4`)**: Warm butter cream and soft powder pink sheets that form the base surfaces, layered with subtle dotted or 16px grid paper lines in `#F0DFE4`.

## Typography

The typographic hierarchy balances characterful vintage charm with digital legibility:

- **Headlines & Expressive Display (`Epilogue`)**: Structured, editorial, and geometric with vintage poster flair. Used across dashboard widget titles, key milestones, and promotional greeting headers.
- **Body & Data (`Plus Jakarta Sans`)**: Friendly, rounded, and hyper-legible at small sizes. Used for task descriptions, checklist items, and input text.
- **Badges, Technical Metadata & Stamps (`Space Grotesk`)**: Monospaced-inspired geometric sans used in all-caps or tabular form for dates, tags, paper clip labels, and progress counters to evoke retro stamped stationery.

## Layout & Spacing

The layout is constructed around an asymmetric desk mat layout, using a structured 12-column grid on desktop and a compact 4-column flow on mobile:

- **Desktop (1024px+)**: 12-column fluid grid with 20px (`1.25rem`) gutters and 24px (`1.5rem`) outer margins. Modules resemble laid-out stationery elements—a notepad list, calendar punch card, and pin-board sticky tiles.
- **Tablet (768px - 1023px)**: 8-column layout where side widgets wrap beneath the primary task canvas with 16px gutters.
- **Mobile (<768px)**: 4-column fluid stack with 16px margins. Cards stack vertically, maintaining notebook page headers and quick-action toolbars anchored to the bottom sheet.
- **Modular Rhythm**: Spacing scale increments derive from a 4px/8px rhythm that locks in sync with the subtle 16px background grid pattern.

## Elevation & Depth

Visual depth is achieved through tactile, stationery-inspired physical layers:

- **Level 0 (Desk Mat / Canvas)**: Pale baby blue (`#D8ECF8`) or grid-lined cream (`#FFF9F0`) with subtle dashed or graph lines (`#F0DFE4`).
- **Level 1 (Paper Sheets & Cards)**: Soft cream or blush paper sheets cast warm, diffused ambient drop shadows (`0 8px 24px -4px rgba(80, 26, 41, 0.08)`), combined with a fine 1.5px border (`rgba(80, 26, 41, 0.08)`).
- **Level 2 (Floating Notes & Scalloped Stamps)**: Elevated sticky notes and popovers with directional offset shadows (`0 12px 28px -6px rgba(80, 26, 41, 0.12), 0 2px 4px rgba(80, 26, 41, 0.04)`) and slight -1° to 1.5° rotational skews for a physical desk feel.
- **Level 3 (Modals & Wax Seals)**: Floating dialogs and focal point pins with crisp outline accents (`0 20px 40px -10px rgba(80, 26, 41, 0.2)`).

## Shapes

The shape system blends soft, friendly roundedness with retro physical paper forms:

- **Base Radius (`0.5rem` / `8px`)**: Form inputs, standard buttons, and small tags.
- **Large Radius (`1rem` / `16px`)**: Primary dashboard cards, calendar cards, and sheet containers.
- **Pill & Scallop Accents (`rounded-full`)**: Circular wax seal action icons, bubbly numeric counters, and pill tags.
- **Decorative Edge Masking**: Special cards incorporate scalloped edges (alternating semi-circular notches), spiral notebook hole-punches at top margins, or zig-zag stamp edges using SVG mask styling.

## Components

### Buttons & Interactive Controls
- **Primary Buttons**: Filled in `#FF6584` with cream text (`#FFF9F0`), rounded at `0.75rem`, featuring a 2px offset solid shadow in `#E24A75`. Pressed states depress the button down 2px to simulate a physical push-stamp.
- **Secondary Buttons**: Butter cream surface (`#FFF9F0`) with a 1.5px border in `#501A29` (deep ink) and text in `#501A29`.
- **Tertiary Buttons**: Ghost styling with pill radius and a subtle background tint (`#FFB7CE` at 20% opacity) on hover.

### Badges & Chips
- **Status Chips**: Bubbly, pill-shaped tags in pastel mint (`#76C7B7`), powder blue (`#D8ECF8`), or rose (`#FFB7CE`) with deep ink text (`#501A29`) in `label-sm` Space Grotesk.
- **Wax Seals**: Circular 36px/48px floating badges with an embossed center emblem and an inset shadow simulating pressed sealing wax.

### Cards & Stationery Notepads
- **Lined Notepad Card**: Butter cream surface featuring subtle 24px horizontal guide rules in `#F4E7EB`, topped with a spiral punch ring header or an illustrated pink binder clip.
- **Scalloped Stamp Card**: Outlined with continuous 12px arc scalloped borders, used for spotlight widgets and milestone badges.

### Lists & Form Inputs
- **Checkboxes**: Heart-shaped or rounded-square checkboxes with a 2px deep ink border. When checked, they fill with `#FF6584` displaying a crisp white heart or hand-drawn check tick.
- **Input Fields**: Lined input styling or soft cream fields enclosed by a 1.5px border in `#FFB7CE`. Active focus switches border to `#FF6584` with an ambient glow (`0 0 0 3px rgba(255, 101, 132, 0.2)`).
- **List Items**: Separated by dashed light-berry rules (`border-dashed border-[#F0DFE4]`), supporting draggable paper handles and reorder animations.