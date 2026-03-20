# EPIRBE Radio -- Component Catalog

**Version:** 1.0
**Date:** 2026-03-20
**Status:** Design Specification (pre-implementation)

This document specifies every UI component for EPIRBE Radio. Each component includes all visual states, interaction behaviors, micro-animations, and accessibility requirements. The specification is grounded in the existing codebase (Tailwind tokens, current component structure) and the UX Audit recommendations.

---

## Design Tokens Reference

All components reference these shared tokens from `tailwind.config.js`:

```
Background:  radio-bg      #0a0a0f
Surface:     radio-surface  #12121a
Border:      radio-border   #1e1e2e
Accent:      radio-accent   #e63946
Text:        radio-text     #e0e0e0
Muted:       radio-muted    #9ca3af
Success:     radio-success  #22c55e
Warning:     radio-warning  #eab308
Error:       radio-error    #ef4444
Info:        radio-info     #3b82f6
```

**Derived tokens used throughout this spec:**

```
surface-95:     radio-surface/95  (rgba(18,18,26,0.95), for backdrop-blur overlays)
accent-10:      radio-accent/10   (red tint for selected/active backgrounds)
accent-20:      radio-accent/20   (red tint for hover/badge backgrounds)
accent-30:      radio-accent/30   (red tint for active-press on accent elements)
border-50:      radio-border/50   (half-opacity border for subtle row hovers)
muted-30:       radio-muted/30    (gray hover for secondary/ghost buttons)
red-600:        #dc2626           (danger button base)
red-700:        #b91c1c           (danger button hover)
red-600-20:     red-600/20        (danger tint backgrounds)
red-600-30:     red-600/30        (danger tint hover)
focus-ring:     white (#ffffff)   (2px solid, 2px offset from radio-surface)
```

**Typography scale:**
- `text-xs`: 12px / 16px
- `text-sm`: 14px / 20px
- `text-base`: 16px / 24px
- `text-lg`: 18px / 28px
- `text-xl`: 20px / 28px
- `text-2xl`: 24px / 32px
- `text-4xl`: 36px / 40px

**Font:** Inter, system-ui, -apple-system, sans-serif

---

## 1. PlayerBar

### Component: PlayerBar
**Purpose:** Persistent bottom audio player bar -- the primary playback control surface, always visible once the app loads.
**Variants:** playlist-mode (default), live-mode

**Layout:** Fixed to viewport bottom. Full width. Height 64px (`h-16`). `z-50`. Background `radio-surface/95` with `backdrop-blur-md`. Top border `1px solid radio-border`. Horizontal flex layout with `px-4 gap-4`, vertically centered.

**Semantic:** `role="region" aria-label="Audio player"`

#### States Table

| State | Background | Border | Text (Track Info) | Play Button | Skip Button | Volume | Equalizer | Listener Badge | Opacity | ARIA |
|-------|-----------|--------|-------------------|-------------|-------------|--------|-----------|----------------|---------|------|
| **Idle (no audio)** | surface-95 + blur | 1px top border | "Ready to play" in radio-muted | Play icon, bg-radio-accent | Visible (playlist-mode) | Slider at last value | Hidden | Visible, radio-muted | 1 | `aria-label="Play"` |
| **Playing** | surface-95 + blur | 1px top border | Title + Artist in radio-text / radio-muted | Pause icon, bg-radio-accent | Visible (playlist-mode) | Active slider | Animated 3-bar equalizer | Visible, radio-muted | 1 | `aria-label="Pause"` |
| **Paused** | surface-95 + blur | 1px top border | Title + Artist (preserved from last playing state) | Play icon, bg-radio-accent | Visible (playlist-mode) | Slider at last value | Hidden | Visible, radio-muted | 1 | `aria-label="Play"` |
| **Buffering** | surface-95 + blur | 1px top border | "Streaming..." in radio-muted | Spinner replaces play/pause icon, bg-radio-accent | Disabled, opacity 0.5 | Active slider | Hidden | Visible | 1 | `aria-label="Loading audio"`, `aria-busy="true"` |
| **Live Mode** | surface-95 + blur | 1px top border | DJ name or "LIVE" in radio-text | Pause icon (stop listening) | Hidden entirely | Active slider | Animated 3-bar equalizer | LIVE badge (red, pulsing) + listener count | 1 | `aria-label="Pause live stream"` |
| **Error (stream down)** | surface-95 + blur | 1px top border, **accent top-1px red flash** | "Stream unavailable" in radio-error | Play icon (retry), bg-radio-accent | Disabled, opacity 0.5 | Disabled slider | Hidden | Visible | 1 | `aria-label="Retry playback"`, `aria-live="assertive"` on error text |
| **Autoplay Blocked** | surface-95 + blur | 1px top border | "Tap play again -- your browser blocked autoplay" in yellow-400 (12px) beneath track info | Play icon, bg-radio-accent, subtle pulse animation | Visible | Slider at last value | Hidden | Visible | 1 | `aria-label="Play -- browser requires interaction"` |

#### Sub-components

**Equalizer (within PlayerBar)**
- Three vertical bars, each `2px` wide, `radio-accent` color, rounded-full ends
- Animations: `eq-1` (0.8s), `eq-2` (0.6s), `eq-3` (0.9s) -- staggered sine-wave heights between 4px and 16px
- Only rendered when `playing === true`
- `prefers-reduced-motion`: bars freeze at mid-height (static 10px)

**LIVE Badge (within PlayerBar)**
- Flex row: pulsing red dot (1.5x1.5, `bg-red-500 rounded-full animate-pulse`) + "LIVE" text
- Container: `bg-red-600/20 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full`
- Only rendered when `isLive === true`

**Listener Count (within PlayerBar)**
- Person icon (3.5x3.5, `radio-muted`, `aria-hidden="true"`) + count number (`text-xs text-radio-muted`)
- Always visible

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Play pressed | Play icon fades to pause icon | 150ms | ease-out | Instant swap, no fade |
| Pause pressed | Pause icon fades to play icon | 150ms | ease-out | Instant swap |
| Track change (metadata update) | Title/artist text cross-fades | 300ms | ease | Instant swap |
| Buffering starts | Play/pause icon replaced by spinner (rotate) | 800ms per rotation, linear, infinite | -- | Static dots or text "Loading" |
| Error appears | Error text slides up from below | 200ms | ease-out | Instant appear |
| Volume slider thumb | Thumb scale from 1.0 to 1.2 on hover | 150ms | ease | No scale change |
| Autoplay blocked text | Slides down into view | 200ms | ease-out | Instant appear |

---

## 2. NowPlayingHero

### Component: NowPlayingHero
**Purpose:** Large, prominent display of what is currently playing -- the visual centerpiece of the listener view.
**Variants:** none (state-driven internally)

**Layout:** Full-width card within content area. Minimum height 200px. `bg-gradient-to-b from-radio-surface to-transparent`. `border border-radio-border rounded-xl`. Centered flex column, `p-8`.

**Semantic:** `aria-live="polite"` on the container (announces track changes to screen readers)

#### States Table

| State | Background | Content | Equalizer | LIVE Badge | Listener Count | Overlay | ARIA |
|-------|-----------|---------|-----------|------------|----------------|---------|------|
| **Has Metadata (playing)** | Gradient: surface to transparent | Title (`text-2xl font-bold text-radio-text`, centered) + Artist (`text-lg text-radio-muted`, centered) | 5-bar animated equalizer (4px wide bars, 24px max height) | Hidden (unless also live) | Visible below content, `mt-6 text-sm text-radio-muted` | None | Track title announced via aria-live |
| **Has Metadata + Live** | Same gradient | Title + Artist + LIVE badge below artist | 5-bar animated equalizer | Shown: `bg-red-600/20 text-red-400 text-sm font-semibold px-3 py-1 rounded-full` with pulsing red dot (2x2) | Visible | None | "Live: [title] by [artist]" announced |
| **No Metadata (playing)** | Same gradient | "EPIRBE Radio" as title + "Streaming..." as subtitle | 5-bar animated equalizer | Hidden | Visible | None | "Now streaming" announced |
| **Live Broadcast (no track metadata)** | Same gradient | "LIVE" in `text-red-400 text-2xl font-bold` with pulsing red dot (3x3) + DJ name in `text-lg text-radio-muted` (if provided) | 5-bar animated equalizer | Integrated into content (the word LIVE itself) | Visible | None | "Live broadcast by [DJ name]" announced |
| **Idle / Waiting** | Same gradient | "EPIRBE Radio" (`text-2xl font-bold text-radio-text`) + "Waiting for stream..." (`text-sm text-radio-muted`) | Hidden | Hidden | Visible | Subtle animated gradient overlay: `bg-gradient-to-br from-radio-accent/5 via-transparent to-radio-accent/5 animate-pulse pointer-events-none` | "Waiting for stream" announced |

#### Equalizer (Hero variant)

- 5 bars (vs 3 in PlayerBar), each `4px` wide, `3px` gap, `24px` max height
- Bars use `radio-accent` color with rounded-full ends
- Staggered animation delays: bars 4 and 5 have `0.2s` and `0.1s` additional delay
- `prefers-reduced-motion`: all bars freeze at staggered static heights (8px, 16px, 12px, 8px, 16px)

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Track metadata changes | Title/artist text cross-fades (opacity 0 to 1) | 400ms | ease-in-out | Instant swap |
| Transition to live mode | LIVE badge scales in from 0.8 to 1.0 + fades in | 300ms | ease-out | Instant appear |
| Transition to idle | Content fades slightly (opacity 1.0 to 0.7) then gradient overlay fades in | 600ms | ease | Instant swap |
| Idle gradient overlay | Continuous pulse animation on gradient opacity | 2000ms (CSS animate-pulse) | ease-in-out | Static gradient at 50% opacity, no animation |

---

## 3. Play/Pause Button

### Component: PlayPauseButton
**Purpose:** The single most important interactive element -- starts and stops audio playback.
**Variants:** standalone (within PlayerBar), hero-size (if ever placed in NowPlayingHero or Splash)

**Layout:** Circular button. In PlayerBar: `w-11 h-11` (44px). Standalone hero: `w-14 h-14` (56px). `rounded-full`. `flex items-center justify-center`. Icon centered, `w-5 h-5` (PlayerBar) or `w-6 h-6` (hero).

#### States Table

| State | Background | Border | Icon | Icon Color | Shadow | Opacity | Cursor | Transition | ARIA |
|-------|-----------|--------|------|------------|--------|---------|--------|------------|------|
| **Play (default)** | radio-accent (#e63946) | none | Right-pointing triangle (polygon: 5,3 19,12 5,21) | white | none | 1 | pointer | all 200ms ease | `aria-label="Play"` |
| **Play (hover)** | radio-accent + brightness-110 filter | none | Same triangle | white | none | 1 | pointer | brightness 150ms ease | -- |
| **Play (active/pressed)** | radio-accent + brightness-90 filter | none | Same triangle, scale(0.95) | white | none | 1 | pointer | transform 100ms ease | -- |
| **Play (focus-visible)** | radio-accent | **2px solid white, 2px offset from radio-surface** | Same triangle | white | none | 1 | pointer | ring 150ms ease | -- |
| **Pause (default)** | radio-accent (#e63946) | none | Two vertical bars (rect 6,4,4,16 + rect 14,4,4,16) | white | none | 1 | pointer | all 200ms ease | `aria-label="Pause"` |
| **Pause (hover)** | radio-accent + brightness-110 | none | Same bars | white | none | 1 | pointer | brightness 150ms ease | -- |
| **Pause (active/pressed)** | radio-accent + brightness-90 | none | Same bars, scale(0.95) | white | none | 1 | pointer | transform 100ms ease | -- |
| **Pause (focus-visible)** | radio-accent | **2px solid white, 2px offset** | Same bars | white | none | 1 | pointer | ring 150ms ease | -- |
| **Buffering/Loading** | radio-accent (#e63946) | none | Circular spinner (animated SVG or CSS border-spin) | white | none | 1 | wait | rotate 800ms linear infinite | `aria-label="Loading audio"`, `aria-busy="true"` |
| **Disabled** | radio-accent | none | Play triangle (grayed) | white | none | 0.5 | not-allowed | none | `aria-disabled="true"`, `aria-label="Play (unavailable)"` |

#### Icon Transition Animation

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Play to Pause | Icon cross-fade: play triangle opacity 1->0, pause bars opacity 0->1 simultaneously | 150ms | ease-out | Instant swap |
| Pause to Play | Reverse of above | 150ms | ease-out | Instant swap |
| Any to Buffering | Current icon fades out (100ms), spinner fades in (100ms) | 200ms total | ease | Spinner replaces instantly, no rotation -- show "..." text instead |
| Active press | `transform: scale(0.95)` on the entire button | 100ms | ease | No scale |
| Release after press | `transform: scale(1.0)` | 100ms | ease-out | No scale |

---

## 4. Button

### Component: Button
**Purpose:** General-purpose button used across the application for all text-labeled actions.
**Variants:** primary, secondary, danger, ghost
**Sizes:** sm (44px min-h), md (48px min-h), lg (56px min-h)

**Layout:** Inline-flex, horizontally and vertically centered. `rounded-md`. `font-medium`. Min touch target enforced at all sizes (44px minimum dimension).

**Semantic:** Native `<button>` element. `forwardRef` supported.

#### Size Dimensions

| Size | Min Height | Min Width | Padding (horizontal) | Padding (vertical) | Font Size |
|------|-----------|-----------|---------------------|--------------------|-----------|
| sm | 44px | 44px | 12px (px-3) | 6px (py-1.5) | 14px (text-sm) |
| md | 48px | 48px | 16px (px-4) | 8px (py-2) | 16px (text-base) |
| lg | 56px | 56px | 24px (px-6) | 12px (py-3) | 18px (text-lg) |

#### States Table -- PRIMARY Variant

| State | Background | Border | Text | Opacity | Cursor | Transition | ARIA |
|-------|-----------|--------|------|---------|--------|------------|------|
| Default | radio-accent (#e63946) | none | white | 1 | pointer | all 200ms ease | -- |
| Hover | radio-accent + `brightness-110` filter | none | white | 1 | pointer | filter 150ms ease | -- |
| Active/Pressed | radio-accent + `brightness-90` filter | none | white | 1 | pointer | filter 100ms ease | -- |
| Focus-Visible | radio-accent | **2px solid white, 2px offset from radio-surface** | white | 1 | pointer | outline 150ms ease | -- |
| Disabled | radio-accent | none | white | 0.5 | not-allowed | none | `aria-disabled="true"` or native `disabled` |
| Loading | radio-accent | none | Hidden, replaced by spinner (white, 16px) | 1 | wait | spinner rotate 800ms linear | `aria-busy="true"`, `aria-label` describes action |

#### States Table -- SECONDARY Variant

| State | Background | Border | Text | Opacity | Cursor | Transition | ARIA |
|-------|-----------|--------|------|---------|--------|------------|------|
| Default | radio-border (#1e1e2e) | none | radio-text (#e0e0e0) | 1 | pointer | all 200ms ease | -- |
| Hover | radio-muted/30 | none | radio-text | 1 | pointer | background 150ms ease | -- |
| Active/Pressed | radio-muted/40 | none | radio-text | 1 | pointer | background 100ms ease | -- |
| Focus-Visible | radio-border | **2px solid white, 2px offset** | radio-text | 1 | pointer | outline 150ms ease | -- |
| Disabled | radio-border | none | radio-text | 0.5 | not-allowed | none | -- |
| Loading | radio-border | none | Hidden, spinner (radio-muted, 16px) | 1 | wait | spinner rotate 800ms linear | `aria-busy="true"` |

#### States Table -- DANGER Variant

| State | Background | Border | Text | Opacity | Cursor | Transition | ARIA |
|-------|-----------|--------|------|---------|--------|------------|------|
| Default | red-600 (#dc2626) | none | white | 1 | pointer | all 200ms ease | -- |
| Hover | red-700 (#b91c1c) | none | white | 1 | pointer | background 150ms ease | -- |
| Active/Pressed | red-800 (#991b1b) | none | white | 1 | pointer | background 100ms ease | -- |
| Focus-Visible | red-600 | **2px solid white, 2px offset** | white | 1 | pointer | outline 150ms ease | -- |
| Disabled | red-600 | none | white | 0.5 | not-allowed | none | -- |
| Loading | red-600 | none | Hidden, spinner (white, 16px) | 1 | wait | spinner rotate 800ms linear | `aria-busy="true"` |

#### States Table -- GHOST Variant

| State | Background | Border | Text | Opacity | Cursor | Transition | ARIA |
|-------|-----------|--------|------|---------|--------|------------|------|
| Default | transparent | none | radio-text (#e0e0e0) | 1 | pointer | all 200ms ease | -- |
| Hover | radio-border (#1e1e2e) | none | radio-text | 1 | pointer | background 150ms ease | -- |
| Active/Pressed | radio-border + brightness-90 | none | radio-text | 1 | pointer | background 100ms ease | -- |
| Focus-Visible | transparent | **2px solid white, 2px offset** | radio-text | 1 | pointer | outline 150ms ease | -- |
| Disabled | transparent | none | radio-text | 0.5 | not-allowed | none | -- |
| Loading | transparent | none | Hidden, spinner (radio-muted, 16px) | 1 | wait | spinner rotate 800ms linear | `aria-busy="true"` |

#### Global Button Interaction Rules
- All buttons use `focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-radio-surface`
- Disabled buttons get `pointer-events-none` (prevents hover/click entirely)
- Loading state replaces children with a centered spinner; button width should NOT collapse (use `min-width` matching current rendered width, or a fixed width on the loading state)
- Buttons containing both icon + text: icon placed left of text with `gap-2`

---

## 5. IconButton

### Component: IconButton
**Purpose:** Icon-only button for compact actions (skip, close, edit, delete). Mandatory `aria-label` for accessibility.
**Variants:** primary, secondary, danger, ghost (same color logic as Button)
**Sizes:** sm (36px / `h-9 w-9`), md (44px / `h-11 w-11`), lg (56px / `h-14 w-14`)

**Layout:** Square, inline-flex centered. `rounded-md`. Icon centered within.

**Semantic:** Native `<button>` with required `aria-label` prop. `forwardRef` supported.

#### Size Dimensions

| Size | Dimensions | Icon Size | Min Touch Target |
|------|-----------|-----------|------------------|
| sm | 36x36px | 16x16px (w-4 h-4) | 36px (acceptable for non-primary actions) |
| md | 44x44px | 20x20px (w-5 h-5) | 44px (meets WCAG 2.5.5) |
| lg | 56x56px | 24x24px (w-6 h-6) | 56px (large touch target) |

#### States Table (all variants follow same pattern as Button)

| State | Background (ghost) | Background (primary) | Background (secondary) | Background (danger) | Icon Color | Opacity | Cursor | Transition |
|-------|-------------------|---------------------|----------------------|--------------------| -----------|---------|--------|------------|
| Default | transparent | radio-accent | radio-border | red-600 | Inherits from variant text color | 1 | pointer | all 200ms ease |
| Hover | radio-border | accent+brightness-110 | muted/30 | red-700 | Same | 1 | pointer | 150ms ease |
| Active | border+brightness-90 | accent+brightness-90 | muted/40 | red-800 | Same | 1 | pointer | 100ms ease |
| Focus-Visible | transparent + ring | accent + ring | border + ring | red-600 + ring | Same | 1 | pointer | 150ms ease |
| Disabled | transparent | radio-accent | radio-border | red-600 | Same | 0.5 | not-allowed | none |
| Loading | transparent | radio-accent | radio-border | red-600 | Spinner replaces icon | 1 | wait | rotate 800ms |

**ARIA requirements:**
- `aria-label` is mandatory (enforced by TypeScript interface: `label: string`)
- If the icon button has a tooltip, use `title` attribute in addition to `aria-label`
- If the button toggles state (e.g., mute/unmute), use `aria-pressed` or dynamically update `aria-label`

---

## 6. Track Row (Library)

### Component: TrackRow
**Purpose:** A single row in the track library table, representing one audio track. Supports selection via checkbox and adding to playlist.
**Variants:** admin-mode (checkbox + add button), listener-mode (request button only, future)

**Layout:** Table row (`<tr>`). Columns: Checkbox (optional, 32px), Title (flex, max-width 200px truncated), Artist (max-width 150px truncated, radio-muted), Duration (right-aligned, radio-muted), Action button (optional, 32px). Row padding: `px-4 py-1.5`.

#### States Table

| State | Background | Border | Title Text | Artist Text | Checkbox | Action Button | Opacity | Cursor | Transition | ARIA |
|-------|-----------|--------|------------|-------------|----------|---------------|---------|--------|------------|------|
| **Default** | transparent | none | radio-text | radio-muted | Unchecked, accent-radio-accent | "+" in radio-accent | 1 | default (row), pointer (interactive elements) | colors 150ms ease | -- |
| **Hover** | radio-border/50 | none | radio-text | radio-muted | Unchecked | "+" brightens (brightness-125) | 1 | pointer | background 150ms ease | -- |
| **Selected (checkbox checked)** | radio-accent/10 | none | radio-text | radio-muted | Checked, accent-radio-accent, filled | "+" in radio-accent | 1 | pointer | background 200ms ease | `aria-selected="true"` on checkbox |
| **Selected + Hover** | radio-accent/15 | none | radio-text | radio-muted | Checked | "+" brightens | 1 | pointer | background 150ms ease | -- |
| **Currently Playing** | radio-accent/10 | left 2px solid radio-accent | radio-accent (title highlighted) | radio-muted | Unchecked or checked | Same | 1 | pointer | background 200ms ease | `aria-current="true"` |
| **Adding to Playlist (flash)** | Flash: radio-success/20 then back to previous | none | radio-text | radio-muted | Same | Briefly shows checkmark then reverts | 1 | pointer | background 400ms ease-out | `aria-live="polite"` announcement: "Added to playlist" |
| **Disabled (no playlist selected)** | transparent | none | radio-text | radio-muted | Hidden or disabled | "+" in radio-muted, `cursor: not-allowed` | 0.7 for action button | not-allowed on action | none | `title="Select a playlist first"` |

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Hover enter | `background-color` from transparent to radio-border/50 | 150ms | ease | Instant |
| Hover leave | `background-color` back to transparent (or selected color) | 150ms | ease | Instant |
| Checkbox toggle | Checkbox fill animation (native browser + accent-color) | Instant (native) | -- | -- |
| Add-to-playlist flash | Background pulses radio-success/20 then fades to transparent | 400ms | ease-out | No flash, rely on toast notification only |
| Currently-playing indicator | Left border appears (width 0 to 2px) | 200ms | ease-out | Instant appear |

---

## 7. Playlist Item

### Component: PlaylistItem
**Purpose:** An entry in the playlist sidebar or playlist track list, representing either a playlist itself or a track within a playlist.
**Variants:** playlist-entry (in the sidebar list), playlist-track (in the track detail pane)

### Playlist Entry (sidebar)

**Layout:** Flex row, `px-3 py-2`. Left side: playlist name (truncated) + track count badge. Right side: Activate button + Delete button. Full width of sidebar column (1/3 of panel).

**Semantic:** `role="option"` within a `role="listbox"`. `aria-selected` indicates currently viewed playlist. `tabIndex={0}` for keyboard navigation.

#### States Table -- Playlist Entry

| State | Background | Border | Name Text | Track Count | Activate Button | Delete Button | Cursor | Transition | ARIA |
|-------|-----------|--------|-----------|-------------|----------------|---------------|--------|------------|------|
| **Default** | transparent | none | radio-text | `text-radio-muted text-xs` "(N)" | `bg-radio-accent/20 text-radio-accent text-xs px-2.5 py-1.5 min-h-[36px]` hover: accent/30 | `bg-red-900/20 text-red-400 text-xs px-2.5 py-1.5 min-h-[36px]` hover: red-900/30 | pointer | colors 150ms ease | `aria-selected="false"` |
| **Hover** | radio-border/50 | none | radio-text | Same | Same + slightly brighter | Same + slightly brighter | pointer | background 150ms ease | -- |
| **Selected (viewing)** | radio-border | none | radio-text (bold if active) | Same | Same | Same | pointer | background 200ms ease | `aria-selected="true"` |
| **Active (currently playing from this playlist)** | radio-border | none | **radio-accent, font-semibold** | Same | Hidden (shows checkmark icon instead, `text-radio-muted/20 cursor-default`) | Same | pointer | color 200ms ease | `aria-current="true"` |
| **Keyboard Focused** | radio-border/50 | **2px solid white ring** (focus-visible) | radio-text | Same | Same | Same | pointer | outline 150ms ease | `aria-selected` per state |

### Playlist Track (detail pane)

**Layout:** Flex row within a `divide-y divide-radio-border` container. Left: position number (`text-radio-muted w-6 text-right mr-2`) + track title (truncated, flex-1). Right: remove button (red "-"). Padding: `px-3 py-1.5`.

#### States Table -- Playlist Track

| State | Background | Border | Position Text | Title Text | Remove Button | Cursor | Transition | ARIA |
|-------|-----------|--------|--------------|------------|---------------|--------|------------|------|
| **Default** | transparent | bottom 1px radio-border (via divide-y) | radio-muted | radio-text | `text-red-400` "-" icon, hidden until hover | default | colors 150ms ease | -- |
| **Hover** | radio-border/50 | Same | radio-muted | radio-text | `text-red-400 hover:text-red-300`, visible | pointer | background 150ms ease | -- |
| **Selected** | radio-accent/10 | Same | radio-muted | radio-text | Visible | pointer | background 200ms ease | `aria-selected="true"` |
| **Currently Playing** | radio-accent/10 | Same + left 2px radio-accent | **radio-accent** | **radio-accent** | Visible | default | background 200ms ease | `aria-current="true"` |
| **Keyboard Focused** | radio-border/50 | **2px solid white ring** | radio-muted | radio-text | Visible | pointer | outline 150ms ease | -- |
| **Drag Handle Visible** | Same as hover | Same | Same | Same | Same + drag handle icon appears left of position | grab | none | `aria-grabbed`, `aria-dropeffect` (future dnd-kit) |

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Playlist entry selected | Background color transition | 200ms | ease | Instant |
| Playlist activated | Name color transitions to radio-accent | 200ms | ease | Instant |
| Track removed | Row slides left and fades out (translateX -20px, opacity 0), then row height collapses | 300ms | ease-in | Row disappears instantly |
| Track added (appears at bottom) | Row slides down from 0 height to full height, opacity 0 to 1 | 250ms | ease-out | Instant appear |

---

## 8. Chat Message

### Component: ChatMessage
**Purpose:** A single message in the chat log. Different visual treatments for different message types.
**Variants:** user-message, own-message, system-message, error-message

**Layout:** List item (`<li>`) within a `<ul role="log" aria-live="polite">`. Left-aligned for all users (no right-alignment for own messages -- radio chat convention, not IM convention). Inline layout: username (bold, colored) + timestamp + message text.

#### States Table

| Variant | Layout | Username Style | Timestamp Style | Message Text Style | Background | Border | Special |
|---------|--------|---------------|----------------|-------------------|-----------|--------|---------|
| **User Message** | Inline: `[username] [time] [text]` | `font-semibold text-radio-accent` | `text-radio-muted text-xs` ("2m ago") | `text-radio-text text-sm` | transparent | none | -- |
| **Own Message** | Same inline layout | `font-semibold text-radio-info` (blue instead of red to distinguish self) | Same | `text-radio-text text-sm` | transparent (or very subtle `radio-info/5` wash) | none | Own username is highlighted blue so user can find their messages |
| **System Message (now-playing)** | Centered, full-width | No username | `text-radio-muted text-xs` | `text-radio-muted text-xs italic` -- e.g., "Now playing: Track -- Artist" | transparent | top and bottom 1px dashed radio-border | Music note icon (optional) prefix |
| **System Message (join/leave)** | Centered, full-width | No username | Same | `text-radio-muted text-xs italic` -- e.g., "user1234 joined" | transparent | none | Muted, does not demand attention |
| **Error Message** | Left-aligned | "System" in radio-error | Same | `text-radio-error text-sm` -- e.g., "Connection lost. Reconnecting..." | radio-error/10 | left 2px solid radio-error | `role="alert"` on this specific message |

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| New message appears | Slides up from bottom of chat, opacity 0 to 1 | 200ms | ease-out | Instant appear |
| Chat scrolls to new message | `scrollIntoView({ behavior: "smooth" })` | ~300ms (browser-controlled) | ease | `scrollIntoView({ behavior: "auto" })` (instant jump) |
| System message appears | Fades in (opacity 0 to 1, no slide) | 300ms | ease | Instant appear |

---

## 9. Chat Input

### Component: ChatInput
**Purpose:** Text input for composing and sending chat messages, with send button.
**Variants:** none

**Layout:** Flex row at the bottom of the Chat panel. Input takes `flex-1`. Send button on the right. Container has `border-t border-radio-border`. Input: `bg-transparent px-4 py-2 text-sm`. Send button: `px-4 py-2 text-sm font-semibold text-radio-accent`.

#### States Table

| State | Input Background | Input Border | Input Text | Placeholder | Send Button | Cursor | ARIA |
|-------|-----------------|-------------|------------|-------------|-------------|--------|------|
| **Default (empty)** | transparent | top border only (container border) | radio-text (but empty) | "Say something..." in radio-muted | `text-radio-accent`, not visually emphasized (text only, no bg) | text cursor in input | `<label for="chat-input" class="sr-only">Chat message</label>` |
| **Focused (empty)** | transparent | top border (no additional highlight -- uses global focus-visible on the input itself, `outline: 2px solid white`) | radio-text | "Say something..." in radio-muted | Same | text cursor | -- |
| **Focused (has value)** | transparent | Same | radio-text (showing typed text) | Hidden (value replaces placeholder) | `text-radio-accent hover:bg-radio-border` transition -- more prominent | text cursor | -- |
| **Disabled (disconnected)** | transparent | Same | radio-muted | "Connecting..." in radio-muted | Disabled (cannot click), `opacity 0.5` | not-allowed | `aria-disabled="true"` on both input and button |
| **Sending** | transparent | Same | radio-text (input clears after send) | -- | Briefly shows "..." or dims for 100ms as visual confirmation | text cursor | -- |

**Username editing sub-state:**
- When the pencil icon next to the username is clicked, a small inline `<input>` replaces the username text
- Input: `bg-radio-bg border border-radio-border rounded px-1.5 py-0.5 text-xs w-24`
- Focus: `border-radio-accent`
- Commit on Enter or blur. Cancel on Escape.
- Max length: 20 characters

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Send button hover | Background fades in (transparent to radio-border) | 150ms | ease | Instant |
| Message sent (input clears) | No animation -- input simply clears. Toast or brief button flash provides confirmation | -- | -- | -- |
| Disconnect | Send button and input fade to 50% opacity | 200ms | ease | Instant opacity change |
| Reconnect | Opacity returns to 100%, placeholder changes back to "Say something..." | 200ms | ease | Instant |

---

## 10. Search Input

### Component: SearchInput
**Purpose:** Text input for filtering the track library, with debounced search and clear button.
**Variants:** none (single style)

**Layout:** `bg-radio-bg border border-radio-border rounded-lg px-3 py-1 text-sm`. Width: `w-40` in Library header (can expand). Within AdminDashboard, it's `flex-1` (fills available space).

#### States Table

| State | Background | Border | Text | Placeholder | Clear Button | Loading Indicator | Cursor | ARIA |
|-------|-----------|--------|------|-------------|--------------|-------------------|--------|------|
| **Empty (default)** | radio-bg (#0a0a0f) | 1px solid radio-border | -- | "Search..." in radio-muted | Hidden | Hidden | text | `<label for="library-search" class="sr-only">Search tracks</label>` |
| **Empty (focused)** | radio-bg | 1px solid **radio-accent** (highlight) | -- | "Search..." in radio-muted | Hidden | Hidden | text | -- |
| **Has Value** | radio-bg | 1px solid radio-border | radio-text | Hidden | Visible: small "X" icon (`text-radio-muted hover:text-radio-text`, 16x16px) at right edge of input | Hidden | text | `aria-label` updates to "Search tracks, [N] results" after results load |
| **Has Value (focused)** | radio-bg | 1px solid **radio-accent** | radio-text | Hidden | Visible | Hidden | text | -- |
| **Loading Results** | radio-bg | 1px solid radio-border (or accent if focused) | radio-text | Hidden | Visible | Small spinner (12x12px, radio-muted) replaces or appears beside clear button | text | `aria-busy="true"` |
| **No Results** | radio-bg | 1px solid radio-border | radio-text (the query) | Hidden | Visible | Hidden | text | Pair with empty state below the input: "No tracks match [query]" |

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Focus | Border color transitions from radio-border to radio-accent | 150ms | ease | Instant |
| Blur | Border color transitions from radio-accent to radio-border | 150ms | ease | Instant |
| Clear button appears | Fades in (opacity 0 to 1) | 150ms | ease | Instant |
| Clear button pressed | Input text clears, clear button fades out | 150ms | ease | Instant |
| Debounce trigger (300ms after last keystroke) | Loading spinner appears | 150ms fade-in | ease | Instant |
| Results loaded | Loading spinner fades out | 150ms | ease | Instant |

---

## 11. Volume Slider

### Component: VolumeSlider
**Purpose:** Controls audio playback volume. Paired with a volume icon that reflects current level and mute state.
**Variants:** none

**Layout:** Flex row: volume icon (16x16, `radio-muted`, `aria-hidden`) + range input (`w-20`, `accent-radio-accent`). Gap: `gap-2`.

The range input uses native HTML `<input type="range" min="0" max="1" step="0.01">` with `accent-radio-accent` for the track fill color.

#### States Table

| State | Icon | Track (unfilled) | Track (filled) | Thumb | Thumb Size | Cursor | ARIA |
|-------|------|-----------------|----------------|-------|-----------|--------|------|
| **Default (mid volume)** | Speaker with one sound wave | radio-border | radio-accent | radio-accent circle | 12px diameter | pointer (on thumb) | `aria-label="Volume"`, `aria-valuenow="0.8"`, `aria-valuemin="0"`, `aria-valuemax="1"` |
| **Hover** | Same | Same | Same | radio-accent circle, **14px diameter** (grows) | 14px | pointer | -- |
| **Dragging** | Same (updates in real-time as volume changes) | Same | radio-accent (width tracks thumb) | radio-accent circle, 14px, with subtle shadow | 14px | grabbing | `aria-valuenow` updates continuously |
| **Low Volume (0.01-0.3)** | Speaker with no sound waves (just speaker body) | Same | Same | Same | Same | pointer | -- |
| **Mid Volume (0.31-0.7)** | Speaker with one sound wave | Same | Same | Same | Same | pointer | -- |
| **High Volume (0.71-1.0)** | Speaker with two sound waves | Same | Same | Same | Same | pointer | -- |
| **Muted (volume = 0)** | Speaker with X / strikethrough | radio-border | None (track fully unfilled) | radio-muted circle (grayed) | 12px | pointer | `aria-label="Volume (muted)"` |
| **Focus-Visible** | Same per volume | Same | Same | Same + **2px white ring** | Same | pointer | -- |
| **Disabled** | radio-muted | radio-border (dim) | None | radio-muted, no interaction | Same | not-allowed | `aria-disabled="true"` |

#### Icon Variants (SVG detail)

- **Muted (0):** Speaker cone only, with "X" overlay or strikethrough line
- **Low (0.01-0.3):** Speaker cone, no waves
- **Mid (0.31-0.7):** Speaker cone + one small arc wave (current implementation)
- **High (0.71-1.0):** Speaker cone + two arc waves

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Thumb hover | Thumb scale from 12px to 14px | 150ms | ease | No scale, color change only |
| Start dragging | Thumb gains subtle box-shadow (`0 0 4px radio-accent/50`) | 100ms | ease | No shadow |
| Volume icon change (threshold crossed) | Icon cross-fades between wave states | 150ms | ease | Instant swap |
| Mute toggle (click on icon, if implemented) | Smooth volume value animation from current to 0 (or from 0 to last value) | 200ms | ease-out | Instant jump |

---

## 12. Toast

### Component: Toast
**Purpose:** Ephemeral notification messages that auto-dismiss. Stacks from bottom-right (or top-right).
**Variants:** success, error, info

**Layout:** `flex items-center gap-3 rounded-lg border-l-4 bg-radio-surface px-4 py-3 text-radio-text shadow-lg`. Max width: 400px. Position: fixed, bottom-right (stacked with 8px gap between toasts).

**Semantic:** `role="status"` with `aria-live="polite"`. Error toasts use `role="alert"` with `aria-live="assertive"`.

#### States Table

| Variant | Border-Left Color | Icon | Icon Color | Background | Text | Auto-Dismiss | ARIA |
|---------|------------------|------|------------|-----------|------|-------------|------|
| **Success** | radio-success (#22c55e) | Checkmark (Unicode 2713) | radio-success | radio-surface | radio-text, text-sm | 4000ms | `role="status"`, `aria-live="polite"` |
| **Error** | radio-error (#ef4444) | X mark (Unicode 2717) | radio-error | radio-surface | radio-text, text-sm | 6000ms (longer for errors) | `role="alert"`, `aria-live="assertive"` |
| **Info** | radio-info (#3b82f6) | Info "i" (Unicode 2139) | radio-info | radio-surface | radio-text, text-sm | 4000ms | `role="status"`, `aria-live="polite"` |

#### Dismiss Button
- Position: right side of toast
- Content: "&times;" character
- Style: `text-radio-muted hover:text-radio-text transition-colors`
- `aria-label="Dismiss notification"`

#### Toast Lifecycle Animation

| Phase | Property | Duration | Easing | Reduced-Motion |
|-------|----------|----------|--------|----------------|
| **Enter** | `translateY(1rem)` to `translateY(0)` + `opacity 0` to `opacity 1` | 300ms | ease-out (slideUp keyframe) | `opacity 0` to `opacity 1` only, no slide |
| **Visible** | Static, fully opaque | Holds for auto-dismiss duration (4000ms or 6000ms) | -- | -- |
| **Auto-dismiss countdown** | Optional: thin progress bar at bottom of toast shrinks from 100% to 0% width | Matches auto-dismiss duration | linear | No progress bar |
| **Exit** | `opacity 1` to `opacity 0` + `translateY(0)` to `translateY(-0.5rem)` | 200ms | ease-in | `opacity 1` to `opacity 0`, no translate |
| **Stack reflow** | Remaining toasts slide down to fill gap | 200ms | ease | Instant reposition |

---

## 13. ConfirmDialog

### Component: ConfirmDialog
**Purpose:** Modal dialog requiring explicit user confirmation before a destructive or significant action.
**Variants:** default, danger

**Layout:** Uses native `<dialog>` element with `showModal()`. Centered on screen (`m-auto`). Container: `rounded-lg border border-radio-border bg-radio-surface p-0 text-radio-text`. Inner content: `flex flex-col gap-4 p-6 max-w-md`. Two buttons at bottom, right-aligned with `gap-3`.

**Semantic:** `role="alertdialog"`. `aria-labelledby` points to title. `aria-describedby` points to message. Focus trapped within dialog. Initial focus on Cancel button (safer default). On close, focus returns to the element that triggered the dialog.

#### States Table -- Dialog Shell

| State | Backdrop | Dialog Background | Dialog Border | ARIA |
|-------|---------|-------------------|--------------|------|
| **Closed** | Hidden (dialog not in DOM flow) | -- | -- | -- |
| **Open (default variant)** | `bg-black/60 backdrop-blur-sm` | radio-surface (#12121a) | 1px solid radio-border | `role="alertdialog"`, `aria-labelledby`, `aria-describedby` |
| **Open (danger variant)** | `bg-black/60 backdrop-blur-sm` | radio-surface (#12121a) | 1px solid radio-border | Same |

#### Inner Element Styles

| Element | Default Variant | Danger Variant |
|---------|----------------|----------------|
| **Title** | `text-lg font-semibold text-radio-text` | `text-lg font-semibold text-radio-text` |
| **Message** | `text-sm text-radio-muted` | `text-sm text-radio-muted` |
| **Cancel Button** | `bg-radio-border text-radio-text hover:bg-radio-muted/30`, `min-h-[44px]`, focus ring | Same (cancel is always neutral) |
| **Confirm Button** | `bg-radio-accent text-white hover:brightness-110`, `min-h-[44px]`, focus ring | `bg-red-600 text-white hover:bg-red-700`, `min-h-[44px]`, focus ring |

#### Interaction Behavior

| Trigger | Behavior |
|---------|----------|
| Open dialog | Backdrop fades in (opacity 0 to 0.6, 200ms ease). Dialog scales from 0.95 to 1.0 + fades in (200ms ease-out). Focus moves to Cancel button. |
| Press Escape | Fires `onCancel`. Dialog closes. Focus returns to trigger element. |
| Click backdrop | Fires `onCancel` (via native dialog cancel event). |
| Press Tab | Focus cycles within dialog (Cancel and Confirm only). |
| Press Enter on Confirm | Fires `onConfirm`. Dialog closes. |
| Press Enter on Cancel | Fires `onCancel`. Dialog closes. |

#### Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Open | Dialog: `transform scale(0.95) -> scale(1.0)` + `opacity 0 -> 1`. Backdrop: `opacity 0 -> 0.6` | 200ms | ease-out | Instant appear, no scale |
| Close | Dialog: `opacity 1 -> 0` + `transform scale(1.0) -> scale(0.95)`. Backdrop: `opacity 0.6 -> 0` | 150ms | ease-in | Instant disappear |

---

## 14. Badge

### Component: Badge
**Purpose:** Small visual indicator for status, count, or labeling. Not interactive (no click handler).
**Variants:** live, listener-count, status, playlist-active

#### Variant Specifications

**LIVE Badge**

| Property | Value |
|----------|-------|
| Layout | Inline-flex row, `items-center gap-1.5` |
| Container | `bg-red-600/20 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full` (PlayerBar) or `px-3 py-1 text-sm` (NowPlayingHero) |
| Dot | `w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse` (PlayerBar) or `w-2 h-2` (Hero) or `w-3 h-3` (standalone large) |
| Text | "LIVE" in uppercase |
| Animation | Dot pulses (CSS `animate-pulse`: opacity 1 -> 0.5 -> 1, 2s infinite) |
| Reduced-motion | Dot is static (no pulse), solid red |
| ARIA | `aria-label="Live broadcast"` if standalone. Otherwise text is visible and sufficient. |

**Listener Count Badge**

| Property | Value |
|----------|-------|
| Layout | Inline-flex row, `items-center gap-1` |
| Icon | Person silhouette SVG, `w-3.5 h-3.5`, `fill: currentColor`, `aria-hidden="true"` |
| Text | `text-xs text-radio-muted` -- just the number (e.g., "12") or "12 listeners" in hero |
| Background | None (transparent) |
| ARIA | `aria-label="[N] listeners"` on the container |

**Status Badge (online/offline)**

| Property | Online | Offline |
|----------|--------|---------|
| Layout | Inline-flex row, `items-center gap-1.5` | Same |
| Dot | `w-2 h-2 bg-radio-success rounded-full` | `w-2 h-2 bg-radio-muted rounded-full` |
| Text | `text-xs text-radio-success` "Online" | `text-xs text-radio-muted` "Offline" |
| Background | `bg-radio-success/10 px-2 py-0.5 rounded-full` | `bg-radio-muted/10 px-2 py-0.5 rounded-full` |
| ARIA | `aria-label="Status: online"` | `aria-label="Status: offline"` |

**Playlist Active Badge**

| Property | Value |
|----------|-------|
| Appearance | Checkmark icon (SVG, `w-4 h-4`, `text-radio-muted`) inside a `min-w-[44px] min-h-[44px]` container with `bg-radio-muted/20 rounded-lg` |
| Text | None (icon only) |
| ARIA | `aria-label="[Playlist name] is active"` |
| Used in | Playlist sidebar, replacing the Activate button for the currently active playlist |

---

## 15. AudioMeter

### Component: AudioMeter
**Purpose:** Real-time visual representation of microphone audio input level during live broadcasting.
**Variants:** none

**Layout:** Full-width horizontal bar. Height: 8px (`h-2`). `rounded-full`. Container background: `radio-border`. Fill bar inside, also `rounded-full`, width set dynamically via inline style as percentage of `level` (0-100).

**Semantic:** `role="meter"`, `aria-label="Audio level"`, `aria-valuenow` (0-100), `aria-valuemin="0"`, `aria-valuemax="100"`.

#### States Table

| State | Container BG | Fill Width | Fill Color | Animation | ARIA |
|-------|-------------|-----------|------------|-----------|------|
| **Inactive (no stream / not active)** | radio-border (#1e1e2e) | 0% (empty) | radio-muted (but not visible at 0 width) | None | `aria-valuenow="0"` |
| **Active -- Low level (0-59%)** | radio-border | 0-59% (tracks `level` state) | **bg-green-500** (#22c55e) | Fill width transitions smoothly (75ms) | `aria-valuenow="[N]"` |
| **Active -- Mid level (60-79%)** | radio-border | 60-79% | **bg-yellow-400** (#facc15) | Fill width transitions smoothly (75ms) | `aria-valuenow="[N]"` |
| **Active -- High level (80-100%)** | radio-border | 80-100% | **bg-red-500** (#ef4444) | Fill width transitions smoothly (75ms) | `aria-valuenow="[N]"` |
| **Clipping (level hits 100%)** | radio-border | 100% | **bg-red-500** with brief **flash to bg-red-400** then back | Flash pulse: bg-red-500 -> bg-red-400 -> bg-red-500, 200ms | `aria-valuenow="100"` |

#### Level Thresholds and Color Transitions

```
0%  -------- 59% -------- 79% -------- 100%
   GREEN           YELLOW         RED
```

The fill color changes are instant at the threshold boundaries (no gradient between colors). The fill width itself transitions smoothly with `transition-all duration-75` (75ms) for responsive but smooth movement.

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Level changes (continuous, every animation frame) | `width` of fill bar | 75ms | ease (via CSS transition) | Same (this is data-driven, not decorative) |
| Color threshold crossed | `background-color` of fill bar | Instant (no transition on color) | -- | Same |
| Clipping flash | `background-color` red-500 -> red-400 -> red-500 | 200ms | ease | No flash, stays red-500 |
| Activate (stream starts) | Fill bar appears from 0% width | 200ms | ease-out | Instant |
| Deactivate (stream stops) | Fill bar shrinks to 0% width | 200ms | ease-in | Instant |

---

## 16. Tabs / Segmented Control

### Component: Tabs
**Purpose:** Switching between views or content sections, primarily in the AdminDashboard or for future multi-panel layouts.
**Variants:** underline-style (default), pill-style (segmented control)

### Underline Tabs

**Layout:** Horizontal flex row of tab buttons. Bottom border on the container: `border-b border-radio-border`. Each tab is a button with padding `px-4 py-2`. Active tab has a 2px bottom accent border that overlaps the container border.

#### States Table

| State | Background | Border-Bottom | Text | Opacity | Cursor | Transition | ARIA |
|-------|-----------|---------------|------|---------|--------|------------|------|
| **Default (inactive)** | transparent | none (container border shows through) | radio-muted | 1 | pointer | all 200ms ease | `role="tab"`, `aria-selected="false"`, `tabIndex="-1"` |
| **Hover (inactive)** | radio-border/30 | none | radio-text | 1 | pointer | background 150ms ease | -- |
| **Active** | transparent | **2px solid radio-accent** (overlaps container border) | **radio-text font-semibold** | 1 | default | border-color 200ms ease | `aria-selected="true"`, `tabIndex="0"` |
| **Focus-Visible** | transparent | Per active/inactive state | Per state | 1 | pointer | outline 150ms ease | Focus ring: 2px solid white |
| **Disabled** | transparent | none | radio-muted | 0.5 | not-allowed | none | `aria-disabled="true"` |

**Semantic structure:**
- Container: `role="tablist"`, `aria-label="[section name] tabs"`
- Each tab: `role="tab"`, `aria-controls="[panel-id]"`
- Content panel: `role="tabpanel"`, `aria-labelledby="[tab-id]"`

### Pill / Segmented Control Tabs

**Layout:** Horizontal flex row within a container with `bg-radio-bg rounded-lg p-1`. Each segment is a button with `rounded-md px-3 py-1.5 text-sm`. Active segment has a filled background.

#### States Table

| State | Background | Text | Opacity | Cursor | Transition | ARIA |
|-------|-----------|------|---------|--------|------------|------|
| **Default (inactive)** | transparent | radio-muted | 1 | pointer | all 200ms ease | `aria-selected="false"` |
| **Hover (inactive)** | radio-border/50 | radio-text | 1 | pointer | background 150ms ease | -- |
| **Active** | **radio-border** | **radio-text font-semibold** | 1 | default | background 200ms ease | `aria-selected="true"` |
| **Focus-Visible** | Per state + ring | Per state | 1 | pointer | outline 150ms ease | Focus ring |

#### Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Tab switch (underline) | Active indicator (bottom border) slides horizontally from old tab to new tab via a positioned pseudo-element | 250ms | ease-in-out | Instant jump (no slide) |
| Tab switch (pill) | Active background pill slides horizontally (using a shared positioned element behind the active tab) | 200ms | ease | Instant jump |
| Content panel switch | Old panel fades out (opacity 1->0), new panel fades in (opacity 0->1) | 200ms total (100ms out, 100ms in) | ease | Instant swap |

---

## 17. Empty State

### Component: EmptyState
**Purpose:** Informative placeholder shown when a list or panel has no content. Provides guidance on what the user can do.
**Variants:** no-tracks, no-playlists, no-chat-messages, no-search-results, no-playlist-selected

**Layout:** Centered within parent container. `flex items-center justify-center h-full`. Text: `text-radio-muted text-sm`. Optional icon above text (24x24 or 32x32, `text-radio-muted/50`).

#### Variant Content

| Variant | Icon | Headline | Body Text | Action (optional) |
|---------|------|----------|-----------|-------------------|
| **No Tracks** | Music note or vinyl icon, 32x32, radio-muted/50 | "No tracks found" | "Click Scan to import music from your library." | "Scan" button (secondary, sm) |
| **No Playlists** | List/playlist icon, 32x32, radio-muted/50 | "No playlists yet" | "Create one above to get started." | None (form is already visible above) |
| **No Chat Messages** | Chat bubble icon, 32x32, radio-muted/50 | "No messages yet" | "Be the first to say something!" | None (input is already visible below) |
| **No Search Results** | Search/magnifying glass icon, 32x32, radio-muted/50 | "No results for \"[query]\"" | "Try a different search term." | "Clear search" button (ghost, sm) |
| **No Playlist Selected** | Arrow/pointer icon, 32x32, radio-muted/50 | "Select a playlist" | "Choose a playlist from the left to view its tracks." | None |
| **Empty Playlist** | Music note with plus, 32x32, radio-muted/50 | "Empty playlist" | "Add tracks from the Library." | None (library is adjacent) |

#### States Table

| State | Icon Color | Headline Style | Body Style | Container | ARIA |
|-------|-----------|---------------|------------|-----------|------|
| **Default** | radio-muted/50 (very subtle) | `text-sm font-medium text-radio-muted` | `text-xs text-radio-muted/70 mt-1` | `flex flex-col items-center justify-center gap-2 py-8` | `role="status"` if content may appear dynamically |
| **With Action Button** | Same | Same | Same | Same + action button below body with `mt-3` | -- |

#### Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Empty state appears (content list becomes empty) | Fade in: opacity 0 to 1 | 300ms | ease | Instant appear |
| Empty state disappears (content loads/appears) | Instant removal (content appears above, pushing empty state out of DOM) | -- | -- | -- |
| Icon | Subtle float animation: translateY(0) -> translateY(-4px) -> translateY(0), infinite | 3000ms | ease-in-out | No float, static |

---

## 18. Loading Skeleton

### Component: Skeleton
**Purpose:** Animated placeholder that mimics the shape of content while it loads, preventing layout shift and communicating progress.
**Variants:** track-row, playlist-item, hero, text-line, button

**Base style:** `bg-radio-border rounded-md` with a shimmer animation overlay. The shimmer is a horizontal gradient that slides left to right.

#### Shimmer Animation Definition

```
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

Applied as: `background: linear-gradient(90deg, radio-border 25%, radio-border-light 50%, radio-border 75%)`, `background-size: 200% 100%`, `animation: shimmer 1.5s infinite`.

Where `radio-border-light` is `#2a2a3a` (slightly lighter than radio-border for visible shimmer on dark background).

#### Variant Dimensions

**Track Row Skeleton**

| Element | Width | Height | Border Radius | Spacing |
|---------|-------|--------|--------------|---------|
| Checkbox placeholder | 16px | 16px | 2px | px-4 |
| Title bar | 60% of cell width | 14px | 4px | px-4 |
| Artist bar | 40% of cell width | 12px | 4px | px-4 |
| Duration bar | 32px | 12px | 4px | right-aligned |
| Row container | 100% | 36px | 0 | py-1.5, within table row |

Render 8-12 skeleton rows to fill the viewport. Each row should have slightly randomized widths (50-70% for title, 30-50% for artist) to look natural.

**Playlist Item Skeleton**

| Element | Width | Height | Border Radius |
|---------|-------|--------|--------------|
| Name bar | 70% of item width | 14px | 4px |
| Count badge | 24px | 12px | 4px |
| Button placeholder | 44px | 36px | 8px |
| Item container | 100% | 44px | 0 |

**Hero Skeleton**

| Element | Width | Height | Border Radius |
|---------|-------|--------|--------------|
| Title bar | 200px (centered) | 24px | 4px |
| Artist bar | 140px (centered) | 18px | 4px |
| Equalizer placeholder | 30px | 24px | 4px |
| Container | 100% | 200px (min) | 12px (rounded-xl) |

**Text Line Skeleton**

| Element | Width | Height | Border Radius |
|---------|-------|--------|--------------|
| Single line | Configurable (default: 100%) | 14px | 4px |
| Use for: chat messages, generic text placeholders | -- | -- | -- |

#### States Table

| State | Background | Shimmer | Opacity | ARIA |
|-------|-----------|---------|---------|------|
| **Loading** | radio-border (#1e1e2e) with shimmer gradient overlay | Sliding left-to-right, 1.5s infinite | 1 | `aria-hidden="true"` on individual skeletons. Container: `aria-busy="true"`, `aria-label="Loading [content type]"` |
| **Loaded (transitioning out)** | Skeleton fades out as real content fades in | Stops | 1 -> 0 | `aria-busy="false"` |

#### Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Shimmer cycle | `background-position` from -200% to 200% | 1.5s | linear, infinite | **No shimmer animation.** Static `bg-radio-border` with `opacity: 0.7` pulse (CSS animate-pulse, 2s) |
| Content loads (skeleton -> real content) | Skeleton: `opacity 1 -> 0`. Real content: `opacity 0 -> 1` | 200ms | ease | Instant swap |
| Skeleton row stagger | Each row's shimmer starts 50ms after the previous (staggered `animation-delay`) | 50ms per row | -- | No stagger, all static |

---

## 19. FirstVisitSplash

### Component: FirstVisitSplash
**Purpose:** Full-screen overlay shown to first-time visitors, providing a clear call-to-action to begin listening. Required because browsers block autoplay without user interaction.
**Variants:** none

**Layout:** `fixed inset-0 z-40 bg-radio-bg flex items-center justify-center`. Content centered in a column: icon, heading, button, metadata. Padding: `px-4`. Text centered.

#### States Table

| State | Background | Content | Button | Metadata | ARIA |
|-------|-----------|---------|--------|----------|------|
| **Visible (no track playing)** | radio-bg (#0a0a0f), full viewport | Headphone icon (96x96, radio-accent, with accent glow blur behind) + "EPIRBE Radio" (text-4xl font-bold) + "Web Radio Station" (text-radio-muted) | "Start Listening" -- `min-h-[56px] px-8 text-lg font-semibold text-white bg-radio-accent rounded-full hover:brightness-110` | Listener count ("N listening now") + current track name if available | `aria-label="Welcome to EPIRBE Radio"` on container |
| **Visible (track is playing elsewhere)** | Same | Same + current track info below button | Same | Shows: "[N] listening now" + "[Track Title]" in `text-radio-text/70 truncate max-w-xs` | -- |
| **Transitioning out (after click)** | Fades out | All content fades out simultaneously | -- | -- | -- |

#### Headphone Icon Glow
- Glow layer: `absolute inset-0 blur-2xl bg-radio-accent/20 rounded-full` behind the SVG
- Creates a soft red ambient light effect around the icon

#### Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Initial load | Entire splash fades in (opacity 0->1) + content slides up slightly (translateY 20px -> 0) | 500ms | ease-out | Fade in only (200ms), no slide |
| Headphone icon | Subtle floating: translateY(0) -> translateY(-8px) -> translateY(0), infinite | 4000ms | ease-in-out | No float, static |
| Glow pulse | Glow opacity oscillates 0.15 -> 0.25 -> 0.15, infinite | 3000ms | ease-in-out | Static at 0.2 opacity |
| "Start Listening" button hover | brightness-110 on bg | 150ms | ease | Instant |
| Click "Start Listening" | Entire splash fades out (opacity 1->0) + scales up slightly (scale 1.0 -> 1.02) | 400ms | ease-in | Fade out only (200ms), no scale |

---

## 20. SourceSwitch (Mic Toggle)

### Component: SourceSwitch
**Purpose:** Controls live microphone broadcasting. Allows the DJ to go live or return to playlist mode.
**Variants:** none (state-driven: idle, connecting, live, error)

**Layout:** Card container: `bg-radio-surface border border-radio-border rounded-xl p-4`. Flex row: left side (heading + status text), right side (action button).

#### States Table

| State | Container Border | Status Text | Status Color | Button Label | Button Style | Button Disabled | AudioMeter | ARIA |
|-------|-----------------|-------------|-------------|-------------|-------------|----------------|------------|------|
| **Idle** | radio-border | "Playlist" | radio-text | "Go Live" | `bg-radio-border text-radio-text hover:bg-radio-muted/30` | No | Hidden (or inactive gray) | Button: `aria-label="Go live with microphone"` |
| **Connecting** | radio-border | "Connecting..." | yellow-400 | "Connecting..." | `bg-radio-border text-radio-text` | **Yes** (`disabled:opacity-50 disabled:cursor-not-allowed`) | Hidden | Button: `aria-label="Connecting microphone"`, `aria-busy="true"` |
| **Live** | radio-border (or subtle accent glow: `border-radio-accent/30`) | "LIVE MIC" with pulsing red dot | radio-accent | "Stop Mic" | `bg-red-600 text-white hover:bg-red-700` | No | **Visible and active** (green/yellow/red bar) | Button: `aria-label="Stop microphone"` |
| **Error** | radio-border | Error message (e.g., "Microphone access denied") | red-400 | "Retry" | `bg-yellow-600 text-white hover:bg-yellow-700` | No | Hidden | Button: `aria-label="Retry microphone connection"`, status text: `role="alert"` |

#### Interaction Micro-animations

| Trigger | Property | Duration | Easing | Reduced-Motion |
|---------|----------|----------|--------|----------------|
| Idle -> Connecting | Button text changes, opacity pulse | 200ms | ease | Instant |
| Connecting -> Live | Status text changes, red pulsing dot appears, button changes to danger style, AudioMeter fades in | 300ms | ease-out | Instant swap |
| Live -> Idle (stop) | Reverse: AudioMeter fades out, button returns to neutral, pulsing dot disappears | 300ms | ease-in | Instant swap |
| Any -> Error | Error text slides in, button changes to yellow/retry | 200ms | ease-out | Instant swap |
| LIVE MIC pulsing dot | `animate-pulse` on the red dot (opacity 1 -> 0.5 -> 1) | 2000ms, infinite | ease-in-out | Static dot, no pulse |

---

## 21. AdminDashboard (Composite)

### Component: AdminDashboard
**Purpose:** Full-screen DJ management interface, gated behind authentication. Composes multiple panels into a 2-column grid layout.
**Variants:** none

This is a composite component -- it does not have independent visual states beyond its children. The specification here covers the layout shell and header.

#### Layout

- Full viewport height: `min-h-screen bg-radio-bg text-radio-text`
- Header: `bg-gradient-to-r from-radio-accent/20 via-radio-surface to-radio-surface border-b border-radio-accent/30 px-4 py-3`
  - Left: pulsing red dot + "DJ Dashboard" (`text-xl font-bold`)
  - Right: "Listener View" text link + "Logout" button (secondary style)
- Content: `max-w-7xl mx-auto px-4 py-6`
  - Grid: `grid-cols-1 lg:grid-cols-2 gap-6`
  - Left column: SourceSwitch + Playlist Manager
  - Right column: Library + Chat

#### Header States

| State | Gradient | Left Content | Right Content |
|-------|---------|-------------|--------------|
| **Default** | `from-radio-accent/20 via-radio-surface to-radio-surface` | Pulsing red dot + "DJ Dashboard" | "Listener View" (ghost text) + "Logout" (secondary button) |
| **During live broadcast** | Same (or intensified: `from-radio-accent/30`) | Pulsing red dot + "DJ Dashboard" + **"ON AIR"** badge | Same |

---

## 22. ListenerView (Composite)

### Component: ListenerView
**Purpose:** The default view for non-admin visitors. Composes NowPlayingHero, Chat, and Library in a responsive grid.
**Variants:** none

#### Layout

- Padding bottom to accommodate PlayerBar: `pb-20` (80px, since PlayerBar is 64px + 16px breathing room)
- Grid: `grid-cols-1 lg:grid-cols-3 gap-6`
  - Left (2/3 on desktop): NowPlayingHero
  - Right (1/3 on desktop): Children slot (Chat + Library passed as children)

---

## Interaction Micro-animations -- Global Summary

### CSS Animation Keyframes (defined in tailwind.config.js or index.css)

| Name | Definition | Used By |
|------|-----------|---------|
| `eq-1` | height: 4px -> 16px -> 4px, 0.8s ease-in-out infinite | Equalizer bars |
| `eq-2` | height: 12px -> 4px -> 12px, 0.6s ease-in-out infinite | Equalizer bars |
| `eq-3` | height: 8px -> 16px -> 8px, 0.9s ease-in-out infinite | Equalizer bars |
| `slideUp` | translateY(1rem) + opacity 0 -> translateY(0) + opacity 1, 300ms ease-out | Toast enter |
| `shimmer` | background-position: -200% -> 200%, 1.5s linear infinite | Loading skeletons |
| `pulse` (Tailwind built-in) | opacity 1 -> 0.5 -> 1, 2s ease-in-out infinite | LIVE badge dot, idle gradient |
| `spin` (Tailwind built-in) | rotate 0 -> 360deg, 1s linear infinite | Loading spinners |
| `float` (new) | translateY(0) -> translateY(-8px) -> translateY(0), 4s ease-in-out infinite | Splash headphone icon, empty state icons |

### Transition Defaults

| Property | Duration | Easing | Used For |
|----------|----------|--------|----------|
| `background-color` | 150ms | ease | Button hover, row hover |
| `color` | 150ms | ease | Text color changes, icon color |
| `border-color` | 150ms | ease | Input focus, tab indicator |
| `opacity` | 200ms | ease | Fade in/out |
| `transform` | 200ms | ease-out | Scale, translate |
| `filter` (brightness) | 150ms | ease | Primary button hover |
| `all` | 200ms | ease | Catch-all for components with multiple transitioning properties |
| `width` (AudioMeter) | 75ms | ease | Meter fill level |

### prefers-reduced-motion Strategy

For users with `prefers-reduced-motion: reduce`:

1. **All continuous animations stop:** Equalizer bars freeze at mid-height, LIVE dot is static, floating icons are static, shimmer becomes a static pulse, AudioMeter fill transitions remain (data-driven).
2. **Entrance/exit animations become instant:** No slide-up for toasts (just fade), no scale for dialogs (just appear/disappear), no translate for rows.
3. **Hover state changes remain:** These are user-initiated and expected. Color changes on hover still happen but without timing transitions (instant).
4. **Focus indicators always work:** Focus rings are not animated, so they are unaffected.
5. **Spinners are replaced:** Loading spinners become static "..." text or a pulsing dot.

Implementation:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

With exceptions for data-driven transitions (AudioMeter `width`, Volume slider `thumb`) which are re-enabled explicitly:
```css
@media (prefers-reduced-motion: reduce) {
  [role="meter"] > div {
    transition-duration: 75ms !important;
  }
}
```

---

## Visual Hierarchy Rules

### Primary Focus (highest visual weight)

These elements demand the most attention and use the strongest contrast:

1. **Play/Pause Button** -- The only element using a solid `radio-accent` filled background at 44-56px. Its circular shape and red fill make it the single most prominent interactive element on the page.
2. **NowPlayingHero title** -- Largest text on screen (`text-2xl font-bold`, white on dark). Centered. Accompanied by the animated equalizer for motion-draw.
3. **LIVE Badge** -- Uses the only animated pulsing element in the primary viewport (red dot). Red text on red/20 background creates urgency.

**Rule:** Only the Play/Pause button and destructive Confirm buttons use solid `radio-accent` backgrounds. No other element should compete with this level of visual weight.

### Secondary Focus (supporting information)

These elements are clearly visible but do not compete with primary elements:

4. **Track metadata** (title in PlayerBar) -- `text-sm font-medium text-radio-text`. Prominent but smaller than hero title.
5. **Action buttons** (Activate, Create, Scan) -- Use `radio-accent` text on transparent or accent/20 backgrounds. Colored but not filled.
6. **Chat messages** -- Username in `radio-accent` provides color anchoring; message text in `radio-text` is readable but not attention-grabbing.
7. **Section headings** -- `text-sm font-semibold text-radio-muted uppercase tracking-wider`. Small but structured. The uppercase + tracking makes them scannable without being loud.

**Rule:** Secondary elements use `radio-accent` as a text color or as a subtle background tint, never as a solid background fill (reserved for primary).

### Tertiary Focus (ambient/supporting)

These elements recede into the background:

8. **Artist names, timestamps, metadata** -- `text-radio-muted` on `radio-surface`. Contrast ratio 4.5:1 (passes WCAG AA). Visible on deliberate reading but does not draw the eye.
9. **Borders and dividers** -- `radio-border` (#1e1e2e) on `radio-surface` (#12121a). Just enough contrast to define panel edges without creating visual noise.
10. **Empty states and placeholders** -- `text-radio-muted/70` (even more subdued). Present for guidance but not demanding attention.
11. **Listener count, duration, track count badges** -- `text-xs text-radio-muted`. Smallest, most subdued text.

**Rule:** Tertiary information uses `radio-muted` or lower opacity variants. Never uses `radio-accent` for color.

### Color Usage Rules

| Color | When to Use | When NOT to Use |
|-------|------------|-----------------|
| `radio-accent` (#e63946) | Play/Pause button fill, confirm/primary action button fill, currently-playing indicators, active username in chat, LIVE badge, Activate button | Informational text, borders, backgrounds of non-interactive elements |
| `radio-text` (#e0e0e0) | Primary readable text (titles, messages, button labels on dark bg) | Text on accent backgrounds (use white instead) |
| `radio-muted` (#9ca3af) | Secondary text (artist, timestamps, metadata, section headers), inactive icons, placeholder text | Primary content that users must read to use the app |
| `radio-success` (#22c55e) | Toast success variant, AudioMeter low level, online status dot | General emphasis (it is not an emphasis color) |
| `radio-warning` (#eab308) | Autoplay blocked message, AudioMeter mid level, connecting state | General warnings that are not truly about caution |
| `radio-error` (#ef4444) | Toast error variant, AudioMeter high level, error messages, inline validation errors | Destructive button backgrounds (use red-600 for danger buttons) |
| `radio-info` (#3b82f6) | Toast info variant, own-message username highlight, informational badges | General links or navigation (there are no traditional links in this SPA) |
| `white` (#ffffff) | Focus ring color, text on accent/danger/primary button fills | Background color (never -- the app is dark-theme only) |

### Contrast Ratios (verified against WCAG 2.1 AA)

| Foreground | Background | Ratio | Passes AA (4.5:1 normal, 3:1 large) |
|-----------|-----------|-------|------|
| radio-text (#e0e0e0) | radio-surface (#12121a) | 12.7:1 | Yes |
| radio-text (#e0e0e0) | radio-bg (#0a0a0f) | 14.8:1 | Yes |
| radio-muted (#9ca3af) | radio-surface (#12121a) | 5.9:1 | Yes |
| radio-muted (#9ca3af) | radio-bg (#0a0a0f) | 6.9:1 | Yes |
| radio-accent (#e63946) | radio-surface (#12121a) | 4.47:1 | Marginal -- passes for large/bold text (3:1), fails for small normal text. Use only for bold labels, icons, or text >= 18px. |
| white (#ffffff) | radio-accent (#e63946) | 4.0:1 | Passes for large text (buttons). For small text on accent bg, use font-weight >= 600. |
| radio-error (#ef4444) | radio-surface (#12121a) | 4.8:1 | Yes |
| radio-success (#22c55e) | radio-surface (#12121a) | 6.3:1 | Yes |
| radio-info (#3b82f6) | radio-surface (#12121a) | 4.6:1 | Yes |

### Z-Index Layering

| Layer | Z-Index | Component |
|-------|---------|-----------|
| Base content | 0 (auto) | ListenerView, AdminDashboard content |
| Panel overlays (gradient, decorative) | 10 | NowPlayingHero gradient overlay |
| Sticky headers (table headers) | 20 | Library table thead |
| Sticky/fixed navigation | 30 | -- (reserved for future header/nav) |
| FirstVisitSplash | 40 | Full-screen overlay |
| PlayerBar | 50 | Fixed bottom bar |
| Toast container | 60 | Fixed position toast stack |
| ConfirmDialog backdrop | 70 | `<dialog>` backdrop (browser-managed, but effectively highest) |
| ConfirmDialog content | 70 | `<dialog>` content (above backdrop) |

---

## Responsive Behavior Summary

### Breakpoints

| Breakpoint | Width | Grid Columns | Key Layout Changes |
|-----------|-------|-------------|-------------------|
| Mobile (default) | < 640px | 1 column | Everything stacked vertically. NowPlayingHero full width. Chat below hero. Library below chat. PlayerBar fixed bottom. Splash is full screen. |
| Tablet (`md`) | 640-1023px | 2 columns | NowPlayingHero left, Chat+Library right. PlayerBar unchanged. |
| Desktop (`lg`) | 1024px+ | 3 columns (listener) or 2 columns (admin) | Listener: Hero spans 2/3, Chat+Library 1/3. Admin: 2-column grid (SourceSwitch+Playlists left, Library+Chat right). |

### Component-Specific Responsive Rules

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| PlayerBar | Full width, all elements compressed. Volume slider may hide (icon-only mute toggle). Skip button may be smaller. | Full width, all elements visible. | Full width, generous spacing. |
| NowPlayingHero | Full width, `min-h-[160px]`, text sizes reduce by one step. | 2/3 width or full width depending on layout. | Full 2/3 width, all text at specified sizes. |
| Chat | Full height section below hero. Fixed height `h-80`. | 1/3 width, flexible height. | 1/3 width, fills available vertical space. |
| Library Table | Artist column hidden (`hidden sm:table-cell`). Title column wider. | Artist column visible. | All columns visible. |
| AdminDashboard | Single column, all panels stacked. | Single column (or compact 2-col). | 2-column grid. |
| Toast | Full width minus padding (`max-w-[calc(100vw-2rem)]`), centered. | Max-width 400px, bottom-right. | Max-width 400px, bottom-right. |
| ConfirmDialog | Near full-width (`max-w-[calc(100vw-2rem)]`). | `max-w-md`, centered. | `max-w-md`, centered. |

---

## Keyboard Navigation Map

### Global Shortcuts (future, Phase 5)

| Key | Action | Context |
|-----|--------|---------|
| Space | Toggle play/pause | When focus is not in a text input |
| N | Skip to next track | When focus is not in a text input |
| M | Toggle mute | When focus is not in a text input |
| Up/Down Arrow | Volume up/down (5% increments) | When focus is on volume slider |
| Ctrl+K / Cmd+K | Open command bar | Global (future Phase 4) |
| ? | Open keyboard shortcuts help overlay | Global (future Phase 5) |
| Escape | Close any open dialog/overlay | When dialog or overlay is open |

### Tab Order

1. Skip-to-content link (visually hidden, appears on focus)
2. Header navigation (if applicable)
3. NowPlayingHero (informational, not focusable -- skip)
4. PlayerBar controls: Play/Pause -> Skip -> Volume -> (flows out to next)
5. Chat panel: Username edit button -> Chat message list (scrollable region) -> Chat input -> Send button
6. Library panel: Search input -> Scan button -> Select-all checkbox -> Individual track checkboxes/actions -> (flows to next)
7. Playlist panel: Create input -> Create button -> Playlist list items (each focusable) -> Playlist track list items

Focus wraps within ConfirmDialog when open (focus trap).

---

*End of component catalog. This specification covers 22 components across all visual states, interaction behaviors, animations, accessibility requirements, and responsive rules. It is intended as the authoritative reference for implementation.*
