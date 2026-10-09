---
name: Utilitarian Credential Passport
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#40484c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#70787d'
  outline-variant: '#bfc8cd'
  surface-tint: '#1e667f'
  primary: '#004357'
  on-primary: '#ffffff'
  primary-container: '#0d5c75'
  on-primary-container: '#93d3ef'
  inverse-primary: '#90cfec'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#004165'
  on-tertiary: '#ffffff'
  tertiary-container: '#005988'
  on-tertiary-container: '#99cfff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bde9ff'
  primary-fixed-dim: '#90cfec'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d64'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.06em
  passport-number:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.12em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style
The design system is engineered for skilled trade and blue-collar professionals—electricians, plumbers, mechanics, welders, and carpenters. It bridges physical credentials (paper certificates, union cards, embossed trade licenses) and modern cryptographic validation.

The design movement combines **Modern Utilitarianism** with **Tactile Document Security**:
- **Utilitarian & Uncompromising:** Direct, clutter-free layouts built for high readability on dirty or glare-heavy phone screens on active jobsites.
- **Physical Document Metaphor:** Digital passes mimic high-security physical identification cards with deliberate security guilloce patterns, perforated dividing edges, and distinct verified stamp states.
- **Immediate Credibility:** Avoids corporate abstraction; every badge, seal, and certificate card gives immediate confidence to contractors, inspectors, and hiring managers.

## Colors
The color palette reflects durable, reliable craftsmanship, structured around verified authority and high legibility:

- **Primary Accent (`#0D5C75` - Deep Industrial Teal):** Anchor tone for navigation headers, primary identity cards, and dominant brand elements. Conveys seasoned skill, industry rigor, and longevity.
- **Secondary Accent (`#059669` - Verified Emerald Green):** Strictly reserved for confirmed credentials, active licensing validations, tamper-free signatures, and authentic certifications.
- **Tertiary Accent (`#0284C7` - Trade Cobalt):** Used for actionable links, interactive elements, in-progress credential updates, and secondary status tags.
- **Neutral Foreground (`#0F172A` - Heavy Charcoal):** The bedrock text color. High contrast, no low-contrast light grays for critical operational text.
- **Canvas & Surface System:** 
  - Canvas background: `#F8FAFC` (Cool Stone)
  - Card/Passport Surface: `#FFFFFF` (Crisp Solid White)
  - Subtle Insets/Well backgrounds: `#F1F5F9` (Slate Off-White)
  - Surface Borders: `#CBD5E1` (Crisp Structured Border)

## Typography
Typographic rules follow direct field-legibility standards:
- **Clarity Under Duress:** Plus Jakarta Sans provides geometric stability with open counters and robust legibility across varied languages and scripts (including full Devanagari/Hindi fallback consistency).
- **All-Caps Semantic Tagging:** `label-sm` and `label-md` are styled in uppercase with tracking for license numbers, state codes, and expiry labels.
- **Credential Identification (`passport-number`):** Explicitly tracked and weighted for immediate parsing during inspection or on-site audits.

## Layout & Spacing
- **Layout Philosophy:** A single-column primary flow on mobile (breakpoint `< 768px`) prioritizing passport credentials and fast scan actions. Converts to an asymmetrical 12-column fluid grid on desktop (`>= 1024px`) with a 4-column persistent profile summary and an 8-column credential sheet.
- **Rhythm & Touch Surface:** All primary touch targets adhere to a strict minimum hit area of 48x48px (expanding to 56px height for primary verify actions) to accommodate gloved or weathered hands.
- **Perforated Divisions:** Multi-part cards use rhythmic 12px or 16px vertical gaps bounded by clear horizontal dividers.

## Elevation & Depth
Depth mimics heavy industrial cards, physical laminates, and paper document sleeves:

- **Level 0 (Flat Field):** `#F8FAFC` base screen canvas.
- **Level 1 (Credential Surface):** Pure `#FFFFFF` background bound by a 1.5px solid `#E2E8F0` border, cast with a grounded shadow: `0px 2px 4px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Active/Floating Passports):** Used for credential inspection sheets and modal verification cards: 1.5px solid `#CBD5E1` border with dual-shadow layering: `0px 8px 16px -4px rgba(15, 23, 42, 0.08), 0px 2px 4px rgba(15, 23, 42, 0.04)`.
- **Tactile Stamp Depth:** Official verification badges and stamps don't float; they feature inset stamp borders (`border: 2px dashed #059669`) angled slightly (-1.5deg to 2deg) or pressed directly into the header plane using subtle inner boundary rings.
- **No Heavy Blurs:** Avoid frosted glass or diffuse colored glows. Visual integrity relies on defined physical lines and tonal surface contrast.

## Shapes
- **Level 2 Implementation (Rounded):** Standard cards and interactive wrappers adopt an 8px (`0.5rem`) radius.
- **Card Sleeves & Badges (`rounded-lg`):** Main credential passport jackets use 16px (`1rem`) to resemble rounded driver's licenses and smart cards.
- **Status Pills (`rounded-full`):** Verification badges and micro tags utilize fully pill-shaped caps to distinguish metadata from content cards.
- **Perforated Notch Metaphor:** Verification cards may feature circular edge insets (scalloped cuts) at divider boundaries to reference detachable proof-of-work slips.

## Components

### Passport / Credential Cards
- **Base Style:** `#FFFFFF` card, 1.5px border `#CBD5E1`, 16px border-radius, `space-lg` internal padding.
- **Header Strip:** Deep teal (`#0D5C75`) top bar or stone header housing the issuing body logo, license ID (`passport-number`), and worker jurisdiction.
- **Security Accent:** Watermark-style SVG trade icons (wrench, lightning bolt, pipe weld) placed in low-opacity (4%) background position.

### Buttons & Touch Drivers
- **Primary Verify Action:** Background `#0D5C75`, text `#FFFFFF`, 56px height, rounded-8px, weight 700. Active click produces an instant 1px downward translation to feel mechanical.
- **Confirmed State / Export Proof:** Background `#059669`, text `#FFFFFF`.
- **Secondary Utility Action:** Background `#FFFFFF`, border 1.5px solid `#CBD5E1`, text `#0F172A`.

### Verification Stamps & Chips
- **Status Badges:** Compact pill format. Green validation chips use a `#ECFDF5` fill, `#059669` 1.5px solid border, and `#065F46` bold text with a lock/check glyph.
- **Multilingual Support:** Badges accommodate dual-string labeling (e.g., `VERIFIED • सत्यापित` or `LICENSED • प्रमाणित`) with automated text wraps and guaranteed height tolerances.

### Input Fields & Selectors
- **Structure:** 52px height for mobile confidence, `#FFFFFF` fill, 1.5px `#94A3B8` border.
- **Focus:** Crisp 2px ring in primary teal `#0D5C75`, no soft halo.
- **Labels:** Prominent `label-md` seated above the input field in `#0F172A` with clear required markers.

### Checkboxes & Trade Skill Toggles
- **Size:** 24x24px geometric box with 4px border radius.
- **Selected State:** Solid `#0D5C75` or `#059669` fill with a bold 2.5px white checkmark for instant visual acknowledgment.

### QR & Cryptographic Inspection Drawer
- **Inspection Deck:** Centered, high-contrast QR display bordered by high-density corner guides, timestamp of validation freshness, and instant cryptographic signature hash in mono-spaced characters.