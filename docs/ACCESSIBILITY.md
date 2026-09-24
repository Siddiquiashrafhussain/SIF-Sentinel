# Accessibility (a11y) Guide

## 1. Core Principles
SIF-Sentinel is designed to be fully navigable without a mouse and clearly perceivable by visually impaired users.

## 2. Focus Rings
- The default browser `outline: none` is strictly forbidden unless paired with an equivalent.
- We utilize a visible `2px solid #38bdf8` focus ring around all interactive elements (inputs, buttons, rows) via Tailwind's `focus-visible:ring-2 focus-visible:ring-sky-400` utilities.

## 3. Keyboard Navigation
- All modals, drawers, and report inspectors trap focus correctly using Shadcn UI's Radix primitive foundations.
- Users can close dialogs via `Esc`.
- `Tab` navigates through the primary hierarchy: Filters -> Table Rows -> Actions.

## 4. Semantic Tables
- We use semantic `<table>`, `<thead>`, `<tbody>`, and `<th scope="col">` elements. We do not use `div`-based tables unless ARIA roles (`role="table"`, etc.) are explicitly provided.

## 5. Screen Readers and ARIA
- Use `aria-label` or `aria-labelledby` for elements without visible text (e.g., icon-only buttons).
- Use `aria-hidden="true"` on decorative icons and SVGs to hide them from screen readers.
- Ensure correct `role` attributes where native HTML elements cannot convey the necessary semantics.
- Status messages, form validation errors, and notifications use `aria-live="polite"` or `aria-live="assertive"`.

## 6. Contrast and Color
- Ensure a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.
- Do not use color alone to convey meaning (e.g., severity badges also include icons or clear text labels).
- Ensure dark mode implementations adhere strictly to the same WCAG AA contrast guidelines.

## 7. Automated Scanning
- We enforce Axe Core accessibility scans within our Playwright E2E suite (`@axe-core/playwright`). 
- Serious or Critical accessibility violations instantly fail the CI build.
- Regular audits are highly recommended before major feature releases.
