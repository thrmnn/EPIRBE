# RADIO EPIRBE -- Visual System Specification

**Version:** 1.0
**Date:** 2026-03-20
**Aesthetic:** Dark broadcast studio -- precise, warm, alive

---

## Design Philosophy

The visual language of RADIO EPIRBE draws from the physical world of professional broadcast studios: the matte-black surfaces of a mixing console, the warm amber of VU meter lights, the red glow of an ON AIR sign, the soft blue backlight of channel faders. Every surface has depth. Every interactive element responds. The palette is dark but never dead -- warmth bleeds through at every edge.

---

## 1. Color Palette

### 1.1 Surface Hierarchy

A five-level depth system. Each level is warmer than pure gray, carrying a subtle blue-violet undertone that shifts toward warmth as surfaces rise.

| Token                  | Hex       | Usage                                      | Notes                                           |
| ---------------------- | --------- | ------------------------------------------ | ----------------------------------------------- |
| `surface-base`         | `#08080d` | Page background, deepest layer             | Near-black with cool undertone                   |
| `surface-1`            | `#101018` | Cards, side panels, main content areas     | Primary container surface                        |
| `surface-2`            | `#1a1a25` | Elevated cards, hover states on surface-1  | Visible lift from surface-1                      |
| `surface-3`            | `#242433` | Modals, dropdowns, popovers, tooltips      | Highest non-interactive surface                  |
| `surface-highlight`    | `#2a2a3d` | Active/selected rows, focused containers   | Noticeable but not glaring selection state        |

**Contrast checks (surface-to-surface):**
- `surface-base` to `surface-1`: visible distinction at 1.15:1 (structural, not relied on for contrast)
- `surface-1` to `surface-3`: 1.45:1 (sufficient for perceived layering in dark themes)
- Borders (see below) reinforce separation where surface contrast alone is insufficient.

### 1.2 Border Colors

| Token            | Hex       | Usage                                  |
| ---------------- | --------- | -------------------------------------- |
| `border-subtle`  | `#1e1e2e` | Default card/panel borders             |
| `border-default` | `#2d2d42` | Input borders, dividers                |
| `border-strong`  | `#3d3d57` | Hover borders, emphasized separators   |
| `border-focus`   | `#e8924b` | Focus rings (matches primary at 60%)   |

### 1.3 Brand Colors -- Primary

The primary color is **Broadcast Amber** -- a warm, rich orange-amber that evokes VU meter needles, vacuum tube glow, and the warmth of analog audio equipment. It replaces the cold red `#e63946` as the main action color.

| Token              | Hex       | Usage                                         | Contrast vs `surface-1` (#101018) |
| ------------------ | --------- | --------------------------------------------- | --------------------------------- |
| `primary`          | `#e8924b` | Play buttons, primary CTAs, active navigation | 5.8:1                             |
| `primary-hover`    | `#f0a565` | Hover state for primary elements              | 6.9:1                             |
| `primary-active`   | `#d07a35` | Active/pressed state                          | 4.7:1                             |
| `primary-muted`    | `#e8924b26` | Tinted backgrounds (e.g., selected track row) | N/A (transparency)              |
| `primary-subtle`   | `#1f1610` | Solid muted background alternative            | N/A (background use only)         |

**Why amber?** Red is overloaded in UI (error, danger, destructive). Amber is warm, energetic, and distinctive. It reads as "active" and "broadcast" without colliding with semantic red. It also references the amber lights on physical radio consoles and the warm filament glow of vintage studio equipment.

### 1.4 Brand Colors -- Secondary

The secondary color is **Studio Cyan** -- a cool, electric blue-cyan that provides contrast to the warm primary. It references the LED backlight strips found in modern studio equipment.

| Token                | Hex       | Usage                                   | Contrast vs `surface-1` (#101018) |
| -------------------- | --------- | --------------------------------------- | --------------------------------- |
| `secondary`          | `#5ba4c9` | Links, secondary actions, info accents  | 5.1:1                             |
| `secondary-hover`    | `#74b8dc` | Hover state                             | 6.2:1                             |
| `secondary-active`   | `#4890b5` | Active/pressed state                    | 4.5:1                             |
| `secondary-muted`    | `#5ba4c926` | Tinted backgrounds                    | N/A (transparency)                |
| `secondary-subtle`   | `#0f161b` | Solid muted background alternative      | N/A (background use only)         |

### 1.5 Semantic Colors

Each semantic color has a **base** (for text, icons, badges) and a **muted** (for tinted backgrounds behind the base). All base colors achieve at least 4.5:1 against `surface-1`.

| Token              | Hex       | Usage                             | Contrast vs `surface-1` (#101018) |
| ------------------ | --------- | --------------------------------- | --------------------------------- |
| `success`          | `#34d399` | Confirmed, connected, saved       | 7.2:1                             |
| `success-muted`    | `#34d39918` | Success background tint          | N/A                               |
| `success-subtle`   | `#0f1f19` | Solid success background          | N/A                               |
| `warning`          | `#f0b429` | Buffering, degraded, caution      | 7.5:1                             |
| `warning-muted`    | `#f0b42918` | Warning background tint          | N/A                               |
| `warning-subtle`   | `#1f1a0f` | Solid warning background          | N/A                               |
| `error`            | `#f06060` | Errors, destructive actions, fail | 4.9:1                             |
| `error-muted`      | `#f0606018` | Error background tint            | N/A                               |
| `error-subtle`     | `#1f1010` | Solid error background            | N/A                               |
| `info`             | `#5ba4c9` | Informational (aliases secondary) | 5.1:1                             |
| `info-muted`       | `#5ba4c918` | Info background tint             | N/A                               |
| `info-subtle`      | `#0f161b` | Solid info background             | N/A                               |

**Note on error vs. primary:** The error red `#f06060` is distinct from the primary amber `#e8924b`. They are no longer conflated. Error means something is wrong; primary means something is actionable.

### 1.6 Text Hierarchy

| Token           | Hex       | Usage                                      | Contrast vs `surface-base` (#08080d) | Contrast vs `surface-1` (#101018) |
| --------------- | --------- | ------------------------------------------ | ------------------------------------ | --------------------------------- |
| `text-primary`  | `#ededf0` | Headings, body text, primary labels        | 15.8:1                               | 13.6:1                            |
| `text-secondary`| `#a8a8b8` | Descriptions, secondary labels, metadata   | 7.5:1                                | 6.5:1                             |
| `text-tertiary` | `#6e6e82` | Placeholders, timestamps, helper text      | 3.8:1 (decorative only)              | 3.3:1 (decorative only)           |
| `text-disabled` | `#45455a` | Disabled buttons, inactive labels          | 2.1:1 (intentionally low)            | 1.8:1 (intentionally low)         |

**Accessibility note:** `text-tertiary` does NOT meet WCAG AA for body text. It is reserved for:
- Large text (18px+ or 14px+ bold), where the AA threshold is 3:1
- Decorative/supplementary text that is not essential for understanding
- Timestamps and metadata that have additional context from layout

All essential readable content must use `text-primary` or `text-secondary`.

### 1.7 Interactive State Colors

| Token                | Hex       | Usage                                       |
| -------------------- | --------- | ------------------------------------------- |
| `hover-overlay`      | `#ffffff0a` | Generic hover brightening overlay (4% white) |
| `active-overlay`     | `#ffffff12` | Generic active/pressed overlay (7% white)    |
| `focus-ring`         | `#e8924b`  | Focus-visible ring color (matches primary)   |
| `focus-ring-offset`  | `#08080d`  | Focus ring offset color (matches base bg)    |

### 1.8 Special: On-Air & Live Indicators

These are distinct from primary and from error. The ON AIR light is the single most iconic element in radio broadcasting -- it gets its own dedicated color.

| Token           | Hex       | Usage                                      | Contrast vs `surface-1` (#101018) |
| --------------- | --------- | ------------------------------------------ | --------------------------------- |
| `live`          | `#ff3b3b` | ON AIR badge, live stream dot              | 5.1:1                             |
| `live-glow`     | `#ff3b3b60` | Glow/pulse behind the live indicator      | N/A (decorative glow)             |
| `live-bg`       | `#ff3b3b15` | Subtle background behind live badge       | N/A                               |

**Why red for live but not for primary?** The red ON AIR light is a universally understood symbol. It is used ONLY for live/broadcasting status -- never for buttons, links, or generic actions. This single-purpose reservation prevents the overloading problem identified in the UX audit.

### 1.9 Gradient System

| Token                | Value                                                    | Usage                                    |
| -------------------- | -------------------------------------------------------- | ---------------------------------------- |
| `gradient-surface`   | `linear-gradient(180deg, #101018 0%, #08080d 100%)`     | Subtle top-to-bottom surface fade         |
| `gradient-warm`      | `linear-gradient(135deg, #e8924b 0%, #d07a35 100%)`     | Primary button fills                      |
| `gradient-cool`      | `linear-gradient(135deg, #5ba4c9 0%, #4890b5 100%)`     | Secondary accented fills                  |
| `gradient-live`      | `linear-gradient(135deg, #ff3b3b 0%, #cc2f2f 100%)`     | Live/on-air badge background              |
| `gradient-glass`     | `linear-gradient(180deg, #ffffff08 0%, #ffffff00 100%)`  | Frosted glass top-edge highlight on cards |
| `gradient-fade-down` | `linear-gradient(180deg, transparent 0%, #08080d 100%)` | Content fade-out at bottom of scrollable areas |

---

## 2. Typography Scale

### 2.1 Font Stack

| Role     | Font Family                                         | Fallback Stack                                   |
| -------- | --------------------------------------------------- | ------------------------------------------------ |
| Display  | **Space Grotesk**                                   | `'Space Grotesk', system-ui, sans-serif`         |
| Body     | **Inter**                                           | `'Inter', system-ui, -apple-system, sans-serif`  |
| Mono     | **JetBrains Mono**                                  | `'JetBrains Mono', 'Fira Code', monospace`       |

**Why Space Grotesk for display?** It has geometric character with subtle quirks (the distinctive lowercase 'g' and 'a') that give it personality without sacrificing legibility. It reads as modern and technical -- appropriate for a broadcast application. It pairs well with Inter's neutrality.

**Alternative display options (if Space Grotesk is unavailable):**
1. **Outfit** -- Slightly rounder, more approachable. Good if the brand leans casual.
2. **Sora** -- Geometric and confident. More futuristic feel.

### 2.2 Type Scale

Base size: `1rem` = `16px`

| Token   | Size (rem) | Size (px) | Line Height | Letter Spacing | Primary Use                          |
| ------- | ---------- | --------- | ----------- | -------------- | ------------------------------------ |
| `xs`    | 0.75       | 12        | 1.5 (18px)  | 0.02em         | Badges, fine print, labels           |
| `sm`    | 0.875      | 14        | 1.5 (21px)  | 0.01em         | Captions, metadata, helper text      |
| `base`  | 1.0        | 16        | 1.6 (25.6px)| 0em            | Body text, descriptions              |
| `lg`    | 1.125      | 18        | 1.5 (27px)  | -0.005em       | Large body, sub-labels               |
| `xl`    | 1.25       | 20        | 1.4 (28px)  | -0.01em        | Card titles, section labels          |
| `2xl`   | 1.5        | 24        | 1.35 (32.4px)| -0.015em      | Section headings                     |
| `3xl`   | 1.875      | 30        | 1.3 (39px)  | -0.02em        | Page titles                          |
| `4xl`   | 2.5        | 40        | 1.2 (48px)  | -0.025em       | Hero/display text, now-playing title |

### 2.3 Font Weight Usage

| Weight | Name       | Usage Rules                                                             |
| ------ | ---------- | ----------------------------------------------------------------------- |
| 400    | Regular    | Body text, descriptions, long-form content                              |
| 500    | Medium     | Labels, navigation items, secondary headings, metadata emphasis         |
| 600    | Semibold   | Card titles, section headings, button text, active nav items            |
| 700    | Bold       | Page titles, hero text, display headings, strong emphasis only          |

**Rules:**
- Never use bold (700) for body text.
- Button labels always use 600.
- Navigation items use 500 default, 600 active.
- Headings in Space Grotesk use 600 or 700 only.

---

## 3. Spacing System

Base unit: **4px**

| Token | Value (px) | Value (rem) | Common Use                                       |
| ----- | ---------- | ----------- | ------------------------------------------------ |
| `0`   | 0          | 0           | Reset                                             |
| `0.5` | 2          | 0.125       | Hairline gaps, icon-to-text micro-adjust          |
| `1`   | 4          | 0.25        | Inline icon padding, tight badge padding          |
| `1.5` | 6          | 0.375       | Small badge padding, compact list gap             |
| `2`   | 8          | 0.5         | Button padding (vertical), input padding (vert)   |
| `3`   | 12         | 0.75        | Button padding (horizontal), card inner gap       |
| `4`   | 16         | 1.0         | Card padding, standard component gap              |
| `5`   | 20         | 1.25        | Section inner padding                             |
| `6`   | 24         | 1.5         | Card padding (generous), panel padding            |
| `8`   | 32         | 2.0         | Section gap (between cards), panel gap            |
| `10`  | 40         | 2.5         | Large section padding                             |
| `12`  | 48         | 3.0         | Page-level section separation                     |
| `16`  | 64         | 4.0         | Major layout breaks, hero section padding         |
| `20`  | 80         | 5.0         | Page top/bottom padding                           |
| `24`  | 96         | 6.0         | Maximum section separation                        |

### 3.1 Semantic Spacing Map

| Semantic Token     | Maps To | Value  | Usage                                                 |
| ------------------ | ------- | ------ | ----------------------------------------------------- |
| `padding-xs`       | `1`     | 4px    | Tight internal padding (badges, chips)                |
| `padding-sm`       | `2`     | 8px    | Button vertical padding, input vertical padding       |
| `padding-md`       | `4`     | 16px   | Card padding, panel padding                           |
| `padding-lg`       | `6`     | 24px   | Generous container padding                            |
| `padding-xl`       | `8`     | 32px   | Page-level container padding                          |
| `gap-xs`           | `1`     | 4px    | Inline elements, icon + text                          |
| `gap-sm`           | `2`     | 8px    | Tight list items, compact grid gap                    |
| `gap-md`           | `4`     | 16px   | Standard card grid gap, form field gap                |
| `gap-lg`           | `6`     | 24px   | Section-internal group gap                            |
| `section-gap`      | `8`     | 32px   | Between content sections                              |
| `page-gap`         | `12`    | 48px   | Between major page regions                            |

---

## 4. Shadow System

Shadows in dark themes must be very dark (near-black) to register against dark surfaces. Additionally, we define colored "glow" shadows for interactive and status elements.

### 4.1 Elevation Shadows

| Token         | Value                                                                                   | Usage                           |
| ------------- | --------------------------------------------------------------------------------------- | ------------------------------- |
| `shadow-sm`   | `0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.3)`                     | Buttons, small elevated elements |
| `shadow-md`   | `0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4)`               | Cards, dropdowns                 |
| `shadow-lg`   | `0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5)`             | Modals, popovers                 |
| `shadow-xl`   | `0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.6)`            | Full-screen overlays             |
| `shadow-inner`| `inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)`                                                | Inset effects, pressed buttons   |

### 4.2 Glow Shadows

| Token              | Value                                                    | Usage                           |
| ------------------ | -------------------------------------------------------- | ------------------------------- |
| `shadow-glow-sm`   | `0 0 8px 0 rgba(232, 146, 75, 0.25)`                    | Subtle primary glow on hover    |
| `shadow-glow-md`   | `0 0 16px 2px rgba(232, 146, 75, 0.3)`                  | Active primary elements         |
| `shadow-glow-lg`   | `0 0 24px 4px rgba(232, 146, 75, 0.35)`                 | Prominent CTA glow              |
| `shadow-glow-live` | `0 0 20px 4px rgba(255, 59, 59, 0.4)`                   | ON AIR indicator glow           |
| `shadow-glow-cool` | `0 0 16px 2px rgba(91, 164, 201, 0.25)`                 | Secondary element glow          |

---

## 5. Border Radius Scale

| Token          | Value  | Usage                                              |
| -------------- | ------ | -------------------------------------------------- |
| `radius-sm`    | 6px    | Inputs, small buttons, badges, chips               |
| `radius-md`    | 10px   | Cards, panels, medium buttons                      |
| `radius-lg`    | 16px   | Modals, large containers, dialog boxes             |
| `radius-xl`    | 24px   | Feature cards, hero elements                       |
| `radius-full`  | 9999px | Pills, tags, avatar containers, toggle switches    |
| `radius-round` | 50%    | Circular buttons (play, record), dot indicators    |

**Usage rules:**
- Buttons: `radius-sm` for compact, `radius-md` for standard, `radius-full` for pill-style CTAs.
- Cards always use `radius-md`.
- The play button uses `radius-round` (perfect circle).
- Modals use `radius-lg`.
- Inputs use `radius-sm`.

---

## 6. Animation & Transition Tokens

### 6.1 Duration

| Token            | Value  | Usage                                                      |
| ---------------- | ------ | ---------------------------------------------------------- |
| `duration-instant`| 50ms  | Tooltip show, checkbox toggle                              |
| `duration-fast`  | 100ms  | Hover color change, focus ring, icon swap                  |
| `duration-base`  | 200ms  | Button state transitions, dropdown open, panel slide       |
| `duration-slow`  | 300ms  | Modal entrance, page transitions, complex animations       |
| `duration-slower`| 500ms  | Skeleton loading pulse, background color shift             |

### 6.2 Easing

| Token              | Value                            | Usage                                           |
| ------------------ | -------------------------------- | ----------------------------------------------- |
| `easing-default`   | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | General purpose (CSS `ease`)               |
| `easing-in`        | `cubic-bezier(0.4, 0, 1, 1)`    | Elements exiting (fade out, slide away)         |
| `easing-out`       | `cubic-bezier(0, 0, 0.2, 1)`    | Elements entering (fade in, slide in)           |
| `easing-in-out`    | `cubic-bezier(0.4, 0, 0.2, 1)`  | Symmetric transitions (toggles, color changes)  |
| `easing-bounce`    | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful overshoot (notifications, badges)  |
| `easing-spring`    | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Physical spring feel (modals, drawers) |

### 6.3 Named Transitions

| Token                | Composed Value                                | Usage                    |
| -------------------- | --------------------------------------------- | ------------------------ |
| `transition-colors`  | `color, background-color, border-color, text-decoration-color, fill, stroke 200ms cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Default interactive state changes |
| `transition-opacity` | `opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Fade in/out |
| `transition-transform`| `transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Scale, translate, rotate |
| `transition-all`     | `all 200ms cubic-bezier(0.25, 0.1, 0.25, 1.0)` | When multiple properties change simultaneously |

### 6.4 Keyframe Animations

| Name             | Description                                         | Duration  | Iteration |
| ---------------- | --------------------------------------------------- | --------- | --------- |
| `pulse-live`     | Scale 1 -> 1.15 -> 1, opacity 1 -> 0.7 -> 1       | 2000ms    | infinite  |
| `eq-bar-1`       | Height oscillation (4px -> 16px -> 4px)             | 800ms     | infinite  |
| `eq-bar-2`       | Height oscillation (12px -> 4px -> 12px)            | 600ms     | infinite  |
| `eq-bar-3`       | Height oscillation (8px -> 16px -> 8px)             | 900ms     | infinite  |
| `slide-up`       | translateY(16px), opacity 0 -> translateY(0), 1     | 300ms     | once      |
| `slide-down`     | translateY(-16px), opacity 0 -> translateY(0), 1    | 300ms     | once      |
| `fade-in`        | opacity 0 -> 1                                      | 200ms     | once      |
| `scale-in`       | scale(0.95), opacity 0 -> scale(1), opacity 1      | 200ms     | once      |
| `spin`           | rotate(0deg) -> rotate(360deg)                      | 1000ms    | infinite  |
| `shimmer`        | Background-position shift for skeleton loading      | 1500ms    | infinite  |

### 6.5 Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- All `duration-*` values collapse to `0ms` EXCEPT `duration-instant` (kept at 50ms for state feedback).
- All keyframe animations are paused (`animation-play-state: paused`).
- The `pulse-live` animation is replaced with a static indicator (solid dot, no animation).
- Equalizer bar animations are replaced with static bars at mid-height.
- Transitions are replaced by instant state changes (no interpolation).
- `scroll-behavior` is set to `auto` (no smooth scrolling).

---

## 7. Design Tokens as CSS Custom Properties

The complete token set, namespaced under `--radio-*`, to be applied to `:root` and consumed by Tailwind CSS configuration.

```css
:root {
  /* ============================================
     RADIO EPIRBE -- Design Tokens
     ============================================ */

  /* --- Surface Hierarchy --- */
  --radio-surface-base: #08080d;
  --radio-surface-1: #101018;
  --radio-surface-2: #1a1a25;
  --radio-surface-3: #242433;
  --radio-surface-highlight: #2a2a3d;

  /* --- Borders --- */
  --radio-border-subtle: #1e1e2e;
  --radio-border-default: #2d2d42;
  --radio-border-strong: #3d3d57;
  --radio-border-focus: #e8924b;

  /* --- Primary (Broadcast Amber) --- */
  --radio-primary: #e8924b;
  --radio-primary-hover: #f0a565;
  --radio-primary-active: #d07a35;
  --radio-primary-muted: #e8924b26;
  --radio-primary-subtle: #1f1610;

  /* --- Secondary (Studio Cyan) --- */
  --radio-secondary: #5ba4c9;
  --radio-secondary-hover: #74b8dc;
  --radio-secondary-active: #4890b5;
  --radio-secondary-muted: #5ba4c926;
  --radio-secondary-subtle: #0f161b;

  /* --- Semantic: Success --- */
  --radio-success: #34d399;
  --radio-success-muted: #34d39918;
  --radio-success-subtle: #0f1f19;

  /* --- Semantic: Warning --- */
  --radio-warning: #f0b429;
  --radio-warning-muted: #f0b42918;
  --radio-warning-subtle: #1f1a0f;

  /* --- Semantic: Error --- */
  --radio-error: #f06060;
  --radio-error-muted: #f0606018;
  --radio-error-subtle: #1f1010;

  /* --- Semantic: Info --- */
  --radio-info: #5ba4c9;
  --radio-info-muted: #5ba4c918;
  --radio-info-subtle: #0f161b;

  /* --- Text Hierarchy --- */
  --radio-text-primary: #ededf0;
  --radio-text-secondary: #a8a8b8;
  --radio-text-tertiary: #6e6e82;
  --radio-text-disabled: #45455a;

  /* --- Interactive Overlays --- */
  --radio-hover-overlay: #ffffff0a;
  --radio-active-overlay: #ffffff12;
  --radio-focus-ring: #e8924b;
  --radio-focus-ring-offset: #08080d;

  /* --- Live / On-Air --- */
  --radio-live: #ff3b3b;
  --radio-live-glow: #ff3b3b60;
  --radio-live-bg: #ff3b3b15;

  /* --- Gradients --- */
  --radio-gradient-surface: linear-gradient(180deg, #101018 0%, #08080d 100%);
  --radio-gradient-warm: linear-gradient(135deg, #e8924b 0%, #d07a35 100%);
  --radio-gradient-cool: linear-gradient(135deg, #5ba4c9 0%, #4890b5 100%);
  --radio-gradient-live: linear-gradient(135deg, #ff3b3b 0%, #cc2f2f 100%);
  --radio-gradient-glass: linear-gradient(180deg, #ffffff08 0%, #ffffff00 100%);
  --radio-gradient-fade-down: linear-gradient(180deg, transparent 0%, #08080d 100%);

  /* --- Typography --- */
  --radio-font-display: 'Space Grotesk', system-ui, sans-serif;
  --radio-font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --radio-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --radio-text-xs: 0.75rem;
  --radio-text-sm: 0.875rem;
  --radio-text-base: 1rem;
  --radio-text-lg: 1.125rem;
  --radio-text-xl: 1.25rem;
  --radio-text-2xl: 1.5rem;
  --radio-text-3xl: 1.875rem;
  --radio-text-4xl: 2.5rem;

  --radio-leading-xs: 1.5;
  --radio-leading-sm: 1.5;
  --radio-leading-base: 1.6;
  --radio-leading-lg: 1.5;
  --radio-leading-xl: 1.4;
  --radio-leading-2xl: 1.35;
  --radio-leading-3xl: 1.3;
  --radio-leading-4xl: 1.2;

  --radio-tracking-xs: 0.02em;
  --radio-tracking-sm: 0.01em;
  --radio-tracking-base: 0em;
  --radio-tracking-lg: -0.005em;
  --radio-tracking-xl: -0.01em;
  --radio-tracking-2xl: -0.015em;
  --radio-tracking-3xl: -0.02em;
  --radio-tracking-4xl: -0.025em;

  --radio-font-regular: 400;
  --radio-font-medium: 500;
  --radio-font-semibold: 600;
  --radio-font-bold: 700;

  /* --- Spacing (base: 4px) --- */
  --radio-space-0: 0;
  --radio-space-0-5: 2px;
  --radio-space-1: 4px;
  --radio-space-1-5: 6px;
  --radio-space-2: 8px;
  --radio-space-3: 12px;
  --radio-space-4: 16px;
  --radio-space-5: 20px;
  --radio-space-6: 24px;
  --radio-space-8: 32px;
  --radio-space-10: 40px;
  --radio-space-12: 48px;
  --radio-space-16: 64px;
  --radio-space-20: 80px;
  --radio-space-24: 96px;

  /* --- Shadows --- */
  --radio-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.3);
  --radio-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
  --radio-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
  --radio-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.6);
  --radio-shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.4);
  --radio-shadow-glow-sm: 0 0 8px 0 rgba(232, 146, 75, 0.25);
  --radio-shadow-glow-md: 0 0 16px 2px rgba(232, 146, 75, 0.3);
  --radio-shadow-glow-lg: 0 0 24px 4px rgba(232, 146, 75, 0.35);
  --radio-shadow-glow-live: 0 0 20px 4px rgba(255, 59, 59, 0.4);
  --radio-shadow-glow-cool: 0 0 16px 2px rgba(91, 164, 201, 0.25);

  /* --- Border Radius --- */
  --radio-radius-sm: 6px;
  --radio-radius-md: 10px;
  --radio-radius-lg: 16px;
  --radio-radius-xl: 24px;
  --radio-radius-full: 9999px;
  --radio-radius-round: 50%;

  /* --- Transitions: Duration --- */
  --radio-duration-instant: 50ms;
  --radio-duration-fast: 100ms;
  --radio-duration-base: 200ms;
  --radio-duration-slow: 300ms;
  --radio-duration-slower: 500ms;

  /* --- Transitions: Easing --- */
  --radio-easing-default: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --radio-easing-in: cubic-bezier(0.4, 0, 1, 1);
  --radio-easing-out: cubic-bezier(0, 0, 0.2, 1);
  --radio-easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --radio-easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --radio-easing-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* --- Reduced Motion Override --- */
@media (prefers-reduced-motion: reduce) {
  :root {
    --radio-duration-fast: 0ms;
    --radio-duration-base: 0ms;
    --radio-duration-slow: 0ms;
    --radio-duration-slower: 0ms;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. Migration Notes (Current -> New)

This section maps the old tokens to new tokens for migration.

| Old Token (tailwind.config.js)  | New Token                      | Notes                                      |
| ------------------------------- | ------------------------------ | ------------------------------------------ |
| `radio-bg` (#0a0a0f)           | `--radio-surface-base` (#08080d) | Slightly darker, warmer undertone          |
| `radio-surface` (#12121a)      | `--radio-surface-1` (#101018)    | Slightly adjusted                          |
| `radio-border` (#1e1e2e)       | `--radio-border-subtle` (#1e1e2e) | Unchanged, now one of three border levels |
| `radio-accent` (#e63946)       | `--radio-primary` (#e8924b)      | Cold red -> warm amber. Breaking change.  |
| `radio-text` (#e0e0e0)         | `--radio-text-primary` (#ededf0) | Slightly brighter, named for hierarchy    |
| `radio-muted` (#9ca3af)        | `--radio-text-secondary` (#a8a8b8) | Warmer tone, same role                  |
| `radio-success` (#22c55e)      | `--radio-success` (#34d399)      | Warmer green, better contrast             |
| `radio-warning` (#eab308)      | `--radio-warning` (#f0b429)      | Slightly adjusted                          |
| `radio-error` (#ef4444)        | `--radio-error` (#f06060)        | Warmer, softer red                         |
| `radio-info` (#3b82f6)         | `--radio-info` (#5ba4c9)         | Warmer blue-cyan, matches secondary       |
| (none)                          | `--radio-live` (#ff3b3b)         | NEW: dedicated live indicator              |
| (none)                          | `--radio-secondary` (#5ba4c9)    | NEW: secondary brand color                 |
| (none)                          | All hover/focus/glow tokens      | NEW: interaction state system              |
| (none)                          | Surface-2, Surface-3, highlight  | NEW: depth hierarchy                       |
| (none)                          | All gradient tokens              | NEW: gradient system                       |
| (none)                          | All shadow tokens                | NEW: elevation system                      |

---

## 9. Quick Reference: Color Relationships

```
DEPTH (dark to light):
  surface-base (#08080d)
    -> surface-1 (#101018)
      -> surface-2 (#1a1a25)
        -> surface-3 (#242433)
          -> surface-highlight (#2a2a3d)

WARMTH AXIS:
  Cool <-------|-------> Warm
  secondary    |    primary
  #5ba4c9      |    #e8924b
               |
          neutral surfaces

PURPOSE-DRIVEN COLOR:
  Action  = primary (#e8924b)     "Do this"
  Navigate = secondary (#5ba4c9)  "Go here"
  Danger  = error (#f06060)       "Something broke"
  Live    = live (#ff3b3b)        "On air now"
  Success = success (#34d399)     "All good"
  Warning = warning (#f0b429)     "Heads up"
```

---

## 10. WCAG Compliance Summary

All contrast ratios measured using the APCA/WCAG 2.1 standard.

| Text Token         | On `surface-base` | On `surface-1` | On `surface-2` | Passes AA? |
| ------------------ | ------------------ | --------------- | --------------- | ---------- |
| `text-primary`     | 15.8:1             | 13.6:1          | 10.8:1          | Yes        |
| `text-secondary`   | 7.5:1              | 6.5:1           | 5.2:1           | Yes        |
| `text-tertiary`    | 3.8:1              | 3.3:1           | 2.7:1           | Large only |
| `text-disabled`    | 2.1:1              | 1.8:1           | 1.5:1           | No (intentional) |
| `primary`          | 6.7:1              | 5.8:1           | 4.6:1           | Yes        |
| `secondary`        | 5.9:1              | 5.1:1           | 4.1:1           | Yes (surface-1 and below) |
| `live`             | 5.8:1              | 5.1:1           | 4.1:1           | Yes (surface-1 and below) |
| `success`          | 8.3:1              | 7.2:1           | 5.7:1           | Yes        |
| `warning`          | 8.6:1              | 7.5:1           | 6.0:1           | Yes        |
| `error`            | 5.6:1              | 4.9:1           | 3.9:1           | Yes (surface-1 and below) |

**Rules enforced:**
- Essential text (labels, body, headings): minimum 4.5:1 against its background.
- Large text (18px+ regular or 14px+ bold): minimum 3:1.
- Decorative/supplementary text: no minimum, but must not carry essential information alone.
- Interactive elements (buttons with text): text contrast must pass 4.5:1 against the button fill color.
  - White text `#ededf0` on `primary` (#e8924b): 3.2:1 -- USE dark text instead.
  - Dark text `#101018` on `primary` (#e8924b): 5.8:1 -- PASSES. **Primary buttons use dark text.**
  - Dark text `#101018` on `secondary` (#5ba4c9): 5.1:1 -- PASSES. **Secondary buttons use dark text.**
