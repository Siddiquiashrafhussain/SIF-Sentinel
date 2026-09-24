---
name: SIF-Sentinel Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#40474f'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#707881'
  outline-variant: '#c0c7d1'
  surface-tint: '#006399'
  primary: '#00507d'
  on-primary: '#ffffff'
  primary-container: '#0369a1'
  on-primary-container: '#cbe4ff'
  inverse-primary: '#94ccff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#00507b'
  on-tertiary: '#ffffff'
  tertiary-container: '#0069a0'
  on-tertiary-container: '#cae4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cde5ff'
  primary-fixed-dim: '#94ccff'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#004b74'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Public Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Public Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Public Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-lg:
    fontFamily: Public Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Public Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.05em
  code-mono:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-precision, institutional safety intelligence environment engineered specifically for critical enterprise infrastructure and hazardous operations. The visual atmosphere balances crisp operational rigor with modern enterprise clarity—evoking uncompromising safety oversight, systemic resilience, and immediate situational awareness.

Drawing from modern technical minimalism and institutional corporate design, the system avoids decorative indulgence in favor of structural density, disciplined alignment, and high-legibility information hierarchies. The interface communicates institutional authority through cool slate canvases, structured borders, and purposeful chromatic restraint. Color is never decorative; chromatic intensity is preserved strictly for functional telemetry, systemic hazard indicators, and critical decision-making nodes.

## Colors

The color architecture is built around functional discipline and uncompromising safety differentiation:

- **Primary Brand (`#0369a1`) & Interactive Accent (`#0284c7`):** Represents industrial engineering integrity. Used exclusively for brand anchors, primary action buttons, key interactive highlights, and active operational tabs.
- **Structural Neutrals:** Canvas foundations deploy cool off-white (`#f8fafc`) and layered slate (`#f1f5f9`). Surfaces transition to pure white (`#ffffff`) for elevated telemetry modules. Typography relies on deep structural slate (`#0f172a`) for headlines and high-priority data points, with secondary slate (`#334155`) and muted borders (`#e2e8f0`) maintaining contrast ratios exceeding WCAG AAA standards.
- **Safety Priority & Severity Tokens (Strictly Isolated):**
  - `Severity Critical`: `#dc2626` (Life-safety risk, emergency trip, immediate stop)
  - `Severity High`: `#ea580c` (Process deviation, major hazard potential)
  - `Severity Medium`: `#d97706` (Precautionary notice, inspection overdue)
  - `Severity Low`: `#16a34a` (Nominal status, validated compliant, safe state)
  - `Severity Info`: `#2563eb` (Systemic event, audit trail notice, model recalculation)

Severity colors must never be applied to generic UI buttons, decorations, or standard promotional accents.

## Typography

The typography strategy pairs **Hanken Grotesk** for display and section headers with **Public Sans** for transactional prose, telemetry panels, and density-critical data readouts.

- **Hanken Grotesk:** Imparts structured geometric authority. Configured with snug letter-spacing at large optical sizes to convey analytical control without visual clutter.
- **Public Sans:** Developed specifically for institutional utility and high legibility. Performs reliably in complex tabular structures, incident reports, and nested audit logs.
- **Tabular Figures & Monospace:** Any numerical metric, coordinate grid, asset tag, or sensor telemetry uses tabular numbers (`tnum`) or the monospaced utility token (`code-mono`) to prevent layout shifts during live data polling.

## Layout & Spacing

The layout is anchored on an 8pt base grid within a 12-column responsive fluid grid framework, engineered for dense multi-monitor command rooms down to ruggedized site tablets.

- **App Shell & Persistent Chrome:** Standard 64px fixed top utility header coupled with a 240px persistent navigational sidebar (collapsible to 64px icon-rail on screens below 1280px). Main analytical canvas remains fluid with safe horizontal padding.
- **Breakpoints:**
  - `Desktop Wide (>= 1440px)`: 12-column grid, `gutter-lg` (2rem), `margin-lg` (2rem). Supports simultaneous triple-panel triage (Incident List, AI Inference Detail, Map/P&ID telemetry).
  - `Desktop Standard (1024px - 1439px)`: 12-column grid, `gutter` (1.5rem), `margin` (1.5rem). Secondary side panels collapse into overlay drawers.
  - `Tablet / Field Console (768px - 1023px)`: 6-column grid, `gutter-sm` (1rem), `margin-sm` (1rem). Navigation switches to permanent mini-rail.
  - `Mobile / Rugged Handheld (< 768px)`: 4-column single-stack flow with bottom-anchored action bars.
- **Internal Density:** Data grids and incident rows adhere strictly to compact 32px or 40px row heights. Internal card paddings follow `space-md` (1rem) for telemetry widgets and `space-lg` (1.5rem) for primary analytical views.

## Elevation & Depth

Visual hierarchy utilizes a hybrid model of structural borders and low-elevation, high-diffusion ambient shadows. This prevents optical mudiness and maintains visual definition in high-ambient-light industrial environments.

- **Level 0 (Canvas Base):** Default application background (`#f8fafc`). Flat, zero shadow.
- **Level 1 (Card & Module Surfaces):** Pure white fill (`#ffffff`) bounded by a subtle 1px border (`#e2e8f0`). Box shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`. Used for standard telemetry panels, incident queues, and KPI cards.
- **Level 2 (Hover & Active Focus Panels):** White fill (`#ffffff`), 1px border (`#cbd5e1`). Box shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals, Overlays, and Tooltips):** White fill (`#ffffff`), 1px border (`#94a3b8`). Box shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.06)`. Applied to AI explainability popovers, action confirmation dialogues, and full-screen telemetry overlays.

## Shapes

The design system implements a disciplined soft-radius architecture (`roundedness: 1`). This deliberate constraint reinforces institutional authority, stability, and engineered precision:

- **Base Radius (`0.25rem` / 4px):** Form inputs, dropdown menus, inline buttons, verification tags, and telemetry chips.
- **Large Radius (`0.5rem` / 8px):** Primary analytical cards, data grid containers, modal frames, and floating notifications (`rounded-lg`).
- **Extra-Large Radius (`0.75rem` / 12px):** Top-level system shell containers and command center hero panels (`rounded-xl`).
- **Circular Elements:** Strictly reserved for status avatar initials and circular radial gauges. System pills are deliberately prohibited; badges use structured 4px rectangular contours with clear typographic padding.

## Components

### Buttons

- **Primary:** Background `#0369a1`, text `#ffffff`, border none, radius `0.25rem`. Hover `#0284c7`, active `#075985`. Focus ring `2px solid #38bdf8` with 2px offset.
- **Secondary (Outlined):** Background `#ffffff`, text `#0f172a`, 1px border `#cbd5e1`, radius `0.25rem`. Hover background `#f1f5f9`.
- **Destructive/Emergency:** Background `#dc2626`, text `#ffffff`, radius `0.25rem`. Reserved strictly for immediate safety trip/escalation triggers.
- **Sizes:** Compact (32px height, 12px horizontal pad), Standard (40px height, 16px horizontal pad).

### Severity Badges & Status Indicators

- Structured 4px rounded rectangles with high-contrast text and a tinted background fill (12% opacity of severity token) bounded by a matching 1px border (30% opacity).
- Example: **Severity Critical Badge** uses background `rgba(220, 38, 38, 0.1)`, text `#dc2626`, border `rgba(220, 38, 38, 0.35)`.

### Cards & Telemetry Containers

- Pure white surface (`#ffffff`), `0.5rem` radius (`rounded-lg`), 1px structural border (`#e2e8f0`), and Level 1 elevation.
- Header bands separate title and action buttons using a 1px bottom divider (`#f1f5f9`). Data displays maintain strict internal column grids.

### Input Fields & Controls

- **Text Inputs:** Height 38px, background `#ffffff`, 1px border `#cbd5e1`, radius `0.25rem`, text `#0f172a`. Focus state features a sharp `#0369a1` border with a 2px tinted focus halo (`rgba(3, 105, 161, 0.15)`).
- **Checkboxes & Radios:** 16px dimensions, 1px border `#94a3b8`, radius 3px for checkboxes, circular for radios. Checked state fills `#0369a1` with crisp white iconography.

### AI Intelligence Badges & Explainability Tooltips

- **AI Inference Badge:** Distinctive styling pairing deep slate background (`#0f172a`) with industrial blue text (`#38bdf8`) and an interactive spark icon.
- **Explainability Tooltip:** Triggered on hover or click of the AI badge. Renders Level 3 elevation, featuring confidence intervals (e.g., `94.8% Confidence`), primary signal drivers (top contributing sensor variances), and human-override verification links.

### HSE Human Verification Tags

- Indicator pills demonstrating human sign-off:
  - `Verified by HSE Officer`: Light green tint background (`#f0fdf4`), green text (`#16a34a`), 1px border (`#86efac`), prepended with a shield-check glyph.
  - `Pending Audit Review`: Light amber tint background (`#fffbeb`), amber text (`#d97706`), 1px dashed border (`#fcd34d`).
